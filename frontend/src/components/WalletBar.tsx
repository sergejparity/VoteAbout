"use client";

import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useMemo, useEffect } from "react";
import { Button } from "./ui/Button";
import { UserIcon } from '@heroicons/react/24/solid'; // Importing the user icon
import React from 'react';

interface WalletBarProps {
  onWalletConnect?: (status: boolean) => void;
}

function WalletConnected({ onWalletConnect }: WalletBarProps) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  // Notify parent about the connection status
  useEffect(() => {
    if (onWalletConnect) {
      onWalletConnect(true);
    }
  }, [address, onWalletConnect]);

  const shortenedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  return (
    <div className="flex items-center space-x-2">
      <UserIcon className="h-6 w-6 text-gray-800 dark:text-gray-200" />
      <span className="text-gray-800 dark:text-gray-200">{shortenedAddress}</span>
      <Button onClick={() => disconnect()} className="ml-2 bg-red-500 text-white hover:bg-red-600">
        Disconnect
      </Button>
    </div>
  );
}

function ConnectWallet() {
  const { connectors, connect } = useConnect();

  return (
    <div>
      <span className="text-gray-800 dark:text-gray-200">Login with wallet: </span>
      {connectors.map((connector) => (
        <Button
          key={connector.id}
          onClick={() => connect({ connector })}
          className="gap-x-2 mr-2"
        >
          {connector.id}
        </Button>
      ))}
    </div>
  );
}

export default function WalletBar({ onWalletConnect }: WalletBarProps) {
  const { address } = useAccount();

  return address ? (
    <WalletConnected onWalletConnect={onWalletConnect} />
  ) : (
    <ConnectWallet />
  );
}
