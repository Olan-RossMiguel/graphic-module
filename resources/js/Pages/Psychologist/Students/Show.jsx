import PDFOptionsModal from '@/Components/UI/PDFOptionsModal';
import StudentHeader from '@/Components/UI/tests/StudentHeader';
import StudentInfoCard from '@/Components/UI/tests/StudentInfoCard';
import {
    GenericTestCard,
    LearningStylesCard,
    PsychologicalAssistanceCard,
} from '@/Components/UI/tests/TestResultCards';
import PsychologistLayout from '@/Layouts/UI/PsychologistLayout';

import {
    generateDetailedPDFReport,
    generatePDFReport,
} from '@/Utils/pdfGeneratorRenderer';

import { useState } from 'react';
import { FaBrain, FaHandsHelping } from 'react-icons/fa';

const TEST_TYPE_MAP = {
    estilos_aprendizaje: 'aprendizaje',
    'learning-styles': 'aprendizaje',
    inteligencia_emocional: 'emocional',
    'emotional-intelligence': 'emocional',
    habilidades_blandas: 'habilidades',
    'soft-skills': 'habilidades',
    asistencia_psicologica: 'asistencia',
    'psychological-assistance': 'asistencia',
    'Asistencia Psicológica': 'asistencia',
};

const processTestResults = (testResults) => {
    const results = {
        aprendizaje: null,
        emocional: null,
        habilidades: null,
        asistencia: null,
    };

    testResults.forEach((result) => {
        const tipoProcesado =
            TEST_TYPE_MAP[result.test_tipo] ||
            TEST_TYPE_MAP[result.test_nombre] ||
            result.test_tipo;

        switch (tipoProcesado) {
            case 'aprendizaje':
                if (result.data) {
                    results.aprendizaje = {
                        data: result.data,
                        tipo: 'aprendizaje',
                        estilo_dominante: result.estilo_dominante,
                        porcentajes: result.porcentajes,
                        interpretacion: result.interpretacion,
                        fecha: result.fecha,
                        puntuacion: result.puntuacion,
                        total_respuestas: result.total_respuestas,
                        dato_curioso: result.dato_curioso,
                    };
                }
                break;

            case 'emocional':
                if (result.data) {
                    results.emocional = {
                        data: result.data,
                        tipo: 'emocional',
                        fecha: result.fecha,
                        puntuacion: result.puntuacion,
                        recomendaciones: result.recomendaciones,
                        dato_curioso: result.dato_curioso,
                        total_respuestas: result.total_respuestas,
                    };
                }
                break;

            case 'habilidades':
                if (result.data) {
                    results.habilidades = {
                        data: result.data,
                        tipo: 'habilidades',
                        fecha: result.fecha,
                        puntuacion: result.puntuacion,
                        recomendaciones: result.recomendaciones,
                        dato_curioso: result.dato_curioso,
                        total_respuestas: result.total_respuestas,
                    };
                }
                break;

            case 'asistencia':
                if (result.data) {
                    // ✅ CRÍTICO: Asegurarse de pasar las respuestas individuales
                    results.asistencia = {
                        data: result.data, // Categorías con totales
                        tipo: 'asistencia',
                        fecha: result.fecha,
                        puntuacion: result.puntuacion,
                        nivel: result.nivel,
                        por_categoria: result.por_categoria, // Detalle por categoría
                        total_respuestas: result.total_respuestas,
                        respuestas: result.respuestas || {}, // ✅ Respuestas individuales
                    };
                }
                break;
        }
    });

    return results;
};

export default function Show({ auth, student, testResults }) {
    const resultados = processTestResults(testResults);

    const [showModal, setShowModal] = useState(false);
    const [currentTestType, setCurrentTestType] = useState(null);

    const testTypeNames = {
        aprendizaje: 'Estilos de Aprendizaje',
        emocional: 'Inteligencia Emocional',
        habilidades: 'Habilidades Blandas',
        asistencia: 'Asistencia Psicológica',
    };

    const handleDownloadReport = (testType) => {
        if (!resultados[testType]) {
            alert('No hay datos disponibles para generar el reporte');
            return;
        }
        setCurrentTestType(testType);
        setShowModal(true);
    };

    const handleGenerateReport = async (reportType) => {
        if (!currentTestType) return;

        try {
            const resultado = resultados[currentTestType];

            if (reportType === 'simple') {
                await generatePDFReport(student, resultado, currentTestType);
            } else {
                await generateDetailedPDFReport(
                    student,
                    resultado,
                    currentTestType,
                );
            }
        } catch (error) {
            console.error('Error al generar el reporte:', error);
            alert(
                'Hubo un error al generar el reporte. Por favor, intenta de nuevo.',
            );
        }
    };

    return (
        <PsychologistLayout user={auth.user}>
            <div className="space-y-6">
                <StudentHeader
                    student={student}
                    backRoute={route('psychologist.groups.show', {
                        group: student.group_id,
                        semestre: student.semestre,
                    })}
                />
                <StudentInfoCard student={student} />

                <div className="space-y-6">
                    {/* Card de Estilos de Aprendizaje */}
                    <LearningStylesCard
                        resultado={resultados.aprendizaje}
                        onDownloadReport={handleDownloadReport}
                    />

                    {/* Card de Inteligencia Emocional */}
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

                    {/* Card de Habilidades Blandas */}
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

                    {/* Card de Asistencia Psicológica */}
                    <PsychologicalAssistanceCard
                        resultado={resultados.asistencia}
                        onDownloadReport={handleDownloadReport}
                    />
                </div>
            </div>

            {/* Modal de opciones PDF */}
            <PDFOptionsModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSelectOption={handleGenerateReport}
                testTypeName={
                    currentTestType ? testTypeNames[currentTestType] : ''
                }
            />
        </PsychologistLayout>
    );
}
