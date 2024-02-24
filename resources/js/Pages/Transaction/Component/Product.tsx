import { rupiah } from '@/libs/BaseHelper'
import clsx from 'clsx'

type ProductProps = {
    data: any
    idProduct: number
    onClick: () => void
}

function Product({ data, idProduct, onClick }: ProductProps) {
    return (
        <div
            onClick={onClick}
            className={
                clsx(
                    'flex flex-col justify-between items-center gap-y-2 px-4 py-3 transition duration-200 ease-in rounded-lg',
                    data.status && idProduct !== data.id ? 'hover:bg-green-300 dark:hover:bg-gray-500' : '',
                    data.status ? 'bg-green-200 dark:bg-gray-400 hover:cursor-pointer' : 'bg-red-200',
                    idProduct === data.id ? 'border-2 border-none bg-green-400 dark:bg-gray-600 dark:text-white' : ''
                )
            }
        >
            <div className='text-center'>
                {!data.status && <div className='py-1 px-2 bg-red-400 text-white text-xs text-center inline rounded-3xl'>Inactive</div>}
                <div className='text-sm'>{data.name}</div>
            </div>
            <div className='text-sm'>{rupiah(data.total)}</div>
        </div>
    )
}

export default Product