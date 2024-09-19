'use client';
import Link from 'next/link';
import NavBar from '../components/NavBar'; // Go up one level, then into components


const CreatePoll: React.FC = () => {
  return (
    <div className="h-screen flex flex-col top">
      <h1 className="text-4xl font-bold">Create a New Poll</h1>
      <p className="text-lg mt-5">Here you can create a new proposal for voting.</p>
      {/* Add Form for Creating new Proposal */}
    </div>
  );
};

export default CreatePoll;
