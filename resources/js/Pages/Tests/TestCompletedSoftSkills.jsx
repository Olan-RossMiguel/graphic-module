import StudentLayout from '@/Layouts/UI/StudentLayout';
import { Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Award,
    Brain,
    CheckCircle,
    FileText,
    Home,
    TrendingUp,
} from 'lucide-react';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

export default function TestCompletedSoftSkills({
    test,
    result,
    chartData,
    insights,
}) {
    const { props } = usePage();

    // Colores para la gráfica de pastel (10 colores para 10 categorías)
    const COLORS = [
        '#3b82f6', // azul
        '#10b981', // verde
        '#f59e0b', // naranja
        '#8b5cf6', // morado
        '#ec4899', // rosa
        '#06b6d4', // cyan
        '#f43f5e', // rojo
        '#84cc16', // lima
        '#f97316', // naranja oscuro
        '#6366f1', // indigo
    ];

    // Mapeo de niveles a emojis
    const levelEmojis = {
        Excelente: '🌟',
        Bueno: '😊',
        Medio: '🙂',
        Bajo: '📈',
    };

    // Renderizado personalizado de la leyenda
    const renderLegend = (props) => {
        const { payload } = props;
        return (
            <ul className="flex flex-wrap justify-center gap-2 text-xs">
                {payload.map((entry, index) => (
                    <li
                        key={`legend-${index}`}
                        className="flex items-center gap-1"
                    >
                        <span
                            className="inline-block h-3 w-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-700">{entry.value}</span>
                    </li>
                ))}
            </ul>
        );
    };

    // Color según el nivel
    const getLevelColor = (nivel) => {
        const colors = {
            Excelente: 'green',
            Bueno: 'blue',
            Medio: 'yellow',
            Bajo: 'orange',
        };
        return colors[nivel] || 'gray';
    };

    const levelColor = getLevelColor(result?.nivel);
    const colorClasses = {
        green: {
            bg: 'from-green-500 to-emerald-600',
            border: 'border-green-200',
            gradient: 'from-green-50 to-emerald-50',
            text: 'text-green-900',
            badge: 'bg-green-600',
        },
        blue: {
            bg: 'from-blue-500 to-indigo-600',
            border: 'border-blue-200',
            gradient: 'from-blue-50 to-indigo-50',
            text: 'text-blue-900',
            badge: 'bg-blue-600',
        },
        yellow: {
            bg: 'from-yellow-500 to-orange-600',
            border: 'border-yellow-200',
            gradient: 'from-yellow-50 to-orange-50',
            text: 'text-yellow-900',
            badge: 'bg-yellow-600',
        },
        orange: {
            bg: 'from-orange-500 to-red-600',
            border: 'border-orange-200',
            gradient: 'from-orange-50 to-red-50',
            text: 'text-orange-900',
            badge: 'bg-orange-600',
        },
        gray: {
            bg: 'from-gray-500 to-gray-600',
            border: 'border-gray-200',
            gradient: 'from-gray-50 to-gray-50',
            text: 'text-gray-900',
            badge: 'bg-gray-600',
        },
    };

    const colors = colorClasses[levelColor];

    // Emojis para categorías
    const categoryEmojis = {
        Comunicación: '💬',
        'Trabajo en equipo': '🤝',
        'Resolución de problemas': '🧩',
        'Pensamiento crítico': '🧠',
        Adaptabilidad: '🔄',
        'Gestión del tiempo': '⏰',
        Liderazgo: '👑',
        Creatividad: '🎨',
        'Manejo del estrés': '😌',
        Responsabilidad: '✅',
    };

    return (
        <StudentLayout user={props?.auth?.user}>
            <div className="mx-auto max-w-6xl py-12">
                {/* Card principal */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    {/* Header con gradiente dinámico */}
                    <div
                        className={`bg-gradient-to-r ${colors.bg} px-8 py-12 text-center`}
                    >
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <CheckCircle
                                className="h-12 w-12 text-white"
                                strokeWidth={2.5}
                            />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-white">
                            ¡Test de Habilidades Blandas Completado!
                        </h1>
                        <p className="text-lg text-white/90">
                            Descubre tu perfil profesional
                        </p>
                    </div>

                    {/* Contenido */}
                    <div className="px-8 py-8">
                        {/* Nivel Destacado */}
                        {result?.nivel && (
                            <div
                                className={`mb-8 rounded-xl border-2 ${colors.border} bg-gradient-to-br ${colors.gradient} p-6 shadow-sm`}
                            >
                                <div className="mb-4 flex items-center justify-center gap-3">
                                    <div
                                        className={`rounded-full ${colors.badge} p-3`}
                                    >
                                        <Brain className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <p
                                            className={`text-sm font-medium ${colors.text}`}
                                        >
                                            Tu nivel de Habilidades Blandas:
                                        </p>
                                        <h2
                                            className={`text-3xl font-bold ${colors.text}`}
                                        >
                                            {levelEmojis[result.nivel] || '🎯'}{' '}
                                            {result.nivel}
                                        </h2>
                                    </div>
                                </div>

                                {result.descripcion && (
                                    <p
                                        className={`text-center text-sm ${colors.text}`}
                                    >
                                        {result.descripcion}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Grid de dos columnas */}
                        <div className="grid gap-8 lg:grid-cols-2">
                            {/* Columna izquierda: Insights y detalles */}
                            <div className="space-y-6">
                                {/* Dato curioso */}
                                {insights && (
                                    <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
                                        <div className="mb-3 flex items-center gap-2">
                                            <div className="rounded-full bg-blue-600 p-2">
                                                <Award className="h-5 w-5 text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold text-blue-900">
                                                💡 Dato Curioso
                                            </h3>
                                        </div>
                                        <p className="mb-4 text-sm leading-relaxed text-blue-800">
                                            {insights.curious_fact}
                                        </p>
                                        {insights.recommendation && (
                                            <div className="border-t border-blue-200 pt-4">
                                                <p className="mb-2 text-xs font-semibold text-blue-900">
                                                    📌 Recomendación
                                                    personalizada:
                                                </p>
                                                <p className="text-sm text-blue-800">
                                                    {insights.recommendation}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Fortalezas */}
                                {result?.fortalezas &&
                                    result.fortalezas.length > 0 && (
                                        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
                                            <div className="mb-3 flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5 text-green-600" />
                                                <h3 className="text-lg font-bold text-green-900">
                                                    💪 Tus Fortalezas
                                                </h3>
                                            </div>
                                            <div className="space-y-3">
                                                {result.fortalezas.map(
                                                    (fortaleza, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between rounded-lg bg-white p-3"
                                                        >
                                                            <span className="flex items-center gap-2 text-sm font-medium text-green-900">
                                                                {categoryEmojis[
                                                                    fortaleza
                                                                        .categoria
                                                                ] || '✨'}
                                                                {
                                                                    fortaleza.categoria
                                                                }
                                                            </span>
                                                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                                                                {
                                                                    fortaleza.puntuacion
                                                                }
                                                                /5
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Áreas de mejora */}
                                {result?.areas_mejora &&
                                    result.areas_mejora.length > 0 && (
                                        <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-6">
                                            <div className="mb-3 flex items-center gap-2">
                                                <AlertCircle className="h-5 w-5 text-orange-600" />
                                                <h3 className="text-lg font-bold text-orange-900">
                                                    🎯 Áreas de Oportunidad
                                                </h3>
                                            </div>
                                            <div className="space-y-3">
                                                {result.areas_mejora.map(
                                                    (area, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between rounded-lg bg-white p-3"
                                                        >
                                                            <span className="flex items-center gap-2 text-sm font-medium text-orange-900">
                                                                {categoryEmojis[
                                                                    area
                                                                        .categoria
                                                                ] || '📈'}
                                                                {area.categoria}
                                                            </span>
                                                            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700">
                                                                {
                                                                    area.puntuacion
                                                                }
                                                                /5
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Información del test */}
                                <div className="rounded-lg bg-gray-50 p-6">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-900">
                                        Detalles del Test
                                    </h3>
                                    {result && (
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <p>
                                                <span className="font-medium">
                                                    Fecha:
                                                </span>{' '}
                                                {new Date(
                                                    result.fecha_realizacion,
                                                ).toLocaleDateString('es-MX', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    Puntuación:
                                                </span>{' '}
                                                <span className="text-lg font-bold text-blue-600">
                                                    {result.puntuacion_total}/50
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Mensaje de confirmación */}
                                <div className="border-l-4 border-green-500 bg-green-50 p-4">
                                    <p className="text-sm text-green-800">
                                        <strong>
                                            ✓ Tus respuestas han sido guardadas.
                                        </strong>
                                        <br />
                                        Las habilidades blandas son clave para
                                        tu éxito profesional.
                                    </p>
                                </div>
                            </div>

                            {/* Columna derecha: Gráfica de pastel */}
                            {chartData && chartData.length > 0 && (
                                <div className="flex flex-col">
                                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                        <h3 className="mb-4 text-center text-lg font-semibold text-gray-900">
                                            Distribución por Habilidades
                                        </h3>
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({
                                                        name,
                                                        percent,
                                                    }) =>
                                                        percent > 0.05
                                                            ? `${(percent * 100).toFixed(0)}%`
                                                            : ''
                                                    }
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {chartData.map(
                                                        (entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    COLORS[
                                                                        index %
                                                                            COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value) => [
                                                        `${value}/5 puntos`,
                                                        'Puntuación',
                                                    ]}
                                                />
                                                <Legend
                                                    content={renderLegend}
                                                    wrapperStyle={{
                                                        paddingTop: '20px',
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Estadísticas en grid */}
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        {chartData
                                            .slice(0, 4)
                                            .map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="rounded-lg border bg-gray-50 p-4 text-center"
                                                >
                                                    <div
                                                        className="mx-auto mb-2 h-3 w-3 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                COLORS[index],
                                                        }}
                                                    />
                                                    <p className="mb-1 text-xs text-gray-600">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        {item.value}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        /5 puntos
                                                    </p>
                                                </div>
                                            ))}
                                    </div>

                                    {/* Recomendaciones personalizadas */}
                                    {result?.recomendaciones &&
                                        result.recomendaciones.length > 0 && (
                                            <div className="mt-4 rounded-lg border-2 border-purple-200 bg-purple-50 p-6">
                                                <div className="mb-3 flex items-center gap-2">
                                                    <Award className="h-5 w-5 text-purple-600" />
                                                    <h3 className="text-lg font-bold text-purple-900">
                                                        🎓 Recomendaciones
                                                    </h3>
                                                </div>
                                                <div className="space-y-3">
                                                    {result.recomendaciones.map(
                                                        (rec, index) => (
                                                            <div
                                                                key={index}
                                                                className="rounded-lg bg-white p-4"
                                                            >
                                                                <p className="mb-2 text-sm font-semibold text-purple-900">
                                                                    {categoryEmojis[
                                                                        rec
                                                                            .categoria
                                                                    ] ||
                                                                        '💡'}{' '}
                                                                    {
                                                                        rec.categoria
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-purple-800">
                                                                    {
                                                                        rec.recomendacion
                                                                    }
                                                                </p>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>

                        {/* Botones de acción */}
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Link
                                href="/student/tests"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                <FileText className="h-5 w-5" />
                                Ver mis tests
                            </Link>

                            <Link
                                href="/student/dashboard"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                <Home className="h-5 w-5" />
                                Ir al inicio
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>
                        💡 Tip: Las habilidades blandas se desarrollan con
                        práctica constante y retroalimentación continua.
                    </p>
                </div>
            </div>
        </StudentLayout>
    );
}
