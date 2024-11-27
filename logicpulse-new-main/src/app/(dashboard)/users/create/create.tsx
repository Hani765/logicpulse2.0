import { buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function Create() {
  return (
    <Link
      className={`w-full sm:w-fit ${buttonVariants({
        variant: "outline",
      })}`}
      href="/users/create"
    >
      <PlusIcon className="mr-2 size-4" aria-hidden="true" />
      Add New User
    </Link>
  );
}
