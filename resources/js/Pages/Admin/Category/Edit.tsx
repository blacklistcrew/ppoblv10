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

export default function Edit({ auth, category }: PageProps & { category: CategoryType }) {
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

        if (result.data?.message) {
            toast(result.data?.message);
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
                urlPreview = `/images/${form.icon}`;
            }
            break;
    }

    return (
        <AuthenticatedLayout
            auth={auth}
            title="Update Category"
        >
            <Card className='px-8 py-10 flex flex-col gap-y-5'>
                <div className='text-2xl dark:text-white mb-2'>Edit</div>

                <TextInput title='Name' value={form.name} onChange={(e) => setForm((state) => ({ ...state, 'name': e.target.value }))} className='w-full md:w-1/2' />

                <TextInput title='Icon' type='file' accept='image/*' onChange={handleInputChange} className='w-full md:w-1/2' />
                <div id='galleryID'>
                    {
                        urlPreview && <ImagePreview src={urlPreview} width='500' />
                    }
                </div>

                <div className='text-right'>
                    <PrimaryButton onClick={() => onSubmit()} disabled={loading} loading={loading}>Update</PrimaryButton>
                </div>
            </Card>
        </AuthenticatedLayout>
    )
}
