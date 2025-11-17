// src/Components/PDF/GeneralPDFReport.jsx
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { BarChart } from './components/BarChart';
import { CoverPage } from './components/CoverPage';
import { DataTable } from './components/DataTable';
import { Footer } from './components/Footer';
import { InfoBox } from './components/InfoBox';
import { InfoSection } from './components/InfoSection';
import { Legend } from './components/Legend';
import { PieChart } from './components/PieChart';
import { styles } from './styles/pdfStyles';
import { prepareChartData } from './utils/dataProcessor';
import './utils/fontRegistration';

const TEST_NAMES = {
    estilos_aprendizaje: 'Test de Estilos de Aprendizaje',
    inteligencia_emocional: 'Test de Inteligencia Emocional',
    habilidades_blandas: 'Test de Habilidades Blandas',
};

const GeneralPDFReport = ({ student, testResults, logoUrl }) => {
    const fechaGeneracion = new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Document>
            {/* ==================== PORTADA ==================== */}
            <CoverPage
                student={student}
                fechaGeneracion={fechaGeneracion}
                logoUrl={logoUrl}
            />

            {/* ==================== PÁGINAS DE CADA TEST ==================== */}
            {testResults.map((resultado, index) => {
                const testType =
                    resultado.test_tipo === 'estilos_aprendizaje'
                        ? 'aprendizaje'
                        : resultado.test_tipo === 'inteligencia_emocional'
                          ? 'emocional'
                          : 'habilidades';

                const testTypeName =
                    TEST_NAMES[resultado.test_tipo] || resultado.test_nombre;

                const fechaRealizacion = new Date(
                    resultado.fecha,
                ).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });

                const { legendData, tableData } = prepareChartData(
                    resultado,
                    testType,
                );

                return (
                    <>
                        {/* ==================== PÁGINA 1: Gráfica de Pastel ==================== */}
                        <Page key={`${index}-1`} size="A4" style={styles.page}>
                            {/* Mini Header */}
                            <View style={styles.header}>
                                <Text style={styles.headerTitle}>
                                    {testTypeName}
                                </Text>
                                <Text style={styles.headerSubtitle}>
                                    {student.nombre_completo}
                                </Text>
                                <Text style={styles.headerDate}>
                                    Generado: {fechaGeneracion}
                                </Text>
                            </View>

                            <InfoSection
                                fechaRealizacion={fechaRealizacion}
                                puntuacion={resultado.puntuacion}
                                totalRespuestas={resultado.total_respuestas}
                            />

                            <Text style={styles.sectionTitle}>
                                Distribución de{' '}
                                {testType === 'aprendizaje'
                                    ? 'Estilos'
                                    : 'Dimensiones'}
                            </Text>

                            <Legend data={legendData} />

                            <PieChart data={legendData} />

                            <Footer />
                        </Page>

                        {/* ==================== PÁGINA 2: Gráfica de Barras y Tabla ==================== */}
                        <Page key={`${index}-2`} size="A4" style={styles.page}>
                            <BarChart data={tableData} testType={testType} />

                            <Text style={styles.sectionTitle}>
                                Resultados Detallados
                            </Text>
                            <DataTable data={tableData} testType={testType} />

                            <Footer />
                        </Page>

                        {/* ==================== PÁGINA 3: Información Adicional (Opcional) ==================== */}
                        {(resultado.dato_curioso ||
                            resultado.recomendaciones) && (
                            <Page
                                key={`${index}-3`}
                                size="A4"
                                style={styles.page}
                            >
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
                    </>
                );
            })}

            {/* ==================== PÁGINA FINAL: RESUMEN ==================== */}
            {testResults.length > 0 && (
                <Page size="A4" style={styles.page}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Resumen General</Text>
                        <Text style={styles.headerSubtitle}>
                            {student.nombre_completo}
                        </Text>
                    </View>

                    <Text style={styles.sectionTitle}>Tests Completados</Text>

                    <View style={{ marginBottom: 15 }}>
                        {testResults.map((resultado, index) => {
                            const testTypeName =
                                TEST_NAMES[resultado.test_tipo] ||
                                resultado.test_nombre;
                            const fechaRealizacion = new Date(
                                resultado.fecha,
                            ).toLocaleDateString('es-MX', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            });

                            return (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginBottom: 8,
                                        paddingVertical: 8,
                                        paddingHorizontal: 12,
                                        backgroundColor:
                                            index % 2 === 0
                                                ? '#f8f9fa'
                                                : '#ffffff',
                                        borderRadius: 4,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: '#333',
                                            flex: 1,
                                            paddingRight: 10,
                                        }}
                                    >
                                        {testTypeName}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 10,
                                            color: '#555',
                                            minWidth: 150,
                                            textAlign: 'right',
                                        }}
                                    >
                                        {fechaRealizacion}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>

                    <View style={[styles.infoBox, styles.infoBoxGreen]}>
                        <Text
                            style={[styles.infoBoxTitle, { color: '#2e7d32' }]}
                        >
                            Conclusion
                        </Text>
                        <Text style={styles.infoBoxText}>
                            El estudiante {student.nombre_completo} ha
                            completado {testResults.length}
                            {testResults.length === 1
                                ? ' evaluacion'
                                : ' evaluaciones'}
                            . Los resultados proporcionan informacion valiosa
                            sobre sus estilos de aprendizaje, inteligencia
                            emocional y habilidades blandas, permitiendo un
                            acompanamiento personalizado en su desarrollo
                            academico y personal.
                        </Text>
                    </View>

                    <Footer />
                </Page>
            )}
        </Document>
    );
};

export default GeneralPDFReport;
