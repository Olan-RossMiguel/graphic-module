// ============================================================================
// src/Components/PDF/PDFReport.jsx - COMPONENTE PRINCIPAL
// ============================================================================

import { Document, Page, Text } from '@react-pdf/renderer';
import { BarChart } from './components/BarChart';
import { DataTable } from './components/DataTable';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { InfoBox } from './components/InfoBox';
import { InfoSection } from './components/InfoSection';
import { Legend } from './components/Legend';
import { PieChart } from './components/PieChart';
import { styles } from './styles/pdfStyles';
import { prepareChartData } from './utils/dataProcessor';
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
