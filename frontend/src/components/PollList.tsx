'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const WalletBar = dynamic(() => import('./WalletBar'), { ssr: false });

const Page: React.FC = () => {
  const router = useRouter();

  const polls = [
    {
      id: 101,
      number: 1,
      title: "Upgrade to Ethereum 2.0",
      "Start-date": "19 May, 2024",
      "Start-End": "30 May, 2024",
      status: 1,
      participate: 34,
    },
    {
      id: 102,
      number: 2,
      title: "Implement Cross-Chain Interoperability",
      "Start-date": "20 August, 2024",
      "Start-End": "20 June, 2024",
      status: 1,
      participate: 100,
    },
    {
      id: 103,
      number: 3,
      title: "Introduce Token Burn Mechanism",
      "Start-date": "10 October, 2024",
      "Start-End": "12 October, 2024",
      status: 2,
      participate: 54,
    },
    {
      id: 104,
      number: 4,
      title: "Increase Block Size Limit",
      "Start-date": "19 May, 2024",
      "Start-End": "30 May, 2024",
      status: 3,
      participate: 10,
    },
    {
      id: 105,
      number: 5,
      title: "Add Privacy Features to Smart Contracts",
      "Start-date": "19 May, 2024",
      "Start-End": "30 May, 2024",
      status: 1,
      participate: 15,
    },
  ];

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 1:
        return { label: "Active", colorClass: "bg-green-500" };
      case 2:
        return { label: "Pending", colorClass: "bg-yellow-500" };
      default:
        return { label: "Closed", colorClass: "bg-red-500" };
    }
  };

  const handleRowClick = (id: number) => {
    router.push(`/poll/${id}`);
  };

  return (
    <div className="h-screen flex flex-col top dark:bg-gray-900 dark:text-gray-100">
      <main className="container mx-auto mb-3 px-4 w-full mt-5">
        <div>
          <h3 className="text-3xl mt-10 text-center font-bold uppercase dark:text-gray-100">Polls</h3>
          <div className="underline w-full border-gray-950 dark:border-gray-100 h-3 bg-black dark:bg-gray-100 mt-3"></div>
          <div className="mt-6">
            <table className="min-w-full table-auto">
              <thead className="bg-white dark:bg-gray-800">
                <tr>
                  <th className="py-3 px-6 text-left text-lg uppercase border-r border-gray-300 dark:border-gray-600">SN</th>
                  <th className="py-3 px-6 text-left text-lg uppercase border-r border-gray-300 dark:border-gray-600">Poll name</th>
                  <th className="py-3 px-6 text-left text-lg uppercase border-r border-gray-300 dark:border-gray-600">Start-time</th>
                  <th className="py-3 px-6 text-left text-lg uppercase border-r border-gray-300 dark:border-gray-600">End-end</th>
                  <th className="py-3 px-6 text-left text-lg uppercase border-r border-gray-300 dark:border-gray-600">Participants</th>
                  <th className="py-3 px-6 text-left text-lg uppercase border-r border-gray-300 dark:border-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                {polls.map((poll, index) => {
                  const { label, colorClass } = getStatusInfo(poll.status);
                  return (
                    <tr key={index} className="hover:bg-gray-400 dark:hover:bg-gray-700 cursor-pointer" onClick={() => handleRowClick(poll.id)}>
                      <td className="py-3 px-6 text-left text-lg border border-gray-300 dark:border-gray-700">{poll.number}</td>
                      <td className="py-3 px-6 text-left text-lg border border-gray-300 dark:border-gray-700">{poll.title}</td>
                      <td className="py-3 px-6 text-left text-lg border border-gray-300 dark:border-gray-700">{poll['Start-date']}</td>
                      <td className="py-3 px-6 text-left text-lg border border-gray-300 dark:border-gray-700">{poll['Start-End']}</td>
                      <td className="py-3 px-6 text-left text-lg border border-gray-300 dark:border-gray-700">{poll.participate}</td>
                      <td className="py-3 px-6 text-left text-lg border border-gray-300 dark:border-gray-700">
                        <span className={`${colorClass} text-white py-1 px-2 rounded`}>
                          {label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <footer></footer>
      </main>
    </div>
  );
};

export default Page;
