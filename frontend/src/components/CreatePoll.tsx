import React, { useState } from 'react';
import {
  useAccount,
  useContract,
  useNetwork,
  useSendTransaction,
  useBlockNumber,
} from "@starknet-react/core";
import type { Abi } from "starknet"; 
import { Button } from './ui/Button';

export function CreatePoll() {
  return <CreatePollInner />;
}

function CreatePollInner() {
  const [pollName, setPollName] = useState('');
  const [pollDescription, setPollDescription] = useState('');
  const [candidates, setCandidates] = useState<string[]>(['']);
  const [votingPeriod, setVotingPeriod] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionCall, setTransactionCall] = useState<any>(null);
  const { data: blockno, error: blockerror } = useBlockNumber();
  const currentblock = blockno?.toString;
  const handleAddCandidate = () => {
    setCandidates([...candidates, '']);
  };

  const handleCandidateChange = (index: number, value: string) => {
    const updatedCandidates = [...candidates];
    updatedCandidates[index] = value;
    setCandidates(updatedCandidates);
  };

  const { address } = useAccount(); 
  const { chain } = useNetwork(); 

  const contractAddress = "0x006d618d5adf4a704c2f33ef8db60c1485a3a1f784a1148739e1f599dd55ecfd"; 
  const { contract } = useContract({
    abi,
    address: contractAddress,
  });

  const { send } = useSendTransaction({
    calls: transactionCall,
  });

  const handleCreatePoll = async () => {
    setLoading(true);
    setError(null);
    try {
      if (contract && address) {
        // Dynamically prepare the transaction call and update state
        const call = [
          contract.populate("create_vote", [
            pollName,
            pollDescription,
            candidates,
            1, // Voting delay in blocks
            300000, // Voting period in blocks
          ]),
        ];
        setTransactionCall(call); // Store the transaction call

        // Trigger the send after setting the transaction
        await send();

        console.log('Poll Created:', { candidates });
      } else {
        throw new Error('Contract or address not available');
      }
    } catch (e) {
      console.error(e);
      setError('Failed to create poll. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

        {/* Voting Period End */}
        <div className="md:col-span-5">
          <label htmlFor="votingPeriod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date: <br></br>{blockno ? `Current Block: ${blockno.toLocaleString()}` : 'Fetching block number...'}
          </label>
          <input
            type="datetime-local"
            className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-blue-300 dark:focus:border-blue-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Voting Period"
            value={votingPeriod}
            onChange={(e) => setVotingPeriod(e.target.value)}
          />
        </div>

        {/* Create Poll Button */}
        <div className="md:col-span-5">
          <button
            onClick={handleCreatePoll}
            disabled={loading}
            className={`mt-6 w-full md:w-auto px-6 py-3 text-white rounded-lg ${loading ? 'bg-gray-400 cursor-not-allowed dark:bg-gray-500' : 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700'}`}
          >
            {loading ? 'Creating Poll...' : 'Create Poll'}
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

const abi = [
  {
    "type": "impl",
    "name": "IVoteAboutImpl",
    "interface_name": "voteabout::voteabout::IVoteAbout"
  },
  {
    "type": "struct",
    "name": "core::array::Span::<core::felt252>",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<core::felt252>"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::array::Span::<(core::felt252, core::integer::u32)>",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<(core::felt252, core::integer::u32)>"
      }
    ]
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "interface",
    "name": "voteabout::voteabout::IVoteAbout",
    "items": [
      {
        "type": "function",
        "name": "create_vote",
        "inputs": [
          {
            "name": "title",
            "type": "core::felt252"
          },
          {
            "name": "description",
            "type": "core::felt252"
          },
          {
            "name": "candidates",
            "type": "core::array::Span::<core::felt252>"
          },
          {
            "name": "voting_delay",
            "type": "core::integer::u64"
          },
          {
            "name": "voting_period",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_candidate_count",
        "inputs": [
          {
            "name": "vote_id",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "vote",
        "inputs": [
          {
            "name": "vote_id",
            "type": "core::integer::u32"
          },
          {
            "name": "candidate_id",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_vote_details",
        "inputs": [
          {
            "name": "vote_id",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [
          {
            "type": "(core::felt252, core::felt252, core::integer::u64, core::integer::u64)"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_vote_count",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_vote_results",
        "inputs": [
          {
            "name": "vote_id",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Span::<(core::felt252, core::integer::u32)>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "is_voting_active",
        "inputs": [
          {
            "name": "vote_id",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "OwnableImpl",
    "interface_name": "openzeppelin_access::ownable::interface::IOwnable"
  },
  {
    "type": "interface",
    "name": "openzeppelin_access::ownable::interface::IOwnable",
    "items": [
      {
        "type": "function",
        "name": "owner",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "transfer_ownership",
        "inputs": [
          {
            "name": "new_owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "renounce_ownership",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "initial_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "event",
    "name": "voteabout::voteabout::VoteAbout::VoteCast",
    "kind": "struct",
    "members": [
      {
        "name": "vote_id",
        "type": "core::integer::u32",
        "kind": "key"
      },
      {
        "name": "voter",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "candidate_id",
        "type": "core::integer::u32",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "voteabout::voteabout::VoteAbout::VoteCreated",
    "kind": "struct",
    "members": [
      {
        "name": "vote_id",
        "type": "core::integer::u32",
        "kind": "key"
      },
      {
        "name": "title",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "description",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "voting_start_time",
        "type": "core::integer::u64",
        "kind": "data"
      },
      {
        "name": "voting_end_time",
        "type": "core::integer::u64",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    "kind": "struct",
    "members": [
      {
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    "kind": "struct",
    "members": [
      {
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      }
    ]
  },
  {
    "type": "event",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "OwnershipTransferred",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
        "kind": "nested"
      },
      {
        "name": "OwnershipTransferStarted",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "voteabout::voteabout::VoteAbout::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "VoteCast",
        "type": "voteabout::voteabout::VoteAbout::VoteCast",
        "kind": "nested"
      },
      {
        "name": "VoteCreated",
        "type": "voteabout::voteabout::VoteAbout::VoteCreated",
        "kind": "nested"
      },
      {
        "name": "OwnableEvent",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
        "kind": "flat"
      }
    ]
  }
] as const satisfies Abi;

export default CreatePoll;
