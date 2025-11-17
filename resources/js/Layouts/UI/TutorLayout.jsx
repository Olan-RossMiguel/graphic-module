import Navbar from '@/Components/UI/Navbar';
import TutorSidebar from '@/Components/UI/sidebars/TutorSidebar';
import { useState } from 'react';

const TutorLayout = ({ user, children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen flex-col overflow-hidden">
            {/* Navbar fijo en la parte superior */}
            <Navbar user={user} />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - posición fija, altura completa */}
                <TutorSidebar
                    user={user}
                    collapsed={sidebarCollapsed}
                    onToggle={setSidebarCollapsed}
                />

                {/* Contenido principal - con scroll independiente y margen dinámico */}
                <main
                    className={`flex-1 overflow-y-auto bg-gray-100 p-4 pl-20 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-6 md:py-6 md:pl-6 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} `}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default TutorLayout;
