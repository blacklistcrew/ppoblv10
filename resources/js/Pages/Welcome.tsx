import { Link, Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Card from '@/Components/Card';
import PaginateDataTable from '@/Components/PaginateDataTable';
import ProductType from '@/types/product';
import { rupiah } from '@/libs/BaseHelper';
import clsx from 'clsx';

const columns = [
    {
        name: 'Name',
        selector: (row: ProductType) => row.name,
    },
    {
        name: 'Price',
        selector: (row: ProductType) => row.total ? rupiah(row.total) : '',
    },
    {
        name: 'Status',
        selector: (row: ProductType) => {
            return <div className={clsx('px-3 py-2 rounded-lg', row.status ? 'bg-green-500' : 'bg-red-500')}>{row.status_name}</div>
        },
    },
];

export default function Welcome({ data }: PageProps) {
    return (
        <>
            <Head title="Welcome" />
            <div className="flex flex-col gap-y-5 h-screen overflow-y-auto bg-gray-100 dark:bg-gray-900">
                <div className="w-full h-60 mx-auto p-6 lg:p-8 bg-gray-800 dark:bg-gray-800/10 dark:bg-gradient-to-tr from-gray-600/60 via-transparent rounded-b-[40%]">
                    <div className="sm:fixed sm:top-0 sm:right-0 lg:p-6 text-end">
                        {data.user ? (
                            <Link
                                href={route('transaction')}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-white dark:hover:font-medium focus:outline focus:outline-1 focus:rounded-sm focus:outline-white"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="font-semibold text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-white dark:hover:font-medium focus:outline focus:outline-1 focus:rounded-sm focus:outline-white"
                                >
                                    Log in
                                </Link>

                                <Link
                                    href={route('register')}
                                    className="ms-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-white dark:hover:font-medium focus:outline focus:outline-1 focus:rounded-sm focus:outline-white"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    <div className='h-full mt-5 sm:mt-0 lg:pl-10 lg:flex items-center'>
                        <div className='gap-2 flex flex-col'>
                            <div className='text-3xl dark:text-white '>Buy all digital produk</div>
                            <div className='text-xl dark:text-white '>Start from phone credit, internet data to pay electricity</div>
                        </div>
                    </div>
                </div>

                <div className='w-full lg:p-5 lg:px-16 flex flex-col gap-y-3'>
                    <div className='dark:text-white text-2xl'>All Product</div>
                    <Card className='py-5'>
                        <PaginateDataTable url='/product' columns={columns} />
                    </Card>
                </div>
            </div>
        </>
    );
}
