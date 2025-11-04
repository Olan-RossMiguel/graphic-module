import Pagination from '@/Components/UI/tests/Pagination';
import StudentLayout from '@/Layouts/UI/StudentLayout';
import { router, usePage } from '@inertiajs/react';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { useState } from 'react';

// --- COMPONENTE DE MODAL ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 transition-colors hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <p className="mb-6 text-gray-600">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg border-2 border-gray-300 px-5 py-2.5 font-semibold text-gray-700 transition-all hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:bg-blue-700"
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
    isLastPage,
    testStorageKey,
}) {
    const { props } = usePage();

    // 🎯 ESTADO ÚNICO: Solo React + localStorage (sin BD hasta el final)
    const [allAnswers, setAllAnswers] = useState(() => {
        try {
            const stored = localStorage.getItem(testStorageKey);
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showValidation, setShowValidation] = useState(false);

    // 📝 Guardar respuesta (solo en React + localStorage)
    const setAnswer = (qid, valor) => {
        const questionId = String(qid);
        const normalizedValue = String(valor);

        setAllAnswers((prev) => {
            const updated = { ...prev, [questionId]: normalizedValue };

            // Guardar en localStorage
            try {
                localStorage.setItem(testStorageKey, JSON.stringify(updated));
            } catch (error) {
                console.error('Error en localStorage:', error);
            }

            return updated;
        });

        // Ocultar validación cuando se responde
        if (showValidation) {
            setShowValidation(false);
        }
    };

    // 🔍 Verificar si todas las preguntas de la página actual están respondidas
    const areCurrentQuestionsAnswered = () => {
        return questions.every((q) => {
            const questionId = String(q.id);
            const answer = allAnswers[questionId];
            return answer !== undefined && answer !== null;
        });
    };

    // 🔄 Cambiar de página (CON validación)
    const handlePageChange = (newPage) => {
        // Validar antes de cambiar de página
        if (!areCurrentQuestionsAnswered()) {
            setShowValidation(true);
            // Scroll suave a la primera pregunta sin responder
            const firstUnanswered = questions.find((q) => {
                const questionId = String(q.id);
                const answer = allAnswers[questionId];
                return answer === undefined || answer === null;
            });
            if (firstUnanswered) {
                const element = document.getElementById(
                    `question-${firstUnanswered.id}`,
                );
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                    });
                }
            }
            return;
        }

        // Si todas están respondidas, permitir cambio de página
        setShowValidation(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        router.get(
            `/tests/estilos-aprendizaje?page=${newPage}`,
            {},
            {
                preserveState: true,
                preserveScroll: false,
                only: ['questions', 'pagination', 'isLastPage'],
            },
        );
    };

    // 📨 Modal de confirmación para enviar
    const openSubmitModal = () => {
        // Validar antes de enviar
        if (!areCurrentQuestionsAnswered()) {
            setShowValidation(true);
            const firstUnanswered = questions.find((q) => {
                const questionId = String(q.id);
                const answer = allAnswers[questionId];
                return answer === undefined || answer === null;
            });
            if (firstUnanswered) {
                const element = document.getElementById(
                    `question-${firstUnanswered.id}`,
                );
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                    });
                }
            }
            return;
        }

        if (Object.keys(allAnswers).length === 0) {
            setModalAction('no_answers');
            setIsModalOpen(true);
            return;
        }
        setModalAction('submit');
        setIsModalOpen(true);
    };

    // ✅ Enviar TODAS las respuestas al servidor
    const executeSubmit = () => {
        setIsModalOpen(false);
        setIsSubmitting(true);

        router.post(
            '/tests/estilos-aprendizaje/submit',
            { answers: allAnswers },
            {
                onSuccess: () => {
                    console.log('✅ Test enviado exitosamente');
                    localStorage.removeItem(testStorageKey);
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    console.error('❌ Error al enviar test:', errors);
                    setIsSubmitting(false);
                    setModalAction('submit_error');
                    setIsModalOpen(true);
                },
            },
        );
    };

    const totalAnsweredCount = Object.keys(allAnswers).length;
    const totalQuestions = pagination?.total || test?.total_preguntas || 0;
    const progressPercentage =
        totalQuestions > 0
            ? Math.round((totalAnsweredCount / totalQuestions) * 100)
            : 0;

    // Contar preguntas respondidas en la página actual
    const currentPageAnswered = questions.filter((q) => {
        const questionId = String(q.id);
        return (
            allAnswers[questionId] !== undefined &&
            allAnswers[questionId] !== null
        );
    }).length;

    return (
        <StudentLayout user={props?.auth?.user}>
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
                {/* MODALES */}
                <ConfirmationModal
                    isOpen={isModalOpen && modalAction === 'submit'}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={executeSubmit}
                    title="Confirmar Envío"
                    message="¿Deseas finalizar el test? No podrás modificar tus respuestas después."
                />
                <ConfirmationModal
                    isOpen={isModalOpen && modalAction === 'no_answers'}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={() => setIsModalOpen(false)}
                    title="Atención"
                    message="Debes responder al menos una pregunta antes de finalizar el test."
                />
                <ConfirmationModal
                    isOpen={isModalOpen && modalAction === 'submit_error'}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={() => setIsModalOpen(false)}
                    title="Error"
                    message="Hubo un problema al enviar el test. Por favor, verifica tu conexión."
                />

                {/* ENCABEZADO */}
                <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="border-b px-6 py-6 sm:px-8 sm:py-8">
                        <h1 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                            {test?.nombre || 'Test de Estilos de Aprendizaje'}
                        </h1>
                        <p className="text-sm text-gray-600 sm:text-base lg:text-lg">
                            {test?.descripcion ||
                                'Responde las siguientes preguntas. Puedes navegar entre páginas y tus respuestas se guardarán automáticamente.'}
                        </p>
                    </div>

                    {/* BARRA DE PROGRESO */}
                    <div className="bg-gray-50 px-6 py-5 sm:px-8 sm:py-6">
                        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-sm font-semibold text-gray-700">
                                Progreso del Test
                            </span>
                            <span className="text-sm font-semibold text-gray-700">
                                {totalAnsweredCount} de {totalQuestions}{' '}
                                preguntas
                            </span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                            <div
                                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* INDICADOR DE PÁGINA */}
                <div className="mb-6 rounded-xl bg-white px-6 py-4 shadow-sm sm:px-8 sm:py-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            Página {pagination?.current_page || 1} de{' '}
                            {pagination?.last_page || 1}
                        </h2>
                        <span className="text-sm text-gray-600">
                            {currentPageAnswered} de {questions.length}{' '}
                            respondidas
                        </span>
                    </div>
                </div>

                {/* ALERTA DE VALIDACIÓN */}
                {showValidation && (
                    <div className="animate-shake mb-6 flex items-start gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4 sm:p-5">
                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 sm:h-6 sm:w-6" />
                        <div className="flex-1">
                            <h3 className="mb-1 text-sm font-bold text-red-900 sm:text-base">
                                Preguntas sin responder
                            </h3>
                            <p className="text-sm text-red-700">
                                Debes responder todas las preguntas de esta
                                página antes de continuar.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowValidation(false)}
                            className="text-red-400 transition-colors hover:text-red-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {/* PREGUNTAS */}
                <div className="mb-8 space-y-6 sm:space-y-8">
                    {questions.map((q) => {
                        const questionId = String(q.id);
                        const currentAnswer = allAnswers[questionId];
                        const isAnswered =
                            currentAnswer !== undefined &&
                            currentAnswer !== null;
                        const isUnanswered = showValidation && !isAnswered;

                        return (
                            <div
                                key={q.id}
                                id={`question-${q.id}`}
                                className={`rounded-xl p-6 shadow-sm transition-all duration-300 sm:p-8 ${
                                    isUnanswered
                                        ? 'border-2 border-red-200 bg-red-50'
                                        : 'border-2 border-transparent bg-white'
                                }`}
                            >
                                <div className="mb-6">
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <h3
                                            className={`text-base font-bold sm:text-lg ${
                                                isUnanswered
                                                    ? 'text-red-900'
                                                    : 'text-gray-900'
                                            }`}
                                        >
                                            Pregunta {q.numero_pregunta}
                                        </h3>
                                        {isUnanswered && (
                                            <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                                                <AlertCircle className="h-3 w-3" />
                                                Sin responder
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        className={`text-base leading-relaxed sm:text-lg ${
                                            isUnanswered
                                                ? 'text-red-800'
                                                : 'text-gray-800'
                                        }`}
                                    >
                                        {q.texto_pregunta}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {(q.opciones ?? []).map((opt, idx) => {
                                        const inputId = `q-${q.id}-${idx}`;
                                        const optionValue = String(
                                            opt?.valor || idx,
                                        );
                                        const isChecked =
                                            currentAnswer === optionValue;

                                        return (
                                            <label
                                                key={inputId}
                                                htmlFor={inputId}
                                                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all sm:gap-4 sm:p-5 ${
                                                    isChecked
                                                        ? 'border-blue-600 bg-blue-50 shadow-md'
                                                        : isUnanswered
                                                          ? 'border-red-200 bg-white hover:border-red-300 hover:bg-red-50'
                                                          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="relative flex flex-shrink-0 items-center justify-center">
                                                    <input
                                                        id={inputId}
                                                        type="radio"
                                                        name={`q-${q.id}`}
                                                        value={optionValue}
                                                        checked={isChecked}
                                                        onChange={() =>
                                                            setAnswer(
                                                                q.id,
                                                                optionValue,
                                                            )
                                                        }
                                                        className="h-5 w-5 cursor-pointer accent-blue-600 sm:h-6 sm:w-6"
                                                    />
                                                </div>
                                                <span
                                                    className={`flex-1 text-sm sm:text-base ${
                                                        isChecked
                                                            ? 'font-semibold text-blue-900'
                                                            : 'text-gray-700'
                                                    }`}
                                                >
                                                    {opt?.texto}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* BOTÓN DE ENVÍO (solo en última página) */}
                {isLastPage && (
                    <div className="mb-8 flex flex-col items-center gap-4">
                        <button
                            type="button"
                            onClick={openSubmitModal}
                            disabled={isSubmitting}
                            className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-8 py-3 text-base font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10 sm:py-4 sm:text-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin sm:h-6 sm:w-6" />
                                    <span>Enviando...</span>
                                </>
                            ) : (
                                <>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        className="h-5 w-5 sm:h-6 sm:w-6"
                                    >
                                        <path
                                            d="M2 10L8 16L18 4"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    Enviar Respuestas
                                </>
                            )}
                        </button>
                        <p className="text-center text-xs text-gray-600 sm:text-sm">
                            Has respondido {totalAnsweredCount} de{' '}
                            {totalQuestions} preguntas
                        </p>
                    </div>
                )}

                {/* PAGINACIÓN CENTRADA */}
                <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                    <Pagination
                        page={pagination?.current_page || 1}
                        totalPages={pagination?.last_page || 1}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </StudentLayout>
    );
}
