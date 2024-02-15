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

type DetailPhoneProps = {
    auth: any,
    category: CategoryType,
    products: ProductType[],
    isPln: boolean
}

export default function DetailPhone({ auth, category, products, isPln }: DetailPhoneProps) {
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

            const res = await axios.post('/transaction/postpaid', {
                id_customer: idCustomer,
                id_product: idProduct,
            })

            if (res.status === 200 && res.data?.data?.id) {
                router.get(`/history/${res.data.data.id}`)
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
            auth={auth}
            title="Transaction"
        >
            <Card className='flex flex-col px-10 gap-y-3 py-3'>
                <h3 className='text-3xl font-medium mb-5 dark:text-white'>{category.name}</h3>

                {
                    products.length > 1 &&
                    <>
                        <InputLabel>Provider/Operator</InputLabel>
                        <SelectInput widthClass='w-full md:w-1/3' data={products} value={idProduct} onChange={handleChangeProduct} />
                    </>
                }

                <TextInput title={isPln ? 'Meter Number' : 'ID Customer'} value={idCustomer} loading={loading} errorMessage={errorMessage} isFocused={true} disabled={loading} onChange={(e: any) => handleChangeNumber(e.target.value, idProduct)} className='md:w-1/3 mr-3' />

                <div className='w-full text-right my-5'>
                    <PrimaryButton disabled={!validatedNumber || loading} onClick={() => onSubmit()}>{loading ? 'Loading...' : 'Process'}</PrimaryButton>
                </div>
            </Card>
        </AuthenticatedLayout>
    )
}
