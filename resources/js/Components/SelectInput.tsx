import { Fragment } from 'react'
import { Listbox } from '@headlessui/react'
import clsx from 'clsx'

type SelectProps = {
    id: number
    name: string
}

export default function SelectInput({ data, value, onChange, widthClass }: { data: SelectProps[], value: number, onChange: any, widthClass?: string }) {
    const listSelect: SelectProps[] = [{ id: 0, name: 'Choose' }].concat(data)
    const selectedValue = listSelect.find((d) => d.id === value)

    return (
        <div className='w-full relative'>
            <Listbox value={selectedValue} onChange={(e) => onChange(e.id)}>
                <Listbox.Button className={`dark:bg-gray-100 outline outline-1 outline-gray-300 rounded px-3 py-2 text-left text leading-5 ${widthClass}`}>{selectedValue?.name}</Listbox.Button>
                <Listbox.Options className={`absolute ${widthClass} top-[110%] max-h-80 overflow-y-auto z-10`}>
                    {listSelect.map((v) => (
                        /* Use the `active` state to conditionally style the active option. */
                        /* Use the `selected` state to conditionally style the selected option. */
                        <Listbox.Option key={v.id} value={v} as={Fragment}>
                            {({ active, selected }) => (
                                <li className={clsx(
                                    `py-1 pl-3 flex items-center bg-white`,
                                    active && 'dark:bg-gray-500 text-white ',
                                    selectedValue?.id !== undefined && selectedValue?.id > 0 && selected && 'dark:bg-gray-600 text-white ',
                                )}>
                                    {v.name}
                                </li>
                            )}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </Listbox>
        </div>
    )
}