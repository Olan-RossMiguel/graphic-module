// resources/js/Pages/Tests/PsychologistAssistance.jsx
import StudentLayout from '@/Layouts/UI/StudentLayout';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const go = (p) => onPageChange(Math.min(Math.max(1, p), totalPages));
    const pages = [];

    // pág. 1 siempre
    pages.push(1);

    // puntos suspensivos antes de la actual
    if (page > 3) pages.push('...');

    // ventana alrededor de la actual
    for (let p = page - 1; p <= page + 1; p++) {
        if (p > 1 && p < totalPages) pages.push(p);
    }

    // puntos suspensivos después de la actual
    if (page < totalPages - 2) pages.push('...');

    // última siempre
    if (totalPages > 1) pages.push(totalPages);

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={() => go(page - 1)}
                className="rounded border px-2 py-1 text-sm hover:bg-blue-50"
                disabled={page === 1}
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
                disabled={page === totalPages}
                aria-label="Siguiente"
            >
                ›
            </button>
        </div>
    );
}

export default function PsychologistAssistance({ questions = [], test }) {
    const { props } = usePage();
    const perPage = 5;
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(questions.length / perPage));

    const form = useForm({ answers: {} });

    const current = useMemo(() => {
        const start = (page - 1) * perPage;
        return questions.slice(start, start + perPage);
    }, [questions, page]);

    const setAnswer = (qid, valor) => {
        form.setData('answers', { ...form.data.answers, [qid]: valor });
    };

    // string → índice (1..N) para que pase la validación integer del backend
    const buildNormalizedPayload = () => {
        const normalized = {};
        for (const q of questions) {
            const v = form.data.answers[q.id];
            if (v === undefined || v === null || v === '') continue;

            const asNumber = Number(v);
            if (!Number.isNaN(asNumber)) {
                normalized[q.id] = asNumber;
                continue;
            }
            const idx = (q.opciones ?? []).findIndex(
                (opt) => String(opt?.valor) === String(v),
            );
            if (idx >= 0) normalized[q.id] = idx + 1;
        }
        return normalized;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        form.setData('answers', buildNormalizedPayload());
        form.post('/tests/assistance', { preserveScroll: true });
    };

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    return (
        <StudentLayout user={props?.auth?.user}>
            <div className="mx-auto max-w-5xl">
                {/* Encabezado estilo screenshot */}
                <div className="mb-5 rounded-md border border-gray-200 bg-white shadow">
                    <div className="border-b bg-gray-50 px-6 py-4">
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            Asistencia psicológica
                        </h1>
                    </div>
                    <div className="px-6 pb-2 pt-3 text-sm text-gray-600">
                        {test?.descripcion}
                    </div>
                </div>

                {/* Tarjeta de preguntas */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-md border bg-white p-5 shadow"
                >
                    <ol className="space-y-6">
                        {current.map((q) => (
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
                                        const checked =
                                            String(
                                                form.data.answers[q.id] ?? '',
                                            ) === String(value);
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
                                                    checked={checked}
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

                    {/* Pie: paginación + enviar */}
                    <div className="mt-6 flex items-center justify-between">
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />

                        {page === totalPages && (
                            <button
                                type="submit"
                                className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                                disabled={form.processing}
                            >
                                {form.processing
                                    ? 'Enviando…'
                                    : 'Enviar respuestas'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </StudentLayout>
    );
}
