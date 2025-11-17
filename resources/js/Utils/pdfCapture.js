// ============================================================================
// ARCHIVO 1: pdfCapture.js
// ============================================================================
// PROPÓSITO: Funciones para capturar elementos del DOM y convertirlos a imágenes
// UBICACIÓN: src/utils/pdfCapture.js
// ============================================================================

import html2canvas from 'html2canvas';

/**
 * ✅ FUNCIÓN CRÍTICA: Preparar elemento para captura sin cortes
 *
 * Esta función prepara cualquier elemento del DOM para ser capturado como imagen
 * sin que se corte ninguna parte del contenido.
 *
 * @param {HTMLElement} element - Elemento del DOM a capturar
 * @param {Object} options - Opciones adicionales para html2canvas
 * @returns {Promise<HTMLCanvasElement|null>} Canvas con la imagen capturada
 */
export async function prepareAndCaptureElement(element, options = {}) {
    if (!element) {
        console.error('Elemento no encontrado');
        return null;
    }

    // 1. Ocultar elementos no deseados en PDF (íconos, marcas de verificación)
    const hideElements = element.querySelectorAll(
        '.text-green-600, .text-red-600, .fa-check, .fa-times',
    );
    const originalDisplay = [];
    hideElements.forEach((el, index) => {
        originalDisplay[index] = el.style.display;
        el.style.display = 'none';
    });

    // 2. Scroll del elemento al inicio (CRÍTICO para evitar cortes)
    element.scrollTop = 0;
    element.scrollLeft = 0;

    // 3. Buscar y resetear scroll en contenedores padres
    let parent = element.parentElement;
    while (parent) {
        parent.scrollTop = 0;
        parent.scrollLeft = 0;
        parent = parent.parentElement;
    }

    // 4. Guardar estilos originales antes de modificarlos
    const originalStyles = {
        overflow: element.style.overflow,
        overflowX: element.style.overflowX,
        overflowY: element.style.overflowY,
        maxHeight: element.style.maxHeight,
        height: element.style.height,
        position: element.style.position,
    };

    // 5. Forzar visibilidad total del contenido
    element.style.overflow = 'visible';
    element.style.overflowX = 'visible';
    element.style.overflowY = 'visible';
    element.style.maxHeight = 'none';
    element.style.height = 'auto';

    // 5.1 Forzar alineación vertical en celdas de tabla
    const tableCells = element.querySelectorAll('td');
    const cellStyles = [];
    tableCells.forEach((cell, index) => {
        cellStyles[index] = {
            element: cell,
            verticalAlign: cell.style.verticalAlign,
            display: cell.style.display,
        };
        cell.style.verticalAlign = 'middle';
        cell.style.display = 'table-cell';
    });

    // 6. Arreglar elementos hijos con overflow
    const allElements = element.querySelectorAll('*');
    const childStyles = [];

    allElements.forEach((child, index) => {
        const computedStyle = window.getComputedStyle(child);
        if (
            computedStyle.overflow !== 'visible' ||
            computedStyle.overflowX !== 'visible' ||
            computedStyle.overflowY !== 'visible'
        ) {
            childStyles[index] = {
                element: child,
                overflow: child.style.overflow,
                overflowX: child.style.overflowX,
                overflowY: child.style.overflowY,
            };

            child.style.overflow = 'visible';
            child.style.overflowX = 'visible';
            child.style.overflowY = 'visible';
        }
    });

    // 7. Esperar renderizado completo (dar tiempo al navegador)
    await new Promise((resolve) => setTimeout(resolve, 600));

    // 8. Obtener dimensiones reales del elemento
    const rect = element.getBoundingClientRect();
    const actualWidth = Math.max(
        element.scrollWidth,
        element.offsetWidth,
        rect.width,
    );
    const actualHeight = Math.max(
        element.scrollHeight,
        element.offsetHeight,
        rect.height,
    );

    console.log(`Capturando: ${actualWidth}x${actualHeight}`);

    // 9. Capturar con configuración óptima usando html2canvas
    const canvas = await html2canvas(element, {
        scale: options.scale || 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: false,
        removeContainer: true,
        imageTimeout: 0,
        width: actualWidth,
        height: actualHeight,
        windowWidth: actualWidth,
        windowHeight: actualHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        ...options,
    });

    // 10. Restaurar elementos que fueron ocultados
    hideElements.forEach((el, index) => {
        el.style.display = originalDisplay[index];
    });

    // 11. Restaurar estilos originales del elemento principal
    Object.keys(originalStyles).forEach((key) => {
        if (originalStyles[key] !== undefined && originalStyles[key] !== null) {
            element.style[key] = originalStyles[key];
        }
    });

    // 12. Restaurar estilos de elementos hijos
    childStyles.forEach((saved) => {
        if (saved && saved.element) {
            Object.keys(saved).forEach((key) => {
                if (key !== 'element' && saved[key] !== undefined) {
                    saved.element.style[key] = saved[key];
                }
            });
        }
    });

    // 13. Restaurar estilos de celdas de tabla
    cellStyles.forEach((saved) => {
        if (saved && saved.element) {
            Object.keys(saved).forEach((key) => {
                if (key !== 'element' && saved[key] !== undefined) {
                    saved.element.style[key] = saved[key];
                }
            });
        }
    });

    return canvas;
}

/**
 * Prepara la página completa para captura (resetea scroll global)
 *
 * @returns {Promise<void>}
 */
export async function preparePageForCapture() {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    await new Promise((resolve) => setTimeout(resolve, 300));
}
