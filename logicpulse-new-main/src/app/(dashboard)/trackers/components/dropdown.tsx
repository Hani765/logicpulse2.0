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
import { API_URL, TRACKERS } from "@/lib/apiEndPoints";
import { toast } from "sonner";
import revalidate from "@/components/revalidate";
import Update from "./update/Update";
import { LuMoreHorizontal } from "react-icons/lu";
import SubmitBtn from "@/components/ui/SubmitBtn";
import useForm from "@/hooks/use-fom";
export default function Dropdown({
  rowCurrent,
  token,
  role,
}: {
  rowCurrent: any;
  token: string;
  role: string;
}) {
  const { delete: destroy, processing } = useForm({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const uniqueId = rowCurrent.unique_id;
  const endPoint = `${API_URL + TRACKERS}/${uniqueId}`;
  const handleDeleteClick = () => {
    destroy(
      endPoint,
      {
        onSuccess: (response) => {
          toast.success(response.message);
          setDeleteOpen(false);
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
          <DropdownMenuContent align="end" className="max-w-10">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {(rowCurrent.visiblity === "public" ||
              role === "administrator") && (
              <>
                <Update
                  token={token}
                  rowCurrent={rowCurrent}
                  endPoint={endPoint}
                  role={role}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="m-0 w-full py-1"
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete
                </Button>
              </>
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
          <div className="flex justify-center space-x-4 sm:justify-end">
            <CredenzaClose>
              <Button>Cancel</Button>
            </CredenzaClose>
            <SubmitBtn
              variant="destructive"
              onClick={handleDeleteClick}
              label="Yes Delete"
              processing={processing}
            />
          </div>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
