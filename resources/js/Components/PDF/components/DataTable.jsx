// src/Components/PDF/components/DataTable.jsx
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../styles/pdfStyles';

export const DataTable = ({ data, testType }) => {
    const headers = {
        dimension: 'Dimensión',
        respuestas: 'Respuestas',
        puntuacion: 'Puntuación',
        color: 'Color',
    };

    return (
        <View style={styles.table} wrap={false}>
            <View style={styles.tableHeader}>
                <Text
                    style={[styles.tableCellHeader, styles.tableCellDimension]}
                >
                    {headers.dimension}
                </Text>
                <Text style={[styles.tableCellHeader, styles.tableCellScore]}>
                    {testType === 'aprendizaje'
                        ? headers.respuestas
                        : headers.puntuacion}
                </Text>
                <Text style={[styles.tableCellHeader, styles.tableCellColor]}>
                    {headers.color}
                </Text>
            </View>

            {data.map((item, index) => {
                const value =
                    testType === 'aprendizaje'
                        ? item.respuestas
                        : item.puntuacion;

                return (
                    <View
                        key={index}
                        style={[
                            styles.tableRow,
                            index % 2 === 1 && styles.tableRowAlt,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tableCell,
                                styles.tableCellDimension,
                            ]}
                        >
                            {item.name || item.estilo || item.dimension}
                        </Text>
                        <Text style={[styles.tableCell, styles.tableCellScore]}>
                            {value}
                        </Text>
                        <View style={styles.tableCellColor}>
                            <View
                                style={[
                                    styles.colorDot,
                                    { backgroundColor: item.color },
                                ]}
                            />
                        </View>
                    </View>
                );
            })}
        </View>
    );
};
