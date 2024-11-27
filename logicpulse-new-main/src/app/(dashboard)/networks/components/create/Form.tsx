import { toast } from "sonner";
import React from "react";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import SearchSelect from "@/components/ui/search-select";
import SubmitBtn from "@/components/ui/SubmitBtn";
import useForm from "@/hooks/use-fom";
import { API_URL, NETWORKS } from "@/lib/apiEndPoints";
import revalidate from "@/action/revalidate";

export default function Form({
  trackers,
  token,
}: {
  trackers: any;
  token: string;
}) {
  const { data, setData, processing, post, reset, errors } = useForm({
    name: "",
    tracker_id: "",
  });
  const createNetwork = async (event: React.FormEvent) => {
    event.preventDefault();
    post(
      API_URL + NETWORKS,
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
    <form onSubmit={createNetwork} className="w-full p-2 sm:p-0">
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
        <SubmitBtn
          processing={processing}
          label="Create new Network"
          className="w-full"
        />
      </div>
    </form>
  );
}
