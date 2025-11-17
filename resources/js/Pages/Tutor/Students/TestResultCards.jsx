import { FaBook, FaCheck, FaDownload, FaTimes } from 'react-icons/fa';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const CHART_COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82ca9d',
    '#FF6B6B',
    '#4ECDC4',
    '#95E1D3',
    '#F38181',
];

const LEARNING_STYLES_NAMES = {
    visual: 'Visual',
    auditivo: 'Auditivo',
    lectura_escritura: 'Lectura/Escritura',
    'lectura-escritura': 'Lectura/Escritura',
    kinestesico: 'Kinestésico',
    kinestésico: 'Kinestésico',
};

// Componente de Header compartido
const TestCardHeader = ({
    title,
    icon: Icon,
    iconColor,
    isCompleted,
    onDownloadReport,
}) => (
    <div className="flex items-center justify-between px-4 py-5 sm:px-6">
        <h3 className="flex items-center text-lg font-medium leading-6 text-gray-900">
            <Icon className={`mr-2 h-5 w-5 ${iconColor}`} />
            {title}
        </h3>
        <div className="flex items-center space-x-2">
            {isCompleted ? (
                <>
                    <FaCheck className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-600">Completado</span>
                    <button
                        onClick={onDownloadReport}
                        className="inline-flex items-center rounded border border-transparent bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                    >
                        <FaDownload className="mr-1 h-3 w-3" />
                        Reporte
                    </button>
                </>
            ) : (
                <>
                    <FaTimes className="h-5 w-5 text-red-500" />
                    <span className="text-sm text-red-600">No completado</span>
                </>
            )}
        </div>
    </div>
);

// Componente mejorado de gráfica de Pie
const PieChartComponent = ({ data, title, chartId }) => {
    if (!data || data.length === 0) {
        return (
            <div className="py-8 text-center text-gray-500">
                No hay datos disponibles
            </div>
        );
    }

    return (
        <div id={chartId}>
            <h4 className="mb-4 text-lg font-medium text-gray-900">{title}</h4>

            {/* Leyenda con porcentajes */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {data.map((entry, index) => (
                    <div
                        key={`legend-${index}`}
                        className="flex items-center gap-2 rounded-lg bg-gray-50 p-3"
                        style={{ minWidth: '0' }}
                    >
                        <div
                            className="h-4 w-4 flex-shrink-0 rounded"
                            style={{ backgroundColor: entry.color }}
                        />
                        <div className="min-w-0 flex-1 overflow-hidden">
                            <p
                                className="truncate text-xs font-medium text-gray-900"
                                title={entry.name}
                            >
                                {entry.name}
                            </p>
                            <p className="text-xs text-gray-600">
                                {entry.porcentaje ||
                                    Math.round(
                                        (entry.value /
                                            data.reduce(
                                                (sum, item) => sum + item.value,
                                                0,
                                            )) *
                                            100,
                                    )}
                                %
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Gráfica de pastel más grande */}
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name, props) => {
                                const porcentaje = props.payload?.porcentaje;
                                const total = data.reduce(
                                    (sum, item) => sum + item.value,
                                    0,
                                );
                                const percent =
                                    porcentaje ||
                                    Math.round((value / total) * 100);
                                return [`${value} (${percent}%)`, name];
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// Componente mejorado de gráfica de Barras con números centrados
const BarChartComponent = ({
    data,
    title,
    dataKey = 'respuestas',
    domain,
    chartId,
}) => {
    if (!data || data.length === 0) {
        return (
            <div className="py-8 text-center text-gray-500">
                No hay datos disponibles
            </div>
        );
    }

    const xAxisKey = Object.keys(data[0])[0];
    const labelMap = {
        respuestas: 'Respuestas',
        puntuacion: 'Puntuación',
    };

    const formatLabel = (label) => {
        if (label.length > 20) {
            return label.substring(0, 18) + '...';
        }
        return label;
    };

    const renderCustomBarLabel = (props) => {
        const { x, y, width, value, height } = props;

        if (height < 20) return null;

        return (
            <text
                x={x + width / 2}
                y={y + height / 2}
                fill="white"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-bold"
            >
                {value}
            </text>
        );
    };

    return (
        <div id={chartId}>
            <h4 className="mb-4 text-lg font-medium text-gray-900">{title}</h4>

            {/* Gráfica de barras */}
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey={xAxisKey}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                            tick={{ fontSize: 12 }}
                            tickFormatter={formatLabel}
                        />
                        <YAxis domain={domain} tick={{ fontSize: 12 }} />
                        <Tooltip
                            formatter={(value) => [
                                `${value} ${labelMap[dataKey] || ''}`,
                                '',
                            ]}
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '8px 12px',
                            }}
                        />
                        <Bar
                            dataKey={dataKey}
                            name={labelMap[dataKey] || dataKey}
                            radius={[8, 8, 0, 0]}
                            label={renderCustomBarLabel}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Tabla con números y círculos centrados vertical y horizontalmente */}
            <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                                Dimensión
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700">
                                {labelMap[dataKey] || dataKey}
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700">
                                Color
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {data.map((item, index) => (
                            <tr
                                key={index}
                                className="transition-colors hover:bg-gray-50"
                            >
                                <td
                                    className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
                                    style={{
                                        verticalAlign: 'middle',
                                        lineHeight: '1.5',
                                    }}
                                >
                                    {item[xAxisKey]}
                                </td>
                                <td
                                    className="px-6 py-4 text-center"
                                    style={{
                                        verticalAlign: 'middle',
                                        lineHeight: '1.5',
                                    }}
                                >
                                    <span
                                        className="inline-flex items-center justify-center rounded-full bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-900"
                                        style={{
                                            verticalAlign: 'middle',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {item[dataKey]}
                                    </span>
                                </td>
                                <td
                                    className="px-6 py-4 text-center"
                                    style={{
                                        verticalAlign: 'middle',
                                        lineHeight: '1.5',
                                    }}
                                >
                                    <div
                                        className="inline-flex items-center justify-center"
                                        style={{
                                            verticalAlign: 'middle',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div
                                            className="h-5 w-5 rounded-full shadow-sm"
                                            style={{
                                                backgroundColor: item.color,
                                                display: 'inline-block',
                                            }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Card de Estilos de Aprendizaje
export const LearningStylesCard = ({ resultado, onDownloadReport }) => {
    if (!resultado) {
        return (
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                <TestCardHeader
                    title="Estilos de Aprendizaje"
                    icon={FaBook}
                    iconColor="text-blue-500"
                    isCompleted={false}
                />
            </div>
        );
    }

    const { data, porcentajes } = resultado;

    const pieData = Object.keys(data).map((estilo, index) => ({
        name: LEARNING_STYLES_NAMES[estilo] || estilo,
        value: data[estilo],
        porcentaje: porcentajes?.[estilo] || 0,
        color: CHART_COLORS[index % CHART_COLORS.length],
    }));

    const barData = Object.keys(data).map((estilo, index) => ({
        estilo: LEARNING_STYLES_NAMES[estilo] || estilo,
        respuestas: data[estilo],
        porcentaje: porcentajes?.[estilo] || 0,
        color: CHART_COLORS[index % CHART_COLORS.length],
    }));

    return (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <TestCardHeader
                title="Estilos de Aprendizaje"
                icon={FaBook}
                iconColor="text-blue-500"
                isCompleted={true}
                onDownloadReport={() => onDownloadReport('aprendizaje')}
            />
            <div
                id="aprendizaje-report-content"
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
                    <p>
                        <strong>Total de preguntas:</strong>{' '}
                        {resultado.total_respuestas}
                    </p>
                </div>

                <div className="space-y-8">
                    <PieChartComponent
                        data={pieData}
                        title="Distribución de Estilos"
                        chartId="aprendizaje-pie-chart"
                    />
                    <BarChartComponent
                        data={barData}
                        title="Respuestas por Estilo"
                        dataKey="respuestas"
                        chartId="aprendizaje-bar-chart"
                    />
                </div>

                {resultado.dato_curioso && (
                    <div className="mt-4 rounded-lg bg-purple-50 p-4">
                        <h4 className="font-medium text-purple-900">
                            Dato Curioso
                        </h4>
                        <p className="mt-2 text-purple-800">
                            {resultado.dato_curioso}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Card Genérica para otros tests
export const GenericTestCard = ({
    resultado,
    title,
    icon,
    iconColor,
    testType,
    bgColor = 'bg-green-50',
    textColor = 'text-green-900',
    onDownloadReport,
}) => {
    if (!resultado) {
        return (
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                <TestCardHeader
                    title={title}
                    icon={icon}
                    iconColor={iconColor}
                    isCompleted={false}
                />
            </div>
        );
    }

    const barData = Object.keys(resultado.data).map((dimension, index) => {
        const formattedDimension = dimension
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return {
            dimension: formattedDimension,
            puntuacion: resultado.data[dimension],
            color: CHART_COLORS[index % CHART_COLORS.length],
        };
    });

    const pieData = Object.keys(resultado.data).map((dimension, index) => {
        const formattedDimension = dimension
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return {
            name: formattedDimension,
            value: resultado.data[dimension],
            color: CHART_COLORS[index % CHART_COLORS.length],
        };
    });

    return (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <TestCardHeader
                title={title}
                icon={icon}
                iconColor={iconColor}
                isCompleted={true}
                onDownloadReport={() => onDownloadReport(testType)}
            />
            <div
                id={`${testType}-report-content`}
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
                    {resultado.total_respuestas && (
                        <p>
                            <strong>Total de preguntas:</strong>{' '}
                            {resultado.total_respuestas}
                        </p>
                    )}
                </div>

                <div className="space-y-8">
                    <PieChartComponent
                        data={pieData}
                        title={`Distribución de ${title}`}
                        chartId={`${testType}-pie-chart`}
                    />

                    <BarChartComponent
                        data={barData}
                        title={`Puntuación por Dimensión`}
                        dataKey="puntuacion"
                        domain={[0, 10]}
                        chartId={`${testType}-bar-chart`}
                    />
                </div>

                {resultado.recomendaciones && (
                    <div className={`mt-6 rounded-lg ${bgColor} p-4`}>
                        <h4 className={`font-medium ${textColor}`}>
                            Recomendaciones:
                        </h4>
                        <p
                            className={`mt-2 ${textColor.replace('900', '800')}`}
                        >
                            {resultado.recomendaciones}
                        </p>
                    </div>
                )}

                {resultado.dato_curioso && (
                    <div className="mt-4 rounded-lg bg-purple-50 p-4">
                        <h4 className="font-medium text-purple-900">
                            Dato Curioso
                        </h4>
                        <p className="mt-2 text-purple-800">
                            {resultado.dato_curioso}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
