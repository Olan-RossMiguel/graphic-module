import Navbar from '@/Components/UI/Navbar';
import StudentSidebar from '@/Components/UI/sidebars/StudentSidebar';

const StudentLayout = ({ user, children }) => {
    return (
        <div className="flex h-screen flex-col overflow-hidden">
            {/* Navbar fijo en la parte superior */}
            <Navbar user={user} />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - posición fija, altura completa */}
                <StudentSidebar />

                {/* Contenido principal - con scroll independiente y margen para la sidebar */}
                <main className="flex-1 overflow-y-auto bg-gray-100 p-4 pl-20 md:ml-64 md:px-6 md:py-6 md:pl-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
