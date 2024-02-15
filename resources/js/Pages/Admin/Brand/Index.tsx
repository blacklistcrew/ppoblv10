import Card from '@/Components/Card';
import PaginateDataTable from '@/Components/PaginateDataTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from 'react-data-table-component';

export default function Index({ auth, models }: any) {

  const columns = [
    {
      name: 'Name',
      selector: (row: any) => row.name,
    },
    {
      name: 'Status',
      selector: (row: any) => row.status ? 'Active' : 'Inactive',
    },
    {
      name: 'Type',
      selector: (row: any) => row.type ? 'Payment' : 'Purchase',
    },
  ];

  return (
    <AuthenticatedLayout
      auth={auth}
      title="Brand"
    >
      <Card>
        <PaginateDataTable
          title="Brand"
          columns={columns}
          data={models}
        />
      </Card>
    </AuthenticatedLayout>
  )
}
