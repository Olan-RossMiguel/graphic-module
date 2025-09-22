export default function AnswerSelector({
    name,
    options = [],
    value = null,
    onChange,
    disabled = false,
}) {
    return (
        <div className="space-y-2">
            {options.map((opt, i) => {
                const id = `${name}-${i}`;
                const checked = String(value ?? '') === String(opt.valor);

                return (
                    <label
                        key={id}
                        htmlFor={id}
                        className={`flex cursor-pointer select-none items-center gap-2 ${
                            disabled ? 'cursor-not-allowed opacity-60' : ''
                        }`}
                    >
                        <input
                            id={id}
                            type="radio"
                            name={name}
                            value={String(opt.valor)}
                            checked={checked}
                            onChange={() => !disabled && onChange?.(opt.valor)}
                            disabled={disabled}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-800">{opt.texto}</span>
                    </label>
                );
            })}
        </div>
    );
}
