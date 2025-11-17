// src/Components/PDF/components/InfoSection.jsx
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../styles/pdfStyles';

export const InfoSection = ({
    fechaRealizacion,
    puntuacion,
    totalRespuestas,
}) => (
    <View style={styles.infoSection}>
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha de realización:</Text>
            <Text style={styles.infoValue}>{fechaRealizacion}</Text>
        </View>
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Puntuación total:</Text>
            <Text style={styles.infoValue}>{puntuacion}</Text>
        </View>
        {totalRespuestas && (
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Total de preguntas:</Text>
                <Text style={styles.infoValue}>{totalRespuestas}</Text>
            </View>
        )}
    </View>
);
