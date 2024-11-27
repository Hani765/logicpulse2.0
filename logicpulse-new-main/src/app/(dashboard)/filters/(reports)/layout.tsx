import React from 'react';
import { getUserDetails } from '@/lib/getUserDetails';
import { isEmpty } from 'lodash'
import { DateRangePicker } from '@/components/date-range-picker';
export default async function ClickReportLayout({
  children,
  searchParams
}: Readonly<{
  children: React.ReactNode;
  searchParams: any;
}>) {
  const currentDate = new Date().toLocaleDateString();
  return (
    <div>
      <div className=" flex flex-row justify-between items-center">
        <div>
          <h1 className='mb-2 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50'>
            Click Report
          </h1>
        </div>
        <div className="flex gap-2">
          <DateRangePicker />
        </div>
      </div>
      <p className='text-sm font-extralight text-muted-foreground'>
        Welcome to your click report! Here you can see the latest data on clicks and conversions as of {currentDate}.
      </p>
      <>
        {children}
      </>
    </div >
  );
}
