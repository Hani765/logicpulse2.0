import React, { Suspense, lazy } from 'react';
import { API_URL, OFFERS } from '@/lib/apiEndPoints';
import { getUserDetails } from '@/lib/getUserDetails';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTableSkeleton } from '@/components/base/tableComponents/tableSkeleton';
const DataFetcher = lazy(() => import('@/app/(dashboard)/offers/components/DataFetcher'));

interface SearchParams {
    page?: string;
    q?: string;
    per_page?: string;
    status?: string;
}

interface OfferProps {
    searchParams: SearchParams;
}
const Offers: React.FC<OfferProps> = async ({ searchParams }) => {
    const user = await getUserDetails();
    const token = user?.token;
    const role = user?.userDetails?.role || 'user';
    const pageEndPoint = API_URL + OFFERS;
    const page = searchParams?.page || 1;
    const q = searchParams?.q || "";
    const status = searchParams?.status || "";
    const per_page = searchParams?.per_page || 50;
    const endPoint = `${pageEndPoint}?q=${q}&page=${page}&per_page=${per_page}&staus=${status}`;

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
                <DataFetcher token={token} endPoint={endPoint} role={role} />
            </Suspense>
        </>
    );
};
export default Offers;