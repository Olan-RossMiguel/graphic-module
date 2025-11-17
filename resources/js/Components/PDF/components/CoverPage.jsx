// src/Components/PDF/components/CoverPage.jsx
import { Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const coverStyles = StyleSheet.create({
    page: {
        backgroundColor: '#0a5cb8', // Azul
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoContainer: {
        marginTop: 80,
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 60,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 40,
        fontFamily: 'Helvetica-Bold',
    },
    infoContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 30,
        borderRadius: 10,
        width: '100%',
        maxWidth: 400,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 14,
        color: '#e0e7ff',
        width: 120,
        fontFamily: 'Helvetica-Bold',
    },
    infoValue: {
        fontSize: 14,
        color: '#ffffff',
        flex: 1,
        fontFamily: 'Helvetica',
    },
    footer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#e0e7ff',
        textAlign: 'center',
        fontFamily: 'Helvetica',
    },
    dateText: {
        fontSize: 10,
        color: '#cbd5e1',
        marginTop: 5,
        fontFamily: 'Helvetica',
    },
});

export const CoverPage = ({ student, fechaGeneracion, logoUrl }) => {
    return (
        <Page size="A4" style={coverStyles.page}>
            {/* Logo */}
            <View style={coverStyles.logoContainer}>
                {logoUrl && <Image src={logoUrl} style={coverStyles.logo} />}
            </View>

            {/* Contenido Principal */}
            <View style={coverStyles.contentContainer}>
                <Text style={coverStyles.title}>REPORTE GENERAL</Text>

                <View style={coverStyles.infoContainer}>
                    <View style={coverStyles.infoRow}>
                        <Text style={coverStyles.infoLabel}>Estudiante:</Text>
                        <Text style={coverStyles.infoValue}>
                            {student.nombre_completo}
                        </Text>
                    </View>

                    <View style={coverStyles.infoRow}>
                        <Text style={coverStyles.infoLabel}>Matrícula:</Text>
                        <Text style={coverStyles.infoValue}>
                            {student.numero_control}
                        </Text>
                    </View>

                    <View style={coverStyles.infoRow}>
                        <Text style={coverStyles.infoLabel}>Grupo:</Text>
                        <Text style={coverStyles.infoValue}>
                            {student.grupo}
                        </Text>
                    </View>

                    <View style={coverStyles.infoRow}>
                        <Text style={coverStyles.infoLabel}>Semestre:</Text>
                        <Text style={coverStyles.infoValue}>
                            {student.semestre}° Semestre
                        </Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={coverStyles.footer}>
                <Text style={coverStyles.footerText}>
                    Sistema de Tutorías y Evaluación Psicopedagógica
                </Text>
                <Text style={coverStyles.dateText}>
                    Generado el {fechaGeneracion}
                </Text>
            </View>
        </Page>
    );
};
