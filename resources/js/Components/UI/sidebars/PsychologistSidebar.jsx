import { FaInfoCircle, FaUser, FaUsers } from 'react-icons/fa';

const PsychologistSidebar = () => {
    return (
        <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-gray-50">
            {/* Logo */}
            <div className="mb-5 border-b border-gray-200 p-5">
                <img
                    src="https://res.cloudinary.com/speedwares/image/upload/v1659284687/windframe-logo-main_daes7r.png"
                    alt="Logo"
                    className="h-auto w-full"
                />
            </div>

            {/* Contenido del sidebar */}
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    {/* Perfil */}
                    <div className="mb-6">
                        <a
                            href="#"
                            className="flex items-center px-5 py-3 text-gray-700 transition-colors duration-200 hover:bg-gray-100"
                        >
                            <FaUser className="mr-3 h-5 w-5 text-blue-500" />
                            <span className="text-sm font-medium">Perfil</span>
                        </a>
                    </div>

                    {/* Grupos */}
                    <div className="mb-6">
                        <p className="mb-2 px-5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Grupos:
                        </p>
                        <div className="pl-7">
                            <a
                                href="#"
                                className="flex items-center px-5 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100"
                            >
                                <FaUsers className="mr-3 h-5 w-5 text-green-500" />
                                <span className="text-sm">
                                    Todos los grupos
                                </span>
                            </a>
                            <a
                                href="#"
                                className="flex items-center px-5 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100"
                            >
                                <FaUsers className="mr-3 h-5 w-5 text-purple-500" />
                                <span className="text-sm">
                                    Reportes generales
                                </span>
                            </a>
                            <a
                                href="#"
                                className="flex items-center px-5 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100"
                            >
                                <FaUsers className="mr-3 h-5 w-5 text-orange-500" />
                                <span className="text-sm">Estadísticas</span>
                            </a>
                        </div>
                    </div>

                    {/* Sobre nosotros */}
                    <div className="mb-6">
                        <a
                            href="#"
                            className="flex items-center px-5 py-3 text-gray-700 transition-colors duration-200 hover:bg-gray-100"
                        >
                            <FaInfoCircle className="mr-3 h-5 w-5 text-red-500" />
                            <span className="text-sm font-medium">
                                Sobre nosotros
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PsychologistSidebar;
