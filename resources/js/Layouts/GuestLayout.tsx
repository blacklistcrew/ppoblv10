import ApplicationLogo from '@/Components/ApplicationLogo';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children, data, title }: PropsWithChildren & PageProps & { title?: string }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
            <Head title={title} />
            <Link href="/">
                <ApplicationLogo src={`/images/${data.setting?.logo}`} className="h-20 fill-current text-gray-500" />
            </Link>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
