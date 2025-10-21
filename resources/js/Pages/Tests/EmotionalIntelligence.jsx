// resources/js/Pages/Tests/EmotionalIntelligence.jsx
import StudentLayout from '@/Layouts/UI/StudentLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function Pagination({ pagination, onPageChange }) {
    if (!pagination || pagination.last_page <= 1) return null;

    const { current_page, last_page, links } = pagination;
    const page = current_page;
    const totalPages = last_page;

    const go = (p) => {
        if (p >= 1 && p <= totalPages && p !== page) {
            onPageChange(p);
        }
    };

    const pages = [];
    pages.push(1);

    if (page > 3) pages.push('...');

    for (let p = page - 1; p <= page + 1; p++) {
        if (p > 1 && p < totalPages) pages.push(p);
    }

    if (page < totalPages - 2) pages.push('...');

    if (totalPages > 1) pages.push(totalPages);

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={() => go(page - 1)}
                className="rounded border px-2 py-1 text-sm hover:bg-blue-50"
                disabled={!links.prev}
                aria-label="Anterior"
            >
                ‹
            </button>

            {pages.map((p, i) =>
                p === '...' ? (
                    <span
                        key={`dots-${i}`}
                        className="px-2 text-sm text-gray-500"
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        onClick={() => go(p)}
                        className={`rounded px-3 py-1 text-sm ${
                            p === page
                                ? 'bg-blue-600 text-white'
                                : 'border text-blue-700 hover:bg-blue-50'
                        }`}
                    >
                        {p}
                    </button>
                ),
            )}

            <button
                type="button"
                onClick={() => go(page + 1)}
                className="rounded border px-2 py-1 text-sm hover:bg-blue-50"
                disabled={!links.next}
                aria-label="Siguiente"
            >
                ›
            </button>
        </div>
    );
}

export default function EmotionalIntelligence({
    questions = [],
    test,
    pagination,
    savedAnswers = {},
    isLastPage,
}) {
    const { props } = usePage();
    const [page, setPage] = useState(pagination?.current_page || 1);

    const form = useForm({
        answers: {},
        page: page,
    });

    const setAnswer = (qid, valor) => {
        form.setData('answers', {
            ...form.data.answers,
            [qid]: valor,
        });
    };

    // Guardar respuestas de la página actual
    const savePageAnswers = () => {
        form.setData('page', page);
        form.post(`/tests/inteligencia-emocional/answers`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                form.defaults('answers', {});
                form.reset('answers');
            },
        });
    };

    // Enviar test completo
    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(`/tests/inteligencia-emocional/submit`, {
            onSuccess: () => {
                // Limpiar localStorage después de enviar exitosamente
                const storageKey = `test-${test.id}-answers`;
                localStorage.removeItem(storageKey);
            },
        });
    };

    // Cambiar de página
    const handlePageChange = (newPage) => {
        // Guardar respuestas antes de cambiar de página
        if (Object.keys(form.data.answers).length > 0) {
            form.setData('page', page);
            form.post(`/tests/inteligencia-emocional/answers`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    form.defaults('answers', {});
                    form.reset('answers');
                    // ✅ Navegación SPA con Inertia
                    router.visit(
                        `/tests/inteligencia-emocional?page=${newPage}`,
                    );
                },
            });
        } else {
            // ✅ Navegación SPA con Inertia
            router.visit(`/tests/inteligencia-emocional?page=${newPage}`);
        }
    };

    // Cargar respuestas guardadas al montar el componente
    useEffect(() => {
        if (Object.keys(form.data.answers).length > 0) {
            const storageKey = `test-${test.id}-answers`;
            localStorage.setItem(storageKey, JSON.stringify(form.data.answers));
        }
    }, [form.data.answers, test.id]);

    // Cargar desde localStorage al iniciar
    useEffect(() => {
        const storageKey = `test-${test.id}-answers`;
        const saved = localStorage.getItem(storageKey);

        if (saved) {
            try {
                const parsedAnswers = JSON.parse(saved);
                form.setData('answers', parsedAnswers);

                // Opcional: Mostrar mensaje de recuperación
                console.log('Respuestas recuperadas del almacenamiento local');
            } catch (e) {
                console.error('Error al cargar respuestas guardadas:', e);
            }
        }
    }, [test.id]);

    return (
        <StudentLayout user={props?.auth?.user}>
            <div className="mx-auto max-w-5xl">
                {/* Encabezado */}
                <div className="mb-5 rounded-md border border-gray-200 bg-white shadow">
                    <div className="border-b bg-gray-50 px-6 py-4">
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            {test?.nombre || 'Inteligencia Emocional'}
                        </h1>
                    </div>
                    <div className="px-6 pb-2 pt-3 text-sm text-gray-600">
                        {test?.descripcion}
                    </div>
                    <div className="px-6 pb-4">
                        <p className="text-sm font-medium text-blue-600">
                            Instrucciones: Lee cada afirmación y responde según
                            qué tan de acuerdo estás con ella.
                        </p>
                        <p className="mt-2 text-sm text-blue-600">
                            Progreso: página {page} de{' '}
                            {pagination?.last_page || 1}
                        </p>
                    </div>
                </div>

                {/* Formulario de preguntas */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-md border bg-white p-5 shadow"
                >
                    <ol className="space-y-6">
                        {questions.map((q) => (
                            <li
                                key={q.id}
                                className="rounded-md border border-gray-200 p-4"
                            >
                                <p className="mb-3 font-semibold text-gray-900">
                                    {q.numero_pregunta}. {q.texto_pregunta}
                                </p>

                                <div className="space-y-2 pl-1">
                                    {(q.opciones ?? []).map((opt, idx) => {
                                        const inputId = `q-${q.id}-${idx}`;
                                        const value = opt?.valor;
                                        const isChecked =
                                            form.data.answers[q.id] === value ||
                                            savedAnswers[q.id] === value;

                                        return (
                                            <label
                                                key={inputId}
                                                htmlFor={inputId}
                                                className="flex cursor-pointer items-center gap-2"
                                            >
                                                <input
                                                    id={inputId}
                                                    type="radio"
                                                    name={`q-${q.id}`}
                                                    value={value}
                                                    checked={isChecked}
                                                    onChange={() =>
                                                        setAnswer(q.id, value)
                                                    }
                                                    className="h-4 w-4 accent-blue-600"
                                                />
                                                <span className="text-gray-800">
                                                    {opt?.texto}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </li>
                        ))}
                    </ol>

                    {/* Pie con paginación y enviar */}
                    <div className="mt-6 flex items-center justify-between">
                        <Pagination
                            pagination={pagination}
                            onPageChange={handlePageChange}
                        />

                        {isLastPage && (
                            <button
                                type="submit"
                                className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                                disabled={form.processing}
                            >
                                {form.processing
                                    ? 'Enviando…'
                                    : 'Finalizar Test'}
                            </button>
                        )}
                    </div>

                    {/* Estado del auto-guardado */}
                    {form.recentlySuccessful && (
                        <div className="mt-4 text-sm text-green-600">
                            Respuestas guardadas automáticamente
                        </div>
                    )}
                </form>
            </div>
        </StudentLayout>
    );
}
