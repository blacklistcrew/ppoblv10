import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PaginateDataTable from '@/Components/PaginateDataTable';
import Card from '@/Components/Card';
import { PageProps, UserType } from '@/types';
import { formatDate, rupiah } from '@/libs/BaseHelper';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link } from '@inertiajs/react';

export default function Index({ data }: PageProps) {
  const columns = [
    {
      name: 'Name',
      selector: (row: UserType) => row.name,
    },
    {
      name: 'E-Mail',
      selector: (row: UserType) => row.email,
    },
    {
      name: 'Saldo',
      selector: (row: UserType) => rupiah(row.saldo),
    },
    {
      name: 'Register Date',
      selector: (row: UserType) => formatDate(row.created_at),
    },
    {
      name: 'Status',
      selector: (row: UserType) => row.status ? 'Active' : 'Inactive',
    },
    {
      selector: (row: UserType) => (
        <Link href={`/admin/user/${row.id}/edit`}>
          <PrimaryButton>Edit</PrimaryButton>
        </Link>
      ),
    },
  ];

  return (
    <AuthenticatedLayout
      data={data}
      title='Product'
    >
      <Card className='p-4'>
        <PaginateDataTable title='Products' url='/admin/user/list' columns={columns} />
      </Card>
    </AuthenticatedLayout>
  )
}
