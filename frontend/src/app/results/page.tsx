'use client';
import NavBar from "@/components/NavBar";
import ResultsPage from "@/components/Results";

const CreatePoll: React.FC = () => {
  return (
    <div className="h-screen flex flex-col top">
        <NavBar />
      <ResultsPage />
    </div>
  );
};

export default CreatePoll;
