import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    FaChevronLeft,
    FaChevronRight,
    FaInfoCircle,
    FaSignOutAlt,
    FaUser,
    FaUsers,
} from 'react-icons/fa';

const TutorSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(true);

    const { url } = usePage();

    const isActiveProfile = url === '/profile' || url.startsWith('/profile');
    const isActiveGroups = url === '/groups' || url.startsWith('/groups');

    return (
        <>
            {/* DESKTOP */}
            <aside
                className={[
                    'hidden bg-[#0a5cb8] text-white md:flex md:flex-col',
                    collapsed ? 'w-20' : 'w-64',
                    'overflow-hidden md:h-screen',
                    'transform will-change-transform',
                    collapsed
                        ? 'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
                        : 'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                ].join(' ')}
            >
                {/* Botón de colapsar/expandir */}
                <div
                    className={[
                        'flex items-center border-b border-white/15 p-4',
                        collapsed ? 'justify-center' : 'justify-end',
                    ].join(' ')}
                >
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={[
                            'rounded-md p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30',
                            collapsed ? 'mx-auto' : 'ml-auto',
                        ].join(' ')}
                        aria-label={
                            collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'
                        }
                        title={collapsed ? 'Expandir' : 'Colapsar'}
                    >
                        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
                    </button>
                </div>

                <div className="flex min-h-0 flex-1 flex-col">
                    <nav className="min-h-0 flex-1 space-y-5 overflow-y-auto px-2 pb-2 pt-4">
                        {/* Perfil */}
                        <Link
                            href={route('profile.edit')}
                            className={`flex items-center rounded-md px-4 py-3 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 ${
                                isActiveProfile ? 'bg-white/10' : ''
                            }`}
                            preserveScroll
                            title="Mi perfil"
                        >
                            <FaUser className="mr-3 h-5 w-5" />
                            {!collapsed && (
                                <span className="text-sm font-medium">
                                    Mi perfil
                                </span>
                            )}
                        </Link>

                        {/* Sección de Grupos */}
                        {!collapsed && (
                            <p className="mb-1 px-4 text-xs font-semibold uppercase tracking-wider text-white/80">
                                Mis Grupos
                            </p>
                        )}
                        <div className="space-y-1">
                            <Link
                                href={route('tutor.groups.index')}
                                className={`flex items-center rounded-md px-4 py-3 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 ${
                                    isActiveGroups ? 'bg-white/10' : ''
                                }`}
                                preserveScroll
                                title="Mis grupos"
                            >
                                <FaUsers className="mr-3 h-5 w-5" />
                                {!collapsed && (
                                    <span className="text-sm font-medium">
                                        Mis grupos
                                    </span>
                                )}
                            </Link>
                        </div>

                        {/* Sobre nosotros */}
                        <Link
                            href="/about" // Ruta directa - AJUSTA ESTA RUTA
                            className="flex items-center rounded-md px-4 py-3 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                            preserveScroll
                            title="Sobre nosotros"
                        >
                            <FaInfoCircle className="mr-3 h-5 w-5" />
                            {!collapsed && (
                                <span className="text-sm font-medium">
                                    Sobre nosotros
                                </span>
                            )}
                        </Link>
                    </nav>

                    {/* Logout */}
                    <div className="sticky bottom-0 border-t border-white/15 bg-[#0a5cb8] px-2 py-3">
                        <button
                            onClick={() => router.post(route('logout'))}
                            className="flex w-full items-center rounded-md px-4 py-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                            title="Cerrar sesión"
                        >
                            <FaSignOutAlt className="mr-3 h-5 w-5" />
                            {!collapsed && (
                                <span className="text-sm">Cerrar sesión</span>
                            )}
                        </button>
                    </div>
                </div>
            </aside>

            {/* MÓVIL: rail de iconos */}
            <div
                className={[
                    'fixed inset-y-0 left-0 z-30 flex w-16 flex-col items-center space-y-6 bg-[#0a5cb8] py-5 text-white md:hidden',
                    'transform will-change-transform',
                    mobileOpen
                        ? 'translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
                        : '-translate-x-16 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    'border-r border-white/20 shadow-lg',
                ].join(' ')}
            >
                {/* Botón para abrir/cerrar el rail */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="rounded-md p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                    aria-label={mobileOpen ? 'Ocultar menú' : 'Mostrar menú'}
                    title={mobileOpen ? 'Ocultar' : 'Mostrar'}
                >
                    {mobileOpen ? (
                        <FaChevronLeft className="h-5 w-5" />
                    ) : (
                        <FaChevronRight className="h-5 w-5" />
                    )}
                </button>

                {/* Iconos móviles */}
                <Link
                    href={route('profile.edit')}
                    className="p-3"
                    title="Mi perfil"
                >
                    <FaUser className="h-6 w-6" />
                </Link>
                <Link
                    href="/tutor/groups" // Ruta directa - AJUSTA ESTA RUTA
                    className="p-3"
                    title="Mis grupos"
                >
                    <FaUsers className="h-6 w-6" />
                </Link>
                <Link
                    href="/about" // Ruta directa - AJUSTA ESTA RUTA
                    className="p-3"
                    title="Sobre nosotros"
                >
                    <FaInfoCircle className="h-6 w-6" />
                </Link>

                {/* Logout móvil */}
                <button
                    onClick={() => router.post(route('logout'))}
                    className="mt-auto p-3"
                    title="Cerrar sesión"
                >
                    <FaSignOutAlt className="h-6 w-6" />
                </button>
            </div>
        </>
    );
};

export default TutorSidebar;
