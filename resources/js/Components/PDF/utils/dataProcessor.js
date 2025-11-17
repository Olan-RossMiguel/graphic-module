// src/Components/PDF/utils/dataProcessor.js
const LEARNING_STYLES_NAMES = {
    visual: 'Visual',
    auditivo: 'Auditivo',
    lectura_escritura: 'Lectura/Escritura',
    'lectura-escritura': 'Lectura/Escritura',
    kinestesico: 'Kinestésico',
    kinestésico: 'Kinestésico',
};

const EMOTIONAL_INTELLIGENCE_NAMES = {
    autoconciencia: 'Autoconciencia',
    autorregulacion: 'Autorregulación',
    motivacion: 'Motivación',
    empatia: 'Empatía',
    habilidades_sociales: 'Habilidades Sociales',
};

const SOFT_SKILLS_NAMES = {
    comunicacion: 'Comunicación',
    trabajo_equipo: 'Trabajo en Equipo',
    resolucion_problemas: 'Resolución de Problemas',
    pensamiento_critico: 'Pensamiento Crítico',
    adaptabilidad: 'Adaptabilidad',
    gestion_tiempo: 'Gestión del Tiempo',
    liderazgo: 'Liderazgo',
    creatividad: 'Creatividad',
    manejo_estres: 'Manejo del Estrés',
    responsabilidad: 'Responsabilidad',
};

const COLORS = [
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

export const prepareChartData = (resultado, testType) => {
    let legendData = [];
    let tableData = [];

    if (testType === 'aprendizaje') {
        // Test de Estilos de Aprendizaje
        const estilos = resultado.data || {};
        const porcentajes = resultado.porcentajes || {};

        legendData = Object.keys(estilos).map((estilo, index) => ({
            name: LEARNING_STYLES_NAMES[estilo] || estilo,
            porcentaje: porcentajes[estilo] || 0,
            color: COLORS[index % COLORS.length],
        }));

        tableData = Object.keys(estilos).map((estilo, index) => ({
            name: LEARNING_STYLES_NAMES[estilo] || estilo,
            respuestas: estilos[estilo],
            color: COLORS[index % COLORS.length],
        }));
    } else if (testType === 'emocional') {
        // Test de Inteligencia Emocional
        const dimensiones = resultado.data || {};

        // Calcular porcentajes
        const total = Object.values(dimensiones).reduce(
            (sum, val) => sum + val,
            0,
        );

        legendData = Object.keys(dimensiones).map((dimension, index) => {
            const formattedDimension =
                EMOTIONAL_INTELLIGENCE_NAMES[dimension] ||
                dimension
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

            const percentage =
                total > 0
                    ? Math.round((dimensiones[dimension] / total) * 100)
                    : 0;

            return {
                name: formattedDimension,
                percentage: percentage,
                color: COLORS[index % COLORS.length],
            };
        });

        tableData = Object.keys(dimensiones).map((dimension, index) => {
            const formattedDimension =
                EMOTIONAL_INTELLIGENCE_NAMES[dimension] ||
                dimension
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

            return {
                name: formattedDimension,
                puntuacion: Math.round(dimensiones[dimension] * 100) / 100, // Redondear a 2 decimales
                color: COLORS[index % COLORS.length],
            };
        });
    } else if (testType === 'habilidades') {
        // Test de Habilidades Blandas
        const habilidades = resultado.data || {};

        // Calcular porcentajes
        const total = Object.values(habilidades).reduce(
            (sum, val) => sum + val,
            0,
        );

        legendData = Object.keys(habilidades).map((habilidad, index) => {
            const formattedHabilidad =
                SOFT_SKILLS_NAMES[habilidad] ||
                habilidad
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

            const percentage =
                total > 0
                    ? Math.round((habilidades[habilidad] / total) * 100)
                    : 0;

            return {
                name: formattedHabilidad,
                percentage: percentage,
                color: COLORS[index % COLORS.length],
            };
        });

        tableData = Object.keys(habilidades).map((habilidad, index) => {
            const formattedHabilidad =
                SOFT_SKILLS_NAMES[habilidad] ||
                habilidad
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

            return {
                name: formattedHabilidad,
                puntuacion: Math.round(habilidades[habilidad] * 100) / 100, // Redondear a 2 decimales
                color: COLORS[index % COLORS.length],
            };
        });
    } else {
        // Formato genérico para otros tests
        const data = resultado.data || {};

        const total = Object.values(data).reduce((sum, val) => sum + val, 0);

        legendData = Object.keys(data).map((key, index) => {
            const formattedKey = key
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            const percentage =
                total > 0 ? Math.round((data[key] / total) * 100) : 0;

            return {
                name: formattedKey,
                percentage: percentage,
                color: COLORS[index % COLORS.length],
            };
        });

        tableData = Object.keys(data).map((key, index) => {
            const formattedKey = key
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            return {
                name: formattedKey,
                puntuacion: data[key],
                color: COLORS[index % COLORS.length],
            };
        });
    }

    return { legendData, tableData };
};
