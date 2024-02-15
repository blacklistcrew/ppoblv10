import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import styled from 'styled-components';
import PrimaryButton from './PrimaryButton';

const TextField = styled.input`
    height: 32px;
    width: 200px;
    border-radius: 3px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border: 1px solid #e5e5e5;
    padding: 0 32px 0 16px;
    color: #000;

    &:hover {
        cursor: pointer;
    }
    &:focus {
        cursor: default;
    }
`;

const FilterComponent = ({ filterText, onFilter, onClear }: any) => (
    <>
        <TextField
            id="search"
            type="text"
            placeholder="Keyword"
            aria-label="Search Input"
            value={filterText}
            onChange={onFilter}
        />
        <PrimaryButton className='h-[33px] rounded-none rounded-r-lg' onClick={onClear}>X</PrimaryButton>
    </>
);

createTheme(
    'custom',
    {
        text: {
            primary: 'inherit',
            secondary: 'inherit',
        },
        background: {
            default: 'inherit',
        },
        context: {
            background: 'inherit',
            text: 'inherit',
        },
        sortFocus: {
            default: 'inherit',
        },
    },
    'dark',
);

type ModelProps = {
    current_page: number,
    per_page: number,
    total: number,
    data: any
}

type PaginateDataTableProps = {
    title?: string,
    url?: string,
    columns: any,
    data?: any
}

export default function PaginateDataTable({ title, url, columns, data }: PaginateDataTableProps) {
    const [model, setModel] = useState<ModelProps>({
        current_page: 1,
        per_page: 10,
        total: 0,
        data: data
    });

    const [loading, setLoading] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const controller = new AbortController();
    const signal = controller.signal;

    const paginationServer = !!url

    let filteredItems = []
    if (!paginationServer) {
        filteredItems = useMemo(() => {
            return model.data.filter((item: any) => {
                const string = Object.values(item).join('-')

                return string && string.toLowerCase().includes(filterText.toLowerCase())
            });
        }, [filterText, resetPaginationToggle])
    }

    const getData = async (page: number, per_page: number, q = '') => {
        if (paginationServer) {
            setLoading(true);

            const res: any = await axios.get(`${url}?page=${page}&per_page=${per_page}&q=${q}`, { signal })

            setModel(res.data)
            setLoading(false);
        }
    }

    useEffect(() => {
        getData(model.current_page, model.per_page, filterText)

        return () => {
            controller.abort();
        }
    }, [model.current_page, model.per_page, filterText])

    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
        };

        return (
            <FilterComponent
                onFilter={(e: any) => setFilterText(e.target.value)}
                onClear={handleClear}
                filterText={filterText}
            />
        );
    }, [filterText, resetPaginationToggle]);

    const handlePerRowsChange = async (newPerPage: number, page: number) => {
        setModel((state: any) => ({ ...state, current_page: page, per_page: newPerPage }))
    };

    const handleChangePage = async (page: number) => {
        setModel((state: any) => ({ ...state, current_page: page }))
    };

    return (
        <span className='dark:bg-gray-800 dark:text-white'>
            <DataTable
                title={title}
                columns={columns}
                data={paginationServer ? model.data : filteredItems}
                progressPending={loading}
                pagination
                paginationServer={paginationServer}
                paginationTotalRows={model.total}
                paginationResetDefaultPage={resetPaginationToggle}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handleChangePage}
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                persistTableHead
                theme='custom'
            />
        </span>
    )
}
