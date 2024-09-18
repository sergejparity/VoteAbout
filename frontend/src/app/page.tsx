'use client';
import dynamic from 'next/dynamic';
import moment from 'moment';


const WalletBar = dynamic(() => import('../components/WalletBar'), { ssr: false })
const Page: React.FC = () => {

  const proposals = [
    {
      number: 1,
      title: "Upgrade to Ethereum 2.0",
      status: "Pending",
      date: "2024-09-15T14:48:00.000Z"
    },
    {
      number: 2,
      title: "Implement Cross-Chain Interoperability",
      status: "Approved",
      date: "2024-09-16T09:30:00.000Z"
    },
    {
      number: 3,
      title: "Introduce Token Burn Mechanism",
      status: "In Progress",
      date: "2024-09-17T13:15:00.000Z"
    },
    {
      number: 4,
      title: "Increase Block Size Limit",
      status: "Rejected",
      date: "2024-09-18T16:45:00.000Z"
    },
    {
      number: 5,
      title: "Add Privacy Features to Smart Contracts",
      status: "In Progress",
      date: "2024-09-19T11:00:00.000Z"
    }
  ];


  // TO-DO 
  return (
    <div className="h-screen flex flex-col top">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Vote About</h1>
          <WalletBar />
        </div>
      </nav>

      <main className="container mx-auto mb-3 px-4 w-full mt-20">
        <div className="flex flex-col mb-8">
          <h1 className="font-bold text-3xl leading-normal">Vote About</h1>
          <p className="text-xl mt-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quo deleniti aspernatur ducimus nesciunt corrupti, deserunt vero quia, eum debitis facilis? Qui, ratione? Optio, eum quo nobis iste ducimus nemo.2</p>
        </div>
        <div>
          <h3 className="text-3xl mt-10 text-center text-gray-950 font-bold uppercase">Proposals</h3>
          <div className="underline w-full border-gray-950 h-3 bg-black mt-3"></div>
          <div className="mt-6">
            {
              proposals.map((proposal, index) => (
                <div key={index} className="flex flex-row justify-between bg-slate-200 p-4 mb-4 text-xl shadow-md rounded-lg font-semibold">
                  <div className='w-1/4'>{proposal.number}</div>
                  <h3 className="flex-1 text-center w-1/2">{proposal.title}</h3>
                  <div className=" flex justify-center w-1/4 mx-auto ">
                    <span className='text-center w-full p-4'>{moment(proposal.date).fromNow()}</span>
                    <div className="bg-green-300 p-4 text-center rounded text-sm w-10/12">{proposal.status}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <footer></footer>
      </main >
    </div >

  );
};

export default Page;