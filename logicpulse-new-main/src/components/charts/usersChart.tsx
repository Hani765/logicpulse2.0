import { fetchData } from '@/app/dataFetch/fetchData';
import { API_URL } from '@/lib/apiEndPoints';
import React from 'react';
import UsersProgressChart from './usersProgressChart';
import { CiHardDrive } from 'react-icons/ci';

export default async function UserChart({ token }: { token: string }) {
    const endPoint = `${API_URL}/dashboard/getUsers`;
    const response = await fetchData({ token, endPoint });
    return (
        <div className="bg-white rounded-sm shadow dark:bg-gray-900 p-2 mt-2">
            <div className="flex justify-between">
                <div className="flex justify-center items-center">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">Users chart</h5>
                </div>
                <div>

                    <button
                        type="button"
                        data-tooltip-target="data-tooltip"
                        data-tooltip-placement="bottom"
                        className="hidden sm:inline-flex items-center justify-center text-gray-500 w-8 h-8 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm"
                    >
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3" />
                        </svg>
                        <span className="sr-only">Download data</span>
                    </button>
                    <div
                        id="data-tooltip"
                        role="tooltip"
                        className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                    >
                        Download CSV
                        <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                </div>
            </div>
            {response?.data ? (
                <UsersProgressChart response={response?.data!} />
            ) : (<div className="w-full p-2 flex gap-2 flex-col text-muted justify-center items-center"
                style={{ height: 'fit-content' }}>
                <div className="text-[30px]">
                    <CiHardDrive />
                </div>
                <div>No data to show</div>
            </div>
            )}
        </div>
    )
}
