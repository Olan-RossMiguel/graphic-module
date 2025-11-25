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

const PSYCHOLOGICAL_ASSISTANCE_NAMES = {
    bienestar_general: 'Bienestar General',
    atencion_externa: 'Atención Externa',
    disposicion_ayuda: 'Disposición a Ayuda',
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

const ASSISTANCE_COLORS = {
    bienestar_general: '#FF6B6B',
    atencion_externa: '#4ECDC4',
    disposicion_ayuda: '#51CF66',
};

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
                puntuacion: Math.round(dimensiones[dimension] * 100) / 100,
                color: COLORS[index % COLORS.length],
            };
        });
    } else if (testType === 'habilidades') {
        // Test de Habilidades Blandas
        const habilidades = resultado.data || {};
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
                puntuacion: Math.round(habilidades[habilidad] * 100) / 100,
                color: COLORS[index % COLORS.length],
            };
        });
    } else if (testType === 'asistencia') {
        // ✅ NUEVO: Test de Asistencia Psicológica
        const categorias = resultado.data || {};

        legendData = Object.keys(categorias).map((categoria) => ({
            name: PSYCHOLOGICAL_ASSISTANCE_NAMES[categoria] || categoria,
            puntuacion: categorias[categoria],
            color: ASSISTANCE_COLORS[categoria] || '#8884D8',
        }));

        tableData = Object.keys(categorias).map((categoria) => ({
            name: PSYCHOLOGICAL_ASSISTANCE_NAMES[categoria] || categoria,
            puntuacion: categorias[categoria],
            color: ASSISTANCE_COLORS[categoria] || '#8884D8',
        }));
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

// ✅ NUEVA FUNCIÓN: Preparar datos de respuestas individuales
export const prepareIndividualResponses = (resultado) => {
    const respuestas = resultado.respuestas || {};

    // Mapeo de preguntas
    const preguntasMap = {
        pregunta_1: {
            texto: '¿Actualmente asistes a un psicólogo fuera de la institución?',
            tipo: 'contexto',
            respuestas: { 1: 'Sí', 0: 'No' },
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
        },
        pregunta_5: {
            texto: 'En caso de necesitarlo, ¿estarías dispuesto a continuar o retomar la atención psicológica externa?',
            tipo: 'contexto',
            respuestas: { 1: 'Sí', 0: 'No', 0.5: 'No estoy seguro' },
        },
        pregunta_6: {
            texto: 'En los últimos meses me he sentido con demasiado estrés por la carga académica',
            tipo: 'likert',
            escala: 'negativa',
        },
        pregunta_7: {
            texto: 'He experimentado ansiedad, nerviosismo o preocupación excesiva durante la carrera',
            tipo: 'likert',
            escala: 'negativa',
        },
        pregunta_8: {
            texto: 'He tenido problemas de sueño (insomnio, dificultad para descansar)',
            tipo: 'likert',
            escala: 'negativa',
        },
        pregunta_9: {
            texto: 'Me siento motivado y con energía para realizar mis actividades diarias',
            tipo: 'likert',
            escala: 'positiva',
        },
        pregunta_10: {
            texto: 'He tenido cambios de humor frecuentes o dificultad para controlar mis emociones',
            tipo: 'likert',
            escala: 'negativa',
        },
        pregunta_11: {
            texto: 'Cuento con alguien de confianza (amigo, familia, docente) con quien puedo hablar de mis problemas',
            tipo: 'likert',
            escala: 'positiva',
        },
        pregunta_12: {
            texto: 'He acudido al psicólogo en algún momento durante mi carrera',
            tipo: 'likert',
            escala: 'positiva',
        },
        pregunta_13: {
            texto: 'Considero que la atención psicológica es importante para los estudiantes universitarios',
            tipo: 'likert',
            escala: 'positiva',
        },
        pregunta_14: {
            texto: 'Si me sintiera mal emocionalmente, buscaría ayuda profesional',
            tipo: 'likert',
            escala: 'positiva',
        },
        pregunta_15: {
            texto: 'Actualmente siento que mi estado de salud mental me permite continuar con mis estudios',
            tipo: 'likert',
            escala: 'positiva',
        },
    };

    const escalaLikert = {
        1: 'Nunca',
        2: 'Casi nunca',
        3: 'A veces',
        4: 'Casi siempre',
        5: 'Siempre',
    };

    const contexto = [];
    const likert = [];

    Object.entries(respuestas)
        .sort(([keyA], [keyB]) => {
            const numA = parseInt(keyA.replace('pregunta_', ''));
            const numB = parseInt(keyB.replace('pregunta_', ''));
            return numA - numB;
        })
        .forEach(([key, valorRaw]) => {
            const pregunta = preguntasMap[key];
            if (!pregunta) return;

            // Extraer valor (manejar objetos y números)
            const valor =
                typeof valorRaw === 'object' &&
                valorRaw !== null &&
                'respuesta' in valorRaw
                    ? parseFloat(valorRaw.respuesta)
                    : parseFloat(valorRaw);

            const numPregunta = parseInt(key.replace('pregunta_', ''));

            if (pregunta.tipo === 'contexto') {
                contexto.push({
                    numero: numPregunta,
                    texto: pregunta.texto,
                    respuesta: pregunta.respuestas[valor] || `Valor: ${valor}`,
                });
            } else {
                likert.push({
                    numero: numPregunta,
                    texto: pregunta.texto,
                    valor: valor,
                    textoValor: escalaLikert[valor] || '',
                    escala: pregunta.escala,
                });
            }
        });

    return { contexto, likert };
};
