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
import {
    prepareChartData,
    prepareIndividualResponses,
} from './utils/dataProcessor';
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
                // ✅ Detectar si es el test de Asistencia Psicológica
                const isAssistanceTest =
                    resultado.test_nombre === 'Asistencia Psicológica';

                if (isAssistanceTest) {
                    // ✅ RENDERIZADO ESPECIAL PARA ASISTENCIA PSICOLÓGICA
                    return (
                        <AssistanceTestPages
                            key={index}
                            resultado={resultado}
                            student={student}
                            fechaGeneracion={fechaGeneracion}
                        />
                    );
                }

                // Renderizado normal para otros tests
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
                            Conclusión
                        </Text>
                        <Text style={styles.infoBoxText}>
                            El estudiante {student.nombre_completo} ha
                            completado {testResults.length}
                            {testResults.length === 1
                                ? ' evaluación'
                                : ' evaluaciones'}
                            . Los resultados proporcionan información valiosa
                            sobre sus estilos de aprendizaje, inteligencia
                            emocional y habilidades blandas, permitiendo un
                            acompañamiento personalizado en su desarrollo
                            académico y personal.
                        </Text>
                    </View>

                    <Footer />
                </Page>
            )}
        </Document>
    );
};

// ✅ NUEVO COMPONENTE: Páginas especiales para Test de Asistencia Psicológica
const AssistanceTestPages = ({ resultado, student, fechaGeneracion }) => {
    const fechaRealizacion = new Date(resultado.fecha).toLocaleDateString(
        'es-MX',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        },
    );

    const { legendData, tableData } = prepareChartData(resultado, 'asistencia');
    const { contexto, likert } = prepareIndividualResponses(resultado);

    return (
        <>
            {/* ==================== PÁGINA 1: Gráfica de Barras y Tabla ==================== */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        Asistencia Psicológica
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
                    Puntuación por Categoría
                </Text>

                <BarChart data={tableData} testType="asistencia" />

                <Text style={styles.sectionTitle}>Resultados Detallados</Text>
                <DataTable data={tableData} testType="asistencia" />

                <Footer />
            </Page>

            {/* ==================== PÁGINA 2: Preguntas de Contexto ==================== */}
            {contexto.length > 0 && (
                <Page size="A4" style={styles.page}>
                    <Text style={styles.sectionTitle}>
                        Información de Contexto
                    </Text>

                    {contexto.map((item, index) => (
                        <View
                            key={index}
                            style={{
                                marginBottom: 10,
                                padding: 10,
                                backgroundColor: '#f8f9fa',
                                borderRadius: 4,
                                borderLeftWidth: 3,
                                borderLeftColor: '#4ECDC4',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 9,
                                    fontWeight: 700,
                                    color: '#4ECDC4',
                                    marginBottom: 4,
                                }}
                            >
                                Pregunta #{item.numero}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 10,
                                    color: '#333',
                                    marginBottom: 6,
                                }}
                            >
                                {item.texto}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: '#2e7d32',
                                }}
                            >
                                Respuesta: {item.respuesta}
                            </Text>
                        </View>
                    ))}

                    <Footer />
                </Page>
            )}

            {/* ==================== PÁGINA 3: Preguntas Likert ==================== */}
            {likert.length > 0 && (
                <Page size="A4" style={styles.page}>
                    <Text style={styles.sectionTitle}>
                        Evaluación de Bienestar Emocional
                    </Text>

                    {likert.map((item, index) => {
                        // Determinar color según escala y valor
                        let borderColor = '#gray';
                        if (item.escala === 'negativa') {
                            borderColor =
                                item.valor <= 2
                                    ? '#51CF66'
                                    : item.valor === 3
                                      ? '#FFBB28'
                                      : '#FF6B6B';
                        } else {
                            borderColor =
                                item.valor >= 4
                                    ? '#51CF66'
                                    : item.valor === 3
                                      ? '#FFBB28'
                                      : '#FF6B6B';
                        }

                        return (
                            <View
                                key={index}
                                style={{
                                    marginBottom: 10,
                                    padding: 10,
                                    backgroundColor: '#ffffff',
                                    borderRadius: 4,
                                    borderLeftWidth: 3,
                                    borderLeftColor: borderColor,
                                    borderWidth: 1,
                                    borderColor: '#e0e0e0',
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginBottom: 4,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 9,
                                            fontWeight: 700,
                                            color: '#666',
                                        }}
                                    >
                                        Pregunta #{item.numero}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: borderColor,
                                        }}
                                    >
                                        {item.valor} / 5
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        fontSize: 10,
                                        color: '#333',
                                        marginBottom: 6,
                                    }}
                                >
                                    {item.texto}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 9,
                                        color: '#666',
                                    }}
                                >
                                    {item.textoValor}
                                </Text>
                            </View>
                        );
                    })}

                    <Footer />
                </Page>
            )}

            {/* ==================== PÁGINA 4: Nivel e Interpretación ==================== */}
            {resultado.nivel && (
                <Page size="A4" style={styles.page}>
                    <Text style={styles.sectionTitle}>
                        Interpretación y Recomendaciones
                    </Text>

                    <InfoBox
                        type="blue"
                        title="Nivel General"
                        content={resultado.nivel}
                    />

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
};

export default GeneralPDFReport;
