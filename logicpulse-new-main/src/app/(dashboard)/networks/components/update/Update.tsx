import { useState } from "react";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import NetworForm from "./NetworkForm";
import { FaPencil } from "react-icons/fa6";
import { API_URL } from "@/lib/apiEndPoints";
import { Button } from "@/components/ui/button";

export default function EditNetwork({
  rowCurrent,
  token,
}: {
  rowCurrent: any;
  token: string;
}) {
  const [fetching, setFetching] = useState(true);
  const [trackers, setTrackers] = useState([]);
  const fetchTrackers = async () => {
    try {
      const res = await fetch(API_URL + "/fetch/trackers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        toast.error("Failed to fetch data. Please try again later.");
      }
      const data = await res.json();
      setTrackers(data);
      setFetching(false);
    } catch (error) {
      toast.error("Error fetching trackers. Please try later!");
    }
  };
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button
          onClick={fetchTrackers}
          variant="ghost"
          className="flex w-full items-center justify-center gap-4 rounded-md py-1.5 hover:bg-slate-50"
        >
          Edit
          <FaPencil size={11} />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Update Network</CredenzaTitle>
          <CredenzaDescription>
            Modify the details of your existing network. Ensure that all
            information is accurate to maintain effective tracking and
            performance monitoring.
          </CredenzaDescription>
        </CredenzaHeader>
        {fetching ? (
          <CreateNetworkSkeleton />
        ) : (
          <NetworForm
            trackers={trackers}
            rowCurrent={rowCurrent}
            token={token}
          />
        )}
      </CredenzaContent>
    </Credenza>
  );
}

export function CreateNetworkSkeleton() {
  return (
    <div className="space-y-4 p-2 sm:p-0">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
