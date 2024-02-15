import React, { HTMLAttributes, ReactNode } from 'react'

function Card({ children, className = '', ...props }: HTMLAttributes<HTMLElement>) {
    return (
        <div {...props} className={`bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg ${className}`}>
            {children}
        </div>
    )
}

export default Card