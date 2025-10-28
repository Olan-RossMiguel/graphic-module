import TutorLayout from '@/Layouts/UI/TutorLayout';
import { Link } from '@inertiajs/react';
import {
    FaArrowLeft,
    FaBook,
    FaBrain,
    FaCheck,
    FaDownload,
    FaEye,
    FaHandsHelping,
    FaTimes,
    FaUser,
} from 'react-icons/fa';

export default function TutorGroupShow({ auth, group, semestre, estudiantes }) {
    // Función para simular el estado de los tests (deberías obtener esto de tu backend)
    const getTestStatus = (estudiante) => {
        // Esto es un ejemplo - deberías obtener estos datos reales de tu base de datos
        return {
            aprendizaje: Math.random() > 0.3, // 70% completado
            emocional: Math.random() > 0.5, // 50% completado
            habilidades: Math.random() > 0.4, // 60% completado
        };
    };

    // Función para descargar reporte
    const handleDownloadReport = (estudianteId, testType) => {
        console.log(
            `Descargando reporte de ${testType} para estudiante ${estudianteId}`,
        );
        // Aquí iría la lógica para descargar el reporte
    };

    // Función para ver detalles del test
    const handleViewDetails = (studentId) => {
        window.location.href = route('tutor.students.show', {
            student: studentId,
        });
    };

    return (
        <TutorLayout user={auth.user}>
            <div className="space-y-6">
                {/* Header */}
                <div className="md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                            <Link
                                href={route('tutor.groups.index')}
                                className="mr-4 text-gray-400 hover:text-gray-600"
                            >
                                <FaArrowLeft className="h-5 w-5" />
                            </Link>
                            <div>
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                                    Grupo {group.nombre} - {semestre}° Semestre
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Lista de estudiantes y estado de sus tests
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">
                                Total Estudiantes
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                {estudiantes.length}
                            </dd>
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">
                                Grupo
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                {group.nombre}
                            </dd>
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">
                                Semestre
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                {semestre}°
                            </dd>
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">
                                Estudiantes Activos
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-green-600">
                                {
                                    estudiantes.filter(
                                        (e) => e.estado === 'activo',
                                    ).length
                                }
                            </dd>
                        </div>
                    </div>
                </div>

                {/* Tabla de estudiantes */}
                <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                    >
                                        Matrícula
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                    >
                                        Nombre completo
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                                    >
                                        <div className="flex items-center justify-center">
                                            <FaBook className="mr-2 h-4 w-4" />
                                            Estilo de aprendizaje
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                                    >
                                        <div className="flex items-center justify-center">
                                            <FaBrain className="mr-2 h-4 w-4" />
                                            Inteligencia Emocional
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                                    >
                                        <div className="flex items-center justify-center">
                                            <FaHandsHelping className="mr-2 h-4 w-4" />
                                            Habilidades blandas
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                                    >
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {estudiantes.map((estudiante) => {
                                    const testStatus =
                                        getTestStatus(estudiante);

                                    return (
                                        <tr
                                            key={estudiante.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                {estudiante.numero_control}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                <div className="flex items-center">
                                                    <img
                                                        className="mr-3 h-8 w-8 rounded-full"
                                                        src={
                                                            estudiante.foto_perfil_url
                                                        }
                                                        alt={`Foto de ${estudiante.nombre}`}
                                                    />
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {estudiante.nombre}{' '}
                                                            {
                                                                estudiante.apellido_paterno
                                                            }{' '}
                                                            {
                                                                estudiante.apellido_materno
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {estudiante.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Estilo de aprendizaje */}
                                            <td className="whitespace-nowrap px-6 py-4 text-center">
                                                {testStatus.aprendizaje ? (
                                                    <FaCheck className="mx-auto h-5 w-5 text-green-500" />
                                                ) : (
                                                    <FaTimes className="mx-auto h-5 w-5 text-red-500" />
                                                )}
                                            </td>

                                            {/* Inteligencia emocional */}
                                            <td className="whitespace-nowrap px-6 py-4 text-center">
                                                {testStatus.emocional ? (
                                                    <FaCheck className="mx-auto h-5 w-5 text-green-500" />
                                                ) : (
                                                    <FaTimes className="mx-auto h-5 w-5 text-red-500" />
                                                )}
                                            </td>

                                            {/* Habilidades blandas */}
                                            <td className="whitespace-nowrap px-6 py-4 text-center">
                                                {testStatus.habilidades ? (
                                                    <FaCheck className="mx-auto h-5 w-5 text-green-500" />
                                                ) : (
                                                    <FaTimes className="mx-auto h-5 w-5 text-red-500" />
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                                <div className="flex justify-center space-x-2">
                                                    {/* Botón descargar reporte */}
                                                    <button
                                                        onClick={() =>
                                                            handleDownloadReport(
                                                                estudiante.id,
                                                                'completo',
                                                            )
                                                        }
                                                        className="inline-flex items-center rounded border border-transparent bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                        title="Descargar reporte completo"
                                                    >
                                                        <FaDownload className="mr-1 h-3 w-3" />
                                                        Reporte
                                                    </button>

                                                    {/* Botón ver detalles */}
                                                    <button
                                                        onClick={() =>
                                                            handleViewDetails(
                                                                estudiante.id,
                                                            )
                                                        }
                                                        className="inline-flex items-center rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                        title="Ver detalles de tests"
                                                    >
                                                        <FaEye className="mr-1 h-3 w-3" />
                                                        Detalles
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {estudiantes.length === 0 && (
                            <div className="py-12 text-center">
                                <FaUser className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    No hay estudiantes
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    No hay estudiantes registrados en este grupo
                                    y semestre.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Paginación (ejemplo) */}
                {estudiantes.length > 0 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Mostrando{' '}
                                    <span className="font-medium">1</span> a{' '}
                                    <span className="font-medium">
                                        {estudiantes.length}
                                    </span>{' '}
                                    de{' '}
                                    <span className="font-medium">
                                        {estudiantes.length}
                                    </span>{' '}
                                    resultados
                                </p>
                            </div>
                            <div>
                                <nav
                                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                    aria-label="Pagination"
                                >
                                    <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                        <span className="sr-only">
                                            Anterior
                                        </span>
                                        &laquo;
                                    </button>
                                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                        1
                                    </button>
                                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                        2
                                    </button>
                                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                        3
                                    </button>
                                    <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                        <span className="sr-only">
                                            Siguiente
                                        </span>
                                        &raquo;
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TutorLayout>
    );
}
