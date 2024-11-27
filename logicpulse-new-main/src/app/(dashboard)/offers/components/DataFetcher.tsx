// components/DataFetcher.tsx
import React from 'react';
import Table from './Table';
import { fetchData } from '@/app/dataFetch/fetchData';
import { LuServerCrash } from 'react-icons/lu';

interface DataFetcherProps {
    token: string;
    endPoint: string;
    role: string;
}

const DataFetcher: React.FC<DataFetcherProps> = async ({ token, endPoint, role }) => {
    const response = await fetchData({ token, endPoint });
    if (!response.data) {
        return (
            <div className="min-h-72 bg-white flex border flex-col border-gray-200 dark:border-gray-700 dark:bg-gray-900 w-full shadow-sm justify-center items-center px-2 rounded py-4 text-gray-100 dark:text-gray-600">
                <div className="text-[70px]">
                    <LuServerCrash />
                </div>
                <div>Something went wrong please try to refresh the page.</div>
            </div>
        );
    }

    return <Table token={token} data={response.data} endPoint={endPoint} role={role} />;
};

export default DataFetcher;
