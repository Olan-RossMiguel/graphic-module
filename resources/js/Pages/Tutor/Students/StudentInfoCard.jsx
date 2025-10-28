import { FaChartBar, FaEnvelope, FaIdCard, FaUser } from 'react-icons/fa';

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center">
        <Icon className="mr-3 h-5 w-5 text-gray-400" />
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-sm text-gray-900">{value}</p>
        </div>
    </div>
);

export default function StudentInfoCard({ student }) {
    return (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="flex items-center text-lg font-medium leading-6 text-gray-900">
                    <FaUser className="mr-2 h-5 w-5" />
                    Información del Estudiante
                </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <InfoItem
                        icon={FaIdCard}
                        label="Matrícula"
                        value={student.numero_control}
                    />
                    <InfoItem
                        icon={FaEnvelope}
                        label="Email"
                        value={student.email}
                    />
                    <InfoItem
                        icon={FaUser}
                        label="Grupo"
                        value={student.group_nombre}
                    />
                    <InfoItem
                        icon={FaChartBar}
                        label="Semestre"
                        value={`${student.semestre}°`}
                    />
                </div>
            </div>
        </div>
    );
}
