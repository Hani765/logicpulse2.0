"use client";

import React from "react";
import TableFacedFilter from "@/components/base/tableComponents/table-faced-filter";
import { Columns } from "./columns";
import { DataTable } from "@/components/base/table";
import SelectInput from "@/components/base/tableComponents/filters/select-input";
import { getRoleOptions, statusOptions } from "@/lib/otpions";
import Create from "../create/create";

type TableProps = {
  endPoint: string;
  token: string;
  role: string;
  data: {
    data: any[];
    pagination: {
      total: number;
      currentPage: number;
      perPage: number;
    };
  };
};

export default function Table({ endPoint, data, token, role }: TableProps) {
  // Debugging log to verify components
  console.log("Table Rendered with:", { endPoint, data, token, role });

  return (
    <DataTable
      data={data.data}
      endPoint={endPoint}
      columns={Columns(token)}
      pagination={data.pagination}
      token={token}
      role={role}
      FacedFilter={<Filter role={role} />}
      Create={<Create />}
    />
  );
}

const Filter = ({ role }: { role: string }) => {
  return (
    <TableFacedFilter>
      <SelectInput
        param="status"
        label="Select Status"
        options={statusOptions}
      />
      <SelectInput
        param="role"
        label="Select Role"
        options={getRoleOptions(role)}
      />
    </TableFacedFilter>
  );
};
