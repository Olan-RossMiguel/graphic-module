// components/StudentRow.jsx
import { Link } from '@inertiajs/react';
import { FaCheck, FaDownload, FaEye, FaTimes } from 'react-icons/fa';

export const StudentRow = ({ estudiante, testStatus, onDownloadReport }) => {
    // Verificar si el estudiante ha completado al menos un test
    const hasCompletedAnyTest =
        testStatus.aprendizaje ||
        testStatus.emocional ||
        testStatus.habilidades;

    return (
        <tr className="transition-colors hover:bg-gray-50">
            {/* Foto */}
            <td className="whitespace-nowrap px-6 py-4 text-center">
                <div className="flex justify-center">
                    <img
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-200"
                        src={estudiante.foto_perfil_url}
                        alt={`Foto de ${estudiante.nombre}`}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/40';
                        }}
                    />
                </div>
            </td>

            {/* Matrícula */}
            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {estudiante.numero_control}
            </td>

            {/* Nombre completo */}
            <td className="px-6 py-4 text-sm text-gray-900">
                <div>
                    <div className="font-medium text-gray-900">
                        {estudiante.nombre} {estudiante.apellido_paterno}{' '}
                        {estudiante.apellido_materno}
                    </div>
                    <div className="text-xs text-gray-500">
                        {estudiante.email}
                    </div>
                </div>
            </td>

            {/* Test de Aprendizaje */}
            <td className="whitespace-nowrap px-6 py-4 text-center">
                <TestStatusIcon
                    completed={testStatus.aprendizaje}
                    testName="Estilos de Aprendizaje"
                />
            </td>

            {/* Test Emocional */}
            <td className="whitespace-nowrap px-6 py-4 text-center">
                <TestStatusIcon
                    completed={testStatus.emocional}
                    testName="Inteligencia Emocional"
                />
            </td>

            {/* Test de Habilidades */}
            <td className="whitespace-nowrap px-6 py-4 text-center">
                <TestStatusIcon
                    completed={testStatus.habilidades}
                    testName="Habilidades Blandas"
                />
            </td>

            {/* Acciones */}
            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                <div className="flex justify-center space-x-2">
                    <Link
                        href={route('tutor.students.report.general', {
                            student: estudiante.id,
                        })}
                        className={`inline-flex items-center rounded border border-transparent px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            hasCompletedAnyTest
                                ? 'cursor-pointer bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                : 'pointer-events-none cursor-not-allowed bg-gray-400 opacity-50'
                        }`}
                        title={
                            hasCompletedAnyTest
                                ? 'Ver reporte general'
                                : 'El estudiante no ha completado ningún test'
                        }
                    >
                        <FaDownload className="mr-1.5 h-3 w-3" />
                        Reporte
                    </Link>

                    <Link
                        href={route('tutor.students.show', {
                            student: estudiante.id,
                        })}
                        className="inline-flex items-center rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        title="Ver detalles de tests"
                    >
                        <FaEye className="mr-1.5 h-3 w-3" />
                        Detalles
                    </Link>
                </div>
            </td>
        </tr>
    );
};

// Componente auxiliar para el estado del test
const TestStatusIcon = ({ completed, testName }) => {
    return completed ? (
        <div
            className="inline-flex items-center justify-center rounded-full bg-green-100 p-2"
            title={`${testName} completado`}
        >
            <FaCheck className="h-4 w-4 text-green-600" />
        </div>
    ) : (
        <div
            className="inline-flex items-center justify-center rounded-full bg-red-100 p-2"
            title={`${testName} pendiente`}
        >
            <FaTimes className="h-4 w-4 text-red-600" />
        </div>
    );
};
