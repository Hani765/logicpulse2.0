"use client";

import { UserCreateUpdateSkeleton } from "@/components/skeletons/userCreateUpdateSkeleton";
import useFetch from "@/hooks/usefetch";
import { API_URL } from "@/lib/apiEndPoints";
import { User } from "@/types";
import { useParams } from "next/navigation";
import React from "react";
import Form from "./form";
import { LuServerCrash } from "react-icons/lu";

type dataType = {
  name: string;
  unique_id: string;
};

type userData = {
  user: User;
  offer_unique_ids: string;
};

const Fetching = ({ role, token }: { role: string; token: string }) => {
  const { id } = useParams();
  const endPoint = API_URL + "/users/" + id;

  const {
    data: userData,
    error: userError,
    isLoading: userIsLoading,
  } = useFetch<userData>(endPoint, token);

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

  // Show loader when any fetch is in progress
  if (userIsLoading || domainsIsLoading || offersIsLoading) {
    return <UserCreateUpdateSkeleton />;
  }

  // Show "User not found" if userData or userData.user is null
  if (!userData || !userData.user) {
    return (
      <div className="flex min-h-72 w-full flex-col items-center justify-center rounded border border-gray-200 bg-white px-2 py-4 text-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600">
        <div className="text-[70px]">
          <LuServerCrash />
        </div>
        <div>Something went wrong please try to refresh the page.</div>
      </div>
    );
  }

  // Render form when data is available
  return (
    <Form
      role={role}
      token={token}
      offers={offersData || []}
      user={userData.user}
      offer_unique_ids={userData.offer_unique_ids || ""}
      domains={domainsData || []}
      endPoint={endPoint}
    />
  );
};

export default Fetching;
