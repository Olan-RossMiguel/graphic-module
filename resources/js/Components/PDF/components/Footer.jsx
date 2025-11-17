import { Text } from '@react-pdf/renderer';
import { styles } from '../styles/pdfStyles';

export const Footer = () => (
    <Text style={styles.footer} fixed>
        Sistema de Tutorías - Página{' '}
        <Text
            render={({ pageNumber, totalPages }) =>
                `${pageNumber} de ${totalPages}`
            }
        />
    </Text>
);
