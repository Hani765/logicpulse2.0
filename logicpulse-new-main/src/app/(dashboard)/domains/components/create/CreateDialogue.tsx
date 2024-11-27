import { Button } from "@/components/ui/button";
import Form from "./Form";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { FaPlus } from "react-icons/fa";

export default function Create({
  role,
  token,
}: {
  role: string;
  token: string;
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
          Add New Domain
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Add Domain</CredenzaTitle>
          <CredenzaDescription>
            Add a new domain to access offers via custom domain.
          </CredenzaDescription>
        </CredenzaHeader>
        <Form role={role} token={token} />
      </CredenzaContent>
    </Credenza>
  );
}
