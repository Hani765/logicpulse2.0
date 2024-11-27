import { getUserDetails } from "@/lib/getUserDetails";
import { Metadata } from "next";
import Form from "./Form";
export const metadata: Metadata = {
  title: "Create new user | Logicpulse",
  description:
    "Fill out the form below to add a new user. Please provide the necessary details including domain and offer information to ensure the user is setup correctly.",
};
export default async function page() {
  const user = await getUserDetails();
  const token = user?.token;
  const role = user?.userDetails?.role || "user";
  return (
    <>
      <h2 className="text-lg">Create new user</h2>
      <p className="hidden py-1 text-sm text-gray-500 sm:block">
        Fill out the form below to add a new user. Please provide the necessary
        details including domain and offer information to ensure the user is set
        up correctly.
      </p>
      <Form role={role} token={token} />
    </>
  );
}
