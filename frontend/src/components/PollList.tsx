'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';


const WalletBar = dynamic(() => import('./WalletBar'), { ssr: false })
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
      participate: 34
    },
    {
      id: 102,
      number: 2,
      title: "Implement Cross-Chain Interoperability",
      "Start-date": "20 August, 2024",
      "Start-End": "20 June, 2024",
      status: 1,
      participate: 100
    },
    {
      id: 103,
      number: 3,
      title: "Introduce Token Burn Mechanism",
      "Start-date": "10 October, 2024",
      "Start-End": "12 October, 2024",
      status: 2,
      participate: 54
    },
    {
      id: 104,
      number: 4,
      title: "Increase Block Size Limit",
      "Start-date": "19 May, 2024",
      "Start-End": "30 May, 2024",
      status: 3,
      participate: 10
    },
    {
      id: 105,
      number: 5,
      title: "Add Privacy Features to Smart Contracts",
      "Start-date": "19 May, 2024",
      "Start-End": "30 May, 2024",
      status: 1,
      participate: 15
    }
  ];


  const getStatusInfo = (status: number) => {
    switch (status) {
      case 1:
        return { label: "Active", colorClass: "bg-green-500" };
      case 2:
        return { label: "pending", colorClass: "bg-yellow-500" };
      default:
        return { label: "Closed", colorClass: "bg-red-500" };
    }
  };

  const handleRowClick = (id: number) => {
    // Navigate to the poll details page based on the poll id
    router.push(`/poll/${id}`);

  };

  // TO-DO 
  return (
    <div className="h-screen flex flex-col top">
      <main className="container mx-auto mb-3 px-4 w-full mt-5">
        <div>
          <h3 className="text-3xl mt-10 text-center text-gray-950 font-bold uppercase">Polls</h3>
          <div className="underline w-full border-gray-950 h-3 bg-black mt-3"></div>
          <div className="mt-6">
            <table className='min-w-full table-auto'>
              <thead className='bg-white'>
                <tr>
                  <th scope="coll" className='py-3 px-6 text-left text-lg uppercase border-r border-gray-300'>SN</th>
                  <th scope="coll" className='py-3 px-6 text-left text-lg uppercase border-r border-gray-300'>Poll name</th>
                  <th scope="coll" className='py-3 px-6 text-left text-lg uppercase border-r border-gray-300'>Start-time</th>
                  <th scope="coll" className='py-3 px-6 text-left text-lg uppercase border-r border-gray-300'>End-end</th>
                  <th scope="coll" className='py-3 px-6 text-left text-lg uppercase border-r border-gray-300'>Participates</th>
                  <th scope="coll" className='py-3 px-6 text-left text-lg uppercase border-r border-gray-300'>Status</th>
                </tr>
              </thead>
              <tbody className='bg-white'>
                {
                  polls.map((poll, index) => {
                    const { label, colorClass } = getStatusInfo(poll.status);
                    return (
                      <tr key={index} className='hover:bg-gray-400 cursor-pointer' onClick={() => handleRowClick(poll.id)}>
                        <td className='py-3 px-6 text-left text-lg border border-gray-300'>{poll.number}</td>
                        <td className='py-3 px-6 text-left text-lg border border-gray-300'>{poll.title}</td>
                        <td className='py-3 px-6 text-left text-lg border border-gray-300'>{poll['Start-date']}</td>
                        <td className='py-3 px-6 text-left text-lg border border-gray-300'>{poll['Start-End']}</td>
                        <td className='py-3 px-6 text-left text-lg border border-gray-300'>{poll.participate}</td>
                        <td className='py-3 px-6 text-left text-lg border border-gray-300'>
                          <span className={`${colorClass} text-white py-1 px-2 rounded`}>
                            {label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
        <footer></footer>
      </main >
    </div >

  );
};

export default Page;