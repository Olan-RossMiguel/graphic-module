import StudentLayout from '@/Layouts/UI/StudentLayout';
import { Link, usePage } from '@inertiajs/react';
import { Award, Brain, CheckCircle, FileText, Home } from 'lucide-react';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

export default function TestCompletedLearningStyles({
    test,
    result,
    chartData,
    insights,
}) {
    const { props } = usePage();

    // Colores para la gráfica de pastel
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

    // Renderizado personalizado de la leyenda
    const renderLegend = (props) => {
        const { payload } = props;
        return (
            <ul className="flex flex-wrap justify-center gap-3 text-sm">
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

    // Mapeo de estilos a emojis
    const styleEmojis = {
        visual: '👁️',
        auditivo: '🎵',
        lectura_escritura: '📚',
        kinestesico: '🤸',
    };

    return (
        <StudentLayout user={props?.auth?.user}>
            <div className="mx-auto max-w-6xl py-12">
                {/* Card principal */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    {/* Header con ícono de éxito */}
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-12 text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <CheckCircle
                                className="h-12 w-12 text-white"
                                strokeWidth={2.5}
                            />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-white">
                            ¡Test de Estilos de Aprendizaje Completado!
                        </h1>
                        <p className="text-lg text-purple-50">
                            Descubre cómo aprendes mejor
                        </p>
                    </div>

                    {/* Contenido */}
                    <div className="px-8 py-8">
                        {/* Estilo Dominante Destacado */}
                        {result?.estilo_dominante && (
                            <div className="mb-8 rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 shadow-sm">
                                <div className="mb-4 flex items-center justify-center gap-3">
                                    <div className="rounded-full bg-purple-600 p-3">
                                        <Brain className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-purple-600">
                                            Tu estilo dominante es:
                                        </p>
                                        <h2 className="text-3xl font-bold capitalize text-purple-900">
                                            {styleEmojis[
                                                result.estilo_dominante
                                            ] || '🎯'}{' '}
                                            {result.estilo_dominante.replace(
                                                '_',
                                                ' ',
                                            )}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Grid de dos columnas */}
                        <div className="grid gap-8 lg:grid-cols-2">
                            {/* Columna izquierda: Dato curioso y detalles */}
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
                                            {result.puntuacion_total !==
                                                undefined && (
                                                <p>
                                                    <span className="font-medium">
                                                        Respuestas dominantes:
                                                    </span>{' '}
                                                    <span className="text-lg font-bold text-purple-600">
                                                        {
                                                            result.puntuacion_total
                                                        }
                                                    </span>
                                                </p>
                                            )}
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
                                        Utiliza esta información para optimizar
                                        tu forma de estudiar.
                                    </p>
                                </div>
                            </div>

                            {/* Columna derecha: Gráfica de pastel */}
                            {chartData && chartData.length > 0 && (
                                <div className="flex flex-col">
                                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                        <h3 className="mb-4 text-center text-lg font-semibold text-gray-900">
                                            Distribución de Estilos
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
                                                            ? `${name}: ${(percent * 100).toFixed(0)}%`
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
                                                        `${value} respuestas`,
                                                        'Cantidad',
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

                                    {/* Estadísticas adicionales */}
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        {chartData.map((item, index) => (
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
                                                    respuestas
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botones de acción */}
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Link
                                href="/student/tests"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700"
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
                        💡 Tip: Combina diferentes estilos de aprendizaje para
                        maximizar tu potencial.
                    </p>
                </div>
            </div>
        </StudentLayout>
    );
}
