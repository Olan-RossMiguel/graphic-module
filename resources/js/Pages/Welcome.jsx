import { Link } from '@inertiajs/react';
import {
    FaBrain,
    FaChalkboardTeacher,
    FaUserGraduate,
    FaUserShield,
} from 'react-icons/fa';

export default function LandingPage() {
    const roles = [
        {
            title: 'Estudiante',
            subtitle: 'Módulo de Tests y Servicios Psicológicos',
            icon: FaUserGraduate,
            route: '/login',
            isAdmin: false,
        },
        {
            title: 'Tutor',
            subtitle: 'Módulo de Seguimiento y Orientación',
            icon: FaChalkboardTeacher,
            route: '/login',
            isAdmin: false,
        },
        {
            title: 'Psicólogo/a',
            subtitle: 'Módulo de Evaluación y Apoyo',
            icon: FaBrain,
            route: '/login',
            isAdmin: false,
        },
        {
            title: 'Administrador',
            subtitle: 'Módulo de Gestión y Configuración',
            icon: FaUserShield,
            route: '/admin',
            isAdmin: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header
                style={{ backgroundColor: '#0a5cb8' }}
                className="py-4 shadow-lg"
            >
                <div className="container mx-auto px-4">
                    <h1 className="text-center text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                        Plataforma de Asistencia Psicológica ITSS
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 sm:py-12">
                {/* Logos Section */}
                <div className="mb-8 flex flex-col items-center justify-center gap-6 sm:mb-12 sm:flex-row sm:gap-12">
                    <img
                        src="https://i.imgur.com/vbzMmkk.png"
                        alt="Logo ITSS"
                        className="h-24 w-auto sm:h-32 lg:h-40"
                    />
                    <div className="h-px w-24 bg-gray-300 sm:h-24 sm:w-px"></div>
                    <img
                        src="https://i.imgur.com/1MoRblg.png"
                        alt="Logo PAP"
                        className="h-24 w-auto sm:h-32 lg:h-40"
                    />
                </div>

                {/* Institution Info */}
                <div className="mb-8 text-center sm:mb-12">
                    <h2 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
                        Tecnológico Nacional de México
                    </h2>
                    <p className="text-base text-gray-600 sm:text-lg lg:text-xl">
                        Instituto Tecnológico Superior de la Región Sierra
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="mx-auto max-w-4xl">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
                        {roles.map((role, index) => {
                            const IconComponent = role.icon;
                            return (
                                <div
                                    key={index}
                                    className="rounded-2xl bg-white p-6 shadow-lg sm:p-8"
                                    style={{ borderTop: '4px solid #0a5cb8' }}
                                >
                                    {/* Icon */}
                                    <div className="mb-4 flex justify-center">
                                        <div className="rounded-full bg-gray-100 p-5">
                                            <IconComponent className="h-12 w-12 text-gray-800 sm:h-14 sm:w-14" />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="mb-2 text-center text-xl font-bold text-gray-900 sm:text-2xl">
                                        PAP{' '}
                                        <span style={{ color: '#0a5cb8' }}>
                                            {role.title}
                                        </span>
                                    </h3>

                                    {/* Subtitle */}
                                    <p className="mb-6 text-center text-sm text-gray-600 sm:text-base">
                                        {role.subtitle}
                                    </p>

                                    {/* Button */}
                                    {role.route ? (
                                        role.isAdmin ? (
                                            // Enlace HTML nativo para Admin (navegación completa)
                                            <a
                                                href={role.route}
                                                style={{
                                                    backgroundColor: '#0a5cb8',
                                                }}
                                                className="block w-full rounded-lg py-3 text-center font-semibold text-white transition-opacity hover:opacity-90 sm:py-3.5"
                                            >
                                                Iniciar Sesión
                                            </a>
                                        ) : (
                                            // Link de Inertia para otros roles
                                            <Link
                                                href={role.route}
                                                style={{
                                                    backgroundColor: '#0a5cb8',
                                                }}
                                                className="block w-full rounded-lg py-3 text-center font-semibold text-white transition-opacity hover:opacity-90 sm:py-3.5"
                                            >
                                                Iniciar Sesión
                                            </Link>
                                        )
                                    ) : (
                                        <button
                                            disabled
                                            className="w-full cursor-not-allowed rounded-lg bg-gray-300 py-3 font-semibold text-gray-500 sm:py-3.5"
                                        >
                                            Próximamente
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500 sm:text-base">
                        Sistema de Gestión de Asistencia Psicológica
                    </p>
                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        © 2024 ITSS - Todos los derechos reservados
                    </p>
                </div>
            </main>
        </div>
    );
}
