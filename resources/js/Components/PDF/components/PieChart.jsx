// src/Components/PDF/components/PieChart.jsx
import { Path, Svg, Text, View } from '@react-pdf/renderer';
import { styles } from '../styles/pdfStyles';

export const PieChart = ({ data }) => {
    const size = 160;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 65;

    const validData = data.filter(
        (item) => (item.porcentaje || item.percentage) > 0,
    );

    if (validData.length === 0) return null;

    let currentAngle = -90;
    const paths = validData.map((item) => {
        const percentage = item.porcentaje || item.percentage;
        const angle = (percentage / 100) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;

        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);

        const largeArc = angle > 180 ? 1 : 0;

        const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z',
        ].join(' ');

        currentAngle = endAngle;

        return {
            path: pathData,
            color: item.color,
        };
    });

    return (
        <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Distribución Porcentual</Text>
            <Svg width={size} height={size}>
                {paths.map((item, index) => (
                    <Path key={index} d={item.path} fill={item.color} />
                ))}
            </Svg>
        </View>
    );
};
