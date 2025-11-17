// ============================================================================
// ARCHIVO 5: pdfGenerator.js (PRINCIPAL)
// ============================================================================
// PROPÓSITO: Archivo principal que orquesta la generación de PDFs
//            Combina todas las funciones de los otros archivos
// UBICACIÓN: src/utils/pdfGenerator.js
// ============================================================================

import jsPDF from 'jspdf';

// ===== IMPORTAR FUNCIONES DE CAPTURA =====
import {
    prepareAndCaptureElement,
    preparePageForCapture,
} from './pdfCapture.js';

// ===== IMPORTAR FUNCIONES DE INTERFAZ =====
import {
    hideLoadingIndicator,
    showLoadingIndicator,
    showSuccessMessage,
} from './pdfUIHelpers.js';

// ===== IMPORTAR FUNCIONES DE LAYOUT =====
import {
    addImageToPDF,
    addPageFooters,
    addPageFootersExceptFirst,
    addTextBox,
    createCoverPage,
} from './pdfLayoutHelpers.js';

// ===== IMPORTAR FUNCIONES DE EXTRACCIÓN DE DATOS =====
import {
    extractResultInfo,
    extractStudentResult,
    generateDetailedFileName,
    generateFileName,
    getFullName,
} from './pdfDataExtractor.js';

// ===== NOMBRES DE TIPOS DE TEST =====
const testTypeNames = {
    aprendizaje: 'Estilos de Aprendizaje',
    emocional: 'Inteligencia Emocional',
    habilidades: 'Habilidades Blandas',
};

/**
 * Genera un reporte PDF en formato VERTICAL (versión estándar sin portada)
 *
 * Este es el reporte básico que incluye:
 * - Encabezado con información del estudiante
 * - Datos básicos (fecha, puntuación, total de preguntas)
 * - Gráfica de pie (más grande)
 * - Gráfica de barras
 * - Dato curioso
 *
 * @param {Object} student - Objeto con datos del estudiante
 * @param {string} testType - Tipo de test ('aprendizaje', 'emocional', 'habilidades')
 * @returns {Promise<void>}
 */
export const generateStudentReport = async (student, testType) => {
    try {
        showLoadingIndicator();

        // ===== CREAR PDF EN FORMATO VERTICAL =====
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true,
        });

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 15;
        let currentY = margin;

        // ===== ENCABEZADO AZUL =====
        pdf.setFillColor(41, 128, 185);
        pdf.rect(0, 0, pageWidth, 40, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(20);
        pdf.text(testTypeNames[testType], pageWidth / 2, 15, {
            align: 'center',
        });

        pdf.setFontSize(14);
        const nombreCompleto = getFullName(student);
        pdf.text(nombreCompleto, pageWidth / 2, 25, { align: 'center' });

        pdf.setFontSize(10);
        const fecha = new Date().toLocaleDateString('es-MX');
        pdf.text(`Generado: ${fecha}`, pageWidth / 2, 33, { align: 'center' });

        currentY = 50;

        // ===== PREPARAR PÁGINA PARA CAPTURA =====
        await preparePageForCapture();

        // ===== OBTENER ELEMENTO PRINCIPAL =====
        const mainElement = document.getElementById(
            `${testType}-report-content`,
        );

        if (!mainElement) {
            hideLoadingIndicator();
            alert('No se encontró el contenido para generar el PDF');
            return;
        }

        // ===== EXTRAER DATOS DEL RESULTADO =====
        const resultado = extractStudentResult(student, testType);
        const { fechaRealizacion, puntuacionTotal, totalRespuestas } =
            extractResultInfo(resultado, mainElement);

        // ===== AGREGAR INFORMACIÓN BÁSICA CON FORMATO =====
        pdf.setTextColor(0, 0, 0);

        // Fecha de realización
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Fecha de realización:', margin, currentY);
        pdf.setFont(undefined, 'normal');
        pdf.text(fechaRealizacion, margin + 55, currentY);
        currentY += 8;

        // Puntuación total
        pdf.setFont(undefined, 'bold');
        pdf.text('Puntuación total:', margin, currentY);
        pdf.setFont(undefined, 'normal');
        pdf.text(puntuacionTotal, margin + 45, currentY);
        currentY += 8;

        // Total de preguntas - SIEMPRE MOSTRAR
        pdf.setFont(undefined, 'bold');
        pdf.text('Total de preguntas:', margin, currentY);
        pdf.setFont(undefined, 'normal');
        pdf.text(totalRespuestas || 'N/A', margin + 50, currentY);
        currentY += 8;

        currentY += 15;

        // ===== CAPTURAR GRÁFICA DE PIE (MÁS GRANDE) =====
        // ===== CAPTURAR GRÁFICA DE PIE (SOLO EL GRÁFICO, SIN LEYENDA) =====
        const pieElement = document.getElementById(`${testType}-pie-chart`);

        if (pieElement) {
            console.log('Capturando gráfica de pie...');

            // 1. OCULTAR LA LEYENDA TEMPORALMENTE
            const legend = pieElement.querySelector('.mb-6.grid');
            const originalLegendDisplay = legend ? legend.style.display : null;
            if (legend) {
                legend.style.display = 'none';
            }

            // 2. AUMENTAR TAMAÑO DEL CONTENEDOR DE LA GRÁFICA
            const chartContainer = pieElement.querySelector('.h-96');
            const originalChartStyles = {
                height: chartContainer?.style.height,
                minHeight: chartContainer?.style.minHeight,
            };

            if (chartContainer) {
                chartContainer.style.height = '1200px';
                chartContainer.style.minHeight = '1200px';
            }

            // Esperar a que se renderice
            await new Promise((resolve) => setTimeout(resolve, 800));

            // 3. CAPTURAR SOLO LA GRÁFICA (sin leyenda)
            const canvas = await prepareAndCaptureElement(pieElement, {
                scale: 6,
            });

            // 4. RESTAURAR ESTILOS
            if (legend) {
                legend.style.display = originalLegendDisplay;
            }
            if (chartContainer) {
                chartContainer.style.height = originalChartStyles.height;
                chartContainer.style.minHeight = originalChartStyles.minHeight;
            }

            if (canvas) {
                const imgData = canvas.toDataURL('image/png', 1.0);

                // Que ocupe TODO el ancho disponible
                const imgWidth = pageWidth - 2 * margin;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                // Nueva página si no cabe
                if (currentY + imgHeight > pageHeight - margin) {
                    pdf.addPage();
                    currentY = margin;
                }

                pdf.addImage(
                    imgData,
                    'PNG',
                    margin,
                    currentY,
                    imgWidth,
                    imgHeight,
                );
                currentY += imgHeight + 15;
            }

            // 5. AHORA CAPTURAR LA LEYENDA POR SEPARADO (MÁS GRANDE)
            if (legend) {
                console.log('Capturando leyenda de porcentajes...');

                // Hacer la leyenda más grande temporalmente
                const originalFontSize = legend.style.fontSize;
                const legendItems =
                    legend.querySelectorAll('.flex.items-center');

                legend.style.fontSize = '18px';
                legendItems.forEach((item) => {
                    item.style.fontSize = '18px';
                    const texts = item.querySelectorAll('p');
                    texts.forEach((text) => {
                        text.style.fontSize = '16px';
                    });
                });

                await new Promise((resolve) => setTimeout(resolve, 300));

                const legendCanvas = await prepareAndCaptureElement(legend, {
                    scale: 3,
                });

                // Restaurar
                legend.style.fontSize = originalFontSize;
                legendItems.forEach((item) => {
                    item.style.fontSize = '';
                    const texts = item.querySelectorAll('p');
                    texts.forEach((text) => {
                        text.style.fontSize = '';
                    });
                });

                if (legendCanvas) {
                    const legendImgData = legendCanvas.toDataURL(
                        'image/png',
                        0.95,
                    );
                    const legendImgWidth = pageWidth - 2 * margin;
                    const legendImgHeight =
                        (legendCanvas.height * legendImgWidth) /
                        legendCanvas.width;

                    if (currentY + legendImgHeight > pageHeight - margin) {
                        pdf.addPage();
                        currentY = margin;
                    }

                    pdf.addImage(
                        legendImgData,
                        'PNG',
                        margin,
                        currentY,
                        legendImgWidth,
                        legendImgHeight,
                    );
                    currentY += legendImgHeight + 15;
                }
            }
        }

        // ===== CAPTURAR GRÁFICA DE BARRAS =====
        const barElement = document.getElementById(`${testType}-bar-chart`);

        if (barElement) {
            console.log('Capturando gráfica de barras...');

            // Nueva página para la gráfica de barras
            pdf.addPage();
            currentY = margin;

            const canvas = await prepareAndCaptureElement(barElement, {
                scale: 3.5,
            });
            if (canvas) {
                const imgData = canvas.toDataURL('image/png', 0.95);
                const imgWidth = pageWidth - 2 * margin;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(
                    imgData,
                    'PNG',
                    margin,
                    currentY,
                    imgWidth,
                    imgHeight,
                );
                currentY += imgHeight + 10;
            }
        }

        // ===== CAPTURAR DATO CURIOSO =====
        const datoCuriosoBox = mainElement.querySelector(
            '.rounded-lg.bg-purple-50',
        );

        if (datoCuriosoBox) {
            console.log('Capturando dato curioso...');

            // Nueva página si no hay espacio
            if (currentY > pageHeight - 80) {
                pdf.addPage();
                currentY = margin;
            }

            const canvas = await prepareAndCaptureElement(datoCuriosoBox, {
                scale: 2,
            });
            if (canvas) {
                const imgData = canvas.toDataURL('image/png', 0.95);
                const imgWidth = pageWidth - 2 * margin;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(
                    imgData,
                    'PNG',
                    margin,
                    currentY,
                    imgWidth,
                    imgHeight,
                );
                currentY += imgHeight + 5;
            }
        }

        // ===== PIE DE PÁGINA =====
        addPageFooters(pdf, pageWidth, pageHeight);

        // ===== CONFIGURAR PROPIEDADES DEL PDF =====
        pdf.setProperties({
            title: `Reporte ${testTypeNames[testType]} - ${nombreCompleto}`,
            subject: `Resultados de ${testTypeNames[testType]}`,
            author: 'Sistema de Tutorías',
            creator: 'Sistema de Tutorías',
        });

        // ===== GUARDAR PDF =====
        const fileName = generateFileName(
            testTypeNames[testType],
            student.nombre,
        );
        pdf.save(fileName);

        hideLoadingIndicator();
        showSuccessMessage('✓ Reporte generado exitosamente');
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        hideLoadingIndicator();
        alert(
            'Hubo un error al generar el reporte. Por favor, intenta de nuevo.',
        );
    }
};

/**
 * Genera un reporte PDF personalizado con portada
 *
 * Este es el reporte completo que incluye:
 * - Portada elegante con fondo azul
 * - Gráficas (pie y barras)
 * - Análisis y recomendaciones
 * - Dato curioso
 *
 * @param {Object} student - Objeto con datos del estudiante
 * @param {Object} resultado - Objeto con resultados del test
 * @param {string} testType - Tipo de test ('aprendizaje', 'emocional', 'habilidades')
 * @returns {Promise<void>}
 */
export const generateCustomReport = async (student, resultado, testType) => {
    try {
        showLoadingIndicator();

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true,
        });

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 15;

        // ===== PÁGINA 1: PORTADA =====
        createCoverPage(
            pdf,
            student,
            resultado,
            testType,
            testTypeNames,
            pageWidth,
            pageHeight,
        );

        // ===== PREPARAR PÁGINA =====
        await preparePageForCapture();

        // ===== PÁGINAS SIGUIENTES: CONTENIDO =====
        pdf.addPage();
        let currentY = margin;

        pdf.setFillColor(41, 128, 185);
        pdf.rect(0, 0, pageWidth, 25, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.text(testTypeNames[testType], margin, 15);

        pdf.setFontSize(10);
        const nombreCompleto = getFullName(student);
        pdf.text(nombreCompleto, pageWidth - margin, 15, { align: 'right' });

        currentY = 35;

        // ===== CAPTURAR GRÁFICAS =====
        const pieElement = document.getElementById(`${testType}-pie-chart`);
        if (pieElement) {
            const canvas = await prepareAndCaptureElement(pieElement, {
                scale: 2.5,
            });
            if (canvas) {
                const result = addImageToPDF(
                    pdf,
                    canvas,
                    margin,
                    currentY,
                    pageWidth,
                    pageHeight,
                );
                currentY = result.newY;
            }
        }

        const barElement = document.getElementById(`${testType}-bar-chart`);
        if (barElement) {
            const canvas = await prepareAndCaptureElement(barElement, {
                scale: 2.5,
            });
            if (canvas) {
                const result = addImageToPDF(
                    pdf,
                    canvas,
                    margin,
                    currentY,
                    pageWidth,
                    pageHeight,
                );
                currentY = result.newY;
            }
        }

        // ===== ANÁLISIS Y RECOMENDACIONES =====
        if (
            resultado.interpretacion ||
            resultado.recomendaciones ||
            resultado.dato_curioso
        ) {
            pdf.addPage();
            currentY = margin;

            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(18);
            pdf.text('Análisis y Recomendaciones', margin, currentY);
            currentY += 12;

            if (resultado.interpretacion?.descripcion) {
                currentY = addTextBox(
                    pdf,
                    '💡 Interpretación',
                    resultado.interpretacion.descripcion,
                    currentY,
                    margin,
                    pageWidth,
                    pageHeight,
                    { bgColor: [232, 245, 233], titleColor: [46, 125, 50] },
                );
            }

            if (resultado.recomendaciones) {
                if (currentY > pageHeight - 60) {
                    pdf.addPage();
                    currentY = margin;
                }
                currentY = addTextBox(
                    pdf,
                    '📋 Recomendaciones',
                    resultado.recomendaciones,
                    currentY,
                    margin,
                    pageWidth,
                    pageHeight,
                    { bgColor: [227, 242, 253], titleColor: [13, 71, 161] },
                );
            }

            if (resultado.dato_curioso && currentY < pageHeight - 50) {
                currentY = addTextBox(
                    pdf,
                    '✨ Dato Curioso',
                    resultado.dato_curioso,
                    currentY,
                    margin,
                    pageWidth,
                    pageHeight,
                    { bgColor: [255, 243, 224], titleColor: [230, 81, 0] },
                );
            }
        }

        // ===== PIE DE PÁGINA (excepto portada) =====
        addPageFootersExceptFirst(pdf, pageWidth, pageHeight);

        // ===== GUARDAR PDF =====
        const fileName = generateDetailedFileName(
            testTypeNames[testType],
            student.nombre,
        );
        pdf.save(fileName);

        hideLoadingIndicator();
        showSuccessMessage('✓ Reporte personalizado generado');
    } catch (error) {
        console.error('Error al generar el reporte personalizado:', error);
        hideLoadingIndicator();
        alert('Hubo un error al generar el reporte personalizado.');
    }
};
