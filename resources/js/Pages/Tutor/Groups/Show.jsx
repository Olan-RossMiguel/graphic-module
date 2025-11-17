// ============================================================================
// TutorGroupShow - Vista de Grupo con Estudiantes
// ============================================================================

import { GroupStats } from '@/Components/UI/GroupStats';
import { StudentTable } from '@/Components/UI/StudentTable';
import TutorLayout from '@/Layouts/UI/TutorLayout';
import { Link } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';

export default function TutorGroupShow({ auth, group, semestre, estudiantes }) {
    // Función para simular el estado de los tests (deberías obtener esto de tu backend)
    const getTestStatus = (estudiante) => {
        return (
            estudiante.tests_completados || {
                aprendizaje: false,
                emocional: false,
                habilidades: false,
            }
        );
    };

    // Función para descargar reporte
    const handleDownloadReport = (estudianteId, testType) => {
        console.log(
            `Descargando reporte de ${testType} para estudiante ${estudianteId}`,
        );
        // Aquí iría la lógica para descargar el reporte
    };

    // Calcular estudiantes activos
    const estudiantesActivos = estudiantes.filter(
        (e) => e.estado === 'activo',
    ).length;

    return (
        <TutorLayout user={auth.user}>
            <div className="space-y-6">
                {/* Header */}
                <div className="md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                            <Link
                                href={route('tutor.groups.index')}
                                className="mr-4 text-gray-400 transition-colors hover:text-gray-600"
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
                <GroupStats
                    totalEstudiantes={estudiantes.length}
                    grupoNombre={group.nombre}
                    semestre={semestre}
                    estudiantesActivos={estudiantesActivos}
                />

                {/* Tabla de estudiantes */}
                <StudentTable
                    estudiantes={estudiantes}
                    getTestStatus={getTestStatus}
                    handleDownloadReport={handleDownloadReport}
                />
            </div>
        </TutorLayout>
    );
}
