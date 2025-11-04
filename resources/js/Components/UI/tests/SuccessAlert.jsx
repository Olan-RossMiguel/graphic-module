import { Check } from 'lucide-react';
export const SuccessAlert = ({
    show,
    message = '✓ Respuestas guardadas correctamente',
}) => {
    if (!show) return null;

    return (
        <div className="mb-6 flex items-center gap-3 rounded-xl border-2 border-green-200 bg-green-50 p-4">
            <Check className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">
                {message}
            </span>
        </div>
    );
};
