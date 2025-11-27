// resources/js/Pages/Psychologist/Dashboard.jsx
import PsychologistLayout from '@/Layouts/UI/PsychologistLayout';
import { Head } from '@inertiajs/react';
import { FaBrain, FaHeart, FaUsers } from 'react-icons/fa';

const PsychologistDashboard = ({ auth }) => {
    return (
        <PsychologistLayout user={auth.user}>
            <Head title="Dashboard - Psicólogo" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Header de Bienvenida */}
                    <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-xl">
                        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                            <div className="text-center md:text-left">
                                <h1 className="mb-2 text-3xl font-bold sm:text-4xl">
                                    ¡Hola, {auth.user.nombre}! 👋
                                </h1>
                                <p className="text-lg text-blue-100">
                                    Bienvenido/a a la Plataforma de Asistencia
                                    Psicológica
                                </p>
                                <p className="mt-1 text-sm font-medium text-blue-200">
                                    PAP - Sistema Integral de Apoyo Estudiantil
                                </p>
                            </div>

                            {/* Logo/Icono */}
                            <div className="flex-shrink-0">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                    <FaBrain className="h-12 w-12 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Información */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Panel de Estudiantes */}
                        <div className="rounded-xl bg-white p-6 shadow-md">
                            <div className="mb-4 flex items-center">
                                <FaUsers className="mr-2 h-5 w-5 text-blue-600" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    Seguimiento Estudiantil
                                </h3>
                            </div>
                            <div className="space-y-3">
                                <div className="rounded-lg bg-blue-50 p-4">
                                    <p className="mb-2 text-sm font-medium text-gray-900">
                                        🧠 Apoyo Integral
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Acompaña a los estudiantes en su
                                        bienestar emocional y desarrollo
                                        personal. Monitorea sus evaluaciones y
                                        brinda el apoyo psicológico que
                                        necesitan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Panel de Recursos */}
                        <div className="rounded-xl bg-white p-6 shadow-md">
                            <div className="mb-4 flex items-center">
                                <FaHeart className="mr-2 h-5 w-5 text-purple-600" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    Recursos de Apoyo
                                </h3>
                            </div>
                            <div className="space-y-3">
                                <div className="rounded-lg bg-purple-50 p-4">
                                    <p className="mb-2 text-sm font-medium text-gray-900">
                                        🎯 Tu rol es fundamental
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Esta plataforma te ayuda a brindar el
                                        mejor apoyo psicológico a los
                                        estudiantes, facilitando el seguimiento
                                        y análisis de su bienestar emocional.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PsychologistLayout>
    );
};

export default PsychologistDashboard;
