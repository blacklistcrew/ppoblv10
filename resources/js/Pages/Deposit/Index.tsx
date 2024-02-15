import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import PaginateDataTable from '@/Components/PaginateDataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import clsx from 'clsx';
import Transaction from '@/types/transaction';
import { listStatus, rupiah } from '@/libs/BaseHelper';
import { PageProps } from '@/types';
import { FaPlus } from 'react-icons/fa';

export default function Index({ auth }: PageProps) {
    const columns = [
        {
            name: 'Bank',
            selector: (row: any) => row.bank,
        },
        {
            name: 'Nominal',
            selector: (row: any) => rupiah(row.nominal),
        },
        {
            name: 'Account Number',
            selector: (row: any) => row.account_number,
        },
        {
            name: 'Status',
            selector: (row: any) => {
                const status = listStatus[row.status]

                return <div className={clsx('px-3 py-2 rounded-xl text-white', status.color)}>{status.label}</div>
            },
        },
        {
            name: 'Date',
            selector: (row: any) => row.created_at_formatted,
        },
        {
            name: '',
            selector: (row: any) => {
                return (
                    <Link href={`/deposit/${row.id}`}>
                        <PrimaryButton>View</PrimaryButton>
                    </Link>
                )
            },
        },
    ];

    return (
        <AuthenticatedLayout
            auth={auth}
            title='Deposit'
        >
            <div className='flex justify-between items-center'>
                <div className='text-3xl dark:text-white'>Deposit</div>
                <PrimaryButton className='py-3' onClick={() => router.get('/deposit/create')}>
                    <FaPlus />&nbsp;Topup
                </PrimaryButton>
            </div>
            <Card>
                <PaginateDataTable url='/deposit/list' columns={columns} />
            </Card>
        </AuthenticatedLayout>
    )
}
