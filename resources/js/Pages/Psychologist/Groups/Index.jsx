import PsychologistLayout from '@/Layouts/UI/PsychologistLayout';
import { Link, usePage } from '@inertiajs/react';
import { FaEye, FaUserGraduate, FaUsers } from 'react-icons/fa';

// Componente de tabla simple con Tailwind
const GroupsTable = ({ groups }) => {
    if (!groups || groups.length === 0) {
        return (
            <div className="py-12 text-center">
                <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No hay grupos disponibles
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    No se han registrado grupos en el sistema.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                            No
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                            Grupo
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                            Semestre
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                            Total Estudiantes
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                            Acción
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {groups.map((group, index) => (
                        <tr
                            key={`${group.group_id}-${group.semestre}`}
                            className="hover:bg-gray-50"
                        >
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                {index + 1}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                {group.grupo_nombre}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                {group.semestre}°
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                <div className="flex items-center">
                                    <FaUserGraduate className="mr-2 h-4 w-4 text-gray-400" />
                                    {group.total_estudiantes || 0}
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                <Link
                                    href={route('psychologist.groups.show', {
                                        group: group.group_id,
                                        semestre: group.semestre,
                                    })}
                                    className="inline-flex items-center rounded-full border border-transparent bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    <FaEye className="mr-1 h-3 w-3" />
                                    Ver grupo
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default function PsychologistGroupsIndex({ auth, groups }) {
    const { props } = usePage();

    // Calcular estadísticas
    const totalGroups = groups?.length || 0;
    const totalStudents =
        groups?.reduce(
            (sum, group) => sum + (group.total_estudiantes || 0),
            0,
        ) || 0;
    const averageStudentsPerGroup =
        totalGroups > 0 ? Math.round(totalStudents / totalGroups) : 0;

    return (
        <PsychologistLayout user={auth.user}>
            <div className="space-y-6">
                {/* Header */}
                <div className="md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                            Grupos
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Vista general de todos los grupos del sistema
                        </p>
                    </div>
                </div>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">
                                Total de Grupos
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                {totalGroups}
                            </dd>
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">
                                Total de Estudiantes
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                {totalStudents}
                            </dd>
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">
                                Promedio por Grupo
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                {averageStudentsPerGroup}
                            </dd>
                        </div>
                    </div>
                </div>

                {/* Tabla de grupos */}
                <GroupsTable groups={groups} />
            </div>
        </PsychologistLayout>
    );
}
