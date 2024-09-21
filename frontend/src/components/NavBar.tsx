"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router'; 
import dynamic from 'next/dynamic';
import { HomeIcon, ChartBarIcon, PlusCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline'; 
const NavBar: React.FC = () => {
  const WalletBar = dynamic(() => import('../components/WalletBar'), { ssr: false });

  return (
    <nav className="sticky top-0 z-50 w-full shadow-md py-4 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <h1 className="text-2xl font-bold text-black dark:text-white transition-colors duration-300">
              Vote About
            </h1>
          </Link>
          <Link href="/dashboard" className="flex items-center">
            <ChartBarIcon className="h-6 w-6 text-black dark:text-white mr-2" />
            <span className="py-2 px-4 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
              Dashboard
            </span>
          </Link>
          <Link href="/create-poll" className="flex items-center">
            <PlusCircleIcon className="h-6 w-6 text-black dark:text-white mr-2" />
            <span className="py-2 px-4 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
              Create Poll
            </span>
          </Link>
          <Link href="/results" className="flex items-center">
            <DocumentTextIcon className="h-6 w-6 text-black dark:text-white mr-2" />
            <span className="py-2 px-4 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
              Results
            </span>
          </Link>
        </div>
        <div className="ml-auto">
          <WalletBar />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
