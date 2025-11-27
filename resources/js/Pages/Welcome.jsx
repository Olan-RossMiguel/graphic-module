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
            color: 'from-blue-500 to-blue-600',
            hoverColor: 'hover:from-blue-600 hover:to-blue-700',
            route: '/login',
        },
        {
            title: 'Tutor',
            subtitle: 'Módulo de Seguimiento y Orientación',
            icon: FaChalkboardTeacher,
            color: 'from-green-500 to-green-600',
            hoverColor: 'hover:from-green-600 hover:to-green-700',
            route: '/login',
        },
        {
            title: 'Psicólogo/a',
            subtitle: 'Módulo de Evaluación y Apoyo',
            icon: FaBrain,
            color: 'from-purple-500 to-purple-600',
            hoverColor: 'hover:from-purple-600 hover:to-purple-700',
            route: '/login',
        },
        {
            title: 'Administrador',
            subtitle: 'Módulo de Gestión y Configuración',
            icon: FaUserShield,
            color: 'from-gray-700 to-gray-800',
            hoverColor: 'hover:from-gray-800 hover:to-gray-900',
            route: '', // Ruta vacía para configurar después
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
            {/* Header */}
            <header className="bg-[#0a5cb8] py-4 shadow-lg">
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
                    <div className="h-px w-24 bg-gray-300 sm:h-24 sm:w-px" />
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
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
                        {roles.map((role, index) => {
                            const IconComponent = role.icon;
                            return (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:p-8"
                                >
                                    {/* Gradient Background on Hover */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                                    />

                                    <div className="relative">
                                        {/* Icon */}
                                        <div
                                            className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${role.color} p-4 text-white shadow-md transition-transform duration-300 group-hover:scale-110 sm:mb-6 sm:p-5`}
                                        >
                                            <IconComponent className="h-10 w-10 sm:h-12 sm:w-12" />
                                        </div>

                                        {/* Title */}
                                        <h3 className="mb-2 text-xl font-bold text-gray-800 sm:text-2xl">
                                            PAP{' '}
                                            <span
                                                className={`bg-gradient-to-r ${role.color} bg-clip-text text-transparent`}
                                            >
                                                {role.title}
                                            </span>
                                        </h3>

                                        {/* Subtitle */}
                                        <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
                                            {role.subtitle}
                                        </p>

                                        {/* Button */}
                                        {role.route ? (
                                            <Link
                                                href={role.route}
                                                className={`block w-full rounded-lg bg-gradient-to-r ${role.color} ${role.hoverColor} py-3 text-center font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg sm:py-3.5`}
                                            >
                                                Iniciar Sesión
                                            </Link>
                                        ) : (
                                            <button
                                                disabled
                                                className="w-full cursor-not-allowed rounded-lg bg-gradient-to-r from-gray-400 to-gray-500 py-3 font-semibold text-white opacity-60 shadow-md sm:py-3.5"
                                            >
                                                Próximamente
                                            </button>
                                        )}
                                    </div>
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
