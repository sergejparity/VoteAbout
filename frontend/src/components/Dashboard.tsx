"use client";

import React, { useState, useEffect } from 'react';
import PollList from './ProposalList';
import CreatePoll from './CreateProposal';
import { useAccount } from "@starknet-react/core";
import { useRouter } from "next/navigation";

const Dashboard: React.FC = () => {
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const { address } = useAccount(); // Get the wallet connection status
  const router = useRouter(); // For redirection

  useEffect(() => {
    if (!address) {
      router.push("/");
    }
  }, [address, router]);

  // Display a loading message while checking connection status
  if (!address) {
    return <div className="flex justify-center items-center h-screen text-lg">Redirecting to home...</div>;
  }

  const handleCreatePollClick = () => {
    setShowCreatePoll(!showCreatePoll);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>

      {/* Poll List */}
      <PollList />
    </div>
  );
};

export default Dashboard;
