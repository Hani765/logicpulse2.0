"use client";
import LoginLayoutComponent from "@/app/Layouts/layout";
import SubmitBtn from "@/components/ui/SubmitBtn";
import useForm from "@/hooks/use-fom";
import { RESEND_EMAIL_URL } from "@/lib/apiEndPoints";
import Link from "next/link";
import React, { FormEventHandler, useState } from "react";
import { toast } from "sonner";

export default function VerifyEmail() {
  const { post, processing } = useForm({});
  const [success, setSuccess] = useState(false);
  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(RESEND_EMAIL_URL, {
      onSuccess: (response) => {
        toast.success(response.message);
        setSuccess(true);
      },
    });
  };

  return (
    <LoginLayoutComponent
      heading="Login to Elevate Your Affiliate Marketing Game!"
      description="Welcome to Logic Pulse, the ultimate affiliate marketing
            platform. Access powerful tools to drive traffic, gain in-depth
            analytics, and receive comprehensive reports. Join us and
            transform your marketing strategies today!"
    >
      <div className="mx-2 w-full rounded-none p-4 md:rounded-2xl md:p-8 lg:mx-4">
        <div className="mb-4 text-sm text-gray-600">
          Thanks for signing up! Before getting started, could you verify your
          email address by clicking on the link we just emailed to you? If you
          didn`t receive the email, we will gladly send you another.
        </div>
        {success && (
          <div className="mb-4 text-sm font-medium text-green-600">
            A new verification link has been sent to the email address you
            provided during registration.
          </div>
        )}

        <form onSubmit={submit}>
          <div className="mt-4 flex items-center justify-between">
            <Link
              href="/logout"
              as="button"
              className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Log Out
            </Link>
            <SubmitBtn
              label="Resend Verification Email"
              processing={processing}
            />
          </div>
        </form>
      </div>
    </LoginLayoutComponent>
  );
}
