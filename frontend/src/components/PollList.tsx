'use client';
import { useState } from 'react';
import { useNetwork,useContract,useAccount, useReadContract } from "@starknet-react/core";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Tab } from '@headlessui/react';
import { ArrowRightIcon, ClockIcon, XCircleIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Abi, AbiEvent, AbiStruct } from 'starknet';
const abi: Abi = require('../abis/abi.json');

// Poll type definition
interface Poll {
  id: string;
  number: number;
  title: string;
  startDate: string;
  endDate: string;
  status: number;
}

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


const WalletBar = dynamic(() => import('./WalletBar'), { ssr: false });
const Page: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Ongoing");
  const contractAddress = "0x03ca1a0363050a5811e3432b1acf9aaf403aefd460829ca1046d850c8d6725c8"; 
  const { data:poll_list, refetch, fetchStatus, status, error:readError } = useReadContract({
    abi,
    functionName: "get_all_votes_details",
    address: contractAddress,
    args: [],
    watch: true,
  });

  // Handle loading and errors
  if (fetchStatus === "fetching") {
    return <div>Loading polls...</div>;
  }

  if (readError) {
    return <div>Error fetching poll data: {readError.message}</div>;
  }


  const polls: Poll[] = poll_list.map((poll:any, index:number): Poll => {
    const id = poll[0].toString(); // VoteId
    const number = index + 1;
    const title = felt252ToString(poll[1]); // Title from felt252
    const startTimestamp = Number(poll[2].toString()) * 1000; // StartTime as timestamp (ms)
    const endTimestamp = Number(poll[3].toString()) * 1000; // EndTime as timestamp (ms)
    
    const startDate = new Date(startTimestamp).toLocaleString(); // Human-readable start date
    const endDate = new Date(endTimestamp).toLocaleString(); // Human-readable end date
    
    const currentTimestamp = new Date().getTime();
    // Determine status based on current time and start/end dates
    let status;
    if (currentTimestamp < startTimestamp) {
      status = 1; // Upcoming
    } else if (currentTimestamp >= startTimestamp && currentTimestamp <= endTimestamp) {
      status = 2; // Ongoing
    } else if (currentTimestamp > endTimestamp) {
      status = 3; // Closed
    }
    else {
      status = 0; // Default fallback, if none of the above conditions match
    }
  
    return {
      id,
      number,
      title,
      startDate,
      endDate,
      status,  // Status logic based on date comparison
    };
  });

  const filteredPolls = (status: number): Poll[] => polls.filter(poll => poll.status === status);

  const handleVote = (id: number, title:string) => {
    sessionStorage.setItem('pollTitle', title);
    router.push(`/poll/${id}`);
  };

  return (
    <div className="h-screen flex flex-col dark:bg-gray-900 dark:text-gray-100">
      <main className="container mx-auto mb-3 px-4 w-full mt-5">
        <h3 className="text-3xl mt-10 text-center font-bold uppercase dark:text-gray-100">Polls</h3>
        <div className="mt-6">
          {/* Tabs */}
          {/* <Tab.Group onChange={setActiveTab}> */}
          <Tab.Group onChange={(index) => setActiveTab(["Ongoing", "Upcoming", "Closed"][index])}>
            <Tab.List className="flex justify-center space-x-4 mb-5">
              {["Ongoing", "Upcoming", "Closed"].map(tab => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    `px-5 py-2 rounded-lg text-lg font-semibold ${
                      selected
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`
                  }
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels>
              {/* Ongoing Tab */}
              <Tab.Panel>
                <div className="space-y-4">
                  {filteredPolls(2).map(poll => (
                    <div
                      key={poll.id}
                      className="grid grid-cols-1 md:grid-cols-6 items-center gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
                    >
                      {/* Poll Title */}
                      <h4 className="text-xl font-bold col-span-3">{poll.title}</h4>

                      {/* Start Date */}
                      <div className="flex items-center space-x-2 col-span-1">
                        <CalendarIcon className="w-5 h-5" />
                        <p>Start: {poll.startDate}</p>
                      </div>

                      {/* End Date */}
                      <div className="flex items-center space-x-2 col-span-1">
                        <CalendarIcon className="w-5 h-5" />
                        <p>End: {poll.endDate}</p>
                      </div>

                      {/* Vote Button */}
                      <div className="flex justify-end col-span-1">
                        <button
                          onClick={() => handleVote(Number(poll.id),poll.title)}
                          className="inline-flex items-center px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Vote <ArrowRightIcon className="ml-2 w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>

              {/* Upcoming Tab */}
              <Tab.Panel>
                <div className="space-y-4">
                  {filteredPolls(1).map(poll => (
                    <div
                      key={poll.id}
                      className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
                    >
                      <h4 className="text-xl font-bold col-span-3">{poll.title}</h4>
                      <div className="flex items-center space-x-2 col-span-1">
                        <CalendarIcon className="w-5 h-5" />
                        <p>Start: {poll.startDate}</p>
                      </div>
                      <div className="flex items-center space-x-2 col-span-1">
                        <CalendarIcon className="w-5 h-5" />
                        <p>End: {poll.endDate}</p>
                      </div>
                      <div className="mt-4 flex items-center text-yellow-500 md:mt-0 md:col-span-5">
                        <ClockIcon className="w-5 h-5 mr-2" />
                        Upcoming
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>

              {/* Closed Tab */}
              <Tab.Panel>
                <div className="space-y-4">
                  {filteredPolls(3).map(poll => (
                    <div
                      key={poll.id}
                      className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
                    >
                      <h4 className="text-xl font-bold col-span-3">{poll.title}</h4>
                      <div className="flex items-center space-x-2 col-span-1">
                        <CalendarIcon className="w-5 h-5" />
                        <p>Start: {poll.startDate}</p>
                      </div>
                      <div className="flex items-center space-x-2 col-span-1">
                        <CalendarIcon className="w-5 h-5" />
                        <p>End: {poll.endDate}</p>
                      </div>
                      <div className="mt-4 flex items-center text-red-500 md:mt-0 md:col-span-5">
                        <XCircleIcon className="w-5 h-5 mr-2" />
                        Closed
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </main>
    </div>
  );
};

export default Page;
