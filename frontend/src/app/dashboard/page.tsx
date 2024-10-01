'use client';
import Dashboard from "@/components/Dashboard";
import RequireWallet from "@/components/RequireWallet";
const DashboardPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col top">
      {/* Protected content here */}
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
