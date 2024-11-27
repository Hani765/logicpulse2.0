"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import PerPage from "../base/tableComponents/PerPage";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pagination: any;
  endPoint: string;
  token: string;
}

export function DataTablePagination<TData>({
  table,
  pagination,
}: DataTablePaginationProps<TData>) {
  const [queryState, setQueryState] = useState({
    page: 1,
  });
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handlePagination = useCallback(() => {
    const selectedValue = queryState.page;
    const params = new URLSearchParams(searchParams);
    if (selectedValue === 1) {
      params.delete("page");
    } else {
      params.set("page", selectedValue.toString());
    }

    replace(`${pathname}?${params}`);
  }, [queryState.page, searchParams, replace, pathname]);

  useEffect(() => {
    handlePagination();
  }, [queryState, handlePagination]);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="mx-2">
        <PerPage />
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() =>
            setQueryState({ ...queryState, page: pagination.first_page })
          }
          disabled={pagination.current_page === pagination.first_page}
        >
          <span className="sr-only">Go to first page</span>
          <DoubleArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() =>
            setQueryState({
              ...queryState,
              page: pagination.prev_page || 1,
            })
          }
          disabled={pagination.prev_page === null}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() =>
            setQueryState({
              ...queryState,
              page: pagination.next_page || pagination.last_page,
            })
          }
          disabled={pagination.next_page === null}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() =>
            setQueryState({
              ...queryState,
              page: pagination.last_page,
            })
          }
          disabled={pagination.current_page === pagination.last_page}
        >
          <span className="sr-only">Go to last page</span>
          <DoubleArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
