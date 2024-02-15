import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PaginateDataTable from '@/Components/PaginateDataTable';
import Card from '@/Components/Card';
import { PageProps } from '@/types';
import ProductType from '@/types/product';

export default function Index({ auth }: PageProps) {
  const columns = [
    {
      name: 'Name',
      selector: (row: ProductType) => row.name,
    },
    {
      name: 'Status',
      selector: (row: ProductType) => row.status ? 'Active' : 'Inactive',
    },
    {
      name: 'Type',
      selector: (row: ProductType) => row.type ? 'Payment' : 'Purchase',
    },
  ];

  return (
    <AuthenticatedLayout
      auth={auth}
      title='Product'
    >
      <Card>
        <PaginateDataTable title='Products' url='/admin/product/list' columns={columns} />
      </Card>
    </AuthenticatedLayout>
  )
}
