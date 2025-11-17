// src/Components/PDF/components/Legend.jsx
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../styles/pdfStyles';

export const Legend = ({ data }) => (
    <View style={styles.legendContainer}>
        {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
                <View
                    style={[
                        styles.legendColor,
                        { backgroundColor: item.color },
                    ]}
                />
                <View style={styles.legendTextContainer}>
                    <Text style={styles.legendName}>{item.name}</Text>
                    <Text style={styles.legendPercentage}>
                        {item.porcentaje || item.percentage}%
                    </Text>
                </View>
            </View>
        ))}
    </View>
);
