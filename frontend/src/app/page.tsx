'use client';
const Page: React.FC = () => {

  return (
    <div className="h-screen flex flex-col">
      <main className="flex flex-col flex-1 justify-center items-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800">
              Welcome to the VoteAbout
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-4xl text-justify">VoteAbout is a user-friendly dApp designed to simplify secure voting. Whether you're looking to create a poll, set a voting time interval, publish it, gather votes, or receive verifiable, on-chain results, VoteAbout makes the entire process seamless and transparent for everyone involved.</p>
          </div>
      </main>
    </div>
  );
};

export default Page;
