import revalidate from "@/components/revalidate";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Label } from "@/components/ui/label";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import SubmitBtn from "@/components/ui/SubmitBtn";
import useForm from "@/hooks/use-fom";
import { TrackerType } from "@/types";
import React, { useState } from "react";
import { toast } from "sonner";

export default function Update({
  rowCurrent,
  token,
  endPoint,
  role,
}: {
  rowCurrent: TrackerType;
  token: string;
  endPoint: string;
  role: string;
}) {
  const [updateOpen, setUpdateOpen] = useState(false);
  const { data, setData, processing, put, errors } = useForm({
    name: rowCurrent.name,
    param: rowCurrent.param,
    value: rowCurrent.value,
    visiblity: rowCurrent.visiblity,
    status: rowCurrent.status,
  });
  const updateTracker = async (event: React.FormEvent) => {
    event.preventDefault();
    put(
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
      <Credenza open={updateOpen} onOpenChange={setUpdateOpen}>
        <CredenzaTrigger asChild>
          <Button variant="ghost" size="sm" className="m-0 w-full py-1">
            Edit
          </Button>
        </CredenzaTrigger>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Update Tracker {rowCurrent.id}</CredenzaTitle>
            <CredenzaDescription>
              Manage and monitor your affiliate marketing campaigns effectively
              by adding a new tracker.
            </CredenzaDescription>
          </CredenzaHeader>
          <form className="space-y-2" onSubmit={updateTracker}>
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
            <div className="w-full">
              <Label>Status</Label>
              <Select
                value={data.status}
                onValueChange={(status) => setData({ ...data, status })}
              >
                <SelectTrigger className="my-1 h-9">
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
            <SubmitBtn
              label="update Tracker"
              processing={processing}
              className="w-full"
            />
          </form>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
