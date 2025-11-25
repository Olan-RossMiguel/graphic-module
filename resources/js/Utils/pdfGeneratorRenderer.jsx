// ============================================================================
// ARCHIVO: src/Utils/pdfGeneratorRenderer.jsx
// ============================================================================

import { pdf } from '@react-pdf/renderer';
import React from 'react';

const testTypeNames = {
    aprendizaje: 'Estilos de Aprendizaje',
    emocional: 'Inteligencia Emocional',
    habilidades: 'Habilidades Blandas',
    asistencia: 'Asistencia Psicológica', // ✅ AGREGADO
};

const showLoadingIndicator = () => {
    const loading = document.createElement('div');
    loading.id = 'pdf-loading-indicator';
    loading.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.75);
            display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(4px);">
            <div style="background: white; padding: 40px 50px; border-radius: 12px; text-align: center;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); max-width: 400px;">
                <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db;
                    border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <p style="margin: 0 0 10px; font-size: 18px; color: #333; font-weight: 600;">Generando reporte PDF...</p>
                <p style="margin: 0; font-size: 13px; color: #666;">Esto puede tomar unos segundos</p>
            </div>
        </div>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    `;
    document.body.appendChild(loading);
};

const hideLoadingIndicator = () => {
    const loading = document.getElementById('pdf-loading-indicator');
    if (loading) loading.remove();
};

const showSuccessMessage = (message) => {
    const toast = document.createElement('div');
    toast.id = 'pdf-success-toast';
    toast.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white; padding: 16px 24px; border-radius: 10px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
            z-index: 10000; animation: slideIn 0.3s ease-out; min-width: 300px;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 24px; background: rgba(255, 255, 255, 0.2); width: 32px; height: 32px;
                    display: flex; align-items: center; justify-content: center; border-radius: 50%;">✓</span>
                <span style="font-weight: 500; font-size: 14px;">${message}</span>
            </div>
        </div>
        <style>@keyframes slideIn { from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; } }</style>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// ✅ FUNCIÓN MEJORADA: Manejo seguro de propiedades undefined
const generateFileName = (testTypeName, student) => {
    const fechaArchivo = new Date().toISOString().split('T')[0];

    // Construir nombre completo de forma segura
    const nombre = student?.nombre || 'Sin';
    const apellidoPaterno = student?.apellido_paterno || 'Nombre';
    const apellidoMaterno = student?.apellido_materno || '';

    const nombreCompleto = [nombre, apellidoPaterno, apellidoMaterno]
        .filter(Boolean)
        .join('_')
        .replace(/\s+/g, '_')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // Quitar acentos

    const testNameClean = (testTypeName || 'Test').replace(/\s+/g, '_');

    return `Reporte_${testNameClean}_${nombreCompleto}_${fechaArchivo}.pdf`;
};

export const generatePDFReport = async (student, resultado, testType) => {
    let PDFReportComponent;

    try {
        showLoadingIndicator();

        // Validación básica
        if (!student) {
            throw new Error('No se proporcionó información del estudiante');
        }

        if (!resultado) {
            throw new Error('No se proporcionaron resultados del test');
        }

        // Importar el componente
        const module = await import('@/Components/PDF/PDFReport');
        PDFReportComponent = module.default;

        if (!PDFReportComponent) {
            throw new Error('No se pudo cargar el componente PDFReport');
        }

        const testTypeName = testTypeNames[testType] || 'Test Psicológico';

        // Crear el elemento React
        const element = React.createElement(PDFReportComponent, {
            student,
            resultado,
            testType,
            testTypeName,
        });

        // Generar el blob
        const blob = await pdf(element).toBlob();

        if (!blob) {
            throw new Error('No se pudo generar el blob del PDF');
        }

        // Crear URL y descargar
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = generateFileName(testTypeName, student); // ✅ Pasar objeto completo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Limpiar
        setTimeout(() => URL.revokeObjectURL(url), 100);

        hideLoadingIndicator();
        showSuccessMessage('✓ Reporte generado exitosamente');
    } catch (error) {
        console.error('❌ Error detallado:', error);

        hideLoadingIndicator();

        alert(
            `Error al generar el reporte:\n\n${error.message}\n\nDetalles técnicos: ${error.stack || 'No disponible'}`,
        );
    }
};

export const generateDetailedPDFReport = async (
    student,
    resultado,
    testType,
) => {
    return generatePDFReport(student, resultado, testType);
};
