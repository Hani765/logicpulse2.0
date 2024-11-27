import React from "react";
import FirstSection from "./dashboardComponents/firstSection";
import { getUserDetails } from "@/lib/getUserDetails";
import OffersTable from "./dashboardComponents/offersTable";
import SecondSection from "./dashboardComponents/secondSection";

export default async function page({ searchParams }: { searchParams: any }) {
  const user = await getUserDetails();
  const token = user?.token;
  const role = user?.userDetails?.role || "user";
  return (
    <div className="flex min-h-screen w-full flex-col gap-4">
      <FirstSection token={token} role={role} />
      <SecondSection token={token} role={role} searchParams={searchParams} />
      <section className="mt-4 w-full">
        <OffersTable searchParams={searchParams} />
      </section>
    </div>
  );
}
