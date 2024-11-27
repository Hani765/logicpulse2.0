"use client";
import React from "react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import SubmitBtn from "@/components/ui/SubmitBtn";
import useForm from "@/hooks/use-fom";
import { API_URL, USERS } from "@/lib/apiEndPoints";
import { UserCreateUpdateSkeleton } from "@/components/skeletons/userCreateUpdateSkeleton";
import Link from "next/link";
import useFetch from "@/hooks/usefetch";
import { getRoleOptions, statusOptions } from "@/lib/otpions";
import { Label } from "@/components/ui/label";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchSelect from "@/components/ui/search-select";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import redirectPath from "@/action/redirect";
type dataType = {
  name: "";
  unique_id: "";
};
export default function Form({ token, role }: { token: string; role: string }) {
  const { data, setData, post, errors, processing } = useForm({
    username: "",
    email: "",
    password: "",
    profile_image: "",
    domain_id: "",
    rate: "",
    phone: "",
    skype: "",
    details: "",
    offer_ids: "",
    notification: "yes",
    role: "",
    isVerified: "no",
    status: "active",
  });

  const {
    data: domainsData,
    error: domainsError,
    isLoading: domainsIsLoading,
  } = useFetch<dataType[]>(API_URL + "/fetch/domains", token);
  const {
    data: offersData,
    error: offersErrors,
    isLoading: offersIsLoading,
  } = useFetch<dataType[]>(API_URL + "/fetch/offers", token);

  const createUser = async (event: React.FormEvent) => {
    event.preventDefault();
    post(
      API_URL + USERS,
      {
        onSuccess: (response) => {
          toast.success(response.message);
          redirectPath("/users");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
      token,
    );
  };
  const roleOptions = getRoleOptions(role);
  return (
    <div>
      {domainsIsLoading || offersIsLoading ? (
        <UserCreateUpdateSkeleton />
      ) : (
        <>
          <form onSubmit={createUser}>
            <div className="w-full space-y-2">
              <div className="rounded bg-white p-2 dark:bg-slate-800">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                  <LabelInputContainer
                    type="text"
                    id="username"
                    value={data.username}
                    onChange={(e) =>
                      setData({
                        ...data,
                        username: e.target.value,
                      })
                    }
                    required
                    placeholder="eg: john doe"
                    className="col-span-2 md:col-span-1"
                    label="Username"
                    errorMessage={errors.username}
                    autoFocus
                  />
                  <LabelInputContainer
                    type="email"
                    id="email"
                    value={data.email}
                    onChange={(e) =>
                      setData({
                        ...data,
                        email: e.target.value,
                      })
                    }
                    required
                    placeholder="example@gmail.com"
                    label="Email"
                    errorMessage={errors.email}
                  />
                  <LabelInputContainer
                    id="password"
                    placeholder="********"
                    type="password"
                    value={data.password}
                    onChange={(e) =>
                      setData({
                        ...data,
                        password: e.target.value,
                      })
                    }
                    required
                    errorMessage={errors.password}
                    label="Password"
                  />
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
                  <div className="w-full">
                    <SearchSelect
                      items={domainsData}
                      selected_value={data.domain_id}
                      onSelect={(unique_id: string) => {
                        setData({ ...data, domain_id: unique_id });
                      }}
                      label="Select Domain"
                      errorMessage={errors.domain_id}
                      description="Select a domain that you want to assing to user."
                    />
                  </div>
                  <LabelInputContainer
                    type="number"
                    value={data.rate}
                    onChange={(e) =>
                      setData({
                        ...data,
                        rate: e.target.value,
                      })
                    }
                    required
                    placeholder="150"
                    label="Rate"
                    id="rate"
                    errorMessage={errors.rate}
                  />
                  <LabelInputContainer
                    type="number"
                    value={data.phone}
                    onChange={(e) =>
                      setData({
                        ...data,
                        phone: e.target.value,
                      })
                    }
                    required
                    placeholder="+123-456-789"
                    label="Phone"
                    id="phone"
                    errorMessage={errors.phone}
                  />
                  <LabelInputContainer
                    type="number"
                    value={data.skype}
                    onChange={(e) =>
                      setData({
                        ...data,
                        skype: e.target.value,
                      })
                    }
                    required
                    placeholder="+123-456-789"
                    label="Skype"
                    id="skype"
                    errorMessage={errors.skype}
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="message">About:</Label>
                  <Textarea
                    name="message"
                    placeholder="Something about user..."
                    id="message"
                    onChange={(e) =>
                      setData({
                        ...data,
                        details: e.target.value,
                      })
                    }
                    required
                    value={data.details}
                  />
                </div>
                <MultiSelect
                  items={offersData || []}
                  selectedItems={data.offer_ids}
                  onSelect={(unique_ids: string) =>
                    setData({ ...data, offer_ids: unique_ids })
                  }
                  label="Select Offers"
                  descriptoin="Select offers that you want to assign to this user."
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="w-full">
                    <Label htmlFor="message">Allow notifications:</Label>
                    <ShadcnSelect
                      required
                      value={data.notification}
                      onValueChange={(notification) =>
                        setData({ ...data, notification })
                      }
                    >
                      <SelectTrigger className="my-1 h-9">
                        <SelectValue placeholder="Allow notification" />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {["yes", "no"].map((notifyOption) => (
                          <SelectItem key={notifyOption} value={notifyOption}>
                            {notifyOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </ShadcnSelect>
                  </div>
                  <div className="w-full">
                    <Label htmlFor="message">Role:</Label>
                    <ShadcnSelect
                      required
                      value={data.role}
                      onValueChange={(role) => setData({ ...data, role })}
                    >
                      <SelectTrigger className="my-1 h-9">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </ShadcnSelect>
                  </div>
                  <div className="w-full">
                    <Label htmlFor="message">Is verified:</Label>
                    <ShadcnSelect
                      required
                      value={data.isVerified}
                      onValueChange={(isVerified) =>
                        setData({ ...data, isVerified })
                      }
                    >
                      <SelectTrigger className="my-1 h-9">
                        <SelectValue placeholder="Email verfication" />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {["yes", "no"].map((verifyOption) => (
                          <SelectItem key={verifyOption} value={verifyOption}>
                            {verifyOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </ShadcnSelect>
                  </div>
                  <div className="w-full">
                    <Label htmlFor="message">Status:</Label>
                    <ShadcnSelect
                      required
                      value={data.status}
                      onValueChange={(status) => setData({ ...data, status })}
                    >
                      <SelectTrigger className="my-1 h-9">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </ShadcnSelect>
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-3" />
            <div className="flex w-full items-center gap-2">
              <Link
                href="/users"
                className={`w-full ${buttonVariants({ variant: "outline" })}`}
              >
                Cancel
              </Link>
              <SubmitBtn
                label="Create"
                className="w-full"
                processing={processing}
              />
            </div>
          </form>
        </>
      )}
    </div>
  );
}
