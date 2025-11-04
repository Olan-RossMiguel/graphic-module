import { ConfirmationModal } from '@/Components/UI/tests/ConfirmationModal';
import { ErrorAlert } from '@/Components/UI/tests/ErrorAlert';
import Pagination from '@/Components/UI/tests/Pagination';
import { ProgressBar } from '@/Components/UI/tests/ProgressBar';
import { SuccessAlert } from '@/Components/UI/tests/SuccessAlert';
import { ValidationAlert } from '@/Components/UI/tests/ValidationAlert';
import StudentLayout from '@/Layouts/UI/StudentLayout';
import { router, usePage } from '@inertiajs/react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

// Componente QuestionCard separado
function QuestionCard({ question, answer, isUnanswered, onAnswerChange }) {
    const questionId = String(question.id);

    return (
        <div
            id={`question-${question.id}`}
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
                            isUnanswered ? 'text-red-900' : 'text-gray-900'
                        }`}
                    >
                        Pregunta {question.numero_pregunta}
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
                        isUnanswered ? 'text-red-800' : 'text-gray-800'
                    }`}
                >
                    {question.texto_pregunta}
                </p>
            </div>

            <div className="space-y-3">
                {(question.opciones ?? []).map((opt, idx) => {
                    const inputId = `q-${question.id}-${idx}`;
                    const optionValue = String(opt?.valor || idx);
                    const isChecked = answer === optionValue;

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
                                    name={`q-${question.id}`}
                                    value={optionValue}
                                    checked={isChecked}
                                    onChange={() =>
                                        onAnswerChange(question.id, optionValue)
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
}

export default function PsychologistAssistance({
    questions = [],
    test,
    pagination,
    isLastPage,
}) {
    const { props } = usePage();

    // 🎯 CLAVE DEL TEST: Genera una clave única para localStorage
    const testStorageKey = `test_asistencia_psicologica_${props?.auth?.user?.id || 'guest'}`;

    // 🎯 ESTADO ÚNICO: Solo React + localStorage (sin BD hasta el final)
    const [allAnswers, setAllAnswers] = useState(() => {
        try {
            const stored = localStorage.getItem(testStorageKey);
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    });

    const [showValidation, setShowValidation] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            `/tests/asistencia-psicologica?page=${newPage}`,
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
            '/tests/asistencia-psicologica/submit',
            { answers: allAnswers },
            {
                onSuccess: () => {
                    console.log('✅ Test enviado exitosamente');
                    // Limpiar localStorage después de enviar
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

    const totalQuestions = pagination?.total || 0;
    const totalAnsweredCount = Object.keys(allAnswers).length;

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
                            {test?.nombre || 'Test de Asistencia Psicológica'}
                        </h1>
                        <p className="text-sm text-gray-600 sm:text-base lg:text-lg">
                            {test?.descripcion ||
                                'Responde las siguientes preguntas. Puedes navegar entre páginas y tus respuestas se guardarán automáticamente.'}
                        </p>
                    </div>

                    {/* BARRA DE PROGRESO */}
                    <ProgressBar
                        totalAnswered={totalAnsweredCount}
                        totalQuestions={totalQuestions}
                    />
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
                <ValidationAlert
                    show={showValidation}
                    onClose={() => setShowValidation(false)}
                />

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
                            <QuestionCard
                                key={q.id}
                                question={q}
                                answer={currentAnswer}
                                isUnanswered={isUnanswered}
                                onAnswerChange={setAnswer}
                            />
                        );
                    })}
                </div>

                {/* ALERTAS DE ESTADO */}
                <SuccessAlert
                    show={isSubmitting === false && modalAction === null}
                />
                <ErrorAlert show={modalAction === 'submit_error'} />

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
