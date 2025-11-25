import { FaDownload, FaFilePdf, FaTimes } from 'react-icons/fa';

/**
 * Modal de confirmación para generar reporte PDF
 */
export default function PDFOptionsModal({
    isOpen,
    onClose,
    onSelectOption,
    testTypeName,
}) {
    if (!isOpen) return null;

    const handleGenerate = () => {
        onSelectOption('simple');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        Generar Reporte PDF
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="mb-6">
                    <div className="mb-4 flex items-center justify-center">
                        <div className="rounded-full bg-blue-100 p-4">
                            <FaFilePdf className="h-12 w-12 text-blue-600" />
                        </div>
                    </div>

                    <p className="mb-4 text-center text-gray-700">
                        Se generará un reporte completo del test de
                    </p>
                    <p className="text-center text-lg font-semibold text-gray-900">
                        {testTypeName}
                    </p>

                    <div className="mt-4 rounded-lg bg-gray-50 p-4">
                        <p className="mb-2 text-sm font-medium text-gray-700">
                            El reporte incluye:
                        </p>
                        <ul className="space-y-1 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                Información del estudiante
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                Resultados y puntuaciones
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                Gráficas y visualizaciones
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                Análisis detallado
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleGenerate}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                    >
                        <FaDownload className="h-4 w-4" />
                        Descargar PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
