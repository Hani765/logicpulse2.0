"use client"
import { DateRangePicker } from '@/components/date-range-picker';
import Link from 'next/link';
import React from 'react';
import { CiHardDrive } from 'react-icons/ci';
import { FaAngleRight } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function MonthlyEarningChart({ from, to, response }: { from: string, to: string, response: any }) {
    const data = response?.earnings?.earnings;
    return (
        <div className="w-full">
            <div className="w-full bg-white rounded shadow dark:bg-gray-900 p-4 h-[400px] col-span-2">
                <div className="flex justify-between items-center p-2">
                    <div className='flex gap-2'>
                        <h3 className="text-lg font-semibold">Total Earnings {response?.earnings?.total_earning}</h3>
                    </div>
                    <div className="flex items-center">
                        <DateRangePicker dateRange={
                            from && to
                                ? { from: new Date(from), to: new Date(to) }
                                : undefined
                        } />
                    </div>
                </div>
                <div className="h-[270px] w-full">
                    {!data ? (<div className="w-full p-2 flex gap-2 flex-col text-muted justify-center items-center h-full">
                        <div className="text-[30px]">
                            <CiHardDrive />
                        </div>
                        <div>No data to show</div>
                    </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart height={180} data={data}>
                                <defs>
                                    <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#DDA0DD" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#DDA0DD" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip labelFormatter={(earning) => new Date(earning).toLocaleDateString()} />
                                <Area type="monotone" dataKey="earning" stroke="#DDA0DD" fillOpacity={1} fill="url(#colorPurple)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
                <div className="flex items-center border-gray-200 border-t dark:border-gray-700 justify-end">
                    <Link href="#" className='uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500 px-3 py-2'>See full report <FaAngleRight /></Link>
                </div>
            </div>
        </div>
    );
}
