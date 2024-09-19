'use client';
import NavBar from '@/components/NavBar';
import CreatePoll from '@/components/CreatePoll';

const CreatePollPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col top">
        <NavBar />
      {/* Add Form for Creating new Proposal */}
      <CreatePoll />
    </div>
  );
};

export default CreatePollPage;
