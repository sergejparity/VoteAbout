'use client';
import ResultsPage from "@/components/Results";
import RequireWallet from "@/components/RequireWallet";

const CreatePoll: React.FC = () => {
  return (
    <div className="h-screen flex flex-col top">
      <RequireWallet>
      <ResultsPage />
      </RequireWallet>
      
    </div>
  );
};

export default CreatePoll;
