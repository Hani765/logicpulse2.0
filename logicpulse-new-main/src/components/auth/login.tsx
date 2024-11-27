"use client";
import React, { FormEventHandler } from "react";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import SocialLogin from "./social-login";
import { LOGIN_CHECK_URL } from "@/lib/apiEndPoints";
import useForm from "@/hooks/use-fom";
import SubmitBtn from "../ui/SubmitBtn";
import { LabelInputContainer } from "../ui/LabelInputContainer";
import { toast } from "sonner";
import LoginLayoutComponent from "@/app/Layouts/layout";

export default function Login() {
  const { data, setData, processing, errors, post, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(LOGIN_CHECK_URL, {
      onSuccess: (response) => {
        toast.success(response.message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onFinish: () => reset("password"),
    });
  };

  return (
    <LoginLayoutComponent
      heading="Login to Elevate Your Affiliate Marketing Game!"
      description="Welcome to Logic Pulse, the ultimate affiliate marketing
      platform. Access powerful tools to drive traffic, gain in-depth
      analytics, and receive comprehensive reports. Join us and
      transform your marketing strategies today!"
      social={true}
      socialText="or signin using"
    >
      <div className="mx-2 w-full rounded-none p-4 md:rounded-2xl md:p-8 lg:mx-4">
        <div className="">
          <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
            Welcome back to Logic Pulse!
          </h2>
          <span className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
            Login to Logic Pulse to elevate your affiliate marketing strategies,
            access in-depth analytics, and drive more traffic. Need an account?{" "}
            <div className="absolute right-3 top-0">
              <Link
                href="signup"
                className={`${buttonVariants({
                  variant: "linkHover1",
                })}`}
              >
                Signup
              </Link>
            </div>
          </span>
        </div>
        <form className="my-8" onSubmit={submit}>
          <LabelInputContainer
            type="email"
            id="password"
            name="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="example@gmail.com"
            label="Email:"
            required
            errorMessage={errors.email}
          />
          <LabelInputContainer
            type="password"
            id="password"
            name="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            placeholder="********"
            errorMessage={errors.password}
            required
            label="Passowrd:"
          />
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={data.remember}
                onCheckedChange={() =>
                  setData({ ...data, remember: !data.remember })
                }
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <Link
              href="forgot"
              className={`${buttonVariants({
                variant: "linkHover1",
              })}`}
            >
              forgot password
            </Link>
          </div>
          <SubmitBtn
            label="Sign in to your account"
            processing={processing}
            className="w-full"
          />
        </form>
        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-purple-300 to-transparent dark:via-neutral-700" />
        <div className="flex w-full items-center justify-center gap-2">
          <p className="text-center text-sm">or sign in using</p>
          <SocialLogin />
        </div>
      </div>
    </LoginLayoutComponent>
  );
}
