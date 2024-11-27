import React, { Suspense, lazy } from 'react';
import { API_URL, CLICKS } from '@/lib/apiEndPoints';
import { getUserDetails } from '@/lib/getUserDetails';
import { FaLock } from 'react-icons/fa';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTableSkeleton } from '@/components/base/tableComponents/tableSkeleton';

const DataFetcher = lazy(() => import('../components/DataFetcher'));

interface SearchParams {
  page?: string;
  q?: string;
  per_page?: string;
  offer?:string;
  user?:string;
  manager?:string;
  admin?:string;
  network?:string;
  domain?:string;
  tracker?:string;
  country?:string;
  cat?:string;
  status?: string;
  from?: Date;
  to?: Date;
}

interface TrackerProps {
  searchParams: SearchParams;
}

const Trackers: React.FC<TrackerProps> = async ({ searchParams }) => {
  const user = await getUserDetails();
  const token = user?.token;
  const role = user?.userDetails?.role || 'user';

  if (role === 'manager' || role === 'user') {
    return (
      <div className="min-h-72 bg-white flex border flex-col border-gray-200 dark:border-gray-700 dark:bg-gray-900 w-full shadow-sm justify-center items-center px-2 rounded py-4 text-gray-100 dark:text-gray-600">
        <div className="text-[70px]">
          <FaLock />
        </div>
        <h2 className="text-lg">You do not have access to this page.</h2>
        <p>Please click here to go back <Link href="/" className='text-blue-600'>Home</Link></p>
      </div>
    );
  }

  const pageEndPoint = API_URL + CLICKS;
  const page = searchParams?.page || 1;
  const q = searchParams?.q || "";
  const offer = searchParams?.offer || "";
  const users = searchParams?.user || "";
  const manager = searchParams?.manager || "";
  const admin = searchParams?.admin || "";
  const network = searchParams?.network || "";
  const domain = searchParams?.domain || "";
  const tracker = searchParams?.tracker || "";
  const country = searchParams?.country || "";
  const cat = searchParams?.cat || "";
  const status = searchParams?.status || "";
  const from = searchParams?.from || "";
  const to = searchParams?.to || "";
  const per_page = searchParams?.per_page || 50;
  const endPoint = `${pageEndPoint}?q=${q}&offer=${offer}&user=${users}&manager=${manager}&admin=${admin}&network=${network}&domain=${domain}&tracekr=${tracker}&country=${country}&cat=${cat}&status=${status}&from=${from}&to=${to}&page=${page}&per_page=${per_page}
  `;

  return (
    <>
      <Suspense fallback={
        <>
          <div className='rounded mb-2'>
            <Skeleton className="w-full h-16" />
          </div>
          <DataTableSkeleton
            columnCount={7}
            searchableColumnCount={1}
            filterableColumnCount={2}
            cellWidths={["4rem", "10rem", "40rem", "12rem", "12rem", "8rem", "3rem"]}
            shrinkZero
          />
        </>
      }>
        <DataFetcher token={token} endPoint={endPoint} pageEndpoint={pageEndPoint} role={role} />
      </Suspense>
    </>
  );
};

export default Trackers;
