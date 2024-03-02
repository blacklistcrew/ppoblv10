import { Fragment, useMemo } from 'react'
import { Listbox } from '@headlessui/react'
import clsx from 'clsx'
import InputLabel from './InputLabel'

type SelectProps = {
    id: number
    name: string
}

interface SelectInputType {
    data: SelectProps[],
    title?: string,
    value: number,
    onChange: any,
    widthClass?: string
    disabled?: boolean
}

export default function SelectInput({ data, title, value, onChange, widthClass, disabled = false }: SelectInputType) {
    const listSelect: SelectProps[] = useMemo(() => {
        let filteredListSelect: any = {};
        [{ id: 0, name: 'Choose' }, ...data].forEach((el: SelectProps) => {
            filteredListSelect[el.id] = el;
        });

        return Object.values(filteredListSelect);
    }, [data])
    const selectedValue = listSelect.find((d) => d.id === value)

    return (
        <div>
            {
                title &&
                <InputLabel value={title} className='mb-2' />
            }

            <div className={clsx('relative border border-gray-300 rounded-md shadow-sm', widthClass)}>
                <Listbox value={selectedValue} onChange={(e) => onChange(e.id)} disabled={disabled}>
                    <Listbox.Button className='dark:bg-gray-100 rounded px-3 py-2 text-left disabled:opacity-70 w-full'>{selectedValue?.name || 'Select'}</Listbox.Button>
                    <Listbox.Options className='absolute top-[110%] max-h-80 overflow-y-auto z-10 w-full border border-gray-300'>
                        {listSelect.map((v) => (
                            /* Use the `active` state to conditionally style the active option. */
                            /* Use the `selected` state to conditionally style the selected option. */
                            <Listbox.Option key={v.id} value={v} as={Fragment}>
                                {({ active, selected }) => (
                                    <li className={clsx(
                                        `py-1 pl-3 flex items-center bg-white`,
                                        active && 'bg-gray-500 text-white ',
                                        selectedValue?.id !== undefined && selectedValue?.id > 0 && selected && 'bg-gray-600 text-white ',
                                    )}>
                                        {v.name}
                                    </li>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Listbox>
            </div>
        </div>
    )
}