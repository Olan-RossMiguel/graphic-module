import { EmptyState } from '@/Components/UI/EmptyState';
import { StudentRow } from '@/Components/UI/tests/psychologist/StudentRow';
import {
    FaBook,
    FaBrain,
    FaHandsHelping,
    FaHeartbeat,
    FaImage,
} from 'react-icons/fa';

export const StudentTable = ({
    estudiantes,
    getTestStatus,
    handleDownloadReport,
}) => {
    if (estudiantes.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                                <div className="flex items-center justify-center">
                                    <FaImage className="mr-2 h-4 w-4" />
                                    Foto
                                </div>
                            </th>
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
                                    Aprendizaje
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                                <div className="flex items-center justify-center">
                                    <FaBrain className="mr-2 h-4 w-4" />
                                    Emocional
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                                <div className="flex items-center justify-center">
                                    <FaHandsHelping className="mr-2 h-4 w-4" />
                                    Habilidades
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                                <div className="flex items-center justify-center">
                                    <FaHeartbeat className="mr-2 h-4 w-4" />
                                    Asistencia
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
                        {estudiantes.map((estudiante) => (
                            <StudentRow
                                key={estudiante.id}
                                estudiante={estudiante}
                                testStatus={getTestStatus(estudiante)}
                                onDownloadReport={handleDownloadReport}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
