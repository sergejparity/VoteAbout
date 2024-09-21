'use client';
import CreatePoll from '@/components/CreatePoll';
import RequireWallet from '@/components/RequireWallet';

const CreatePollPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col top">
      <RequireWallet>
      <CreatePoll />
      </RequireWallet>
      
    </div>
  );
};

export default CreatePollPage;
