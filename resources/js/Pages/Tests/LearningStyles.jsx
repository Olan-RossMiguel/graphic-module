import Pagination from '@/Components/UI/tests/Pagination';
import StudentLayout from '@/Layouts/UI/StudentLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import { Check, Loader2, Save, X } from 'lucide-react';
import { useMemo, useState } from 'react';

// --- COMPONENTE DE MODAL ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
            <div className="w-full max-w-sm scale-100 rounded-xl bg-white p-6 shadow-2xl transition-all">
                <div className="mb-4 flex items-center justify-between border-b pb-3">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <p className="mb-6 text-sm text-gray-600">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function LearningStyles({
    questions = [],
    test,
    pagination,
    allSavedAnswers = {},
    isLastPage,
    testStorageKey,
}) {
    const { props } = usePage();

    // 🎯 ESTADO PRINCIPAL: Un solo estado para TODAS las respuestas del test
    // Inicializa combinando localStorage + BD (BD tiene prioridad)
    const [allAnswers, setAllAnswers] = useState(() => {
        try {
            const stored = localStorage.getItem(testStorageKey);
            const storageAnswers = stored ? JSON.parse(stored) : {};

            // Combinar: BD sobrescribe localStorage
            const combined = { ...storageAnswers, ...allSavedAnswers };

            console.log('🚀 Inicialización:', {
                fromStorage: Object.keys(storageAnswers).length,
                fromBD: Object.keys(allSavedAnswers).length,
                total: Object.keys(combined).length,
            });

            return combined;
        } catch (error) {
            console.error('Error inicializando respuestas:', error);
            return { ...allSavedAnswers };
        }
    });

    const [isSaving, setIsSaving] = useState(false);
    const [justAnswered, setJustAnswered] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);

    const form = useForm({
        answers: {},
        page: pagination?.current_page || 1,
    });

    // 🔄 Sincronizar con nuevas respuestas de BD cuando cambia la página
    // useMemo se ejecuta cuando allSavedAnswers cambia (nueva data del servidor)
    useMemo(() => {
        if (Object.keys(allSavedAnswers).length > 0) {
            setAllAnswers((prev) => {
                const updated = { ...prev, ...allSavedAnswers };

                console.log('🔄 Sincronizando con BD:', {
                    prevCount: Object.keys(prev).length,
                    newFromBD: Object.keys(allSavedAnswers).length,
                    updatedCount: Object.keys(updated).length,
                    page: pagination?.current_page,
                });

                return updated;
            });
        }
    }, [allSavedAnswers, pagination?.current_page]);

    // Función para establecer una respuesta
    const setAnswer = (qid, valor) => {
        const questionId = String(qid);

        setAllAnswers((prev) => {
            const updated = {
                ...prev,
                [questionId]: valor,
            };

            // Guardar en localStorage inmediatamente
            try {
                localStorage.setItem(testStorageKey, JSON.stringify(updated));
            } catch (error) {
                console.error('Error guardando en localStorage:', error);
            }

            return updated;
        });

        // Efecto visual
        setJustAnswered(questionId);
        setTimeout(() => setJustAnswered(null), 600);
    };

    // Calcular respuestas no guardadas en BD
    const unsavedAnswers = useMemo(() => {
        const unsaved = {};
        Object.keys(allAnswers).forEach((qid) => {
            if (
                !(qid in allSavedAnswers) ||
                allSavedAnswers[qid] !== allAnswers[qid]
            ) {
                if (allAnswers[qid] !== null && allAnswers[qid] !== undefined) {
                    unsaved[qid] = allAnswers[qid];
                }
            }
        });
        return unsaved;
    }, [allAnswers, allSavedAnswers]);

    const handlePageChange = (newPage) => {
        const unsavedCount = Object.keys(unsavedAnswers).length;

        console.log('📤 Intentando cambiar de página:', {
            newPage,
            unsavedCount,
            unsavedAnswers,
            formData: form.data,
        });

        if (unsavedCount > 0) {
            setIsSaving(true);

            // Usar router.post directamente
            router.post(
                '/tests/estilos-aprendizaje/answers',
                {
                    answers: unsavedAnswers,
                    page: pagination?.current_page,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: (page) => {
                        console.log('✅ Respuestas guardadas en BD', page);
                        setIsSaving(false);

                        // Navegar a la nueva página
                        router.visit(
                            `/tests/estilos-aprendizaje?page=${newPage}`,
                            {
                                preserveScroll: false,
                            },
                        );
                    },
                    onError: (errors) => {
                        console.error('❌ Error completo:', {
                            errors,
                            message: errors?.message,
                            response: errors,
                        });
                        setIsSaving(false);
                        setModalAction('save_error');
                        setIsModalOpen(true);
                    },
                    onFinish: () => {
                        console.log('🏁 Request finalizado');
                    },
                },
            );
        } else {
            console.log('⏭️ No hay cambios, navegando directamente');
            router.visit(`/tests/estilos-aprendizaje?page=${newPage}`, {
                preserveScroll: false,
            });
        }
    };

    const openSubmitModal = () => {
        if (Object.keys(allAnswers).length === 0) {
            setModalAction('no_answers');
            setIsModalOpen(true);
            return;
        }

        setModalAction('submit');
        setIsModalOpen(true);
    };

    const executeSubmit = () => {
        setIsModalOpen(false);
        setIsSaving(true);

        console.log('📤 Enviando test completo:', {
            totalAnswers: Object.keys(allAnswers).length,
            allAnswers,
        });

        // Usar router.post directamente
        router.post(
            '/tests/estilos-aprendizaje/submit',
            {
                answers: allAnswers,
            },
            {
                onSuccess: (page) => {
                    console.log('✅ Test completado', page);
                    localStorage.removeItem(testStorageKey);
                    setIsSaving(false);
                },
                onError: (errors) => {
                    console.error('❌ Error completo al enviar:', {
                        errors,
                        message: errors?.message,
                        response: errors,
                    });
                    setIsSaving(false);
                    setModalAction('submit_error');
                    setIsModalOpen(true);
                },
                onFinish: () => {
                    console.log('🏁 Submit finalizado');
                },
            },
        );
    };

    const clearLocalStorage = () => {
        if (
            confirm(
                '¿Estás seguro de que quieres limpiar la caché local? Esto borrará tus respuestas no guardadas.',
            )
        ) {
            localStorage.removeItem(testStorageKey);
            setAllAnswers({ ...allSavedAnswers });
            router.reload();
        }
    };

    const unsavedCount = Object.keys(unsavedAnswers).length;
    const totalAnsweredCount = Object.keys(allAnswers).length;

    return (
        <StudentLayout user={props?.auth?.user}>
            <div className="mx-auto max-w-5xl py-6">
                {/* Modales */}
                <ConfirmationModal
                    isOpen={isModalOpen && modalAction === 'submit'}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={executeSubmit}
                    title="Confirmar Envío de Test"
                    message="Estás a punto de finalizar el test. Asegúrate de haber respondido todas las preguntas. Una vez enviado, no podrás modificar tus respuestas."
                />
                <ConfirmationModal
                    isOpen={isModalOpen && modalAction === 'no_answers'}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={() => setIsModalOpen(false)}
                    title="Atención"
                    message="Por favor, responde al menos una pregunta antes de intentar finalizar el test."
                />
                <ConfirmationModal
                    isOpen={
                        isModalOpen &&
                        (modalAction === 'save_error' ||
                            modalAction === 'submit_error')
                    }
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={() => setIsModalOpen(false)}
                    title="Error de Conexión"
                    message="Hubo un problema al guardar o enviar tus respuestas. Por favor, revisa tu conexión a internet e intenta de nuevo."
                />

                {/* Encabezado */}
                <div className="mb-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                    <div className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            {test?.nombre || 'Estilos de Aprendizaje VAK'}
                        </h1>
                    </div>
                    <div className="px-6 pb-2 pt-4 text-sm text-gray-600">
                        {test?.descripcion}
                    </div>
                    <div className="flex flex-col bg-blue-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-medium text-blue-700">
                            📝 **Instrucciones:** Selecciona la opción que mejor
                            refleje tu forma de aprender. Tus respuestas se
                            guardan **automáticamente** al cambiar de página.
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-blue-600 sm:mt-0">
                            <div className="flex items-center gap-1 font-semibold">
                                <span>Pág {pagination?.current_page || 1}</span>
                                <span className="text-blue-400">/</span>
                                <span>{pagination?.last_page || 1}</span>
                            </div>
                            <span className="text-blue-400">•</span>
                            <div className="flex items-center gap-1 text-blue-500">
                                <Save className="h-4 w-4" />
                                <span>{totalAnsweredCount} Respuestas</span>
                                {unsavedCount > 0 && (
                                    <span className="text-xs font-bold text-red-500">
                                        ({unsavedCount} sin guardar)
                                    </span>
                                )}
                            </div>
                            <span className="text-blue-400">•</span>
                            <button
                                type="button"
                                onClick={clearLocalStorage}
                                className="text-xs text-red-500 underline transition-colors hover:text-red-700"
                                title="Solo para debugging"
                            >
                                Limpiar caché
                            </button>
                        </div>
                    </div>
                </div>

                {/* Formulario de preguntas */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                    <div className="space-y-6">
                        {questions.map((q) => {
                            const questionId = String(q.id);
                            const currentAnswerValue = allAnswers[questionId];
                            const isAnswered =
                                currentAnswerValue !== undefined &&
                                currentAnswerValue !== null;
                            const isJustAnswered = justAnswered === questionId;
                            const isSavedInDB =
                                allSavedAnswers[questionId] ==
                                currentAnswerValue;
                            const isModified =
                                isAnswered &&
                                !isSavedInDB &&
                                questionId in allSavedAnswers;

                            return (
                                <div
                                    key={q.id}
                                    className={`rounded-xl border-2 p-5 transition-all duration-300 ${
                                        isAnswered
                                            ? isSavedInDB
                                                ? 'border-green-200 bg-green-50/30'
                                                : 'border-blue-200 bg-blue-50/30'
                                            : 'border-gray-200 bg-white'
                                    } ${
                                        isJustAnswered
                                            ? 'scale-[1.01] shadow-xl'
                                            : ''
                                    }`}
                                >
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <p className="flex-1 text-base font-bold leading-relaxed text-gray-900">
                                            <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-mono text-sm text-white shadow-md">
                                                {q.numero_pregunta}
                                            </span>
                                            {q.texto_pregunta}
                                        </p>
                                        <div className="mt-1 flex items-center gap-2">
                                            {isAnswered && (
                                                <div className="flex items-center gap-1">
                                                    <div
                                                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                                                            isSavedInDB
                                                                ? 'bg-green-500'
                                                                : 'bg-orange-500'
                                                        } shadow`}
                                                    >
                                                        <Check
                                                            className="h-4 w-4 text-white"
                                                            strokeWidth={3}
                                                        />
                                                    </div>
                                                    {!isSavedInDB && (
                                                        <span className="text-xs font-semibold text-orange-600">
                                                            Sin guardar
                                                        </span>
                                                    )}
                                                    {isModified && (
                                                        <span className="text-xs font-semibold text-orange-600">
                                                            (Modificada)
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2 pl-2">
                                        {(q.opciones ?? []).map((opt, idx) => {
                                            const inputId = `q-${q.id}-${idx}`;
                                            const value = opt?.valor;
                                            const isChecked =
                                                currentAnswerValue == value;

                                            return (
                                                <label
                                                    key={inputId}
                                                    htmlFor={inputId}
                                                    className={`group flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all duration-200 ${
                                                        isChecked
                                                            ? 'border-blue-500 bg-blue-50 shadow-md'
                                                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                                                    }`}
                                                >
                                                    <input
                                                        id={inputId}
                                                        type="radio"
                                                        name={`q-${q.id}`}
                                                        value={value}
                                                        checked={isChecked}
                                                        onChange={() =>
                                                            setAnswer(
                                                                q.id,
                                                                value,
                                                            )
                                                        }
                                                        className="h-5 w-5 cursor-pointer accent-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span
                                                        className={`flex-1 text-base transition-colors ${
                                                            isChecked
                                                                ? 'font-bold text-blue-900'
                                                                : 'text-gray-700 group-hover:text-gray-900'
                                                        }`}
                                                    >
                                                        {opt?.texto}
                                                    </span>
                                                    {isChecked && (
                                                        <Check
                                                            className="h-5 w-5 text-blue-600"
                                                            strokeWidth={2.5}
                                                        />
                                                    )}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pie: paginación + enviar */}
                    <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
                        <Pagination
                            page={pagination?.current_page || 1}
                            totalPages={pagination?.last_page || 1}
                            onPageChange={handlePageChange}
                            className={
                                isSaving || form.processing
                                    ? 'pointer-events-none opacity-50'
                                    : ''
                            }
                        />

                        {isLastPage && (
                            <button
                                type="button"
                                onClick={openSubmitModal}
                                className="w-full rounded-lg bg-gradient-to-r from-green-600 to-blue-600 px-8 py-3 font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-md sm:w-auto"
                                disabled={form.processing || isSaving}
                            >
                                {form.processing || isSaving ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Procesando...</span>
                                    </div>
                                ) : (
                                    '✓ Finalizar Test'
                                )}
                            </button>
                        )}
                    </div>

                    {/* Estado de guardado */}
                    {(isSaving || form.processing) && (
                        <div className="mt-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 shadow-inner">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                            <span>
                                {form.processing
                                    ? 'Enviando test final...'
                                    : 'Guardando respuestas en el servidor...'}
                            </span>
                        </div>
                    )}

                    {form.recentlySuccessful &&
                        !isSaving &&
                        !form.processing && (
                            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-inner">
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-600" />
                                    <span>
                                        Respuestas guardadas correctamente
                                    </span>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </StudentLayout>
    );
}
