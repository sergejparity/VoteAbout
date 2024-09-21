import ViewDetails from '@/components/ViewDetails';

const PollPage = ({ params }: { params: { id: string } }) => {
    const { id } = params; // Access the dynamic route parameter here

    return (
        <div className="h-screen flex flex-col top">
            <ViewDetails />
        </div>
    );
};

export default PollPage;
