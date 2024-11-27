"use client";
import React, { FormEventHandler } from "react";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import { toast } from "sonner";
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
import { API_URL, DOMAIN } from "@/lib/apiEndPoints";
import revalidate from "@/action/revalidate";

export default function Form({ role, token }: { role: string; token: string }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    visiblity: "private",
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(
      API_URL + DOMAIN,
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
    ); // Pass the token as the third parameter
  };

  return (
    <form className="w-full p-2 sm:p-0" onSubmit={submit}>
      <div className="mb-2 flex w-full flex-col items-end gap-2">
        <div className="w-full">
          <LabelInputContainer
            label="Domain"
            description="Please enter a valid URL for the domain."
            type="url"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            required
            id="large-url"
            placeholder="https://www.example.com"
            errorMessage={errors.name}
          />
          {role === "administrator" && (
            <div className="">
              <Label>Visible</Label>
              <Select
                value={data.visiblity}
                onValueChange={(visiblity) => setData({ ...data, visiblity })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select status" />
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
          label="Create new domain"
          className="w-full"
        />
      </div>
    </form>
  );
}
