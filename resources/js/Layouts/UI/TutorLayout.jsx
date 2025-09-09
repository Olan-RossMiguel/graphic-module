// components/layouts/TutorLayout.jsx
import Navbar from '@/Components/UI/Navbar';
import TutorSidebar from '../../Components/UI/sidebars/TutorSidebar';

const TutorLayout = ({ user, children }) => {
    return (
        <>
            <Navbar />
            <div className="flex h-screen bg-gray-100">
                <TutorSidebar user={user} />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </>
    );
};

export default TutorLayout;
