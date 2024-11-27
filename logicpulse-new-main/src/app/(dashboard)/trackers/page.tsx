import React, { Suspense, lazy } from "react";
import { API_URL, TRACKERS } from "@/lib/apiEndPoints";
import { getUserDetails } from "@/lib/getUserDetails";
import { FaLock } from "react-icons/fa";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/base/tableComponents/tableSkeleton";
import { Metadata } from "next";
import { DateRangePicker } from "@/components/date-range-picker";

const DataFetcher = lazy(() => import("./components/DataFetcher"));

interface SearchParams {
  page?: string;
  q?: string;
  per_page?: string;
  status?: string;
  role?: string;
  from?: string;
  to?: string;
}

interface UserProps {
  searchParams: SearchParams;
}
export const metadata: Metadata = {
  title: "Trackers | LogicPulse",
  description: "Manage and track your trackers in one convenient location.",
};
// Utility function to build query string dynamically
const buildQueryParams = (params: Record<string, string | undefined>) => {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== "") // Exclude undefined or empty values
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`,
    )
    .join("&");
};

const Users: React.FC<UserProps> = async ({ searchParams }) => {
  const user = await getUserDetails();
  const token = user?.token;
  const role = user?.userDetails?.role || "user";

  if (role === "manager" || role === "user") {
    return (
      <div className="flex min-h-72 w-full flex-col items-center justify-center rounded border border-gray-200 bg-white px-2 py-4 text-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600">
        <div className="text-[70px]">
          <FaLock />
        </div>
        <h2 className="text-lg">You do not have access to this page.</h2>
        <p>
          Please click here to go back
          <Link href="/" className="text-blue-600">
            Home
          </Link>
        </p>
      </div>
    );
  }

  const pageEndPoint = `${API_URL}${TRACKERS}`;
  const queryParams = buildQueryParams({
    q: searchParams?.q,
    page: searchParams?.page,
    per_page: searchParams?.per_page,
    status: searchParams?.status,
    role: searchParams?.role,
    from: searchParams?.from,
    to: searchParams?.to,
  });
  const endPoint = `${pageEndPoint}?${queryParams}`;

  return (
    <>
      <Suspense
        fallback={
          <>
            <div className="mb-2 rounded">
              <Skeleton className="h-16 w-full" />
            </div>
            <DataTableSkeleton
              columnCount={7}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={[
                "4rem",
                "10rem",
                "40rem",
                "12rem",
                "12rem",
                "8rem",
                "3rem",
              ]}
              shrinkZero
            />
          </>
        }
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg">Trackers</h2>
            <p className="hidden text-sm text-gray-500 sm:block">
              Manage and track your trackers in one convenient location.
            </p>
          </div>
          <DateRangePicker />
        </div>
        <DataFetcher
          token={token}
          endPoint={endPoint}
          pageEndPoint={pageEndPoint}
          role={role}
        />
      </Suspense>
    </>
  );
};

export default Users;
