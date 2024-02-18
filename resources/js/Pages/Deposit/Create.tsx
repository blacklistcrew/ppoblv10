import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import Card from '@/Components/Card';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';
import InputLabel from '@/Components/InputLabel';
import { toast } from 'react-toastify';
import { router } from '@inertiajs/react';
import { toInteger } from '@/libs/BaseHelper';

export default function Create({ data }: PageProps) {
    const [loading, setLoading] = useState(false);
    const [nominal, setNominal] = useState<number>(0);

    const onSubmit = async () => {
        setLoading(true)

        const res = await axios.post('/deposit', { nominal })

        if (res.data?.id !== undefined) {
            toast.success(res.data.message);
            router.get(`/deposit/${res.data.id}`)
            return;
        } else {
            toast.error(res.data.message);
        }

        setLoading(false)
    }

    const handleChangeNomimal = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value.replaceAll('.', ''));
        setNominal(val >= 0 ? val : nominal)
    }

    return (
        <AuthenticatedLayout
            data={data}
            title="Deposit"
        >
            <h3 className='text-3xl font-medium dark:text-white'>Create Deposit</h3>

            <Card className='py-10 px-8 flex flex-col'>
                <InputLabel>Nominal</InputLabel>

                <div className='flex items-center gap-x-10'>
                    <TextInput disabled={loading} loading={loading} className='w-1/4' value={toInteger(nominal)} onChange={handleChangeNomimal} />

                    <PrimaryButton loading={loading} onClick={() => onSubmit()}>Submit</PrimaryButton>
                </div>
            </Card>
        </AuthenticatedLayout>
    );
}
