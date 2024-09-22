"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import WalletBar from "@/components/WalletBar";
import { useAccount } from "@starknet-react/core";

const Login: React.FC = () => {
  const router = useRouter();
  const { address } = useAccount();

  useEffect(() => {
    // Redirect if the wallet is already connected
    if (address) {
      router.push("/"); // Redirect to previous page or home
    }
  }, [address, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">Connect Your Wallet</h2>
        <WalletBar onWalletConnect={(status) => console.log("Wallet connected:", status)} />
      </div>
    </div>
  );
};

export default Login;
