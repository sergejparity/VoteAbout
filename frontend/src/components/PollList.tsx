'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Tab } from '@headlessui/react';
import { ArrowRightIcon, ClockIcon, XCircleIcon, CalendarIcon } from '@heroicons/react/24/outline';

const WalletBar = dynamic(() => import('./WalletBar'), { ssr: false });

const Page: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Ongoing");

  const polls = [
    { id: 101, number: 1, title: "Upgrade to Ethereum 2.0", startDate: "19 May, 2024", endDate: "30 May, 2024", status: 1 },
    { id: 102, number: 2, title: "Implement Cross-Chain Interoperability", startDate: "20 August, 2024", endDate: "20 June, 2024", status: 1 },
    { id: 103, number: 3, title: "Introduce Token Burn Mechanism", startDate: "10 October, 2024", endDate: "12 October, 2024", status: 2 },
    { id: 104, number: 4, title: "Increase Block Size Limit", startDate: "19 May, 2024", endDate: "30 May, 2024", status: 3 },
    { id: 105, number: 5, title: "Add Privacy Features to Smart Contracts", startDate: "19 May, 2024", endDate: "30 May, 2024", status: 1 },
  ];

  const filteredPolls = (status: number) => polls.filter(poll => poll.status === status);

  const handleVote = (id: number) => {
    router.push(`/poll/${id}`);
  };

  return (
    <div className="h-screen flex flex-col dark:bg-gray-900 dark:text-gray-100">
      <main className="container mx-auto mb-3 px-4 w-full mt-5">
        <h3 className="text-3xl mt-10 text-center font-bold uppercase dark:text-gray-100">Polls</h3>
        <div className="mt-6">
          {/* Tabs */}
          <Tab.Group onChange={setActiveTab}>
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
                  {filteredPolls(1).map(poll => (
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
                          onClick={() => handleVote(poll.id)}
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
                  {filteredPolls(2).map(poll => (
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
