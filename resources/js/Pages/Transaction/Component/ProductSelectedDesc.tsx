import React from 'react'

export default function ProductSelectedDesc({ description }: { description: string }) {
    return (
        description.length > 0 &&
        <div className='w-full rounded-md bg-gray-200 dark:bg-gray-500 px-8 py-4 mt-3'>
            {description}
        </div>
    )
}
