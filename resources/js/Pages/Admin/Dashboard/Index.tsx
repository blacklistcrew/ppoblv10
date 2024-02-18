import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import Card from '@/Components/Card';
import { rupiah } from '@/libs/BaseHelper';

export default function Dashboard({ data, setting }: PageProps & { setting: any }) {
    return (
        <AuthenticatedLayout
            data={data}
            title="Dashboard"
        >
            <div className='text-3xl dark:text-white'>Dashboard</div>

            <Card className='p-8'>
                <div className='dark:text-white'>Server Balance : {rupiah(setting.balance)}</div>
            </Card>
        </AuthenticatedLayout>
    );
}
