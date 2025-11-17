// src/Components/PDF/components/Header.jsx
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../styles/pdfStyles';

export const Header = ({ testTypeName, nombreCompleto, fechaGeneracion }) => (
    <View style={styles.header}>
        <Text style={styles.headerTitle}>{testTypeName}</Text>
        <Text style={styles.headerSubtitle}>{nombreCompleto}</Text>
        <Text style={styles.headerDate}>Generado: {fechaGeneracion}</Text>
    </View>
);
