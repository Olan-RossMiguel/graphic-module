import { Head, Link } from '@inertiajs/react';
import {
    FaBook,
    FaBrain,
    FaCalendarAlt,
    FaChartLine,
    FaCheckCircle,
    FaClock,
    FaHandsHelping,
    FaHeartbeat,
} from 'react-icons/fa';

export default function StudentDashboard({ auth, stats, completed_results }) {
    // Mapeo de iconos por tipo de test
    const testIcons = {
        estilos_aprendizaje: FaBook,
        'learning-styles': FaBook,
        inteligencia_emocional: FaBrain,
        'emotional-intelligence': FaBrain,
        habilidades_blandas: FaHandsHelping,
        'soft-skills': FaHandsHelping,
        asistencia_psicologica: FaHeartbeat,
        'psychological-assistance': FaHeartbeat,
    };

    // Mapeo de colores por tipo de test
    const testColors = {
        estilos_aprendizaje: 'from-blue-500 to-blue-600',
        'learning-styles': 'from-blue-500 to-blue-600',
        inteligencia_emocional: 'from-purple-500 to-purple-600',
        'emotional-intelligence': 'from-purple-500 to-purple-600',
        habilidades_blandas: 'from-green-500 to-green-600',
        'soft-skills': 'from-green-500 to-green-600',
        asistencia_psicologica: 'from-red-500 to-red-600',
        'psychological-assistance': 'from-red-500 to-red-600',
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getTestIcon = (tipo) => {
        const IconComponent = testIcons[tipo] || FaBook;
        return <IconComponent className="h-5 w-5" />;
    };

    return (
        <>
            <Head title="Dashboard - Estudiante" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            ¡Hola, {auth.user.nombre}! 👋
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Aquí está tu progreso en los tests psicométricos
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                        {/* Total Tests */}
                        <div className="rounded-xl border-l-4 border-blue-500 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Tests Totales
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                        {stats.total_tests}
                                    </p>
                                </div>
                                <div className="rounded-full bg-blue-100 p-3">
                                    <FaBook className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        {/* Completed Tests */}
                        <div className="rounded-xl border-l-4 border-green-500 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Completados
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                        {stats.completed_tests}
                                    </p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <FaCheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        {/* Pending Tests */}
                        <div className="rounded-xl border-l-4 border-orange-500 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Pendientes
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                        {stats.pending_tests}
                                    </p>
                                </div>
                                <div className="rounded-full bg-orange-100 p-3">
                                    <FaClock className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                        </div>

                        {/* Completion Percentage */}
                        <div className="rounded-xl border-l-4 border-purple-500 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Progreso
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                        {stats.completion_percentage}%
                                    </p>
                                </div>
                                <div className="rounded-full bg-purple-100 p-3">
                                    <FaChartLine className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                            <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
                                <div
                                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                                    style={{
                                        width: `${stats.completion_percentage}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tests Completados Table */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-md">
                        <div className="border-b border-gray-200 px-6 py-5">
                            <h2 className="flex items-center text-xl font-bold text-gray-900">
                                <FaCheckCircle className="mr-2 text-green-500" />
                                Tests Completados
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Historial de tests realizados
                            </p>
                        </div>

                        {completed_results.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <FaClock className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="mb-2 text-lg font-medium text-gray-900">
                                    No has completado ningún test
                                </h3>
                                <p className="mb-6 text-gray-600">
                                    Comienza tu primer test para ver tus
                                    resultados aquí
                                </p>
                                <Link
                                    href="/student/tests"
                                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-medium text-white shadow-md transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
                                >
                                    <FaBook className="mr-2" />
                                    Ver Tests Disponibles
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Test
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Fecha
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Puntuación
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {completed_results.map((result) => (
                                            <tr
                                                key={result.id}
                                                className="transition-colors hover:bg-gray-50"
                                            >
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div
                                                            className={`h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-r ${testColors[result.test_tipo] || 'from-gray-500 to-gray-600'} flex items-center justify-center text-white`}
                                                        >
                                                            {getTestIcon(
                                                                result.test_tipo,
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {
                                                                    result.test_nombre
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <FaCalendarAlt className="mr-2 text-gray-400" />
                                                        {formatDate(
                                                            result.fecha_realizacion,
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                                        {result.puntuacion_total.toFixed(
                                                            1,
                                                        )}{' '}
                                                        pts
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                    <button className="font-medium text-blue-600 transition-colors hover:text-blue-900">
                                                        Ver Detalles →
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    {completed_results.length > 0 &&
                        stats.pending_tests > 0 && (
                            <div className="mt-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white shadow-lg">
                                <div className="flex flex-col items-center justify-between sm:flex-row">
                                    <div className="mb-4 sm:mb-0">
                                        <h3 className="mb-1 text-xl font-bold">
                                            ¡Continúa tu progreso!
                                        </h3>
                                        <p className="text-blue-100">
                                            Aún tienes {stats.pending_tests}{' '}
                                            test
                                            {stats.pending_tests !== 1
                                                ? 's'
                                                : ''}{' '}
                                            pendiente
                                            {stats.pending_tests !== 1
                                                ? 's'
                                                : ''}
                                        </p>
                                    </div>
                                    <Link
                                        href="/student/tests"
                                        className="inline-flex items-center rounded-lg bg-white px-6 py-3 font-medium text-blue-600 shadow-md transition-all hover:bg-blue-50 hover:shadow-lg"
                                    >
                                        <FaBook className="mr-2" />
                                        Realizar Test
                                    </Link>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </>
    );
}
