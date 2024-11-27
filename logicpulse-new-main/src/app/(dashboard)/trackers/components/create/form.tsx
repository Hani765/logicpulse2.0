import { toast } from "sonner";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import SubmitBtn from "@/components/ui/SubmitBtn";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import useForm from "@/hooks/use-fom";
import { API_URL, TRACKERS } from "@/lib/apiEndPoints";
import revalidate from "@/action/revalidate";
export default function Form({ token, role }: { token: string; role: string }) {
  const { data, setData, processing, post, reset, errors } = useForm({
    name: "",
    param: "",
    value: "",
    visiblity: "private",
  });
  const createTracker = async (event: React.FormEvent) => {
    event.preventDefault();
    post(
      API_URL + TRACKERS,
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
    <form className="space-y-2 p-4 sm:p-0" onSubmit={createTracker}>
      <div className="w-full space-y-2">
        <LabelInputContainer
          type="text"
          autoFocus
          id="tracker-name"
          placeholder="Tracker name"
          label="Name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          errorMessage={errors.name}
          popoverMessage="Enter a unique name for your tracker. This name will help you identify the tracker later."
          required
        />
        <LabelInputContainer
          type="text"
          id="tracker-param"
          placeholder="e.g., sub2"
          label="Param"
          value={data.param}
          onChange={(e) => setData({ ...data, param: e.target.value })}
          errorMessage={errors.param}
          popoverMessage="Specify the parameter for your tracker. This typically represents a sub-parameter for tracking purposes."
          required
        />
        <LabelInputContainer
          type="text"
          id="tracker-value"
          placeholder="e.g., {sub2}"
          label="Value"
          value={data.value}
          onChange={(e) => setData({ ...data, value: e.target.value })}
          errorMessage={errors.value}
          popoverMessage="Provide the value for the tracker parameter. Use placeholders like {sub2} to dynamically track different values."
          required
        />
        {role === "administrator" && (
          <div className="">
            <Label>Visible</Label>
            <Select
              value={data.visiblity}
              onValueChange={(visiblity) => setData({ ...data, visiblity })}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select visiblity" />
              </SelectTrigger>
              <SelectContent side="top">
                {["private", "public"].map((visibleOption) => (
                  <SelectItem key={visibleOption} value={visibleOption}>
                    {visibleOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <SubmitBtn
        processing={processing}
        label="Create new"
        className="w-full"
      />
    </form>
  );
}
