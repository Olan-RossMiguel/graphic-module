// ============================================================================
// ARCHIVO 3: pdfLayoutHelpers.js
// ============================================================================
// PROPÓSITO: Funciones para crear y dar formato a los elementos del PDF
//            (portadas, encabezados, cajas de texto, pie de página)
// UBICACIÓN: src/utils/pdfLayoutHelpers.js
// ============================================================================

/**
 * ✅ Añadir imagen al PDF con control de páginas
 *
 * Añade una imagen (canvas) al PDF y verifica si hay espacio suficiente.
 * Si no cabe, crea una nueva página automáticamente.
 *
 * @param {jsPDF} pdf - Instancia del documento PDF
 * @param {HTMLCanvasElement} canvas - Canvas con la imagen a añadir
 * @param {number} margin - Márgenes del documento
 * @param {number} currentY - Posición Y actual en el PDF
 * @param {number} pageWidth - Ancho de la página
 * @param {number} pageHeight - Alto de la página
 * @returns {Object} - Objeto con newY (nueva posición Y) y addedPage (si se añadió página)
 */
export function addImageToPDF(
    pdf,
    canvas,
    margin,
    currentY,
    pageWidth,
    pageHeight,
) {
    // Convertir canvas a imagen en formato base64
    const imgData = canvas.toDataURL('image/png', 0.95);

    // Calcular dimensiones de la imagen respetando proporciones
    const imgWidth = pageWidth - 2 * margin;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let addedPage = false;

    // Verificar si la imagen cabe en la página actual
    if (currentY + imgHeight > pageHeight - margin) {
        pdf.addPage(); // Crear nueva página
        currentY = margin; // Resetear posición Y
        addedPage = true;
    }

    // Añadir la imagen al PDF
    pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);

    return {
        newY: currentY + imgHeight + 8, // Nueva posición Y con espaciado
        addedPage,
    };
}

/**
 * Crea la portada del PDF con diseño elegante
 *
 * Genera una página de portada con fondo azul, información del estudiante,
 * tipo de test, fecha de evaluación y puntuación total.
 *
 * @param {jsPDF} pdf - Instancia del documento PDF
 * @param {Object} student - Objeto con datos del estudiante
 * @param {Object} resultado - Objeto con resultados del test
 * @param {string} testType - Tipo de test (aprendizaje, emocional, habilidades)
 * @param {Object} testTypeNames - Nombres completos de los tipos de test
 * @param {number} pageWidth - Ancho de la página
 * @param {number} pageHeight - Alto de la página
 * @returns {void}
 */
export function createCoverPage(
    pdf,
    student,
    resultado,
    testType,
    testTypeNames,
    pageWidth,
    pageHeight,
) {
    // ===== FONDO AZUL COMPLETO =====
    pdf.setFillColor(41, 128, 185); // Color azul
    pdf.rect(0, 0, pageWidth, pageHeight, 'F'); // Rectángulo lleno

    // ===== CÍRCULO BLANCO CON ÍCONO =====
    pdf.setFillColor(255, 255, 255); // Color blanco
    pdf.circle(pageWidth / 2, 70, 25, 'F'); // Círculo centrado

    // Añadir emoji de gráfica
    pdf.setTextColor(41, 128, 185);
    pdf.setFontSize(50);
    pdf.text('📊', pageWidth / 2 - 15, 80);

    // ===== TÍTULO PRINCIPAL =====
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.text('Reporte de Resultados', pageWidth / 2, 130, { align: 'center' });

    // ===== SUBTÍTULO (TIPO DE TEST) =====
    pdf.setFontSize(20);
    pdf.text(testTypeNames[testType], pageWidth / 2, 145, { align: 'center' });

    // ===== LÍNEA DECORATIVA =====
    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(0.5);
    pdf.line(pageWidth / 2 - 60, 155, pageWidth / 2 + 60, 155);

    // ===== NOMBRE DEL ESTUDIANTE =====
    pdf.setFontSize(16);
    const nombreCompleto = [
        student.nombre,
        student.apellido_paterno,
        student.apellido_materno,
    ]
        .filter(Boolean) // Filtrar valores null/undefined
        .join(' ');
    pdf.text(`Estudiante: ${nombreCompleto}`, pageWidth / 2, 175, {
        align: 'center',
    });

    // ===== FECHA DE EVALUACIÓN =====
    pdf.setFontSize(14);
    const fechaFormato = new Date(resultado.fecha).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    pdf.text(`Evaluación: ${fechaFormato}`, pageWidth / 2, 190, {
        align: 'center',
    });

    // ===== CAJA DE PUNTUACIÓN =====
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(pageWidth / 2 - 50, 205, 100, 30, 5, 5, 'F'); // Rectángulo redondeado

    pdf.setTextColor(41, 128, 185);
    pdf.setFontSize(12);
    pdf.text('Puntuación Total', pageWidth / 2, 218, { align: 'center' });

    pdf.setFontSize(28);
    pdf.text(`${resultado.puntuacion}`, pageWidth / 2, 230, {
        align: 'center',
    });

    // ===== FECHA DE GENERACIÓN =====
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text(
        `Generado: ${new Date().toLocaleDateString('es-MX')}`,
        pageWidth / 2,
        270,
        {
            align: 'center',
        },
    );
}

/**
 * Añade una caja de texto con estilo al PDF
 *
 * Crea una caja coloreada con título y contenido de texto.
 * Útil para interpretaciones, recomendaciones y datos curiosos.
 *
 * @param {jsPDF} pdf - Instancia del documento PDF
 * @param {string} title - Título de la caja (ej: "💡 Interpretación")
 * @param {string} text - Texto contenido en la caja
 * @param {number} currentY - Posición Y actual
 * @param {number} margin - Márgenes del documento
 * @param {number} pageWidth - Ancho de la página
 * @param {number} pageHeight - Alto de la página
 * @param {Object} options - Opciones de estilo (bgColor, titleColor)
 * @returns {number} - Nueva posición Y después de añadir la caja
 */
export function addTextBox(
    pdf,
    title,
    text,
    currentY,
    margin,
    pageWidth,
    pageHeight,
    options,
) {
    const boxHeight = 45; // Altura fija de la caja

    // Verificar si hay espacio suficiente, sino crear nueva página
    if (currentY + boxHeight > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
    }

    // ===== DIBUJAR CAJA CON FONDO DE COLOR =====
    pdf.setFillColor(...options.bgColor); // Ejemplo: [232, 245, 233]
    pdf.roundedRect(
        margin,
        currentY,
        pageWidth - 2 * margin,
        boxHeight,
        3, // Radio de las esquinas
        3,
        'F', // 'F' = Fill (relleno)
    );

    // ===== TÍTULO DE LA CAJA =====
    pdf.setFontSize(12);
    pdf.setTextColor(...options.titleColor); // Ejemplo: [46, 125, 50]
    pdf.text(title, margin + 5, currentY + 8);

    // ===== CONTENIDO DE TEXTO =====
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0); // Negro

    // Dividir texto largo en múltiples líneas
    const splitText = pdf.splitTextToSize(text, pageWidth - 2 * margin - 10);
    pdf.text(splitText, margin + 5, currentY + 16);

    // Retornar nueva posición Y con espaciado adicional
    return currentY + boxHeight + 8;
}

/**
 * Añade pie de página a todas las páginas del PDF
 *
 * Recorre todas las páginas y añade numeración en el pie de página.
 *
 * @param {jsPDF} pdf - Instancia del documento PDF
 * @param {number} pageWidth - Ancho de la página
 * @param {number} pageHeight - Alto de la página
 * @returns {void}
 */
export function addPageFooters(pdf, pageWidth, pageHeight) {
    const totalPages = pdf.internal.getNumberOfPages();

    // Recorrer todas las páginas
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i); // Ir a la página i
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150); // Gris claro

        // Añadir texto centrado en el pie de página
        pdf.text(
            `Página ${i} de ${totalPages}`,
            pageWidth / 2,
            pageHeight - 8,
            {
                align: 'center',
            },
        );
    }
}

/**
 * Añade pie de página excluyendo la primera página (portada)
 *
 * Similar a addPageFooters pero omite la primera página,
 * útil cuando la primera página es una portada.
 *
 * @param {jsPDF} pdf - Instancia del documento PDF
 * @param {number} pageWidth - Ancho de la página
 * @param {number} pageHeight - Alto de la página
 * @returns {void}
 */
export function addPageFootersExceptFirst(pdf, pageWidth, pageHeight) {
    const totalPages = pdf.internal.getNumberOfPages();

    // Recorrer todas las páginas excepto la primera
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);

        if (i > 1) {
            // Omitir primera página
            pdf.setFontSize(8);
            pdf.setTextColor(150, 150, 150);
            pdf.text(
                `Página ${i} de ${totalPages}`,
                pageWidth / 2,
                pageHeight - 8,
                {
                    align: 'center',
                },
            );
        }
    }
}
