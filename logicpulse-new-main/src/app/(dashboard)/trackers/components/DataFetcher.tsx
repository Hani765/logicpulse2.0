// components/DataFetcher.tsx
import React from "react";
import Table from "./Table";
import { fetchData } from "@/app/dataFetch/fetchData";
import { LuServerCrash } from "react-icons/lu";
import { PageChart } from "@/components/charts/page-chart";

interface DataFetcherProps {
  token: string;
  endPoint: string;
  pageEndPoint: string;
  role: string;
}

const DataFetcher: React.FC<DataFetcherProps> = async ({
  token,
  endPoint,
  pageEndPoint,
  role,
}) => {
  const response = await fetchData({ token, endPoint });
  if (!response?.data?.data) {
    return (
      <div className="flex min-h-72 w-full flex-col items-center justify-center rounded border border-gray-200 bg-white px-2 py-4 text-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600">
        <div className="text-[70px]">
          <LuServerCrash />
        </div>
        <div>Something went wrong please try to refresh the page.</div>
      </div>
    );
  }

  return (
    <>
      <PageChart data={response.data.chart_data} />
      <Table
        token={token}
        data={response.data}
        endPoint={pageEndPoint}
        role={role}
      />
    </>
  );
};

export default DataFetcher;
