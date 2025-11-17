// components/EmptyState.jsx
import { FaUser } from 'react-icons/fa';

export const EmptyState = () => {
    return (
        <div className="rounded-lg bg-white py-12 text-center shadow">
            <FaUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
                No hay estudiantes
            </h3>
            <p className="mt-1 text-sm text-gray-500">
                No hay estudiantes registrados en este grupo y semestre.
            </p>
        </div>
    );
};
