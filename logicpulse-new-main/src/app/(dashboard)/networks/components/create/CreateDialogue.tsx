import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { PlusIcon } from "@radix-ui/react-icons";
import { API_URL } from "@/lib/apiEndPoints";
import Form from "./Form";

export default function Create({ token }: { token: string }) {
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
      toast.error("Error fetching Trackers. Please try later!");
    }
  };
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-fit"
          onClick={fetchTrackers}
        >
          <PlusIcon className="mr-2 size-4" aria-hidden="true" />
          Add New Network
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add Network</CredenzaTitle>
          <CredenzaDescription>
            Use this form to add a new network to your tracker system. Provide
            the necessary details to ensure accurate and effective tracking of
            your affiliate marketing campaigns.
          </CredenzaDescription>
        </CredenzaHeader>
        {fetching ? (
          <CreateNetworkSkeleton />
        ) : (
          <Form trackers={trackers} token={token} />
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
      </div>
    </div>
  );
}
