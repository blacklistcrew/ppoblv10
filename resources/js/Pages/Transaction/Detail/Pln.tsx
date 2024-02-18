import { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import Card from '@/Components/Card';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Product from '../Component/Product';
import axios from 'axios';
import CategoryType from '@/types/category';
import ProductType from '@/types/product';
import { filterNumber } from '@/libs/BaseHelper';
import { toast } from 'react-toastify';
import { PageProps } from '@/types';

type DetailPlnProps = {
    category: CategoryType,
    products: ProductType[]
}

export default function PlnPrepaid({ data, category, products }: DetailPlnProps & PageProps) {
    const [idCustomer, setIdCustomer] = useState('')
    const [validatedIdCustomer, setValidatedIdCustomer] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [loading, setLoading] = useState(false)
    const [idProduct, setIdProduct] = useState(0)

    const onSubmit = async () => {
        setLoading(true)

        const result = await axios.post('/transaction/prepaid', {
            id_product: idProduct,
            id_customer: idCustomer,
        });

        if (result?.data?.data?.id) {
            toast.success(result.data.message);
            setIdProduct(0)
            setIdCustomer('')
            router.get(`/history/${result?.data?.data?.id}`)
            return;
        } else if (result.data?.message) {
            toast.error(result.data?.message);
        }

        setLoading(false)
    }

    const handleValidateIdCustomer = (idcust: string, idProduct: number) => {
        setIdProduct(idProduct)
        setIdCustomer(idcust)
        setValidatedIdCustomer(idcust.length >= 10 && idProduct > 0)
    }

    const handleChangeNumber = (number: string) => {
        const num = filterNumber(number)

        setErrorMessage(num.length < 10 ? 'Number too short, minimim 11 number' : '')
        handleValidateIdCustomer(num, idProduct)
    }

    const handleSelectedPackage = (d: { id: number, desc: string }) => {
        handleValidateIdCustomer(idCustomer, d.id)
    }

    return (
        <AuthenticatedLayout
            data={data}
            title='Transaction'
        >
            <Card className='flex flex-col px-10 gap-y-3 py-3'>
                <h3 className='text-3xl font-medium mb-5 dark:text-white'>{category.name}</h3>

                <TextInput title='Meter Number' disabled={loading} value={idCustomer} errorMessage={errorMessage} isFocused={true} onChange={(e: any) => handleChangeNumber(e.target.value)} className='w-full md:w-1/3' />

                <label className='dark:text-white'>Nominal</label>
                <div className='flex-wrap inline-flex min-w-full gap-8 max-h-96 overflow-y-auto rounded-sm'>
                    {
                        products.sort((a, b) => a.price - b.price).map((d: any, i: number) => <Product key={i} data={d} idProduct={idProduct} onClick={() => d.status && handleSelectedPackage(d)} />)
                    }
                </div>

                <div className='w-full text-right my-5'>
                    <PrimaryButton loading={loading} disabled={!validatedIdCustomer || loading} onClick={() => onSubmit()}>Process</PrimaryButton>
                </div>
            </Card>
        </AuthenticatedLayout>
    )
}
