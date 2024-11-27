import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import Dropdown from "./dropdown";
import { UserType } from "@/types";
import ProfilePic from "@/components/ui/profile_pic";
import { DataTableColumnHeader } from "@/components/base/tableComponents/data-table-column-header";
import { Progress } from "@/components/ui/progress";
import Status from "@/components/base/tableComponents/status";

export const Columns = (token: string): ColumnDef<UserType>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ID" />;
    },
    cell: (info) => info.row.index + 1,
  },
  {
    accessorKey: "profile_image",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Profile Pic" />;
    },
    cell: ({ row }) => {
      const path = String(row.getValue("profile_image"));

      return (
        <>
          <ProfilePic path={path} />
        </>
      );
    },
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="First Name" />;
    },
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Last Name" />;
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Username" />;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Phonr" />;
    },
  },
  {
    accessorKey: "age",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Age" />;
    },
  },
  {
    accessorKey: "rate",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Rate" />;
    },
  },
  {
    accessorKey: "clicks",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Clicks" />;
    },
  },
  {
    accessorKey: "conversions",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Conversions" />;
    },
  },
  {
    accessorKey: "cvr",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="CVR" />;
    },
  },
  {
    accessorKey: "progress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Progress" />
    ),
    cell: ({ row }) => {
      // Ensure progress is a number
      const progress = Number(row.getValue("progress")) || 0;

      return <Progress value={progress} />;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Role" />;
    },
    cell: ({ row }) => {
      const role = String(row.getValue("role"));
      return (
        <>
          {role === "admin" ? (
            <div className="text-green-500">Admin</div>
          ) : role === "manager" ? (
            <div className="text-blue-500">Manager</div>
          ) : (
            <div className="text-red-500">User</div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "manager_username",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Manager Name" />;
    },
  },
  {
    accessorKey: "admin_username",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Admin Name" />;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Create At" />;
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      const formated = date.toLocaleDateString();
      return <div className="font-medium">{formated}</div>;
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Update At" />;
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("updated_at"));
      const formated = date.toLocaleDateString();
      return <div className="font-medium">{formated}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => {
      const status = String(row.getValue("status"));
      return <Status status={status} />;
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const rowCurrent = row.original;
      return <Dropdown rowCurrent={rowCurrent} token={token} />;
    },
  },
];
