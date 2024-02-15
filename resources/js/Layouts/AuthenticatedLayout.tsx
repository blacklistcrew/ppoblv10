import { useState, PropsWithChildren } from 'react';
import { Head, Link } from '@inertiajs/react';
import clsx from 'clsx'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GoHistory, GoHome } from "react-icons/go";
import { CiCirclePlus } from "react-icons/ci";
import { BiCategory } from "react-icons/bi";
import { IconType } from 'react-icons/lib';

import { PageProps } from '@/types';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

type ListMenuProps = {
    title: string,
    Icon: IconType,
    link: string,
    active?: string,
}

const ListMenu = ({ Icon, link, title, active }: ListMenuProps) => {
    const isActive = route().current(active === undefined ? link : active)

    return (
        <li className={clsx("group rounded-sm px-6 hover:bg-gray-100 transition duration-300 ease-in-out", isActive ? 'bg-gray-200' : 'dark:hover:bg-gray-700')}>
            <Link
                href={link}
                className='flex items-center py-4 space-x-3 rounded-md'
            >
                <Icon className={clsx(isActive ? 'group-hover:text-white dark:group-hover:text-black' : 'dark:text-white ')} size={20} />
                <span className={clsx(isActive ? 'group-hover:text-white dark:group-hover:text-black' : 'dark:text-white ')}>{title}</span>
            </Link>
        </li >
    )
}

export default function Authenticated({ auth, title, children }: PropsWithChildren<{ title?: string }> & PageProps) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="flex flex-col bg-gray-100 dark:bg-gray-900">
            <nav className="flex bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>

                            {/* <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Home
                                </NavLink>
                            </div> */}
                        </div>

                        <Head title={title} />
                        <ToastContainer />

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {auth.user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        {
                                            route().current('admin*') &&
                                            <Dropdown.Link href={'/transaction'}>Member</Dropdown.Link>
                                        }
                                        <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800 dark:text-gray-200">
                                {auth.user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">{auth.user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1">
                <aside className="md:flex flex-col py-3 bg-white dark:bg-gray-800 shadow w-80 hidden overflow-y-auto h-[93vh]">
                    <ul className="">
                        {
                            route().current('admin*') ?
                                <>
                                    <ListMenu Icon={GoHome} link='/admin' title='Dashboard' active='admin' />
                                    <ListMenu Icon={BiCategory} link='/admin/category' title='Category' active='admin.category*' />
                                    <ListMenu Icon={BiCategory} link='/admin/brand' title='Brand' active='admin.brand*' />
                                    <ListMenu Icon={BiCategory} link='/admin/product' title='Product' active='admin.product*' />
                                </>
                                :
                                <>
                                    <ListMenu Icon={GoHome} link='/transaction' title='Home' active='transaction*' />
                                    <ListMenu Icon={GoHistory} link='/history' title='History' active='history*' />
                                    <ListMenu Icon={CiCirclePlus} link='/deposit' title='Deposit' active='deposit*' />
                                    <li className="px-6 text-sm dark:text-gray-400 mt-2">Administrator</li >
                                    <ListMenu Icon={BiCategory} link='/admin' title='Admin Panel' />
                                </>
                        }
                        {
                            // Array.from({ length: 33 }, (v, i) => i).map((d: any) => {
                            //     return (
                            //         <li key={d} className="rounded-sm">
                            //             <Link
                            //                 href="#"
                            //                 className="flex items-center p-2 space-x-3 rounded-md"
                            //             >
                            //                 <SlLogout />
                            //                 <span>Logout{d}</span>
                            //             </Link>
                            //         </li>
                            //     )
                            // })
                        }
                    </ul>
                </aside>
                <main className="w-full p-3 md:p-10 flex flex-col gap-y-5 overflow-y-auto h-[93vh]">
                    {children}
                </main>
            </div>
        </div>
    );
}
