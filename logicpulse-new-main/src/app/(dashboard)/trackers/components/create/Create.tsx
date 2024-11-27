import React from "react";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import Form from "./form";
import { FaPlus } from "react-icons/fa6";

export default function Create({
  token,
  role,
}: {
  token: string;
  role: string;
}) {
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex w-full items-center gap-1 sm:w-fit"
        >
          <FaPlus />
          Add New Tracker
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add Tracker</CredenzaTitle>
          <CredenzaDescription>
            Manage and monitor your affiliate marketing campaigns effectively by
            adding a new tracker.
          </CredenzaDescription>
        </CredenzaHeader>
        <Form token={token} role={role} />
      </CredenzaContent>
    </Credenza>
  );
}
