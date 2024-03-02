import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { ChangeEvent, useEffect, useState } from 'react';
import { UserType } from '@/types';
import Api from '@/libs/Api';

export default function UpdateProfileInformation({ user, className = '' }: { user: UserType, className?: string }) {
    const [form, setForm] = useState(user);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const updateForm = (e: ChangeEvent<HTMLInputElement>) => {
        setForm((state) => ({ ...state, [e.target.name]: e.target.value }))
    }

    const onSubmit = async () => {
        setLoading(true)
        const res = await Api.put(`/admin/user/profile/${user.id}`, form);
        if (res) {
            setIsSuccess(true)
        }
        setLoading(false)
    }

    useEffect(() => {
        const time = setTimeout(() => {
            if (isSuccess) {
                setIsSuccess(false)
            }
        }, 1500);

        return () => clearTimeout(time);
    }, [isSuccess])

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Profile Information</h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Update account's profile information and email address.
                </p>
            </header>

            <div className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="username" value="Username" />

                    <TextInput
                        id="username"
                        name="username"
                        className="mt-1 block w-full"
                        value={form.username}
                        onChange={updateForm}
                        required
                        isFocused
                        autoComplete="username"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        className="mt-1 block w-full"
                        value={form.name}
                        onChange={updateForm}
                        required
                        isFocused
                        autoComplete="name"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        name="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={form.email}
                        onChange={updateForm}
                        required
                        autoComplete="username"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={loading} onClick={() => onSubmit()}>Save</PrimaryButton>

                    <Transition
                        show={isSuccess}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
                    </Transition>
                </div>
            </div>
        </section>
    );
}
