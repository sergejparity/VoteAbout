'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

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

// Sample poll data
const polls: Poll[] = [
  {
    id: "101",
    name: "Upgrade to Ethereum 2.0",
    options: [
      { id: 1, name: "Yes" },
      { id: 2, name: "No" },
      { id: 3, name: "Abstain" }
    ]
  },
  {
    id: "102",
    name: "Implement Cross-Chain Interoperability",
    options: [
      { id: 1, name: "Yes" },
      { id: 2, name: "No" },
      { id: 3, name: "Abstain" }
    ]
  },
  {
    id: "103",
    name: "Introduce Token Burn Mechanism",
    options: [
      { id: 1, name: "Yes" },
      { id: 2, name: "No" },
      { id: 3, name: "Abstain" }
    ]
  }
  // Add more polls as needed
];

const PollPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const poll = polls.find(poll => poll.id === id); // Find the poll based on the dynamic ID
  const [selectedOption, setSelectedOption] = useState<PollOption | null>(null); // Set state type
  const router = useRouter();

  if (!poll) {
    return <div className="text-center mt-10">Poll not found</div>; // Handle the case where the poll is not found
  }

  const handleVote = () => {
    if (selectedOption) {
      // Handle voting logic here
      alert(`You voted for option: ${selectedOption.name}`);
    }
  };

  return (
    <div className="h-screen flex flex-col dark:bg-gray-900 dark:text-gray-100">
      <main className="container mx-auto px-4 mt-5">
        <h3 className="text-3xl font-bold text-center dark:text-white mb-6">{poll.name}</h3>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 md:p-8">
          <RadioGroup value={selectedOption} onChange={setSelectedOption}>
            <RadioGroup.Label className="text-xl font-semibold mb-4 block dark:text-white">Choose an option:</RadioGroup.Label>
            <div className="space-y-4">
              {poll.options.map((option) => (
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
