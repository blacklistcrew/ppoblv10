import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PaginateDataTable from '@/Components/PaginateDataTable';
import Card from '@/Components/Card';
import { PageProps } from '@/types';
import ProductType from '@/types/product';
import { rupiah } from '@/libs/BaseHelper';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link } from '@inertiajs/react';

export default function Index({ data }: PageProps) {
  const columns = [
    {
      name: 'Name',
      selector: (row: ProductType) => row.name,
    },
    {
      name: 'Price',
      selector: (row: ProductType) => rupiah(row.price),
    },
    {
      name: 'Commission',
      selector: (row: ProductType) => rupiah(row.commission),
    },
    {
      name: 'Selling Price',
      selector: (row: ProductType) => rupiah(row.total),
    },
    {
      name: 'Status',
      selector: (row: ProductType) => row.status ? 'Active' : 'Inactive',
    },
    {
      selector: (row: ProductType) => (
        row.price > 0 &&
        <Link href={`/admin/product/${row.id}`}>
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
        <PaginateDataTable title='Products' url='/admin/product/list' columns={columns} />
      </Card>
    </AuthenticatedLayout>
  )
}
