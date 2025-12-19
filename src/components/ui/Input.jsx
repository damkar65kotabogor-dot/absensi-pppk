import { forwardRef } from 'react';

export const Input = forwardRef(function Input({
    label,
    error,
    type = 'text',
    className = '',
    containerClassName = '',
    icon: Icon,
    ...props
}, ref) {
    return (
        <div className={`w-full ${containerClassName}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={`input ${Icon ? 'pl-10' : ''} ${error ? 'input-error' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-danger-500">{error}</p>
            )}
        </div>
    );
});

export function Select({
    label,
    error,
    options = [],
    className = '',
    containerClassName = '',
    ...props
}) {
    return (
        <div className={`w-full ${containerClassName}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                </label>
            )}
            <select
                className={`input ${error ? 'input-error' : ''} ${className}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1.5 text-sm text-danger-500">{error}</p>
            )}
        </div>
    );
}

export function Textarea({
    label,
    error,
    className = '',
    containerClassName = '',
    rows = 4,
    ...props
}) {
    return (
        <div className={`w-full ${containerClassName}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                </label>
            )}
            <textarea
                rows={rows}
                className={`input resize-none ${error ? 'input-error' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-danger-500">{error}</p>
            )}
        </div>
    );
}
