"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function PerPage() {
  const [queryState, setQueryState] = useState({
    per_page: "50",
  });
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const handlePerpage = useCallback(() => {
    const selectedValue = queryState.per_page;
    const params = new URLSearchParams(searchParams);
    if (selectedValue === "50") {
      params.delete("per_page");
    } else {
      params.set("per_page", selectedValue);
    }

    replace(`${pathname}?${params}`);
  }, [queryState.per_page, searchParams, replace, pathname]);

  useEffect(() => {
    handlePerpage();
  }, [queryState, handlePerpage]);

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm font-medium">Rows per page</p>
      <Select
        value={queryState.per_page}
        onValueChange={(per_page) => setQueryState({ ...queryState, per_page })}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue placeholder={queryState.per_page} />
        </SelectTrigger>
        <SelectContent side="top">
          {[50, 100, 250, 500, 1000].map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
