import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import PaginateDataTable from '@/Components/PaginateDataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import clsx from 'clsx';
import { formatDate, listStatus, rupiah } from '@/libs/BaseHelper';
import { PageProps } from '@/types';
import { FaPlus } from 'react-icons/fa';
import DepositType, { DepositLabel } from '@/types/deposit';

const columns = [
    {
        name: 'Bank',
        selector: (row: DepositType) => row.bank,
    },
    {
        name: 'Nominal',
        selector: (row: DepositType) => rupiah(row.nominal),
    },
    {
        name: 'Account Number',
        selector: (row: DepositType) => row.account_number,
    },
    {
        name: 'Status',
        selector: (row: DepositType) => {
            const status = listStatus[row.status]

            return <div className={clsx('px-3 py-2 rounded-xl text-white', status.color)}>{DepositLabel[row.status]}</div>
        },
    },
    {
        name: 'Date',
        selector: (row: DepositType) => formatDate(row.created_at),
    },
    {
        name: '',
        selector: (row: DepositType) => {
            return (
                <Link href={`/deposit/${row.id}`}>
                    <PrimaryButton>View</PrimaryButton>
                </Link>
            )
        },
    },
];

export default function Index({ data }: PageProps) {
    return (
        <AuthenticatedLayout
            data={data}
            title='Deposit'
        >
            <div className='flex justify-between items-center'>
                <div className='text-3xl dark:text-white'>Deposit</div>
                <PrimaryButton className='py-3' onClick={() => router.get('/deposit/create')}>
                    <FaPlus />&nbsp;Topup
                </PrimaryButton>
            </div>
            <Card className='p-4'>
                <PaginateDataTable url='/deposit/list' columns={columns} />
            </Card>
        </AuthenticatedLayout>
    )
}
