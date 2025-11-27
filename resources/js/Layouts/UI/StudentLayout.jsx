import Navbar from '@/Components/UI/Navbar';
import StudentSidebar from '@/Components/UI/sidebars/StudentSidebar';
import { useState } from 'react';

const StudentLayout = ({ user, children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <>
            <Navbar user={user} />
            <div className="flex h-screen bg-gray-100">
                <StudentSidebar
                    collapsed={sidebarCollapsed}
                    onToggle={setSidebarCollapsed}
                />
                <main className="flex-1 overflow-y-auto p-4 pl-20 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:p-6">
                    {children}
                </main>
            </div>
        </>
    );
};

export default StudentLayout;
