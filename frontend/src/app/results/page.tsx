'use client';
import NavBar from '../../components/NavBar'; 

const CreateProposal: React.FC = () => {
  return (
    <div className="h-screen flex flex-col top">
        <NavBar />
      <h1 className="text-4xl font-bold">Results</h1>
      <p className="text-lg mt-5">View Results for voting.</p>
    </div>
  );
};

export default CreateProposal;
