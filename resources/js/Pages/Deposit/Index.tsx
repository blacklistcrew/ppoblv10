import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import Card from '@/Components/Card';
import { Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaPlus } from 'react-icons/fa';

export default function Deposit({ auth }: PageProps) {
    return (
        <AuthenticatedLayout
            auth={auth}
            title="Deposit"
        >
            <Link href='/deposit/create' >
                <PrimaryButton className='py-4'>
                    <FaPlus />&nbsp;Topup
                </PrimaryButton>
            </Link>
            <Card>


                {/* <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">Deposit</div>
                    </div>
                </div>
            </div> */}
            </Card>
        </AuthenticatedLayout>
    );
}
