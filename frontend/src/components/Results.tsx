import React, { useState, useEffect } from 'react';
import { useReadContract } from "@starknet-react/core";
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Abi, AbiEvent, AbiStruct } from 'starknet';
const abi: Abi = require('../abis/abi.json');

function felt252ToString(felt: any) {
  const hex = felt.toString(16);
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const charCode = parseInt(hex.substring(i, i + 2), 16);
    if (charCode === 0) break;
    str += String.fromCharCode(charCode);
  }
  return str;
}

Chart.register(ArcElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
      align: 'start' as const,
      labels: {
        usePointStyle: true,
        boxWidth: 10, 
        padding: 20,
      },
    },
    tooltip: {
      enabled: true,
    },
  },
};

const ResultsPage: React.FC = () => {
  const contractAddress = "0x03ca1a0363050a5811e3432b1acf9aaf403aefd460829ca1046d850c8d6725c8"; 

  // Fetch all votes details
  const { data: poll_list, refetch, fetchStatus, status, error: readError } = useReadContract({
    abi: contractAbi,
    functionName: "get_all_votes_details",
    address: contractAddress,
    args: [],
    watch: true,
  });

  // State to handle selected poll and its candidates
  const [selectedPollId, setSelectedPollId] = useState<string>('');
  const [pollData, setPollData] = useState<any>({ candidates: [] });

  // Query to fetch the candidates for the selected poll
  const { data: poll_candidates, refetch: refetchCandidates, fetchStatus: candStatus, error: candidateError } = useReadContract({
    abi: contractAbi,
    functionName: "get_vote_results",
    address: contractAddress,
    args: selectedPollId ? [selectedPollId] : [0], // Pass selected poll ID as argument
    watch: true,
  });

  // Fetch the candidates whenever the selected poll changes
  useEffect(() => {
    if (selectedPollId && poll_candidates) {
      const candidates = poll_candidates.map((candidate: any) => ({
        name: felt252ToString(candidate[0]),
        votes: Number(candidate[1].toString())
      }));
      setPollData({ candidates });
    }
  }, [selectedPollId, poll_candidates]);

  // Get current timestamp to compare poll start and end times
  const currentTimestamp = new Date().getTime();

  // Transform the poll list data and filter ongoing and closed polls
  const polls = poll_list?.map((poll: any, index: number) => {
    const id = poll[0].toString();
    const title = felt252ToString(poll[1]);
    const startTimestamp = Number(poll[2].toString()) * 1000;
    const endTimestamp = Number(poll[3].toString()) * 1000;

    let status;
    if (currentTimestamp < startTimestamp) {
      status = 'upcoming';
    } else if (currentTimestamp >= startTimestamp && currentTimestamp <= endTimestamp) {
      status = 'ongoing';
    } else if (currentTimestamp > endTimestamp) {
      status = 'closed';
    }

    return {
      id,
      title,
      startTimestamp,
      endTimestamp,
      number: index + 1,
      status,
    };
  }) || [];

  // Filter polls to only include ongoing and closed polls
  const filteredPolls = polls.filter((poll) => poll.status === 'ongoing' || poll.status === 'closed');

  // Default to the first available ongoing or closed poll if none is selected
  const selectedPoll = filteredPolls.find(poll => poll.id === selectedPollId) || filteredPolls[0];

  const totalVotes = pollData.candidates.reduce((sum: number, candidate: any) => sum + candidate.votes, 0);
  const chartData = {
    labels: pollData.candidates.map((candidate: any) => candidate.name) || [],
    datasets: [
      {
        data: pollData.candidates.map((candidate: any) => candidate.votes) || [],
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
      },
    ],
  };

  // Handle loading and errors
  if (fetchStatus === "fetching" || candStatus === "fetching") {
    return <div>Loading polls or candidates...</div>;
  }

  if (readError || candidateError) {
    return <div>Error fetching data: {readError?.message || candidateError?.message}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-6 dark:bg-gray-900 dark:text-gray-200">
      <h1 className="text-3xl font-bold text-center mb-6">Poll Results</h1>

      {/* Poll Selection */}
      <div className="mb-6 text-center">
        <label htmlFor="pollSelect" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Poll
        </label>
        <select
        id="pollSelect"
        value={selectedPollId}
        onChange={(e) => setSelectedPollId(e.target.value)}
        className="block w-full max-w-xs mx-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-gray-300"
      >
        {/* Unselectable Placeholder */}
        <option value="" disabled>
          Select an ongoing or closed poll
        </option>

        {/* Ongoing and Closed Polls */}
        {filteredPolls.map((poll) => (
          <option key={poll.id} value={poll.id}>
            {poll.title}
          </option>
        ))}
      </select>


      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Candidate Summary */}
        <div className="lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pollData?.candidates.map((candidate: any, index: number) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold dark:text-gray-300">{candidate.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{candidate.votes} votes</p>
                <p className="text-gray-500 dark:text-gray-500">
                  {(candidate.votes / totalVotes * 100).toFixed(2)}% of total votes
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-semibold text-center mb-4">Vote Distribution</h2>
          <div className="w-full lg:w-full mx-auto">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
