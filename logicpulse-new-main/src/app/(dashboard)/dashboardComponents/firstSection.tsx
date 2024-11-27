import { fetchData } from '@/app/dataFetch/fetchData';
import RowChart from '@/components/charts/rowChart'
import { API_URL } from '@/lib/apiEndPoints';
import React from 'react'

export default async function FirstSection({ token, role }: { token: string, role: string }) {
    const endPoint = `${API_URL}/dashboard/firstSection`;
    const response = await fetchData({ token, endPoint });
    return (
        <section>
            <h1 className='mb-2 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50'>Dashboard Data</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                <RowChart data={response?.data?.clicks!} chartData={response?.data?.chartData?.clicks!} label="clicks" />
                <RowChart data={response?.data?.conversions!} chartData={response?.data?.chartData?.conversions!} label="conversions" />
                {role === 'admin' || role === 'administrator' ? (
                    <RowChart data={response?.data?.cvr!} chartData={response?.data?.chartData?.cvr!} label="cvr" />
                ) : (
                    <RowChart data={response?.data?.rejectedConversions!} chartData={response?.data?.chartData?.rejectedConversions!} label="rejected" />
                )}
                <RowChart data={response?.data?.earnings!} chartData={response?.data?.chartData?.earnings!} label="earnings" />
            </div>
        </section>
    )
}
