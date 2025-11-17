import StudentLayout from '@/Layouts/UI/StudentLayout';
import { usePage } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

export default function TestCompleted({ test, result }) {
    const { props } = usePage();

    return (
        <StudentLayout user={props?.auth?.user}>
            <div className="mx-auto max-w-3xl py-12">
                {/* Card principal */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    {/* Header con ícono de éxito */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <CheckCircle
                                className="h-12 w-12 text-white"
                                strokeWidth={2.5}
                            />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-white">
                            ¡Test Completado!
                        </h1>
                        <p className="text-lg text-green-50">
                            Has finalizado el cuestionario satisfactoriamente
                        </p>
                    </div>

                    {/* Contenido */}
                    <div className="px-8 py-8">
                        {/* Información del test */}
                        <div className="mb-8 rounded-lg bg-gray-50 p-6">
                            <h2 className="mb-3 text-xl font-semibold text-gray-900">
                                {test?.nombre ||
                                    'Test de Asistencia Psicológica'}
                            </h2>

                            {result && (
                                <div className="space-y-2 text-sm text-gray-700">
                                    <p>
                                        <span className="font-medium">
                                            Fecha de realización:
                                        </span>{' '}
                                        {new Date(
                                            result.fecha_realizacion,
                                        ).toLocaleDateString('es-MX', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Mensaje de confirmación */}
                    </div>
                </div>

                {/* Información adicional */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>
                        Si tienes alguna duda o necesitas más información,
                        <br />
                        contacta con tu orientador educativo.
                    </p>
                </div>
            </div>
        </StudentLayout>
    );
}
