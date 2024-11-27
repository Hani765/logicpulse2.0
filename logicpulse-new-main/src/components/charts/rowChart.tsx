"use client"
import React, { useState } from 'react';
import Progress from './progress';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { CiHardDrive } from "react-icons/ci";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from '../ui/skeleton';
import TinyChart from './tinyChart';
export default function RowChart({ data, chartData, label }: { data: any, chartData: any, label: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const handleToggle = () => {
        setIsOpen(!isOpen);
    };
    const thisMonthValue = data?.thisMonthvalue! || 0;
    const lastMonthValue = data?.lastMonthvalue! || 0;
    const progressPercentage = (((thisMonthValue - lastMonthValue) / lastMonthValue) * 100).toFixed(2);
    return (
        <>
            {!data ? (
                <>
                    <div className="w-full bg-white shadow-sm rounded dark:bg-gray-900 p-2 flex gap-2 flex-col text-muted justify-center items-center"
                        style={{ height: 'fit-content' }}>
                        <div className="text-[30px]">
                            <CiHardDrive />
                        </div>
                        <div>No data to show</div>
                    </div>
                </>
            ) : (
                <>  <div className="w-full bg-white shadow-sm rounded dark:bg-gray-900 p-2 flex gap-2 flex-col"
                    style={{ height: 'fit-content' }}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 mt-2">
                            <p className="font-bold text-gray-900 sm:text-sm dark:text-gray-50">{label}</p>
                            <span className="inline-flex items-center gap-x-1 whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-semibold ring-1 bg-gray-50 ring-gray-500/30 dark:bg-gray-400/10 dark:ring-gray-400/20">{parseFloat(progressPercentage) < 0 ? (
                                <span className="text-red-400">{progressPercentage}%</span>
                            ) : (
                                <span className="text-green-400">+{progressPercentage}%</span>
                            )}</span>
                        </div>
                        <div className="h-[50px] w-full ml-4">
                            <TinyChart data={chartData} placeholder={label} />
                        </div>
                    </div>
                    <p className="flex items-baseline gap-2">
                        <span className="text-xl text-gray-900 dark:text-gray-50">{label === "cvr" ? (
                            `${data?.thisMonthvalue!}%`) : (
                            data?.thisMonthvalue!
                        )
                        }</span>
                        <span className="text-sm text-gray-500">this month {label}</span>
                    </p>
                    <div className='w-full'>
                        <Collapsible
                            className='w-full'
                            open={isOpen}
                            onOpenChange={handleToggle}>
                            <CollapsibleContent className='w-full'>
                                <Progress label="Today" currentValue={data?.todayvalue!} totalValue={data?.yesterdayvalue!} placeholder={label} />
                                <Progress label="Yesterday" currentValue={data?.yesterdayvalue!} totalValue={data?.twoDaysAgovalue} placeholder={label} />
                                <Progress label="Last Week" currentValue={data?.thisWeekvalue!} totalValue={data?.lastWeekvalue!} placeholder={label} />
                                <Progress label="Last Month" currentValue={data?.thisMonthvalue!} totalValue={data?.lastMonthvalue!} placeholder={label} />
                            </CollapsibleContent>
                            <div className="flex justify-center items-center w-full">
                                <CollapsibleTrigger asChild>
                                    <button onClick={handleToggle} className="focus:outline-none">
                                        {isOpen ? <FaCaretUp /> : <FaCaretDown />}
                                    </button>
                                </CollapsibleTrigger>
                            </div>
                        </Collapsible>
                    </div>
                </div >
                </>
            )}
        </>
    );
}
