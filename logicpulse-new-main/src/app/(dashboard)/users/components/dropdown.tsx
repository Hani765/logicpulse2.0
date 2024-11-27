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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { API_URL, USERS } from "@/lib/apiEndPoints";
import { toast } from "sonner";
import revalidate from "@/components/revalidate";
import { LuMoreHorizontal } from "react-icons/lu";
import Link from "next/link";
import SubmitBtn from "@/components/ui/SubmitBtn";
import useForm from "@/hooks/use-fom";

interface DropdownProps {
  rowCurrent: any;
  token: string;
}

interface ResponseData {
  [key: string]: any;
}

export default function Dropdown({ rowCurrent, token }: DropdownProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const unique_id = rowCurrent.unique_id;
  const endPoint = `${API_URL}${USERS}/${unique_id}`;
  const { delete: destroy, processing } = useForm({});

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
              <LuMoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href={`/users/update/${rowCurrent.unique_id}`}>Edit </Link>
            </DropdownMenuItem>
            <Button
              variant="ghost"
              size="sm"
              className="m-0 w-full py-1"
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Credenza open={deleteOpen} onOpenChange={setDeleteOpen}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Are you sure you want to delete? </CredenzaTitle>
            <CredenzaDescription>
              This action cannot be undone. You are about to delete (
              {rowCurrent.id}: {rowCurrent.username})
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
