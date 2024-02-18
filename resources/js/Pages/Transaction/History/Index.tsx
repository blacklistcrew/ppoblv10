import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import Card from '@/Components/Card';
import PaginateDataTable from '@/Components/PaginateDataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import clsx from 'clsx';
import Transaction from '@/types/transaction';
import { formatDate, listStatus } from '@/libs/BaseHelper';
import { PageProps } from '@/types';

export default function Index({ data }: PageProps) {

  const columns = [
    {
      name: 'Name',
      selector: (row: Transaction) => row.product_name,
    },
    {
      name: 'Price',
      selector: (row: Transaction) => row.total,
    },
    {
      name: 'Customer Number',
      selector: (row: Transaction) => row.mtrpln ? row.mtrpln : row.target,
    },
    {
      name: 'Status',
      selector: (row: Transaction) => {
        const status = listStatus[row.status]

        return <div className={clsx('px-3 py-2 rounded-xl text-white', status.color)}>{status.label}</div>
      },
    },
    {
      name: 'Date',
      selector: (row: Transaction) => formatDate(row.created_at),
    },
    {
      name: '',
      selector: (row: Transaction) => {
        return (
          <Link href={`/history/${row.id}`}>
            <PrimaryButton>View</PrimaryButton>
          </Link>
        )
      },
    },
  ];

  return (
    <AuthenticatedLayout
      data={data}
      title='History'
    >
      <div className='text-3xl dark:text-white'>History</div>
      <Card className='p-4'>
        <PaginateDataTable url='/history/list' columns={columns} />
      </Card>
    </AuthenticatedLayout>
  )
}
