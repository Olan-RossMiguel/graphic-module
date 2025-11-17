// ============================================================================
// ARCHIVO 4: pdfDataExtractor.js
// ============================================================================
// PROPÓSITO: Funciones para extraer y procesar datos del estudiante y resultados
//            Maneja diferentes estructuras de datos y extracción desde el DOM
// UBICACIÓN: src/utils/pdfDataExtractor.js
// ============================================================================

/**
 * Extrae los resultados del estudiante desde múltiples ubicaciones posibles
 *
 * Intenta encontrar el resultado del test en diferentes ubicaciones del objeto student,
 * ya que la estructura de datos puede variar dependiendo de cómo se obtuvo la información.
 *
 * Posibles ubicaciones:
 * - student.resultados[testType]
 * - student[testType]
 * - student.resultado
 *
 * @param {Object} student - Objeto con toda la información del estudiante
 * @param {string} testType - Tipo de test ('aprendizaje', 'emocional', 'habilidades')
 * @returns {Object|null} - Objeto con los resultados del test o null si no se encuentra
 */
export function extractStudentResult(student, testType) {
    let resultado = null;

    // Intentar diferentes ubicaciones del resultado

    // Ubicación 1: student.resultados.testType
    if (student.resultados?.[testType]) {
        resultado = student.resultados[testType];
    }
    // Ubicación 2: student.testType (directamente en el objeto)
    else if (student[testType]) {
        resultado = student[testType];
    }
    // Ubicación 3: student.resultado (resultado genérico)
    else if (student.resultado) {
        resultado = student.resultado;
    }

    // Logs para debugging
    console.log('Datos del estudiante:', student);
    console.log('Resultado encontrado:', resultado);

    return resultado;
}

/**
 * Extrae información básica del resultado (fecha, puntuación, respuestas)
 *
 * Si encuentra el objeto resultado, extrae los datos directamente.
 * Si no lo encuentra, intenta extraer la información del DOM.
 *
 * @param {Object|null} resultado - Objeto con los resultados del test
 * @param {HTMLElement} mainElement - Elemento principal del DOM donde buscar
 * @returns {Object} - Objeto con fechaRealizacion, puntuacionTotal, totalRespuestas
 */
export function extractResultInfo(resultado, mainElement) {
    let fechaRealizacion, puntuacionTotal, totalRespuestas;

    if (resultado) {
        // ===== EXTRAER DATOS DEL OBJETO RESULTADO =====

        // Fecha: convertir a formato legible en español
        fechaRealizacion = new Date(resultado.fecha).toLocaleDateString(
            'es-MX',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            },
        );

        // Puntuación: buscar en diferentes propiedades posibles
        puntuacionTotal = String(
            resultado.puntuacion || resultado.puntuacion_total || 0,
        );

        // Total de respuestas (opcional)
        totalRespuestas = String(resultado.total_respuestas || 'N/A');
    } else {
        // ===== EXTRAER DATOS DEL DOM SI NO HAY OBJETO RESULTADO =====

        // Buscar todos los elementos <strong> dentro de párrafos
        const infoTexts = mainElement.querySelectorAll('p strong');

        infoTexts.forEach((strong) => {
            const text = strong.parentElement.textContent;

            // Buscar "Fecha de realización:"
            if (text.includes('Fecha de realización:')) {
                fechaRealizacion = text.split(':')[1].trim();
            }

            // Buscar "Puntuación total:"
            if (text.includes('Puntuación total:')) {
                puntuacionTotal = text.split(':')[1].trim();
            }

            // Buscar "Total de respuestas:"
            if (text.includes('Total de respuestas:')) {
                totalRespuestas = text.split(':')[1].trim();
            }
        });

        // ===== VALORES POR DEFECTO SI NO SE ENCUENTRA NADA =====
        if (!fechaRealizacion)
            fechaRealizacion = new Date().toLocaleDateString('es-MX');
        if (!puntuacionTotal) puntuacionTotal = 'N/A';
    }

    return {
        fechaRealizacion,
        puntuacionTotal,
        totalRespuestas,
    };
}

/**
 * Obtiene el nombre completo del estudiante
 *
 * Concatena nombre, apellido paterno y apellido materno,
 * filtrando valores null/undefined.
 *
 * @param {Object} student - Objeto con datos del estudiante
 * @returns {string} - Nombre completo del estudiante
 */
export function getFullName(student) {
    return [student.nombre, student.apellido_paterno, student.apellido_materno]
        .filter(Boolean) // Filtrar null, undefined, "" (valores falsy)
        .join(' '); // Unir con espacios
}

/**
 * Genera el nombre del archivo PDF estándar
 *
 * Formato: Reporte_TipoTest_NombreEstudiante_YYYY-MM-DD.pdf
 * Ejemplo: Reporte_Estilos_de_Aprendizaje_Juan_Perez_2024-03-15.pdf
 *
 * @param {string} testTypeName - Nombre completo del tipo de test
 * @param {string} studentName - Nombre del estudiante
 * @returns {string} - Nombre del archivo PDF
 */
export function generateFileName(testTypeName, studentName) {
    // Obtener fecha en formato ISO (YYYY-MM-DD)
    const fechaArchivo = new Date().toISOString().split('T')[0];

    // Limpiar nombre (reemplazar espacios por guiones bajos)
    const nombreLimpio = studentName.replace(/\s+/g, '_');

    // Construir nombre del archivo
    return `Reporte_${testTypeName.replace(/\s+/g, '_')}_${nombreLimpio}_${fechaArchivo}.pdf`;
}

/**
 * Genera el nombre del archivo PDF detallado (con portada)
 *
 * Formato: Reporte_Detallado_TipoTest_NombreEstudiante_YYYY-MM-DD.pdf
 * Ejemplo: Reporte_Detallado_Estilos_de_Aprendizaje_Juan_Perez_2024-03-15.pdf
 *
 * @param {string} testTypeName - Nombre completo del tipo de test
 * @param {string} studentName - Nombre del estudiante
 * @returns {string} - Nombre del archivo PDF detallado
 */
export function generateDetailedFileName(testTypeName, studentName) {
    // Obtener fecha en formato ISO (YYYY-MM-DD)
    const fechaArchivo = new Date().toISOString().split('T')[0];

    // Limpiar nombre (reemplazar espacios por guiones bajos)
    const nombreLimpio = studentName.replace(/\s+/g, '_');

    // Construir nombre del archivo con prefijo "Detallado"
    return `Reporte_Detallado_${testTypeName.replace(/\s+/g, '_')}_${nombreLimpio}_${fechaArchivo}.pdf`;
}
