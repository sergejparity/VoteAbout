'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RadioGroup } from '@headlessui/react';
import {  useNetwork,useContract,useAccount, useReadContract,useSendTransaction } from "@starknet-react/core";
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import contractAbi from '../../../abis/abi.json';


function felt252ToString(felt: any) {
  // Convert the BigInt to a hex string
  const hex = felt.toString(16);
  // Split hex into pairs and convert to characters
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const charCode = parseInt(hex.substring(i, i + 2), 16);
    if (charCode === 0) break; // Stop at null character
    str += String.fromCharCode(charCode);
  }
  return str;
}

// Define types for poll options
interface PollOption {
  id: number;
  name: string;
}

interface Poll {
  id: string;
  name: string;
  options: PollOption[];
}

const PollPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [pollTitle, setPollTitle] = useState('');
  const [selectedOption, setSelectedOption] = useState<PollOption | null>(null); // Set state type
  const router = useRouter();
  useEffect(() => {
    // Retrieve the title from sessionStorage
    const storedTitle = sessionStorage.getItem('pollTitle');
    if (storedTitle) {
      setPollTitle(storedTitle); // Set it in the local state
    }
  }, []); // Runs only once after the comp


  const contractAddress = "0x03ca1a0363050a5811e3432b1acf9aaf403aefd460829ca1046d850c8d6725c8"; 
  const [transactionCall, setTransactionCall] = useState<any>(null);
  const { address } = useAccount(); 
  const { chain } = useNetwork(); 
  const { data:poll_description, refetch, fetchStatus, status, error:readError } = useReadContract({
    abi: contractAbi,
    functionName: "get_vote_details",
    address: contractAddress,
    args: [id],
    watch: true,
  });

  const { data:poll_candidates, refetch: refetchcandidates, fetchStatus: candStatus, status: cs, error:candidateError } = useReadContract({
    abi: contractAbi,
    functionName: "get_vote_results",
    address: contractAddress,
    args: [id],
    watch: true,
  });

  const { contract } = useContract({
    abi: contractAbi,
    address: contractAddress,
  });

  const { send } = useSendTransaction({
    calls: transactionCall,
  });

  // Handle loading and errors
  if (fetchStatus === "fetching") {
    return <div>Loading poll...description</div>;
  }

  if (readError) {
    return <div>Error fetching poll data: {readError.message}</div>;
  }

  if (candStatus === "fetching") {
    return <div>Loading poll...candidates</div>;
  }

  if (candidateError) {
    return <div>Error fetching poll data: {candidateError.message}</div>;
  }

  // Create options from poll_candidates
  const options: PollOption[] = poll_candidates.map((candidate:any, index:number) => ({
    id: index + 1, // or some unique identifier based on your data
    name: felt252ToString(candidate[0]), // Convert the first element to string for the option name
  }));


  const handleVote = async () => {
    try{
      if (selectedOption && contract && address) {
      const pollId = Number(id); 
      const optionId = Number(selectedOption.id); 

        const call = [
          contract.populate("vote", [
            pollId,
            optionId
            
          ]),
        ];
        setTransactionCall(call); // Store the transaction call

        // Trigger the send after setting the transaction
        await send();
        alert(`You're voting for option ID: ${selectedOption.id}, Poll ID: ${id}`);
      }
      else{
        throw new Error('Contract or address not available');
      }
    }
    catch (e) {
      console.error(e);
      alert('Couldnt place vote. Please try again.');
    } finally {
      //to-do
      
    }
  };

  return (
    <div className="h-screen flex flex-col dark:bg-gray-900 dark:text-gray-100">
      <main className="container mx-auto px-4 mt-5">
        <h3 className="text-3xl font-bold text-center dark:text-white mb-6">{pollTitle}</h3>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 md:p-8">
          <RadioGroup value={selectedOption} onChange={setSelectedOption}>
            <RadioGroup.Label className="text-xl font-semibold mb-4 block dark:text-white">{felt252ToString(poll_description[1])}:</RadioGroup.Label>
            <div className="space-y-4">
              {options.map((option) => (
                <RadioGroup.Option
                  key={option.id}
                  value={option}
                  className={({ active, checked }) =>
                    `relative flex items-center px-4 py-2 cursor-pointer rounded-lg border ${
                      checked ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'
                    } focus:outline-none`
                  }
                >
                  {({ checked }: { checked: boolean }) => (  // Explicitly define the type of 'checked'
                    <>
                      <span className="flex items-center">
                        {option.name}
                      </span>
                      {checked && (
                        <CheckCircleIcon className="w-6 h-6 text-white absolute right-4" />
                      )}
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleVote}
              disabled={!selectedOption}
              className={`flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ${
                !selectedOption ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Vote
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PollPage;
