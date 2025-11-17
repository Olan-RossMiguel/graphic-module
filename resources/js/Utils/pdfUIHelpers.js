// ============================================================================
// ARCHIVO 2: pdfUIHelpers.js
// ============================================================================
// PROPÓSITO: Funciones para mostrar indicadores visuales en la interfaz
//            (pantalla de carga, mensajes de éxito/error)
// UBICACIÓN: src/utils/pdfUIHelpers.js
// ============================================================================

/**
 * Muestra un indicador de carga mientras se genera el PDF
 *
 * Crea un overlay oscuro con un spinner animado y mensaje de "Generando reporte PDF..."
 * Este indicador se muestra en pantalla completa con z-index alto para estar
 * por encima de todos los demás elementos.
 *
 * @returns {void}
 */
export function showLoadingIndicator() {
    // Crear elemento div para el indicador de carga
    const loading = document.createElement('div');
    loading.id = 'pdf-loading-indicator'; // ID único para poder removerlo después

    // HTML inline con estilos para el overlay y spinner
    loading.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.75);
            display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(4px);">
            <div style="background: white; padding: 40px 50px; border-radius: 12px; text-align: center;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); max-width: 400px;">
                
                <!-- Spinner animado -->
                <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db;
                    border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                
                <!-- Mensaje principal -->
                <p style="margin: 0 0 10px; font-size: 18px; color: #333; font-weight: 600;">Generando reporte PDF...</p>
                
                <!-- Mensaje secundario -->
                <p style="margin: 0; font-size: 13px; color: #666;">Esto puede tomar unos segundos</p>
            </div>
        </div>
        
        <!-- Animación CSS para el spinner -->
        <style>
            @keyframes spin { 
                0% { transform: rotate(0deg); } 
                100% { transform: rotate(360deg); } 
            }
        </style>
    `;

    // Añadir el indicador al body del documento
    document.body.appendChild(loading);
}

/**
 * Oculta el indicador de carga
 *
 * Busca el elemento con id 'pdf-loading-indicator' y lo remueve del DOM
 *
 * @returns {void}
 */
export function hideLoadingIndicator() {
    const loading = document.getElementById('pdf-loading-indicator');
    if (loading) {
        loading.remove(); // Remover completamente del DOM
    }
}

/**
 * Muestra un mensaje de éxito temporal (toast notification)
 *
 * Crea una notificación tipo toast en la esquina superior derecha que aparece
 * con animación de deslizamiento, permanece 3 segundos y luego se oculta.
 *
 * @param {string} message - Mensaje a mostrar en la notificación
 * @returns {void}
 */
export function showSuccessMessage(message) {
    // Crear elemento div para el toast
    const toast = document.createElement('div');
    toast.id = 'pdf-success-toast'; // ID único

    // HTML inline con estilos para el toast de éxito
    toast.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; 
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white; padding: 16px 24px; border-radius: 10px; 
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
            z-index: 10000; animation: slideIn 0.3s ease-out; min-width: 300px;">
            
            <div style="display: flex; align-items: center; gap: 12px;">
                <!-- Ícono de checkmark -->
                <span style="font-size: 24px; background: rgba(255, 255, 255, 0.2); 
                    width: 32px; height: 32px; display: flex; align-items: center; 
                    justify-content: center; border-radius: 50%;">✓</span>
                
                <!-- Mensaje de éxito -->
                <span style="font-weight: 500; font-size: 14px;">${message}</span>
            </div>
        </div>
        
        <!-- Animación CSS para el deslizamiento -->
        <style>
            @keyframes slideIn { 
                from { 
                    transform: translateX(400px); 
                    opacity: 0; 
                }
                to { 
                    transform: translateX(0); 
                    opacity: 1; 
                } 
            }
        </style>
    `;

    // Añadir el toast al body
    document.body.appendChild(toast);

    // Después de 3 segundos, animar la salida y remover el elemento
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse'; // Animación reversa
        setTimeout(() => toast.remove(), 300); // Remover después de la animación
    }, 3000);
}
