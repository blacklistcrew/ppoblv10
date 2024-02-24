import { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';
import { router } from '@inertiajs/react';
import CategoryType from '@/types/category';
import ProductType from '@/types/product';
import { toast } from 'react-toastify';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import { filterNumber } from '@/libs/BaseHelper';
import { PageProps } from '@/types';

type DetailPhoneProps = {
    category: CategoryType,
    products: ProductType[],
    isPln: boolean
}

export default function DetailPhone({ data, category, products, isPln }: DetailPhoneProps & PageProps) {
    const [idProduct, setIdProduct] = useState(0)
    const [idCustomer, setIdCustomer] = useState('')
    const [validatedNumber, setValidatedNumber] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const controller = new AbortController();
    const signal = controller.signal;

    const onSubmit = async () => {
        if (!loading) {
            setLoading(true)

            const result = await axios.post('/transaction/postpaid', {
                id_customer: idCustomer,
                id_product: idProduct,
            })

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
    }

    useEffect(() => {
        if (products.length === 1) {
            setIdProduct(products[0].id)
        }
    }, [])

    const handleChangeNumber = (number: string, id_product: number) => {
        let num = number;
        let countValid = 5

        if (isPln) {
            num = filterNumber(number)
            countValid = 12
        }

        const isValid = num.length >= countValid;
        setErrorMessage(isValid ? '' : `Number too short, minimim ${countValid} number`)
        setValidatedNumber(isValid && id_product > 0)
        setIdCustomer(num)
    }

    const handleChangeProduct = (id: number) => {
        setIdProduct(id)
        handleChangeNumber(idCustomer, id)
    }

    return (
        <AuthenticatedLayout
            data={data}
            title="Transaction"
        >
            <Card className='flex flex-col md:px-10 p-6 gap-y-3'>
                <h3 className='text-3xl font-medium mb-5 dark:text-white'>{category.name}</h3>

                {
                    products.length > 1 &&
                    <>
                        <InputLabel>Provider/Operator</InputLabel>
                        <SelectInput widthClass='max-w-xl' data={products} value={idProduct} onChange={handleChangeProduct} />
                    </>
                }

                <TextInput title={isPln ? 'Meter Number' : 'ID Customer'} value={idCustomer} loading={loading} errorMessage={errorMessage} isFocused={true} disabled={loading} onChange={(e: any) => handleChangeNumber(e.target.value, idProduct)} className='max-w-xl' />

                <div className='w-full text-right my-5'>
                    <PrimaryButton loading={loading} disabled={!validatedNumber || loading} onClick={() => onSubmit()}>Process</PrimaryButton>
                </div>
            </Card>
        </AuthenticatedLayout>
    )
}
