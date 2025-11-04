import { AlertCircle } from 'lucide-react';

export const ErrorAlert = ({
    show,
    message = 'Error al guardar. Por favor intenta de nuevo.',
}) => {
    if (!show) return null;

    return (
        <div className="mb-6 flex items-center gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-700">{message}</span>
        </div>
    );
};
