export const ProgressBar = ({ totalAnswered, totalQuestions }) => {
    const progressPercentage =
        totalQuestions > 0
            ? Math.round((totalAnswered / totalQuestions) * 100)
            : 0;

    return (
        <div className="bg-gray-50 px-6 py-5 sm:px-8 sm:py-6">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-semibold text-gray-700">
                    Progreso del Test
                </span>
                <span className="text-sm font-semibold text-gray-700">
                    {totalAnswered} de {totalQuestions} preguntas
                </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </div>
    );
};
