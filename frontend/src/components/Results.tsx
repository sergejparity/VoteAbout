import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

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

const pollResults = [
  {
    pollName: 'What is your Favorite Programming Language',
    candidates: [
      { name: 'JavaScript', votes: 150 },
      { name: 'Rust', votes: 813 },
      { name: 'GO', votes: 513 },
      { name: 'Python', votes: 213 },
    ],
  },
];

const ResultsPage: React.FC = () => {
  const [selectedPoll, setSelectedPoll] = useState<string>(pollResults[0].pollName);
  
  const pollData = pollResults.find((poll) => poll.pollName === selectedPoll);
  const totalVotes = pollData?.candidates.reduce((sum, candidate) => sum + candidate.votes, 0) || 0;
  const winner = pollData?.candidates.reduce((prev, current) => (prev.votes > current.votes ? prev : current));

  const chartData = {
    labels: pollData?.candidates.map((candidate) => candidate.name) || [],
    datasets: [
      {
        data: pollData?.candidates.map((candidate) => candidate.votes) || [],
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
      },
    ],
  };

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
          value={selectedPoll}
          onChange={(e) => setSelectedPoll(e.target.value)}
          className="block w-full max-w-xs mx-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-gray-300"
        >
          {pollResults.map((poll) => (
            <option key={poll.pollName} value={poll.pollName}>
              {poll.pollName}
            </option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Candidate Summary */}
        <div className="lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pollData?.candidates.map((candidate, index) => (
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
            <Pie data={chartData} options={chartOptions}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
