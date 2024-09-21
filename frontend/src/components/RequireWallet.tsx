"use client";

import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface RequireWalletProps {
  children: ReactNode;
}

const RequireWallet: React.FC<RequireWalletProps> = ({ children }) => {
  const { address } = useAccount();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true); // Track if we are still checking the wallet

  useEffect(() => {
    const checkWallet = () => {
      if (address) {
        setIsChecking(false); // Wallet address exists, stop checking
      } else {
        router.push("/login");
      }
    };

    const timeout = setTimeout(checkWallet, 2000); // Adjust delay if necessary
    return () => clearTimeout(timeout); // Cleanup on unmount
  }, [address, router]);

  // Prevent rendering until wallet is checked
  if (isChecking) return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="loader"></div>
    </div>
  );

  // Render children if wallet is connected
  return <>{children}</>;
};

export default RequireWallet;
