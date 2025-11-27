// resources/js/Pages/Tutor/Dashboard.jsx
import TutorLayout from '@/Layouts/UI/TutorLayout';
import { Head } from '@inertiajs/react';
import {
    FaChalkboardTeacher,
    FaLightbulb,
    FaUserGraduate,
} from 'react-icons/fa';

const TutorDashboard = ({ auth }) => {
    return (
        <TutorLayout user={auth.user}>
            <Head title="Dashboard - Tutor" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Header de Bienvenida */}
                    <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-teal-600 p-8 text-white shadow-xl">
                        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                            <div className="text-center md:text-left">
                                <h1 className="mb-2 text-3xl font-bold sm:text-4xl">
                                    ¡Hola, {auth.user.nombre}! 👋
                                </h1>
                                <p className="text-lg text-green-100">
                                    Bienvenido/a al Sistema de Tutoría Académica
                                </p>
                                <p className="mt-1 text-sm font-medium text-green-200">
                                    PAP - Acompañamiento y Orientación
                                    Estudiantil
                                </p>
                            </div>

                            {/* Logo/Icono */}
                            <div className="flex-shrink-0">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                    <FaChalkboardTeacher className="h-12 w-12 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Información */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Panel de Estudiantes */}
                        <div className="rounded-xl bg-white p-6 shadow-md">
                            <div className="mb-4 flex items-center">
                                <FaUserGraduate className="mr-2 h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    Tus Estudiantes
                                </h3>
                            </div>
                            <div className="space-y-3">
                                <div className="rounded-lg bg-green-50 p-4">
                                    <p className="mb-2 text-sm font-medium text-gray-900">
                                        👥 Acompañamiento Personalizado
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Como tutor, eres el enlace fundamental
                                        entre los estudiantes y su desarrollo
                                        académico. Monitorea su progreso y
                                        brinda orientación continua.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Panel de Orientación */}
                        <div className="rounded-xl bg-white p-6 shadow-md">
                            <div className="mb-4 flex items-center">
                                <FaLightbulb className="mr-2 h-5 w-5 text-teal-600" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    Recursos de Orientación
                                </h3>
                            </div>
                            <div className="space-y-3">
                                <div className="rounded-lg bg-teal-50 p-4">
                                    <p className="mb-2 text-sm font-medium text-gray-900">
                                        🎯 Tu labor marca la diferencia
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Esta plataforma te permite dar
                                        seguimiento al rendimiento académico y
                                        bienestar de tus estudiantes,
                                        identificando áreas de mejora y
                                        fortalezas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TutorLayout>
    );
};

export default TutorDashboard;
