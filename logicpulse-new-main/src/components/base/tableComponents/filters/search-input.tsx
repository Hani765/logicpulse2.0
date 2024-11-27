"use client";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import { debounce } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const debouncedSearchRef = useRef(
    debounce((query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      replace(`${pathname}?${params.toString()}`);
    }, 300),
  );

  // Update the debounced function when dependencies change
  useEffect(() => {
    debouncedSearchRef.current = debounce((query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      replace(`${pathname}?${params.toString()}`);
    }, 300);

    // Cleanup the debounce function
    return () => {
      debouncedSearchRef.current.cancel();
    };
  }, [searchParams, replace, pathname]);

  const handleSearch = (e: any) => {
    debouncedSearchRef.current(e.target.value);
  };
  return (
    <div className="relative w-full md:w-[300px]">
      <LabelInputContainer
        type="search"
        placeholder="Search..."
        onChange={handleSearch}
        className="w-full rounded bg-background"
        containerClassName="m-0"
      />
    </div>
  );
}
