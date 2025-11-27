import Navbar from '@/Components/UI/Navbar';
import TutorSidebar from '@/Components/UI/sidebars/TutorSidebar';
import { useState } from 'react';

const TutorLayout = ({ user, children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <>
            <Navbar user={user} />
            <div className="flex h-screen bg-gray-100">
                <TutorSidebar
                    user={user}
                    collapsed={sidebarCollapsed}
                    onToggle={setSidebarCollapsed}
                />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </>
    );
};

export default TutorLayout;
