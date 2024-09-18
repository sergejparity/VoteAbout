'use client';
import Link from 'next/link';
import NavBar from '../../components/NavBar'; // Go up one level, then into components


const CreateProposal: React.FC = () => {
  return (
    <div className="h-screen flex flex-col top">
        <NavBar />
      <h1 className="text-4xl font-bold">Results</h1>
      <p className="text-lg mt-5">View Results from voting.</p>
      {/* Add Form for Creating new Proposal */}
    </div>
  );
};

export default CreateProposal;
