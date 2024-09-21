'use client';
import { PencilSquareIcon,CheckCircleIcon, DocumentIcon, UsersIcon, ShieldCheckIcon , LockClosedIcon} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const Page: React.FC = () => {
  const router = useRouter();

  const features = [
    { icon: <PencilSquareIcon className="h-6 w-6 text-indigo-600" />, text: "Create Polls Easily" },
    { icon: <CheckCircleIcon className="h-6 w-6 text-indigo-600" />, text: "Set Voting Intervals" },
    { icon: <DocumentIcon className="h-6 w-6 text-indigo-600" />, text: "Publish Polls" },
    { icon: <UsersIcon className="h-6 w-6 text-indigo-600" />, text: "Gather Votes" },
    { icon: <LockClosedIcon className="h-6 w-6 text-indigo-600" />, text: "Receive Secure Results" },
    { icon: <ShieldCheckIcon className="h-6 w-6 text-indigo-600" />, text: "Immutable Results Storage" },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-200">
      <main className="flex flex-col flex-1 justify-center items-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Welcome to VoteAbout
          </h2>
          <p className="text-lg mt-4 max-w-4xl text-justify">
            VoteAbout is a user-friendly dApp designed to simplify secure voting. Whether you're looking to create a poll, set a voting time interval, publish it, gather votes, or receive verifiable, on-chain results, VoteAbout makes the entire process seamless and transparent for everyone involved.
          </p>
        </div>

        {/* Features List */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center">
              <div className="mr-4">{feature.icon}</div>
              <p className="text-lg">{feature.text}</p>
            </div>
          ))}
        </div>

        {/* Get Started Button */}
        <div className="mt-10">
          <button
            onClick={() => router.push('/login')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-200"
          >
            Get Started
          </button>
        </div>
      </main>
    </div>
  );
};

export default Page;
