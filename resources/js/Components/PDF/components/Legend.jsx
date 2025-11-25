// src/Components/PDF/components/Legend.jsx
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../styles/pdfStyles';

export const Legend = ({ data }) => (
    <View style={styles.legendContainer}>
        {data.map((item, index) => {
            // ✅ Verificación mejorada: usar !== undefined en lugar de truthiness
            const hasPercentage =
                item.porcentaje !== undefined || item.percentage !== undefined;
            const hasPuntuacion =
                item.puntuacion !== undefined && !hasPercentage;

            let displayValue;
            if (hasPercentage) {
                // ✅ Usar || 0 solo después de verificar que existe la propiedad
                const percentValue =
                    item.porcentaje !== undefined
                        ? item.porcentaje
                        : item.percentage;
                displayValue = `${percentValue}%`;
            } else if (hasPuntuacion) {
                displayValue = `${item.puntuacion} pts`;
            } else {
                displayValue = '0%';
            }

            return (
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
                            {displayValue}
                        </Text>
                    </View>
                </View>
            );
        })}
    </View>
);
