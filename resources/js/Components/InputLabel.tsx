import { LabelHTMLAttributes } from 'react';

export default function InputLabel({ value, className = '', children, ...props }: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
    return (
        <label {...props} className={`${className} block font-medium text-sm text-gray-700 dark:text-gray-300`}>
            {value ? value : children}
        </label>
    );
}
