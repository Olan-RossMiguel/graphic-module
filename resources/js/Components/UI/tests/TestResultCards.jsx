import {
    FaBook,
    FaCheck,
    FaCheckCircle,
    FaDownload,
    FaExclamationTriangle,
    FaHeartbeat,
    FaTimes,
    FaTimesCircle,
} from 'react-icons/fa';
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

            {/* Tabla con números y círculos centrados */}
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

// ✅ NUEVO COMPONENTE: Card de Asistencia Psicológica
export const PsychologicalAssistanceCard = ({
    resultado,
    onDownloadReport,
}) => {
    if (!resultado) {
        return null;
    }

    // Configuración de categorías
    const categorias = {
        bienestar_general: {
            nombre: 'Bienestar General',
            color: '#FF6B6B',
            descripcion:
                'Estrés, ansiedad, sueño, motivación, cambios de humor',
        },
        atencion_externa: {
            nombre: 'Atención Externa',
            color: '#4ECDC4',
            descripcion: 'Uso y percepción de servicios psicológicos',
        },
        disposicion_ayuda: {
            nombre: 'Disposición a Ayuda',
            color: '#51CF66',
            descripcion: 'Apertura para buscar apoyo profesional',
        },
    };

    // Mapeo completo de las 15 preguntas
    const preguntasTest = {
        // PREGUNTAS DE CONTEXTO (1-5) - Solo para la psicóloga
        pregunta_1: {
            texto: '¿Actualmente asistes a un psicólogo fuera de la institución?',
            tipo: 'contexto',
            respuestas: { 1: 'Sí', 0: 'No' },
            categoria: 'atencion_externa',
        },
        pregunta_2: {
            texto: 'Si respondiste que sí, ¿con qué frecuencia acudes?',
            tipo: 'contexto',
            respuestas: {
                4: 'Semanal',
                3: 'Quincenal',
                2: 'Mensual',
                1: 'Ocasional',
            },
            categoria: 'atencion_externa',
        },
        pregunta_3: {
            texto: '¿Desde cuándo aproximadamente recibes apoyo psicológico externo?',
            tipo: 'contexto',
            respuestas: {
                1: 'Menos de 3 meses',
                2: '3 a 6 meses',
                3: '6 meses a 1 año',
                4: 'Más de 1 año',
            },
            categoria: 'atencion_externa',
        },
        pregunta_4: {
            texto: '¿Sientes que la atención psicológica externa te ha ayudado a mejorar tu bienestar emocional?',
            tipo: 'contexto',
            respuestas: {
                5: 'Sí, mucho',
                3: 'Sí, en parte',
                1: 'Poco',
                0: 'Nada',
            },
            categoria: 'atencion_externa',
        },
        pregunta_5: {
            texto: 'En caso de necesitarlo, ¿estarías dispuesto a continuar o retomar la atención psicológica externa?',
            tipo: 'contexto',
            respuestas: { 1: 'Sí', 0: 'No', 0.5: 'No estoy seguro' },
            categoria: 'disposicion_ayuda',
        },
        // PREGUNTAS CON ESCALA LIKERT (6-15)
        pregunta_6: {
            texto: 'En los últimos meses me he sentido con demasiado estrés por la carga académica',
            tipo: 'negativa',
            categoria: 'bienestar_general',
        },
        pregunta_7: {
            texto: 'He experimentado ansiedad, nerviosismo o preocupación excesiva durante la carrera',
            tipo: 'negativa',
            categoria: 'bienestar_general',
        },
        pregunta_8: {
            texto: 'He tenido problemas de sueño (insomnio, dificultad para descansar)',
            tipo: 'negativa',
            categoria: 'bienestar_general',
        },
        pregunta_9: {
            texto: 'Me siento motivado y con energía para realizar mis actividades diarias',
            tipo: 'positiva',
            categoria: 'bienestar_general',
        },
        pregunta_10: {
            texto: 'He tenido cambios de humor frecuentes o dificultad para controlar mis emociones',
            tipo: 'negativa',
            categoria: 'bienestar_general',
        },
        pregunta_11: {
            texto: 'Cuento con alguien de confianza (amigo, familia, docente) con quien puedo hablar de mis problemas',
            tipo: 'positiva',
            categoria: 'bienestar_general',
        },
        pregunta_12: {
            texto: 'He acudido al psicólogo en algún momento durante mi carrera',
            tipo: 'positiva',
            categoria: 'atencion_externa',
        },
        pregunta_13: {
            texto: 'Considero que la atención psicológica es importante para los estudiantes universitarios',
            tipo: 'positiva',
            categoria: 'atencion_externa',
        },
        pregunta_14: {
            texto: 'Si me sintiera mal emocionalmente, buscaría ayuda profesional',
            tipo: 'positiva',
            categoria: 'disposicion_ayuda',
        },
        pregunta_15: {
            texto: 'Actualmente siento que mi estado de salud mental me permite continuar con mis estudios',
            tipo: 'positiva',
            categoria: 'bienestar_general',
        },
    };

    const escalaLikert = {
        1: 'Nunca',
        2: 'Casi nunca',
        3: 'A veces',
        4: 'Casi siempre',
        5: 'Siempre',
    };

    // Función para extraer el valor de respuesta
    const getRespuestaValor = (valor) => {
        if (
            typeof valor === 'object' &&
            valor !== null &&
            'respuesta' in valor
        ) {
            return parseFloat(valor.respuesta);
        }
        return parseFloat(valor);
    };

    // Función para determinar el estilo de la respuesta (solo para Likert)
    const getResponseStyle = (key, valorRaw) => {
        const valor = getRespuestaValor(valorRaw);
        const pregunta = preguntasTest[key];

        if (!pregunta || pregunta.tipo === 'contexto') {
            return null;
        }

        const esNegativa = pregunta.tipo === 'negativa';

        if (esNegativa) {
            if (valor <= 2)
                return {
                    nivel: 'Bien',
                    badge: 'bg-green-500 text-white',
                    icon: FaCheckCircle,
                };
            if (valor === 3)
                return {
                    nivel: 'Moderado',
                    badge: 'bg-yellow-500 text-white',
                    icon: FaExclamationTriangle,
                };
            return {
                nivel: 'Alerta',
                badge: 'bg-red-500 text-white',
                icon: FaTimesCircle,
            };
        } else {
            if (valor >= 4)
                return {
                    nivel: 'Excelente',
                    badge: 'bg-green-500 text-white',
                    icon: FaCheckCircle,
                };
            if (valor === 3)
                return {
                    nivel: 'Moderado',
                    badge: 'bg-yellow-500 text-white',
                    icon: FaExclamationTriangle,
                };
            return {
                nivel: 'Requiere atención',
                badge: 'bg-red-500 text-white',
                icon: FaTimesCircle,
            };
        }
    };

    // Preparar datos para la gráfica
    const barData = Object.keys(resultado.data || {}).map((categoria) => {
        const info = categorias[categoria] || {
            nombre: categoria,
            color: '#8884D8',
            descripcion: '',
        };
        return {
            categoria: info.nombre,
            puntuacion: resultado.data[categoria],
            color: info.color,
            descripcion: info.descripcion,
        };
    });

    barData.sort((a, b) => b.puntuacion - a.puntuacion);

    // Separar preguntas de contexto y Likert
    const preguntasContexto = [];
    const preguntasLikert = [];

    if (resultado.respuestas) {
        Object.entries(resultado.respuestas)
            .sort(([keyA], [keyB]) => {
                const numA = parseInt(keyA.replace('pregunta_', ''));
                const numB = parseInt(keyB.replace('pregunta_', ''));
                return numA - numB;
            })
            .forEach(([key, valorRaw]) => {
                const pregunta = preguntasTest[key];
                if (!pregunta) return;

                const valor = getRespuestaValor(valorRaw);
                const numPregunta = parseInt(key.replace('pregunta_', ''));

                if (pregunta.tipo === 'contexto') {
                    preguntasContexto.push({
                        key,
                        pregunta,
                        valor,
                        numPregunta,
                    });
                } else {
                    preguntasLikert.push({ key, pregunta, valor, numPregunta });
                }
            });
    }

    return (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <TestCardHeader
                title="Asistencia Psicológica"
                icon={FaHeartbeat}
                iconColor="text-red-500"
                isCompleted={true}
                onDownloadReport={() => onDownloadReport?.('asistencia')}
            />
            <div
                id="asistencia-report-content"
                className="border-t border-gray-200 px-4 py-5 sm:p-6"
            >
                {/* Información general */}
                <div className="mb-6 space-y-2 text-sm">
                    <p>
                        <strong>Fecha de realización:</strong>{' '}
                        {new Date(resultado.fecha).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
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
                </div>

                {/* Gráfica de barras */}
                {barData.length > 0 && (
                    <div className="mb-8">
                        <h4 className="mb-4 text-lg font-medium text-gray-900">
                            Puntuación por Categoría
                        </h4>
                        <div className="h-80">
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
                                        domain={[0, 50]}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="categoria"
                                        width={140}
                                        tick={{ fontSize: 11 }}
                                    />
                                    <Tooltip
                                        formatter={(value, name, props) => [
                                            `${value} puntos`,
                                            props.payload.descripcion,
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
                                        dataKey="puntuacion"
                                        name="Puntuación"
                                        radius={[0, 8, 8, 0]}
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
                )}

                {/* Tabla de detalle por categoría */}
                {barData.length > 0 && (
                    <div className="mb-8 overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                                        Categoría
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700">
                                        Puntuación
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                                        Descripción
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
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-3 w-3 rounded"
                                                    style={{
                                                        backgroundColor:
                                                            item.color,
                                                    }}
                                                />
                                                {item.categoria}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center rounded-full bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-900">
                                                {item.puntuacion}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {item.descripcion}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* SECCIÓN 1: Preguntas de Contexto */}
                {preguntasContexto.length > 0 && (
                    <div className="mb-8">
                        <h4 className="mb-4 text-lg font-medium text-gray-900">
                            Información de Contexto (Solo para Psicóloga)
                        </h4>
                        <div className="space-y-3">
                            {preguntasContexto.map(
                                ({ key, pregunta, valor, numPregunta }) => {
                                    const respuestaTexto =
                                        pregunta.respuestas?.[valor] ||
                                        `Valor: ${valor}`;

                                    return (
                                        <div
                                            key={key}
                                            className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <span className="rounded bg-gray-600 px-2 py-0.5 text-xs font-semibold text-white">
                                                            #{numPregunta}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {categorias[
                                                                pregunta
                                                                    .categoria
                                                            ]?.nombre ||
                                                                pregunta.categoria}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {pregunta.texto}
                                                    </p>
                                                </div>
                                                <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {respuestaTexto}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </div>
                )}

                {/* SECCIÓN 2: Preguntas con Escala Likert */}
                {preguntasLikert.length > 0 && (
                    <div className="mb-8">
                        <h4 className="mb-4 text-lg font-medium text-gray-900">
                            Evaluación de Bienestar Emocional
                        </h4>
                        <div className="space-y-3">
                            {preguntasLikert.map(
                                ({ key, pregunta, valor, numPregunta }) => {
                                    const style = getResponseStyle(key, valor);
                                    const Icon = style?.icon;

                                    return (
                                        <div
                                            key={key}
                                            className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex flex-1 items-start gap-3">
                                                    {Icon && (
                                                        <Icon className="mt-1 text-lg text-gray-400" />
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <span className="rounded bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white">
                                                                #{numPregunta}
                                                            </span>
                                                            {style && (
                                                                <span
                                                                    className={`rounded-full ${style.badge} px-2 py-0.5 text-xs font-semibold`}
                                                                >
                                                                    {
                                                                        style.nivel
                                                                    }
                                                                </span>
                                                            )}
                                                            <span className="text-xs text-gray-500">
                                                                {
                                                                    categorias[
                                                                        pregunta
                                                                            .categoria
                                                                    ]?.nombre
                                                                }
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-900">
                                                            {pregunta.texto}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-gray-100 px-3 py-1.5">
                                                        <span className="text-xl font-bold text-gray-900">
                                                            {valor}
                                                        </span>
                                                        <span className="text-gray-400">
                                                            /
                                                        </span>
                                                        <span className="text-sm text-gray-600">
                                                            5
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-600">
                                                        {escalaLikert[valor]}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </div>
                )}
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
