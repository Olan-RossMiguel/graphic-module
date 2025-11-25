// Agregar este nuevo componente en TestResultCards.jsx

export const PsychologicalAssistanceCard = ({
    resultado,
    onDownloadReport,
}) => {
    if (!resultado) {
        return (
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                <TestCardHeader
                    title="Asistencia Psicológica"
                    icon={FaHeartbeat}
                    iconColor="text-red-500"
                    isCompleted={false}
                />
            </div>
        );
    }

    // Preparar datos agrupados por categoría con colores
    const barData = Object.keys(resultado.data).map((pregunta, index) => {
        // Determinar categoría y color según el número de pregunta
        let categoria = '';
        let color = '';

        const numPregunta = parseInt(pregunta.replace('pregunta_', ''));

        if ([1, 2, 3, 5].includes(numPregunta)) {
            categoria = 'Indicadores Negativos';
            color = '#FF6B6B'; // Rojo
        } else if ([4, 6, 10].includes(numPregunta)) {
            categoria = 'Indicadores Positivos';
            color = '#51CF66'; // Verde
        } else if ([7, 8, 9].includes(numPregunta)) {
            categoria = 'Actitud hacia Atención';
            color = '#4ECDC4'; // Azul
        }

        // Nombres más descriptivos para las preguntas
        const nombresPreguntas = {
            pregunta_1: 'Estrés académico',
            pregunta_2: 'Ansiedad/nerviosismo',
            pregunta_3: 'Problemas de sueño',
            pregunta_4: 'Motivación y energía',
            pregunta_5: 'Cambios de humor',
            pregunta_6: 'Red de apoyo',
            pregunta_7: 'Uso de servicio psicológico',
            pregunta_8: 'Importancia de atención',
            pregunta_9: 'Disposición a buscar ayuda',
            pregunta_10: 'Capacidad para estudiar',
        };

        return {
            pregunta: nombresPreguntas[pregunta] || pregunta,
            promedio: resultado.data[pregunta],
            categoria: categoria,
            color: color,
            numPregunta: numPregunta,
        };
    });

    // Ordenar por categoría y número de pregunta
    barData.sort((a, b) => a.numPregunta - b.numPregunta);

    return (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <TestCardHeader
                title="Asistencia Psicológica"
                icon={FaHeartbeat}
                iconColor="text-red-500"
                isCompleted={true}
                onDownloadReport={() => onDownloadReport('asistencia')}
            />
            <div
                id="asistencia-report-content"
                className="border-t border-gray-200 px-4 py-5 sm:p-6"
            >
                <div className="mb-6 space-y-2 text-sm">
                    <p>
                        <strong>Fecha de realización:</strong>{' '}
                        {new Date(resultado.fecha).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Puntuación total:</strong>{' '}
                        {resultado.puntuacion}
                    </p>
                    {resultado.nivel && (
                        <p>
                            <strong>Nivel:</strong> {resultado.nivel}
                        </p>
                    )}
                    {resultado.total_respuestas && (
                        <p>
                            <strong>Total de preguntas:</strong>{' '}
                            {resultado.total_respuestas}
                        </p>
                    )}
                </div>

                {/* Leyenda de categorías */}
                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3">
                        <div className="h-4 w-4 rounded bg-red-500" />
                        <span className="text-sm font-medium text-red-900">
                            Indicadores Negativos
                        </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3">
                        <div className="h-4 w-4 rounded bg-green-500" />
                        <span className="text-sm font-medium text-green-900">
                            Indicadores Positivos
                        </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3">
                        <div className="h-4 w-4 rounded bg-blue-400" />
                        <span className="text-sm font-medium text-blue-900">
                            Actitud hacia Atención
                        </span>
                    </div>
                </div>

                {/* Gráfica de barras horizontales */}
                <div>
                    <h4 className="mb-4 text-lg font-medium text-gray-900">
                        Resultados por Pregunta (Escala 1-5)
                    </h4>
                    <div className="h-[600px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={barData}
                                layout="vertical"
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 150,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                />
                                <XAxis
                                    type="number"
                                    domain={[0, 5]}
                                    ticks={[0, 1, 2, 3, 4, 5]}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="pregunta"
                                    width={140}
                                    tick={{ fontSize: 11 }}
                                />
                                <Tooltip
                                    formatter={(value) => [
                                        `${value.toFixed(2)}`,
                                        'Promedio',
                                    ]}
                                    contentStyle={{
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.95)',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        padding: '8px 12px',
                                    }}
                                />
                                <Bar
                                    dataKey="promedio"
                                    name="Promedio"
                                    radius={[0, 8, 8, 0]}
                                    label={{
                                        position: 'right',
                                        fill: '#374151',
                                        fontSize: 12,
                                        formatter: (value) => value.toFixed(2),
                                    }}
                                >
                                    {barData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tabla detallada */}
                <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                                    Pregunta
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700">
                                    Promedio
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700">
                                    Categoría
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {barData.map((item, index) => (
                                <tr
                                    key={index}
                                    className="transition-colors hover:bg-gray-50"
                                >
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                        {item.pregunta}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center rounded-full bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-900">
                                            {item.promedio.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                                            style={{
                                                backgroundColor: `${item.color}20`,
                                                color: item.color,
                                            }}
                                        >
                                            {item.categoria}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Categorías agrupadas (opcional) */}
                {resultado.por_categoria && (
                    <div className="mt-6 rounded-lg bg-blue-50 p-4">
                        <h4 className="font-medium text-blue-900">
                            Análisis por Categorías
                        </h4>
                        <div className="mt-3 space-y-2">
                            {Object.entries(resultado.por_categoria).map(
                                ([categoria, valor]) => (
                                    <div
                                        key={categoria}
                                        className="flex justify-between"
                                    >
                                        <span className="text-blue-800">
                                            {categoria}:
                                        </span>
                                        <span className="font-semibold text-blue-900">
                                            {valor.toFixed(2)}
                                        </span>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
