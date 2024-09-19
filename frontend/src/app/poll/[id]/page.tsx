import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import ViewDetails from '@/components/ViewDetails';

const PollPage = ({ params }: { params: { id: string } }) => {
    const { id } = params; // Access the dynamic route parameter here

    return (
        <div className="h-screen flex flex-col top">
            <NavBar />
            <ViewDetails />
        </div>
    );
};

export default PollPage;
