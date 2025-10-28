import Navbar from '@/Components/UI/Navbar';
import StudentSidebar from '@/Components/UI/sidebars/StudentSidebar';

const StudentLayout = ({ user, children }) => {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar user={user} />

            <div className="flex flex-1 flex-col md:flex-row">
                <StudentSidebar />
                {/* más aire en móvil respecto a la sidebar de 64px → 5rem */}
                <main className="flex-1 bg-gray-100 p-4 pl-20 md:px-6 md:py-6 md:pl-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
