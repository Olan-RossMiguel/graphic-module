// components/layouts/PsychologistLayout.jsx
import Navbar from '@/Components/UI/Navbar';
import PsychologistSidebar from '../../Components/UI/sidebars/PsychologistSidebar';

const PsychologistLayout = ({ user, children }) => {
    return (
        <>
            <Navbar />
            <div className="flex h-screen bg-gray-100">
                <PsychologistSidebar user={user} />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </>
    );
};

export default PsychologistLayout;
