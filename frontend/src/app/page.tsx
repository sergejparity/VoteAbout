'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Dashboard from '@/components/Dashboard';
import Link from 'next/link';

// Dynamically import WalletBar to disable server-side rendering
const WalletBar = dynamic(() => import('../components/WalletBar'), { ssr: false });

const Page: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleWalletConnection = (status: boolean) => {
    setIsWalletConnected(status);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full shadow-md py-4 bg-white">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-4">
        <Link href="/">
          <h1 className="text-2xl font-bold">Vote About</h1>
          </Link>
          <Link href="/">
            <button className="py-2 px-4 hover:bg-bisque-700 transition">
              Dashboard
            </button>
          </Link>
          <Link href="/create-proposal">
            <button className="py-2 px-4 hover:bg-bisque-700 transition">
              Create Proposal
            </button>
          </Link>
          <Link href="/results">
            <button className="py-2 px-4 hover:bg-bisque-700 transition">
              Results
            </button>
          </Link>
        </div>
        <div className="ml-auto">
          <WalletBar onWalletConnect={handleWalletConnection} />
        </div>
      </div>
    </nav>

      {/* Content */}
      <main className="flex flex-col flex-1 justify-center items-center">
        {isWalletConnected ? (
          <Dashboard />
        ) : (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800">
              Welcome to the VoteAbout
            </h2>
            <p className="text-lg text-gray-600 mt-4">
              Please connect your wallet to access the dashboard.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
