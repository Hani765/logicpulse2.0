import { toast } from "sonner";
import React, { useState } from "react";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NetworkType } from "@/types";
import SearchSelect from "@/components/ui/search-select";
import SubmitBtn from "@/components/ui/SubmitBtn";
import useForm from "@/hooks/use-fom";
import revalidate from "@/action/revalidate";
import { API_URL, NETWORKS } from "@/lib/apiEndPoints";

export default function NetworForm({
  trackers,
  rowCurrent,
  token,
}: {
  trackers: any;
  token: string;
  rowCurrent: NetworkType;
}) {
  const { data, setData, processing, put, reset, errors } = useForm({
    name: rowCurrent.name,
    tracker_id: rowCurrent.tracker_id,
    status: rowCurrent.status,
  });
  const createNetwork = async (event: React.FormEvent) => {
    event.preventDefault();
    put(
      API_URL + NETWORKS + `/${rowCurrent.unique_id}`,
      {
        onSuccess: (response) => {
          toast.success(response.message);
          revalidate();
          reset();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
      token,
    );
  };
  return (
    <form onSubmit={createNetwork} className="w-full p-2 sm:p-0">
      <div className="w-full space-y-2">
        <div className="w-full space-y-2">
          <LabelInputContainer
            required
            type="text"
            id="network"
            placeholder="CPA MATICA"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            autoFocus
            errorMessage={errors.name}
            label="Network Name"
            popoverMessage="Enter the name of the network you wish to add. This should be a unique and easily identifiable name for your reference."
          />
          <div>
            <SearchSelect
              items={trackers}
              selected_value={data.tracker_id}
              onSelect={(unique_id: string) =>
                setData({ ...data, tracker_id: unique_id })
              }
              label="Select Tracker"
              errorMessage={errors.tracker_id}
              description="Choose a tracker from the list to associate with this network."
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <div className="w-34">
            <Select
              value={data.status}
              onValueChange={(status) => setData({ ...data, status })}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent side="top">
                {["active", "inactive"].map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption}>
                    {statusOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <SubmitBtn processing={processing} label="Create new Network" />
        </div>
      </div>
    </form>
  );
}
