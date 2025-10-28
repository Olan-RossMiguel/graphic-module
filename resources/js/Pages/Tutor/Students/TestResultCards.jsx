import {
    FaBook,
    FaCheck,
    FaDownload,
    FaGraduationCap,
    FaLightbulb,
    FaTimes,
} from 'react-icons/fa';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
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
];

const LEARNING_STYLES_NAMES = {
    visual: 'Visual',
    auditivo: 'Auditivo',
    lectura_escritura: 'Lectura/Escritura',
    kinestesico: 'Kinestésico',
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

// Componente de gráfica de Pie
const PieChartComponent = ({ data, title }) => {
    if (!data || data.length === 0) {
        return (
            <div className="py-8 text-center text-gray-500">
                No hay datos disponibles
            </div>
        );
    }

    return (
        <div>
            <h4 className="mb-4 text-lg font-medium text-gray-900">{title}</h4>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, porcentaje }) =>
                                `${name} (${porcentaje}%)`
                            }
                            outerRadius={80}
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
                            formatter={(value, name, props) => [
                                `${value} respuestas (${props.payload.porcentaje}%)`,
                                name,
                            ]}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// Componente de gráfica de Barras
const BarChartComponent = ({ data, title, dataKey = 'respuestas', domain }) => {
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

    return (
        <div>
            <h4 className="mb-4 text-lg font-medium text-gray-900">{title}</h4>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey={xAxisKey}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis domain={domain} />
                        <Tooltip
                            formatter={(value, name, props) => {
                                if (props.payload.porcentaje) {
                                    return [
                                        `${value} respuestas (${props.payload.porcentaje}%)`,
                                        'Cantidad',
                                    ];
                                }
                                return [value, name];
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey={dataKey}
                            name={labelMap[dataKey] || dataKey}
                            fill="#8884d8"
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
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <p>
                            <strong>Fecha de realización:</strong>{' '}
                            {new Date(resultado.fecha).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Puntuación total:</strong>{' '}
                            {resultado.puntuacion}
                        </p>
                        <p>
                            <strong>Total de respuestas:</strong>{' '}
                            {resultado.total_respuestas}
                        </p>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-4">
                        <h4 className="flex items-center font-medium text-blue-900">
                            <FaGraduationCap className="mr-2" />
                            Estilo Dominante
                        </h4>
                        <p className="text-lg font-semibold text-blue-800">
                            {LEARNING_STYLES_NAMES[
                                resultado.estilo_dominante
                            ] || resultado.estilo_dominante}
                        </p>
                        <p className="text-blue-700">
                            {
                                resultado.porcentajes?.[
                                    resultado.estilo_dominante
                                ]
                            }
                            % de preferencia
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <PieChartComponent
                        data={pieData}
                        title="Distribución de Estilos"
                    />
                    <BarChartComponent
                        data={barData}
                        title="Respuestas por Estilo"
                        dataKey="respuestas"
                    />
                </div>

                {resultado.interpretacion && (
                    <div className="mt-6 space-y-4">
                        <div className="rounded-lg bg-green-50 p-4">
                            <h4 className="flex items-center font-medium text-green-900">
                                <FaLightbulb className="mr-2" />
                                Interpretación
                            </h4>
                            <p className="text-green-800">
                                {resultado.interpretacion.descripcion}
                            </p>
                            {resultado.interpretacion.caracteristicas && (
                                <ul className="mt-2 list-inside list-disc text-green-700">
                                    {resultado.interpretacion.caracteristicas.map(
                                        (car, idx) => (
                                            <li key={idx}>{car}</li>
                                        ),
                                    )}
                                </ul>
                            )}
                        </div>

                        {resultado.interpretacion.recomendacion && (
                            <div className="rounded-lg bg-yellow-50 p-4">
                                <h4 className="font-medium text-yellow-900">
                                    Recomendaciones de Estudio
                                </h4>
                                <p className="text-yellow-800">
                                    {resultado.interpretacion.recomendacion}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {resultado.dato_curioso && (
                    <div className="mt-4 rounded-lg bg-purple-50 p-4">
                        <h4 className="font-medium text-purple-900">
                            Dato Curioso
                        </h4>
                        <p className="text-purple-800">
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

    const barData = Object.keys(resultado.data).map((dimension, index) => ({
        dimension: dimension,
        puntuacion: resultado.data[dimension],
        color: CHART_COLORS[index % CHART_COLORS.length],
    }));

    return (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <TestCardHeader
                title={title}
                icon={icon}
                iconColor={iconColor}
                isCompleted={true}
                onDownloadReport={() => onDownloadReport(testType)}
            />
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="mb-4 space-y-2">
                    <p>
                        <strong>Fecha de realización:</strong>{' '}
                        {new Date(resultado.fecha).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Puntuación total:</strong>{' '}
                        {resultado.puntuacion}
                    </p>
                </div>

                <BarChartComponent
                    data={barData}
                    title={title}
                    dataKey="puntuacion"
                    domain={[0, 10]}
                />

                {resultado.recomendaciones && (
                    <div className={`mt-4 rounded-lg ${bgColor} p-4`}>
                        <h4 className={`font-medium ${textColor}`}>
                            Recomendaciones:
                        </h4>
                        <p className={textColor.replace('900', '800')}>
                            {resultado.recomendaciones}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
