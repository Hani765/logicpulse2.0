"use client";
import React, { useState } from "react";
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { API_URL, DOMAIN } from "@/lib/apiEndPoints";
import { toast } from "sonner";
import revalidate from "@/components/revalidate";
import { DotsHorizontalIcon, ReloadIcon } from "@radix-ui/react-icons";
import useForm from "@/hooks/use-fom";
import SubmitBtn from "@/components/ui/SubmitBtn";
export default function Dropdown({
  rowCurrent,
  token,
  role,
}: {
  rowCurrent: any;
  token: string;
  role: string;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { delete: destroy, processing } = useForm({});
  const endPoint = `${API_URL}${DOMAIN}/${rowCurrent.unique_id}`;

  const deleteRow = () => {
    destroy(
      endPoint,
      {
        onSuccess: (response) => {
          toast.success(response.message);
          revalidate();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
      token,
    );
  };
  return (
    <>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-w-10">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {(rowCurrent.visiblity === "public" ||
              role === "administrator") && (
              <Button
                variant="ghost"
                size="sm"
                className="m-0 w-full py-1"
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </Button>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Credenza open={deleteOpen} onOpenChange={setDeleteOpen}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Are you sure you want to delete? </CredenzaTitle>
            <CredenzaDescription>
              This action cannot be undone. You are about to delete (
              {rowCurrent.name})
            </CredenzaDescription>
          </CredenzaHeader>
          <div className="flex flex-col justify-between gap-2 p-2">
            <SubmitBtn
              variant="destructive"
              onClick={deleteRow}
              label="Yes Delete"
              processing={processing}
            />
            <CredenzaClose className="w-full">Cancel</CredenzaClose>
          </div>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
