// src/Components/PDF/components/BarChart.jsx
import { Rect, Svg, Text, View } from '@react-pdf/renderer';
import { styles } from '../styles/pdfStyles';

export const BarChart = ({ data, testType }) => {
    const maxValue = Math.max(
        ...data.map((item) =>
            testType === 'aprendizaje' ? item.respuestas : item.puntuacion,
        ),
    );

    return (
        <View style={styles.barChartContainer} wrap={false}>
            <Text style={styles.chartTitle}>
                {testType === 'aprendizaje'
                    ? 'Respuestas por Estilo'
                    : 'Puntuación por Dimensión'}
            </Text>
            {data.map((item, index) => {
                const value =
                    testType === 'aprendizaje'
                        ? item.respuestas
                        : item.puntuacion;
                const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                const barWidth = Math.max(percentage, 5);

                return (
                    <View key={index} style={styles.barRow}>
                        <Text style={styles.barLabel}>
                            {item.name || item.estilo || item.dimension}
                        </Text>
                        <View style={styles.barBackground}>
                            <Svg width="100%" height={20}>
                                <Rect
                                    x={0}
                                    y={0}
                                    width={`${barWidth}%`}
                                    height={20}
                                    fill={item.color}
                                    rx={3}
                                />
                                <Text
                                    x={`${Math.min(barWidth - 5, 95)}%`}
                                    y={14}
                                    fontSize={9}
                                    fontWeight="bold"
                                    fill="#fff"
                                    textAnchor="end"
                                >
                                    {value}
                                </Text>
                            </Svg>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};
