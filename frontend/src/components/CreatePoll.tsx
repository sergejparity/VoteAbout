import React, { useState, useEffect } from 'react';
import {
  useAccount,
  useContract,
  useNetwork,
  useSendTransaction,
  useBlockNumber,
  useTransactionReceipt,
} from "@starknet-react/core";
import { Button } from './ui/Button';
import { Abi, AbiEvent, AbiStruct } from 'starknet';
const abi: Abi = require('../abis/abi.json');

export function CreatePoll() {
  return <CreatePollInner />;
}

function CreatePollInner() {
  const [pollName, setPollName] = useState('');
  const [pollDescription, setPollDescription] = useState('');
  const [candidates, setCandidates] = useState<string[]>(['']);
  const [votingPeriod, setVotingPeriod] = useState<string>('');  // Store voting period
  const [votingDelay, setVotingDelay] = useState<string>('');    // Store voting delay
  const [votingStart, setVotingStart] = useState('');            // Start time
  const [votingEnd, setVotingEnd] = useState('');                 //End time
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionCall, setTransactionCall] = useState<any>(null);
  const { data: blockno, error: blockerror } = useBlockNumber();
  const currentblock = blockno?.toString;
  
  const handleAddCandidate = () => {
    setCandidates([...candidates, '']);
  };

  // Effect to handle calculation of voting delay and period
  useEffect(() => {
    if (votingStart && votingEnd) {
      const voteStartUnix = new Date(votingStart).getTime() / 1000;
      const voteEndUnix = new Date(votingEnd).getTime() / 1000;
      const currentTime = Math.floor(Date.now() / 1000);  // Current time in seconds (Unix Epoch)

      // Calculate voting delay
      const delay = voteStartUnix - currentTime;
      setVotingDelay(delay.toString());  // Set the delay in seconds

      // Calculate voting period
      const period = voteEndUnix - voteStartUnix;
      setVotingPeriod(period.toString());  // Set the period in seconds
    }
  }, [votingStart, votingEnd]);  // This effect runs whenever `votingStart` or `votingEnd` changes

  const handleCandidateChange = (index: number, value: string) => {
    const updatedCandidates = [...candidates];
    updatedCandidates[index] = value;
    setCandidates(updatedCandidates);
  };

  const { address } = useAccount(); 
  const { chain } = useNetwork(); 

  const contractAddress = "0x03ca1a0363050a5811e3432b1acf9aaf403aefd460829ca1046d850c8d6725c8"; 
  const { contract } = useContract({
    abi,
    address: contractAddress,
  });

  const { send: pollAsync,
    data:createPollData,
    isPending: createPollPending,
  } = useSendTransaction({
    calls: transactionCall,
  });

  const { 
    data: waitData, 
    status: waitStatus,
    error:receiptError,
    isLoading: waitIsLoading,
    isError: waitIsError,
    error: waitError,
  } = useTransactionReceipt({
    hash: createPollData?.transaction_hash, watch:true
  });

  const LoadingState = ({ message }: { message: string }) => (
    <div className="flex items-center space-x-2">
      <div className="animate-spin">
        <svg className="h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <span>{message}</span>
    </div>
  );

  const handleCreatePoll = async () => {
    try {
      if (contract && address) {
        // Dynamically prepare the transaction call and update state
        const call = [
          contract.populate("create_vote", [
            pollName,
            pollDescription,
            candidates,
            votingDelay, 
            votingPeriod
          ]),
        ];
        setTransactionCall(call);

      } else {
        throw new Error('Contract or address not available');
      }
    } catch (e) {
      setError('Failed to create poll. Please try again.');
    }
  };

  useEffect(() => {
    if (transactionCall && !createPollPending) {
      pollAsync();
    }
  }, [transactionCall]);

  const buttonContent = () => {
    if (createPollPending) {
      return <LoadingState message="Confirm Poll Creation" />;
    }
    if (waitIsLoading) {
      return <LoadingState message="Creating Poll...please wait!..." />;
    }
    if (waitStatus === "error") {
      return <LoadingState message="Could not create poll..." />;
    }
    if (waitStatus === "success") {
      return "Poll created, Create New";
    }
    return "Create Poll";
  }

  useEffect(() => {
    if (waitStatus === "success") {
      // Reset form fields
      setPollName('');
      setPollDescription('');
      setCandidates(['']);
      setVotingStart('');
      setVotingEnd('');
      setVotingDelay('');
      setVotingPeriod('');
      
      setSuccess(true);  // Show success modal
    }
  }, [waitStatus]);  

  return (
    <div className="mt-8 w-full max-w-5xl mx-auto p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">Create New Poll</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Poll Name */}
        <div className="md:col-span-5">
          <input
            type="text"
            className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-blue-300 dark:focus:border-blue-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Poll Name"
            value={pollName}
            onChange={(e) => setPollName(e.target.value)}
          />
        </div>

        {/* Poll Description */}
        <div className="md:col-span-5">
          <input
            type="text"
            className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-blue-300 dark:focus:border-blue-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Poll Descrription"
            value={pollDescription}
            onChange={(e) => setPollDescription(e.target.value)}
          />
        </div>

        {/* Candidates */}
        <div className="md:col-span-5">
          {candidates.map((candidate, index) => (
            <div className="mb-2" key={index}>
              <input
                type="text"
                className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-blue-300 dark:focus:border-blue-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder={`Option ${index + 1}`}
                value={candidate}
                onChange={(e) => handleCandidateChange(index, e.target.value)}
              />
            </div>
          ))}

          {/* Add Candidate Button */}
          <button
            onClick={handleAddCandidate}
            className="mt-2 px-4 py-2 bg-green-500 text-white dark:bg-green-600 rounded-lg hover:bg-green-600 dark:hover:bg-green-700"
          >
            Add Option
          </button>
        </div>

        {/* Voting Period Start */}
        <div className="md:col-span-5">
          <label htmlFor="votingPeriod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date:
          </label>
          <input
            type="datetime-local"
            className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-blue-300 dark:focus:border-blue-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Voting Period"
            value={votingStart}
            onChange={(e) => setVotingStart(e.target.value)}
          />
        </div>

        {/* Voting Period End */}
        <div className="md:col-span-5">
          <label htmlFor="votingPeriod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date:
          </label>
          <input
            type="datetime-local"
            className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-blue-300 dark:focus:border-blue-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Voting Period"
            value={votingEnd}
            onChange={(e) => setVotingEnd(e.target.value)}
          />
        </div>

        <div className="md:col-span-5 text-gray-700 dark:text-gray-300">
          <strong>Voting Delay</strong> by: {votingDelay} seconds and <strong>Voting Period</strong> to last: {votingPeriod} seconds
        </div>

        {/* Create Poll Button */}
        <div className="md:col-span-5">
          <button
            onClick={handleCreatePoll}
            disabled={createPollPending}
            className={`mt-6 w-full md:w-auto px-6 py-3 text-white rounded-lg ${createPollPending? 'bg-gray-400 cursor-not-allowed dark:bg-gray-500' : 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700'}`}>
            {buttonContent()}
          </button>
        </div>
      </div>

      {/* Success or Error Modal */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-green-600">Poll Created Successfully!</h3>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
              onClick={() => setSuccess(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-red-600">{error}</h3>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={() => setError(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatePoll;
