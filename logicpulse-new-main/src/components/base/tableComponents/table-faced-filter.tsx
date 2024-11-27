import React from "react";
import SearchInput from "./filters/search-input";

export default function TableFacedFilter({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
      <SearchInput />
      {children}
    </div>
  );
}
