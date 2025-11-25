// src/Components/PDF/styles/pdfStyles.js
import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Roboto',
        fontSize: 11,
        backgroundColor: '#FFFFFF',
    },

    // HEADER
    header: {
        backgroundColor: '#2980b9',
        padding: 20,
        marginBottom: 20,
        borderRadius: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 700,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 4,
    },
    headerDate: {
        fontSize: 10,
        color: '#FFFFFF',
        textAlign: 'center',
        opacity: 0.9,
    },

    // INFO SECTION
    infoSection: {
        marginBottom: 15,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 6,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    infoLabel: {
        fontSize: 10,
        fontWeight: 700,
        color: '#333',
        width: 130,
    },
    infoValue: {
        fontSize: 10,
        color: '#555',
        flex: 1,
    },

    // SECTION TITLE
    sectionTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: '#2c3e50',
        marginBottom: 10,
        marginTop: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#3498db',
        paddingBottom: 4,
    },

    // LEGEND
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
        gap: 6,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 8,
        borderRadius: 4,
        width: '48%',
        marginBottom: 4,
    },
    legendColor: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginRight: 6,
    },
    legendTextContainer: {
        flex: 1,
    },
    legendName: {
        fontSize: 8,
        fontWeight: 500,
        color: '#2c3e50',
        marginBottom: 2,
    },
    legendPercentage: {
        fontSize: 11,
        fontWeight: 700,
        color: '#2c3e50',
    },

    // GRÁFICAS
    chartContainer: {
        marginVertical: 15,
        alignItems: 'center',
    },
    chartTitle: {
        fontSize: 11,
        fontWeight: 600,
        color: '#2c3e50',
        marginBottom: 8,
        textAlign: 'center',
    },

    // GRÁFICA DE BARRAS
    barChartContainer: {
        marginVertical: 15,
    },
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    barLabel: {
        fontSize: 8,
        width: 100,
        color: '#495057',
    },
    barBackground: {
        flex: 1,
        height: 20,
        backgroundColor: '#e9ecef',
        borderRadius: 3,
        position: 'relative',
    },

    // TABLE
    table: {
        width: '100%',
        marginTop: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#dee2e6',
        borderRadius: 6,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 2,
        borderBottomColor: '#dee2e6',
        padding: 8,
        alignItems: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        padding: 8,
        alignItems: 'center',
    },
    tableRowAlt: {
        backgroundColor: '#f8f9fa',
    },
    tableCellHeader: {
        fontSize: 9,
        fontWeight: 700,
        color: '#495057',
        textTransform: 'uppercase',
        textAlign: 'left',
    },
    tableCell: {
        fontSize: 9,
        color: '#495057',
    },
    tableCellDimension: {
        flex: 2,
        paddingRight: 10,
    },
    tableCellScore: {
        width: 100,
        textAlign: 'center',
        fontWeight: 700,
        fontSize: 11,
    },
    tableCellColor: {
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },

    // INFO BOX
    infoBox: {
        marginTop: 12,
        padding: 12,
        borderRadius: 6,
        borderLeftWidth: 4,
    },
    infoBoxPurple: {
        backgroundColor: '#f3e5f5',
        borderLeftColor: '#9c27b0',
    },
    infoBoxGreen: {
        backgroundColor: '#e8f5e9',
        borderLeftColor: '#4caf50',
    },
    infoBoxBlue: {
        backgroundColor: '#e3f2fd',
        borderLeftColor: '#2196f3',
    },
    infoBoxTitle: {
        fontSize: 10,
        fontWeight: 700,
        marginBottom: 5,
    },
    infoBoxText: {
        fontSize: 9,
        lineHeight: 1.5,
        color: '#424242',
    },

    // FOOTER
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 9,
        color: '#999',
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        paddingTop: 8,
    },

    // ✅ ESTILOS PARA ASISTENCIA PSICOLÓGICA
    subtitle: {
        fontSize: 10,
        color: '#666',
        marginBottom: 12,
    },

    responsesList: {
        marginTop: 12,
    },

    responseItem: {
        marginBottom: 12,
        padding: 10,
        backgroundColor: '#f9fafb',
        borderRadius: 4,
        borderLeftWidth: 3,
        borderLeftColor: '#6b7280',
    },

    responseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },

    responseNumber: {
        fontSize: 10,
        fontWeight: 700,
        backgroundColor: '#374151',
        color: 'white',
        padding: 4,
        paddingHorizontal: 8,
        borderRadius: 3,
    },

    responseQuestion: {
        fontSize: 10,
        color: '#1f2937',
        marginBottom: 6,
    },

    responseAnswer: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 4,
    },

    responseAnswerText: {
        fontSize: 10,
        fontWeight: 700,
        color: '#374151',
    },

    // Estilos para preguntas Likert
    likertItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },

    likertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },

    likertBadge: {
        padding: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },

    badgeGreen: {
        backgroundColor: '#10b981',
    },

    badgeYellow: {
        backgroundColor: '#f59e0b',
    },

    badgeRed: {
        backgroundColor: '#ef4444',
    },

    likertBadgeText: {
        fontSize: 9,
        fontWeight: 700,
        color: 'white',
    },

    likertAnswer: {
        fontSize: 9,
        color: '#6b7280',
        marginTop: 4,
    },
});
