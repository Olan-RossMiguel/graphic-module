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
            className={`flex w-full flex-col items-center justify-between gap-4 sm:flex-row ${className}`}
            aria-label="Paginación"
        >
            {/* Botón Anterior */}
            <button
                type="button"
                onClick={() => go(page - 1)}
                disabled={page <= 1}
                className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all sm:w-auto sm:px-5 sm:py-2.5 ${
                    page <= 1
                        ? 'cursor-not-allowed border-gray-200 bg-white text-gray-400'
                        : 'border-blue-500 bg-white text-blue-600 hover:bg-blue-50'
                }`}
                aria-label="Página anterior"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="rotate-180"
                >
                    <path
                        d="M6 12L10 8L6 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <span className="hidden sm:inline">Anterior</span>
            </button>

            {/* Contenedor central: Texto + Números */}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
                {/* Texto de página actual */}
                <span className="whitespace-nowrap text-sm font-medium text-gray-600">
                    Página {page} de {totalPages}
                </span>

                {/* Números de página */}
                <div className="flex items-center gap-2">
                    {range.map((item, idx) =>
                        item === '...' ? (
                            <span
                                key={`dots-${idx}`}
                                className="px-1 text-gray-400 sm:px-2"
                            >
                                …
                            </span>
                        ) : (
                            <button
                                key={item}
                                type="button"
                                onClick={() => go(item)}
                                className={`h-9 min-w-[36px] rounded-full text-sm font-semibold transition-all sm:h-[42px] sm:min-w-[42px] ${
                                    item === page
                                        ? 'scale-110 bg-blue-600 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                aria-current={
                                    item === page ? 'page' : undefined
                                }
                                aria-label={`Página ${item}`}
                            >
                                {item}
                            </button>
                        ),
                    )}
                </div>
            </div>

            {/* Botón Siguiente */}
            <button
                type="button"
                onClick={() => go(page + 1)}
                disabled={page >= totalPages}
                className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all sm:w-auto sm:px-5 sm:py-2.5 ${
                    page >= totalPages
                        ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                        : 'border-blue-500 bg-blue-600 text-white shadow-md hover:bg-blue-700'
                }`}
                aria-label="Página siguiente"
            >
                <span className="hidden sm:inline">Siguiente</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                        d="M6 12L10 8L6 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </nav>
    );
}

/** Devuelve un arreglo de páginas/"…" como [1, 2, "...", 5] */
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
