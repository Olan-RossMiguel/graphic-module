function Navbar({ user }) {
    const defaultAvatar = 'https://www.gravatar.com/avatar/?d=mp&s=64';

    return (
        <header className="sticky top-0 z-40 bg-[#0a5cb8] shadow-[0_8px_12px_-8px_rgba(0,0,0,0.35)]">
            <div className="mx-auto flex h-16 items-center justify-between px-4 sm:h-20 sm:px-6">
                {/* Logo - Siempre visible en navbar */}
                <div className="flex items-center space-x-3">
                    <img
                        src="https://i.imgur.com/vbzMmkk.png"
                        className="h-10 w-auto sm:h-12"
                        alt="Logo"
                    />
                </div>

                {/* Información del usuario - Solo visible en desktop */}
                <div className="hidden items-center space-x-3 md:flex">
                    <img
                        src={user?.foto_perfil || defaultAvatar}
                        alt="Perfil"
                        className="h-9 w-9 rounded-full border-2 border-white object-cover sm:h-10 sm:w-10"
                    />
                    <div>
                        <p className="text-sm font-semibold text-white">
                            {user?.nombre || 'Usuario'}
                        </p>
                        <p className="text-xs text-white/80">Estudiante</p>
                    </div>
                </div>

                {/* Avatar solo en móvil */}
                <div className="md:hidden">
                    <img
                        src={user?.foto_perfil || defaultAvatar}
                        alt="Perfil"
                        className="h-9 w-9 rounded-full border-2 border-white object-cover"
                    />
                </div>
            </div>
        </header>
    );
}

export default Navbar;
