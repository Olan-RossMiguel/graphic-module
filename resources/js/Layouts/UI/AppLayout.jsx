// resources/js/Layouts/AppLayout.jsx
import Navbar from '../Components/Navbar';
import PsychologistSidebar from '../Components/Sidebars/PsychologistSidebar';
import StudentSidebar from '../Components/Sidebars/StudentSidebar';
import TutorSidebar from '../Components/Sidebars/TutorSidebar';

const AppLayout = ({ children, auth }) => {
    // Determinar qué sidebar mostrar según el rol
    const renderSidebar = () => {
        switch (auth.user.role) {
            case 'student':
                return <StudentSidebar user={auth.user} />;
            case 'tutor':
                return <TutorSidebar user={auth.user} />;
            case 'psychologist':
                return <PsychologistSidebar user={auth.user} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar user={auth.user} />
            <div className="flex h-screen">
                {renderSidebar()}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
};

export default AppLayout;
