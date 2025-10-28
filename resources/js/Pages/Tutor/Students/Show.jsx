import TutorLayout from '@/Layouts/UI/TutorLayout';
import StudentHeader from '@/Pages/Tutor/Students/StudentHeader';
import StudentInfoCard from '@/Pages/Tutor/Students/StudentInfoCard';
import {
    GenericTestCard,
    LearningStylesCard,
} from '@/Pages/Tutor/Students/TestResultCards';
import { FaBrain, FaHandsHelping } from 'react-icons/fa';

// Constantes
const TEST_TYPE_MAP = {
    estilos_aprendizaje: 'aprendizaje',
    'learning-styles': 'aprendizaje',
    inteligencia_emocional: 'emocional',
    'emotional-intelligence': 'emocional',
    habilidades_blandas: 'habilidades',
    'soft-skills': 'habilidades',
};

// Función para procesar resultados
const processTestResults = (testResults) => {
    const results = {
        aprendizaje: null,
        emocional: null,
        habilidades: null,
    };

    testResults.forEach((result) => {
        const resultadoData = result.resultado_json;
        const tipoProcesado =
            TEST_TYPE_MAP[result.test_tipo] || result.test_tipo;

        switch (tipoProcesado) {
            case 'aprendizaje':
                if (resultadoData?.estilos) {
                    results.aprendizaje = {
                        data: resultadoData.estilos,
                        tipo: 'aprendizaje',
                        estilo_dominante: resultadoData.estilo_dominante,
                        porcentajes: resultadoData.porcentajes,
                        interpretacion: resultadoData.interpretacion,
                        fecha: result.fecha_realizacion,
                        puntuacion: result.puntuacion_total,
                        recomendaciones: result.recomendaciones,
                        dato_curioso: result.dato_curioso,
                        total_respuestas: resultadoData.total_respuestas,
                    };
                }
                break;

            case 'emocional':
                results.emocional = {
                    data: resultadoData.dimensiones || resultadoData,
                    tipo: 'emocional',
                    fecha: result.fecha_realizacion,
                    puntuacion: result.puntuacion_total,
                    recomendaciones: result.recomendaciones,
                };
                break;

            case 'habilidades':
                results.habilidades = {
                    data: resultadoData.dimensiones || resultadoData,
                    tipo: 'habilidades',
                    fecha: result.fecha_realizacion,
                    puntuacion: result.puntuacion_total,
                    recomendaciones: result.recomendaciones,
                };
                break;
        }
    });

    return results;
};

// COMPONENTE PRINCIPAL
export default function Show({ auth, student, testResults }) {
    const resultados = processTestResults(testResults);

    const handleDownloadReport = (testType) => {
        console.log(
            `Descargando reporte de ${testType} para ${student.nombre}`,
        );
        // Implementar lógica de descarga
    };

    return (
        <TutorLayout user={auth.user}>
            <div className="space-y-6">
                <StudentHeader student={student} />

                <StudentInfoCard student={student} />

                <div className="space-y-6">
                    <LearningStylesCard
                        resultado={resultados.aprendizaje}
                        onDownloadReport={handleDownloadReport}
                    />

                    <GenericTestCard
                        resultado={resultados.emocional}
                        title="Inteligencia Emocional"
                        icon={FaBrain}
                        iconColor="text-green-500"
                        testType="emocional"
                        bgColor="bg-green-50"
                        textColor="text-green-900"
                        onDownloadReport={handleDownloadReport}
                    />

                    <GenericTestCard
                        resultado={resultados.habilidades}
                        title="Habilidades Blandas"
                        icon={FaHandsHelping}
                        iconColor="text-purple-500"
                        testType="habilidades"
                        bgColor="bg-purple-50"
                        textColor="text-purple-900"
                        onDownloadReport={handleDownloadReport}
                    />
                </div>
            </div>
        </TutorLayout>
    );
}
