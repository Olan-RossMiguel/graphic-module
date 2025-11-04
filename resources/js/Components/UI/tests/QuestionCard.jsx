import { AlertCircle } from 'lucide-react';
export function QuestionCard({ question, answer, isUnanswered, onAnswerChange }) {
    const questionId = String(question.id);
    const isAnswered = answer !== undefined && answer !== null;

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
