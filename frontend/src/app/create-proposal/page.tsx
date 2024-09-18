'use client';
import NavBar from '../../components/NavBar'; 

const CreateProposal: React.FC = () => {
  return (
    <div className="h-screen flex flex-col top">
        <NavBar />
      <h1 className="text-4xl font-bold">Create Proposal</h1>
      <p className="text-lg mt-5">Add Poll</p>
      {/* Add Form for Creating new Proposal */}
    </div>
  );
};

export default CreateProposal;
