'use client';

import Link from 'next/link';
import WalletBar from './WalletBar'; 
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const NavBar: React.FC = () => {
  const WalletBar = dynamic(() => import('../components/WalletBar'), { ssr: false });
  return (
    <nav className="sticky top-0 z-50 w-full shadow-md py-4 bg-white">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-4">
        <Link href="/">
          <h1 className="text-2xl font-bold">Vote About</h1>
          </Link>
          <Link href="/dashboard">
            <button className="py-2 px-4 hover:bg-bisque-700 transition">
              Dashboard
            </button>
          </Link>
          <Link href="/create-poll">
            <button className="py-2 px-4 hover:bg-bisque-700 transition">
              Create Poll
            </button>
          </Link>
          <Link href="/results">
            <button className="py-2 px-4 hover:bg-bisque-700 transition">
              Results
            </button>
          </Link>
        </div>
        <div className="ml-auto">
          <WalletBar  />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
