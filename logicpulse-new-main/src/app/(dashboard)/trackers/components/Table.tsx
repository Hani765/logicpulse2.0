"use client";
import TableFacedFilter from "@/components/base/tableComponents/table-faced-filter";
import { Columns } from "./columns";
import { DataTable } from "@/components/base/table";
import SelectInput from "@/components/base/tableComponents/filters/select-input";
import { statusOptions } from "@/lib/otpions";
import Create from "./create/Create";

export default function Table({
  endPoint,
  data,
  token,
  role,
}: {
  endPoint: string;
  token: string;
  role: string;
  data: any;
}) {
  return (
    <DataTable
      data={data.data}
      endPoint={endPoint}
      columns={Columns(token, role)}
      pagination={data.pagination}
      token={token}
      role={role}
      FacedFilter={filter}
      Create={<Create token={token} role={role} />}
    />
  );
}

const filter = () => {
  return (
    <TableFacedFilter>
      <SelectInput
        param="status"
        label="Select Status"
        options={statusOptions}
      />
    </TableFacedFilter>
  );
};
