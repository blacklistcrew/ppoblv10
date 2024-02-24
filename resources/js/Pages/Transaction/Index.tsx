import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import { FaPlus } from "react-icons/fa";
import { useMemo } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import { rupiah } from '@/libs/BaseHelper';
import CategoryType from '@/types/category';
import { PageProps } from '@/types';

const ListCategory = ({ title, models }: { title: string, models: CategoryType[] }) => {
  if (!models) {
    return;
  }

  return (
    <div className='px-8 py-6 md:my-3'>
      <div className='text-xl dark:text-white mb-5'>{title}</div>
      <div className='grid lg:grid-cols-5 md:grid-cols-4 grid-cols-3 gap-8'>
        {
          models.map((d: CategoryType, i: number) => {
            return (
              <Link key={i} href={`/transaction/${d.slug}`} className='group flex items-center flex-col lg:flex-row gap-x-8 gap-y-3 hover:scale-[1.01]'>
                <div className='p-3 shadow-lg rounded-3xl dark:bg-white'>
                  {
                    d.icon ?
                      <img className="h-10 w-10" decoding="async" src={`/images/category/${d.icon}`} alt={d.name} crossOrigin="anonymous" />
                      : <div className="h-10 w-10 flex justify-center items-center text-xl font-medium">{d.name.charAt(0)}</div>
                  }
                </div>
                <div className='dark:text-white group-hover:font-semibold'>{d.name}</div>
              </Link>
            )
          })
        }
      </div>
    </div>
  )
}

export default function Index({ data, models }: PageProps & { models: CategoryType[] }) {
  const categories = useMemo(() => {
    let tempPrepaid: CategoryType[] = []
    let tempPostpaid: CategoryType[] = []

    models.forEach((d: CategoryType) => {
      if (d.type === 'prepaid') {
        tempPrepaid.push(d)
      } else {
        tempPostpaid.push(d)
      }
    })

    return { prepaid: tempPrepaid, postpaid: tempPostpaid }
  }, [models])

  return (
    <AuthenticatedLayout
      data={data}
      title="Transaction"
    >
      <Card className='p-4 md:p-6 flex justify-between items-center rounded-lg'>
        <div className='dark:text-white'>
          {rupiah(data?.user?.saldo || 0)}
        </div>

        <PrimaryButton className='py-4' onClick={() => router.get('/deposit/create')}>
          <FaPlus />&nbsp;Topup
        </PrimaryButton>
      </Card>
      <Card>
        {
          models.length > 0 ?
            <>
              <ListCategory title='Prepaid' models={categories.prepaid} />
              <ListCategory title='Postpaid' models={categories.postpaid} />
            </>
            : <div className='dark:text-white'>Empty Product</div>
        }
      </Card>

    </AuthenticatedLayout>
  )
}
