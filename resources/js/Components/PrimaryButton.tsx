import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({ className = '', loading = false, disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
    return (
        <button
            {...props}
            className={
                clsx(
                    `inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-white border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150`,
                    disabled && 'opacity-30',
                    className,
                )
            }
            disabled={disabled}
        >
            {loading ? 'Loading...' : children}
        </button>
    );
}
