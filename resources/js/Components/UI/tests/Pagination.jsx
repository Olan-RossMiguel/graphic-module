export default function Pagination({
    page,
    totalPages,
    onPageChange,
    className = '',
}) {
    if (!totalPages || totalPages <= 1) return null;

    const go = (p) => {
        if (p < 1 || p > totalPages || p === page) return;
        onPageChange?.(p);
    };

    const range = getRange(page, totalPages);

    return (
        <nav
            className={`flex items-center gap-2 ${className}`}
            aria-label="Paginación"
        >
            {/* Prev */}
            <button
                type="button"
                onClick={() => go(page - 1)}
                disabled={page <= 1}
                className={`rounded-md border px-3 py-1 text-sm ${
                    page <= 1
                        ? 'border-gray-200 text-gray-300'
                        : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                aria-label="Anterior"
            >
                ‹
            </button>

            {/* Números + elipsis */}
            {range.map((item, idx) =>
                item === '...' ? (
                    <span key={`dots-${idx}`} className="px-2 text-gray-500">
                        …
                    </span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        onClick={() => go(item)}
                        className={`rounded-md border px-3 py-1 text-sm ${
                            item === page
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                        }`}
                        aria-current={item === page ? 'page' : undefined}
                    >
                        {item}
                    </button>
                ),
            )}

            {/* Next */}
            <button
                type="button"
                onClick={() => go(page + 1)}
                disabled={page >= totalPages}
                className={`rounded-md border px-3 py-1 text-sm ${
                    page >= totalPages
                        ? 'border-gray-200 text-gray-300'
                        : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                aria-label="Siguiente"
            >
                ›
            </button>
        </nav>
    );
}

/** Devuelve un arreglo de páginas/“…” como [1, 2, "...", 5] */
function getRange(page, total) {
    const pages = new Set([1, total, page, page - 1, page + 1, 2, total - 1]);
    const arr = [...pages]
        .filter((p) => p >= 1 && p <= total)
        .sort((a, b) => a - b);

    const out = [];
    for (let i = 0; i < arr.length; i++) {
        const p = arr[i];
        if (i === 0) {
            out.push(p);
            continue;
        }
        if (p - arr[i - 1] > 1) out.push('...');
        out.push(p);
    }
    return out;
}
