import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';

// Campo de Select con icono
export const SelectField = ({
    id,
    label,
    icon: Icon,
    value,
    options,
    onChange,
    error,
    required = false,
    placeholder = 'Seleccionar',
}) => (
    <div>
        <label
            htmlFor={id}
            className="mb-2 block text-sm font-medium text-gray-700"
        >
            {label}
        </label>
        <div className="relative">
            {Icon && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon className="h-5 w-5 text-gray-400" />
                </div>
            )}
            <select
                id={id}
                name={id}
                value={value}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${Icon ? 'pl-10' : 'pl-3'} py-2 pr-3`}
                onChange={onChange}
                required={required}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
        <InputError message={error} className="mt-2" />
    </div>
);

// Campo de texto con icono
export const TextField = ({
    id,
    label,
    icon: Icon,
    type = 'text',
    value,
    onChange,
    error,
    required = false,
    placeholder = '',
}) => (
    <div>
        <label
            htmlFor={id}
            className="mb-2 block text-sm font-medium text-gray-700"
        >
            {label}
        </label>
        <div className="relative">
            {Icon && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon className="h-5 w-5 text-gray-400" />
                </div>
            )}
            <TextInput
                id={id}
                type={type}
                name={id}
                value={value}
                className={`mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${Icon ? 'pl-10' : ''}`}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
            />
        </div>
        <InputError message={error} className="mt-2" />
    </div>
);
