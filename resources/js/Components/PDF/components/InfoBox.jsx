// src/Components/PDF/components/InfoBox.jsx
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../styles/pdfStyles';

export const InfoBox = ({ type, title, content }) => {
    const boxStyle =
        type === 'purple' ? styles.infoBoxPurple : styles.infoBoxGreen;
    const titleColor = type === 'purple' ? '#7b1fa2' : '#2e7d32';

    return (
        <View style={[styles.infoBox, boxStyle]}>
            <Text style={[styles.infoBoxTitle, { color: titleColor }]}>
                {title}
            </Text>
            <Text style={styles.infoBoxText}>{content}</Text>
        </View>
    );
};
