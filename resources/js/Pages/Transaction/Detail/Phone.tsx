import { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Card from '@/Components/Card';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Product from '../Component/Product';
import axios from 'axios';
import ProductSelectedDesc from '../Component/ProductSelectedDesc';
import { filterNumber } from '@/libs/BaseHelper';
import { toast } from 'react-toastify';
import clsx from 'clsx';

export default function PhonePrepaid({ data, category }: any) {
    const [phone, setPhone] = useState('')
    const [validatedNumber, setValidatedNumber] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [loading, setLoading] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [idProduct, setIdProduct] = useState(0)
    const [descProduct, setDescProduct] = useState('')
    const [products, setProducts] = useState([])

    const controller = new AbortController();
    const signal = controller.signal;

    const getProducts = async () => {
        setLoading(true)
        setDescProduct('')

        const res = await axios.get(`/transaction/list-product?id_category=${category.id}&phone=${phone}`, { signal })

        setProducts(res.data);
        setLoading(false)
    }

    const onSubmit = async () => {
        setLoadingSubmit(true)

        const result = await axios.post('/transaction/prepaid', {
            id_product: idProduct,
            target: phone,
        });

        if (result?.data?.data?.id) {
            toast.success(result.data?.message);
            setIdProduct(0)
            router.get(`/history/${result?.data?.data?.id}`)
            return;
        } else if (result.data?.message) {
            toast.error(result.data?.message);
        }

        setLoadingSubmit(false)
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (phone.length >= 4) {
                getProducts()
            }
        }, 1000)

        return () => {
            clearTimeout(timeout);
            controller.abort();
        }
    }, [phone])

    const handleValidatedNumber = (phoneNumber: string, idProduct: number) => {
        setIdProduct(idProduct)
        setPhone(phoneNumber)
        setValidatedNumber(phoneNumber.length >= 10 && idProduct > 0)
    }

    const handleChangePhone = (number: string) => {
        const num = filterNumber(number)

        setErrorMessage(num.length < 10 ? 'Number too short, minimim 10 number' : '')
        handleValidatedNumber(num, idProduct)
    }

    const handleSelectedPackage = (d: { id: number, desc: string }) => {
        setDescProduct(d.desc)
        handleValidatedNumber(phone, d.id)
    }

    return (
        <AuthenticatedLayout
            data={data}
        >
            <Head title="Transaction" />
            <Card className='flex flex-col md:px-10 p-6 gap-y-3'>
                <h3 className='text-3xl font-medium mb-5 dark:text-white'>{category.name}</h3>

                <TextInput title='Phone Number' disabled={loadingSubmit} errorMessage={errorMessage} value={phone} isFocused={true} onChange={(e: any) => handleChangePhone(e.target.value)} className='w-full max-w-xl' />

                {
                    products.length > 0 && <label className='dark:text-white'>Nominal</label>
                }
                <div className={clsx(!loading && 'grid lg:grid-cols-5 md:grid-cols-3', 'gap-8 max-h-96 overflow-y-auto pr-5 rounded-sm')}>
                    {
                        loading ? <div className='w-full text-center dark:text-white'>Processing...</div>
                            : products.map((d: any, i: number) => <Product key={i} data={d} idProduct={idProduct} onClick={() => d.status && handleSelectedPackage(d)} />)
                    }
                </div>

                <ProductSelectedDesc description={descProduct} />

                <div className='w-full text-right my-5'>
                    <PrimaryButton loading={loadingSubmit} disabled={!validatedNumber || loadingSubmit} onClick={() => onSubmit()}>Process</PrimaryButton>
                </div>
            </Card>
        </AuthenticatedLayout>
    )
}
