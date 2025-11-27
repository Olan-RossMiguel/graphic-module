import { Link } from '@inertiajs/react';

function Navbar({ user }) {
    const defaultAvatar = 'https://www.gravatar.com/avatar/?d=mp&s=64';

    // Función para obtener el rol en formato legible
    const getRoleName = (tipo) => {
        const roles = {
            estudiante: 'Estudiante',
            tutor: 'Tutor/a',
            psicologa: 'Psicólogo/a',
            admin: 'Administrador/a',
        };
        return roles[tipo] || 'Usuario';
    };

    // Función para obtener la ruta del dashboard según el tipo de usuario
    const getDashboardRoute = () => {
        const userType = user?.tipo;

        switch (userType) {
            case 'estudiante':
                return '/student/dashboard';
            case 'tutor':
                return '/tutor/dashboard';
            case 'psicologa':
                return '/psychologist/dashboard';
            case 'admin':
                return '/admin/dashboard';
            default:
                return '/dashboard';
        }
    };

    // Obtener la URL correcta de la foto de perfil
    const getProfilePhoto = () => {
        if (!user?.foto_perfil) {
            return defaultAvatar;
        }

        // Si la foto ya es una URL completa (http/https)
        if (user.foto_perfil.startsWith('http')) {
            return user.foto_perfil;
        }

        // Si es una ruta relativa del storage
        return `/storage/${user.foto_perfil}`;
    };

    return (
        <header className="sticky top-0 z-40 bg-[#0a5cb8] shadow-[0_8px_12px_-8px_rgba(0,0,0,0.35)]">
            <div className="mx-auto flex h-16 items-center justify-between px-4 sm:h-20 sm:px-6">
                {/* Logo - Siempre visible en navbar con redirección */}
                <Link
                    href={getDashboardRoute()}
                    className="flex items-center space-x-3"
                >
                    <img
                        src="https://i.imgur.com/vbzMmkk.png"
                        className="h-10 w-auto transition-transform hover:scale-105 sm:h-12"
                        alt="Logo"
                    />
                </Link>

                {/* Información del usuario - Solo visible en desktop */}
                <div className="hidden items-center space-x-3 md:flex">
                    <img
                        src={getProfilePhoto()}
                        alt="Perfil"
                        className="h-9 w-9 rounded-full border-2 border-white object-cover sm:h-10 sm:w-10"
                        onError={(e) => {
                            e.target.src = defaultAvatar;
                        }}
                    />
                    <div>
                        <p className="text-sm font-semibold text-white">
                            {user?.nombre_completo || user?.nombre || 'Usuario'}
                        </p>
                        <p className="text-xs text-white/80">
                            {getRoleName(user?.tipo)}
                        </p>
                    </div>
                </div>

                {/* Avatar solo en móvil */}
                <div className="md:hidden">
                    <img
                        src={getProfilePhoto()}
                        alt="Perfil"
                        className="h-9 w-9 rounded-full border-2 border-white object-cover"
                        onError={(e) => {
                            e.target.src = defaultAvatar;
                        }}
                    />
                </div>
            </div>
        </header>
    );
}

export default Navbar;
