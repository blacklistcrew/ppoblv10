import React, { ButtonHTMLAttributes, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Card from '@/Components/Card'
import clsx from 'clsx';
import { formatDate, listStatus, rupiah } from '@/libs/BaseHelper';
import axios from 'axios';
import { router } from '@inertiajs/react';
import DepositType, { DepositLabel, DepositStat } from '@/types/deposit';
import TextInput from '@/Components/TextInput';
import ImagePreview from '@/Components/ImagePreview';
import { toast } from 'react-toastify';
import { PageProps } from '@/types';

type ItemDataProps = {
    label: string
    value: any
    align?: string
}

const ItemData = ({ label, value, align = 'text-left' }: ItemDataProps) => {
    return (
        <div className={clsx('p-2', align)}>
            <div className='dark:text-white leading-8'>{label}</div>
            <div className='text-xl font-semibold dark:text-white inline-flex'>{value}</div>
        </div>
    )
}

const BtnSubmit = ({ label, loading, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string, loading?: boolean }) => {
    return (<button disabled={loading} {...props} className={clsx('w-full p-2 rounded-xl text-center text-white transition-all duration-300 disabled:opacity-50', className)}>{loading ? 'Loading...' : label}</button>)
}

type ShowProps = {
    deposit: DepositType,
}

export default function Show({ data, deposit }: ShowProps & PageProps) {
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<any>('');

    const handleInputChange = (event: any) => {
        setFile(event.target.files[0]);
    };

    const onSubmit = async (stat: number) => {
        setLoading(true)

        axios.put(`/admin/deposit/${deposit.id}`, { stat })
            .then(e => {
                if (e.data?.success) {
                    toast.success(e.data?.message);
                    router.get('/admin/deposit')
                    return;
                } else {
                    toast.error(e.data?.message);
                }
            })
            .catch(e => {
                toast.error(e.response.data?.message);
            })
            .finally(() => {
                setLoading(false)
            })
    }

    let urlPreview = '';
    switch (typeof file) {
        case 'object':
            urlPreview = URL.createObjectURL(file)
            break;
        case 'string':
            if (deposit.image) {
                urlPreview = `/images/deposit/${deposit.image}`;
            }
            break;
    }

    const status = listStatus[deposit.status];

    return (
        <AuthenticatedLayout
            data={data}
        >
            <div className='text-3xl dark:text-white'>Deposit : {deposit.id}</div>
            <div className='grid lg:grid-cols-2 gap-y-5 gap-x-10'>
                <Card className='px-4 py-3'>
                    <div className='flex justify-between'>
                        <ItemData label='Bank' value={deposit.bank} />
                        <div className='p-3 text-right'>
                            <div className='dark:text-white'>Date</div>
                            <div className='dark:text-white'>{formatDate(deposit.created_at)}</div>
                        </div>
                    </div>

                    <ItemData label='Account Number' value={deposit.account_number} />

                    <ItemData label='Nominal' value={rupiah(deposit.nominal)} />

                    <ItemData label='Status' value={<div className={clsx('px-4 py-2 rounded-xl text-white', status.color)}>{DepositLabel[deposit.status]}</div>} />

                    {
                        [DepositStat.waiting_payment, DepositStat.waiting_approval].includes(deposit.status) &&
                        <div className='p-3 mt-5 flex gap-x-8 justify-between'>
                            <BtnSubmit label='Cancel' loading={loading} onClick={() => onSubmit(DepositStat.failed)} className={clsx('bg-red-500', !loading && 'hover:bg-red-600')} />
                            <BtnSubmit label='Approve' loading={loading} onClick={() => onSubmit(DepositStat.success)} className={clsx('bg-green-500', !loading && 'hover:bg-green-600')} />
                        </div>
                    }
                </Card>

                <Card className='px-4 py-3 flex flex-col'>
                    <div className='dark:text-white mb-10 text-xl'>Upload Transfer Evidence</div>

                    {
                        deposit.status == DepositStat.waiting_payment &&
                        <TextInput type='file' accept='image/*' onChange={handleInputChange} className='w-full md:w-1/2 mb-2' />
                    }
                    <div id='galleryID'>
                        {
                            urlPreview && <ImagePreview src={urlPreview} height={210} />
                        }
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    )
}
