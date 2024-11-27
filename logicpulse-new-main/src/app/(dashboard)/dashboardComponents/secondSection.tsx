import React from 'react'
import InfoChart from './InfoChart';
import MonthlyEarningChart from './monthlyEarningChart';
import { API_URL } from '@/lib/apiEndPoints';
import { fetchData } from '@/app/dataFetch/fetchData';
export default async function SecondSection({ searchParams, token, role }: { searchParams: any, token: string, role: string }) {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    // Correct the default values
    const from = searchParams?.from || oneMonthAgo.toISOString().split('T')[0];
    const to = searchParams?.to || today.toISOString().split('T')[0];
    const endPoint = `${API_URL}/dashboard/earnings?from=${from}&to=${to}`
    const response = await fetchData({ token, endPoint });
    return (
        <div>
            <section className='flex flex-col sm:flex-row gap-4'>
                <InfoChart token={token} role={role} />
                <MonthlyEarningChart from={from} to={to} response={response?.data} />
            </section>
        </div>
    )
}
