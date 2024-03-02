import Card from '@/Components/Card';
import ImagePreview from '@/Components/ImagePreview';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Api from '@/libs/Api';
import { PageProps } from '@/types';
import SettingType from '@/types/setting';
import { Switch } from '@headlessui/react';
import { router } from '@inertiajs/react';
import clsx from 'clsx';
import { ChangeEvent, useState } from 'react';

export default function Index({ data, model }: PageProps & { model: SettingType }) {
  const [form, setForm] = useState(model);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<any>('');
  const handleInputChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const updateForm = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((state) => ({ ...state, [e.target.name]: e.target.value }))
  }

  const onSubmit = async () => {
    setLoading(true)

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('image', file);
    formData.append('account_number', form.account_number);
    formData.append('bank', form.bank);
    formData.append('api_username', form.api_username);
    formData.append('api_dev_key', form.api_dev_key);
    formData.append('api_prod_key', form.api_prod_key);
    formData.append('api_secret', form.api_secret);
    formData.append('use_prod', `${form.use_prod}`);
    formData.append('status', `${form.status}`);

    const res = await Api.post('/admin/setting', formData)
    if (res) {
      router.reload()
      return;
    }
    setLoading(false)
  }

  let urlPreview = '';
  switch (typeof file) {
    case 'object':
      urlPreview = URL.createObjectURL(file)
      break;
    case 'string':
      if (form.logo) {
        urlPreview = `/images/${form.logo}`;
      }
      break;
  }

  const checked = !!form.status;

  return (
    <AuthenticatedLayout
      data={data}
      title="Setting"
    >
      <div className='flex justify-end gap-5'>
        <span className={clsx("dark:text-white")}>Maintenance Mode</span>
        <Switch
          checked={checked}
          onChange={(checked) => setForm((state) => ({ ...state, status: checked ? 1 : 0 }))}
          className={`${checked ? 'bg-blue-600' : 'bg-gray-700'} relative inline-flex h-6 w-11 items-center rounded-full`}>
          <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
        </Switch>
      </div>

      <Card className='p-6 sm:px-8'>
        <div className='flex flex-col gap-y-5'>
          <div className='text-2xl dark:text-white'>App Logo</div>
          <TextInput type='file' accept='image/png' onChange={handleInputChange} className='max-w-xl' />
          <div id='galleryID'>
            {
              urlPreview && <ImagePreview src={urlPreview} height={150} />
            }
          </div>
        </div>
      </Card>

      <Card className='p-6 sm:px-8 flex flex-col gap-y-5'>
        <div className='text-2xl dark:text-white'>Bank Transfer</div>
        <div className='grid lg:grid-cols-2 gap-5'>
          <TextInput disabled={loading} title='Bank Name' name='bank' value={form.bank} onChange={updateForm} />

          <TextInput disabled={loading} title='Account Number' name='account_number' value={form.account_number} onChange={updateForm} />
        </div>
      </Card>

      <Card className='p-6 sm:px-8 flex flex-col gap-y-5'>
        <div className='text-2xl dark:text-white'>API Digiflazz</div>
        <div className='grid lg:grid-cols-2 gap-5'>
          <SelectInput
            title='Mode'
            disabled={loading}
            value={form.use_prod}
            data={[{ id: 0, name: 'Development' }, { id: 1, name: 'Production' }]}
            onChange={(val: number) => setForm((state) => ({ ...state, use_prod: val ? 1 : 0 }))}
            widthClass='w-full'
          />

          <TextInput disabled={loading} title='Username' name='api_username' value={form.api_username} onChange={updateForm} />

          <TextInput disabled={loading} title='Development Key' name='api_dev_key' value={form.api_dev_key} onChange={updateForm} />

          <TextInput disabled={loading} title='Production Key' name='api_prod_key' value={form.api_prod_key} onChange={updateForm} />

          <TextInput disabled={loading} title='Secret Number' name='api_secret' value={form.api_secret} onChange={updateForm} />
        </div>
      </Card>

      <div className='text-right'>
        <PrimaryButton disabled={loading} loading={loading} onClick={() => onSubmit()}>Update</PrimaryButton>
      </div>

    </AuthenticatedLayout>
  )
}
