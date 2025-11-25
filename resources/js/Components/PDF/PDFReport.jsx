// ============================================================================
// src/Components/PDF/PDFReport.jsx - COMPONENTE PRINCIPAL
// ============================================================================

import { Document, Page, Text, View } from '@react-pdf/renderer';
import { BarChart } from './components/BarChart';
import { DataTable } from './components/DataTable';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { InfoBox } from './components/InfoBox';
import { InfoSection } from './components/InfoSection';
import { Legend } from './components/Legend';
import { PieChart } from './components/PieChart';
import { styles } from './styles/pdfStyles';
import {
    prepareChartData,
    prepareIndividualResponses,
} from './utils/dataProcessor';
import './utils/fontRegistration';

const PDFReport = ({ student, resultado, testType, testTypeName }) => {
    // Preparar nombre completo
    const nombreCompleto = [
        student.nombre,
        student.apellido_paterno,
        student.apellido_materno,
    ]
        .filter(Boolean)
        .join(' ');

    // Formatear fechas
    const fechaRealizacion = new Date(resultado.fecha).toLocaleDateString(
        'es-MX',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        },
    );

    const fechaGeneracion = new Date().toLocaleDateString('es-MX');

    // Preparar datos para gráficas
    const { legendData, tableData } = prepareChartData(resultado, testType);

    // ✅ NUEVO: Si es test de asistencia, preparar respuestas individuales
    const individualResponses =
        testType === 'asistencia'
            ? prepareIndividualResponses(resultado)
            : null;

    // ============================================================================
    // RENDERIZADO ESPECÍFICO PARA ASISTENCIA PSICOLÓGICA
    // ============================================================================
    if (testType === 'asistencia') {
        return (
            <Document>
                {/* ==================== PÁGINA 1: Información General ==================== */}
                <Page size="A4" style={styles.page}>
                    <Header
                        testTypeName={testTypeName}
                        nombreCompleto={nombreCompleto}
                        fechaGeneracion={fechaGeneracion}
                    />

                    <InfoSection
                        fechaRealizacion={fechaRealizacion}
                        puntuacion={resultado.puntuacion}
                        totalRespuestas={resultado.total_respuestas}
                    />

                    {resultado.nivel && (
                        <View style={styles.infoBox}>
                            <Text style={styles.infoBoxTitle}>
                                Nivel de Recomendación
                            </Text>
                            <Text style={styles.infoBoxContent}>
                                {resultado.nivel}
                            </Text>
                        </View>
                    )}

                    <Text style={styles.sectionTitle}>
                        Puntuación por Categoría
                    </Text>

                    <Legend data={legendData} />

                    <Footer />
                </Page>

                {/* ==================== PÁGINA 2: Gráfica y Categorías ==================== */}
                <Page size="A4" style={styles.page}>
                    <BarChart data={tableData} testType={testType} />

                    <Text style={styles.sectionTitle}>
                        Detalle por Categoría
                    </Text>
                    <DataTable data={tableData} testType={testType} />

                    <Footer />
                </Page>

                {/* ==================== PÁGINA 3: Preguntas de Contexto ==================== */}
                {individualResponses?.contexto.length > 0 && (
                    <Page size="A4" style={styles.page}>
                        <Text style={styles.sectionTitle}>
                            Información de Contexto
                        </Text>
                        <Text style={styles.subtitle}>
                            (Información confidencial - Solo para la psicóloga)
                        </Text>

                        <View style={styles.responsesList}>
                            {individualResponses.contexto.map((item, index) => (
                                <View key={index} style={styles.responseItem}>
                                    <View style={styles.responseHeader}>
                                        <Text style={styles.responseNumber}>
                                            #{item.numero}
                                        </Text>
                                    </View>
                                    <Text style={styles.responseQuestion}>
                                        {item.texto}
                                    </Text>
                                    <View style={styles.responseAnswer}>
                                        <Text style={styles.responseAnswerText}>
                                            {item.respuesta}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <Footer />
                    </Page>
                )}

                {/* ==================== PÁGINA 4-5: Preguntas con Escala Likert ==================== */}
                {individualResponses?.likert.length > 0 && (
                    <>
                        <Page size="A4" style={styles.page}>
                            <Text style={styles.sectionTitle}>
                                Evaluación de Bienestar Emocional
                            </Text>
                            <Text style={styles.subtitle}>
                                Escala: 1 = Nunca | 2 = Casi nunca | 3 = A veces
                                | 4 = Casi siempre | 5 = Siempre
                            </Text>

                            <View style={styles.responsesList}>
                                {individualResponses.likert
                                    .slice(0, 5)
                                    .map((item, index) => (
                                        <View
                                            key={index}
                                            style={styles.likertItem}
                                        >
                                            <View style={styles.likertHeader}>
                                                <Text
                                                    style={
                                                        styles.responseNumber
                                                    }
                                                >
                                                    #{item.numero}
                                                </Text>
                                                <View
                                                    style={[
                                                        styles.likertBadge,
                                                        item.escala ===
                                                        'negativa'
                                                            ? item.valor <= 2
                                                                ? styles.badgeGreen
                                                                : item.valor ===
                                                                    3
                                                                  ? styles.badgeYellow
                                                                  : styles.badgeRed
                                                            : item.valor >= 4
                                                              ? styles.badgeGreen
                                                              : item.valor === 3
                                                                ? styles.badgeYellow
                                                                : styles.badgeRed,
                                                    ]}
                                                >
                                                    <Text
                                                        style={
                                                            styles.likertBadgeText
                                                        }
                                                    >
                                                        {item.valor} / 5
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text
                                                style={styles.responseQuestion}
                                            >
                                                {item.texto}
                                            </Text>
                                            <Text style={styles.likertAnswer}>
                                                Respuesta: {item.textoValor}
                                            </Text>
                                        </View>
                                    ))}
                            </View>

                            <Footer />
                        </Page>

                        {individualResponses.likert.length > 5 && (
                            <Page size="A4" style={styles.page}>
                                <Text style={styles.sectionTitle}>
                                    Evaluación de Bienestar Emocional
                                    (Continuación)
                                </Text>

                                <View style={styles.responsesList}>
                                    {individualResponses.likert
                                        .slice(5)
                                        .map((item, index) => (
                                            <View
                                                key={index}
                                                style={styles.likertItem}
                                            >
                                                <View
                                                    style={styles.likertHeader}
                                                >
                                                    <Text
                                                        style={
                                                            styles.responseNumber
                                                        }
                                                    >
                                                        #{item.numero}
                                                    </Text>
                                                    <View
                                                        style={[
                                                            styles.likertBadge,
                                                            item.escala ===
                                                            'negativa'
                                                                ? item.valor <=
                                                                  2
                                                                    ? styles.badgeGreen
                                                                    : item.valor ===
                                                                        3
                                                                      ? styles.badgeYellow
                                                                      : styles.badgeRed
                                                                : item.valor >=
                                                                    4
                                                                  ? styles.badgeGreen
                                                                  : item.valor ===
                                                                      3
                                                                    ? styles.badgeYellow
                                                                    : styles.badgeRed,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={
                                                                styles.likertBadgeText
                                                            }
                                                        >
                                                            {item.valor} / 5
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text
                                                    style={
                                                        styles.responseQuestion
                                                    }
                                                >
                                                    {item.texto}
                                                </Text>
                                                <Text
                                                    style={styles.likertAnswer}
                                                >
                                                    Respuesta: {item.textoValor}
                                                </Text>
                                            </View>
                                        ))}
                                </View>

                                <Footer />
                            </Page>
                        )}
                    </>
                )}
            </Document>
        );
    }

    // ============================================================================
    // RENDERIZADO PARA OTROS TESTS (Aprendizaje, Emocional, Habilidades)
    // ============================================================================
    return (
        <Document>
            {/* ==================== PÁGINA 1 ==================== */}
            <Page size="A4" style={styles.page}>
                <Header
                    testTypeName={testTypeName}
                    nombreCompleto={nombreCompleto}
                    fechaGeneracion={fechaGeneracion}
                />

                <InfoSection
                    fechaRealizacion={fechaRealizacion}
                    puntuacion={resultado.puntuacion}
                    totalRespuestas={resultado.total_respuestas}
                />

                <Text style={styles.sectionTitle}>
                    Distribución de{' '}
                    {testType === 'aprendizaje' ? 'Estilos' : 'Dimensiones'}
                </Text>

                <Legend data={legendData} />

                <PieChart data={legendData} />

                <Footer />
            </Page>

            {/* ==================== PÁGINA 2 ==================== */}
            <Page size="A4" style={styles.page}>
                <BarChart data={tableData} testType={testType} />

                <Text style={styles.sectionTitle}>Resultados Detallados</Text>
                <DataTable data={tableData} testType={testType} />

                <Footer />
            </Page>

            {/* ==================== PÁGINA 3 (Opcional) ==================== */}
            {(resultado.dato_curioso || resultado.recomendaciones) && (
                <Page size="A4" style={styles.page}>
                    <Text style={styles.sectionTitle}>
                        Información Adicional
                    </Text>

                    {resultado.dato_curioso && (
                        <InfoBox
                            type="purple"
                            title="✨ Dato Curioso"
                            content={resultado.dato_curioso}
                        />
                    )}

                    {resultado.recomendaciones && (
                        <InfoBox
                            type="green"
                            title="📋 Recomendaciones"
                            content={resultado.recomendaciones}
                        />
                    )}

                    <Footer />
                </Page>
            )}
        </Document>
    );
};

export default PDFReport;
