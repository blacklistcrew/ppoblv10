import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import PaginateDataTable from '@/Components/PaginateDataTable';
import { PageProps } from '@/types';
import CategoryType from '@/types/category';
import PrimaryButton from '@/Components/PrimaryButton';
import { router } from '@inertiajs/react';

export default function Index({ auth, models }: PageProps) {
  const columns = [
    {
      name: 'Name',
      selector: (row: CategoryType) => row.name,
    },
    {
      name: 'Status',
      selector: (row: CategoryType) => row.status ? 'Active' : 'Inactive',
    },
    {
      name: 'Type',
      selector: (row: CategoryType) => row.type ? 'Payment' : 'Purchase',
    },
    {
      name: 'Type',
      selector: (row: CategoryType) => <PrimaryButton onClick={() => router.get(`/admin/category/${row.id}/edit`)} >Edit</PrimaryButton>,
    },
  ];

  return (
    <AuthenticatedLayout
      auth={auth}
      title="Category"
    >
      <Card>
        <PaginateDataTable
          title="Category"
          columns={columns}
          data={models}
        />
      </Card>
    </AuthenticatedLayout>
  )
}
