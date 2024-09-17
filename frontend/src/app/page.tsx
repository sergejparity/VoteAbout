'use client';
import dynamic from 'next/dynamic';

const WalletBar = dynamic(() => import('../components/WalletBar'), { ssr: false })
const Page: React.FC = () => {
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

    </div>
  );
};

export default Page;