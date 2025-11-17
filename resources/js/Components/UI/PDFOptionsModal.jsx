import { useState } from 'react';
import { FaFileAlt, FaFilePdf, FaTimes } from 'react-icons/fa';

/**
 * Modal para seleccionar el tipo de reporte PDF a generar
 */
export default function PDFOptionsModal({
    isOpen,
    onClose,
    onSelectOption,
    testTypeName,
}) {
    const [selectedOption, setSelectedOption] = useState('simple');

    if (!isOpen) return null;

    const handleGenerate = () => {
        onSelectOption(selectedOption);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Generar Reporte PDF
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div>

                <p className="mb-6 text-gray-600">
                    Selecciona el tipo de reporte que deseas generar para{' '}
                    {testTypeName}
                </p>

                {/* Opciones */}
                <div className="space-y-4">
                    {/* Opción Simple */}
                    <div
                        onClick={() => setSelectedOption('simple')}
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                            selectedOption === 'simple'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className={`rounded-full p-3 ${
                                    selectedOption === 'simple'
                                        ? 'bg-blue-500'
                                        : 'bg-gray-200'
                                }`}
                            >
                                <FaFilePdf
                                    className={`h-6 w-6 ${
                                        selectedOption === 'simple'
                                            ? 'text-white'
                                            : 'text-gray-600'
                                    }`}
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                                    Reporte Simple
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Captura exacta de lo que ves en pantalla.
                                    Incluye todas las gráficas, colores y
                                    formato tal como aparecen en el dashboard.
                                </p>
                                <ul className="mt-2 space-y-1 text-sm text-gray-500">
                                    <li>✓ Orientación horizontal</li>
                                    <li>✓ Alta calidad de imagen</li>
                                    <li>✓ Generación rápida</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Opción Personalizada */}
                    <div
                        onClick={() => setSelectedOption('custom')}
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                            selectedOption === 'custom'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className={`rounded-full p-3 ${
                                    selectedOption === 'custom'
                                        ? 'bg-blue-500'
                                        : 'bg-gray-200'
                                }`}
                            >
                                <FaFileAlt
                                    className={`h-6 w-6 ${
                                        selectedOption === 'custom'
                                            ? 'text-white'
                                            : 'text-gray-600'
                                    }`}
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                                    Reporte Personalizado
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Reporte profesional con portada, gráficas
                                    optimizadas y secciones bien organizadas.
                                    Ideal para presentaciones.
                                </p>
                                <ul className="mt-2 space-y-1 text-sm text-gray-500">
                                    <li>✓ Portada profesional</li>
                                    <li>✓ Gráficas optimizadas</li>
                                    <li>✓ Secciones organizadas</li>
                                    <li>✓ Análisis detallado</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleGenerate}
                        className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                    >
                        Generar Reporte
                    </button>
                </div>
            </div>
        </div>
    );
}
