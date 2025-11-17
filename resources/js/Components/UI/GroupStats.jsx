// components/GroupStats.jsx
import { FaCheckCircle, FaUserGraduate, FaUsers } from 'react-icons/fa';

export const GroupStats = ({
    totalEstudiantes,
    grupoNombre,
    semestre,
    estudiantesActivos,
}) => {
    const stats = [
        {
            label: 'Total Estudiantes',
            value: totalEstudiantes,
            icon: FaUsers,
            color: 'text-blue-600',
        },
        {
            label: 'Grupo',
            value: grupoNombre,
            icon: FaUserGraduate,
            color: 'text-purple-600',
        },
        {
            label: 'Semestre',
            value: `${semestre}°`,
            icon: FaUserGraduate,
            color: 'text-indigo-600',
        },
        {
            label: 'Estudiantes Activos',
            value: estudiantesActivos,
            icon: FaCheckCircle,
            color: 'text-green-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md"
                >
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <stat.icon
                                    className={`h-8 w-8 ${stat.color}`}
                                />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dt className="truncate text-sm font-medium text-gray-500">
                                    {stat.label}
                                </dt>
                                <dd
                                    className={`mt-1 text-3xl font-semibold ${stat.color}`}
                                >
                                    {stat.value}
                                </dd>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
