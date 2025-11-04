import { AlertCircle, X } from 'lucide-react';

export const ValidationAlert = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div className="animate-shake mb-6 flex items-start gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4 sm:p-5">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 sm:h-6 sm:w-6" />
            <div className="flex-1">
                <h3 className="mb-1 text-sm font-bold text-red-900 sm:text-base">
                    Preguntas sin responder
                </h3>
                <p className="text-sm text-red-700">
                    Debes responder todas las preguntas de esta página antes de
                    continuar.
                </p>
            </div>
            <button
                onClick={onClose}
                className="text-red-400 transition-colors hover:text-red-600"
            >
                <X className="h-5 w-5" />
            </button>
        </div>
    );
};
