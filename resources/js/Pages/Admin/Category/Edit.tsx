import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import { PageProps } from '@/types';
import CategoryType from '@/types/category';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import ImagePreview from '@/Components/ImagePreview';
import { toast } from 'react-toastify';
import { router } from '@inertiajs/react';

export default function Edit({ data, category }: PageProps & { category: CategoryType }) {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState(category)

    const [file, setFile] = useState<any>('');
    const handleInputChange = (event: any) => {
        setFile(event.target.files[0]);
    };

    const onSubmit = async () => {
        setLoading(true)

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', form.name);
        formData.append('image', file);

        const result = await axios.post(`/admin/category/${category.id}`, formData)

        if (result.data?.success) {
            toast.success(result.data?.message);
            router.get('/admin/category')
            return;
        } else {
            toast.error(result.data?.message);
        }

        setLoading(false)
    }

    let urlPreview = '';
    switch (typeof file) {
        case 'object':
            urlPreview = URL.createObjectURL(file)
            break;
        case 'string':
            if (form.icon) {
                urlPreview = `/images/category/${form.icon}`;
            }
            break;
    }

    return (
        <AuthenticatedLayout
            data={data}
            title="Update Category"
        >
            <Card className='flex flex-col md:px-10 p-6 gap-y-3'>
                <div className='text-2xl dark:text-white mb-2'>Edit</div>

                <TextInput title='Name' value={form.name} onChange={(e) => setForm((state) => ({ ...state, 'name': e.target.value }))} className='max-w-xl' />

                <TextInput title='Icon' type='file' accept='image/*' onChange={handleInputChange} className='max-w-xl' />
                <div id='galleryID'>
                    {
                        urlPreview && <ImagePreview src={urlPreview} height={300} />
                    }
                </div>

                <div className='text-right'>
                    <PrimaryButton onClick={() => onSubmit()} disabled={loading} loading={loading}>Update</PrimaryButton>
                </div>
            </Card>
        </AuthenticatedLayout>
    )
}
