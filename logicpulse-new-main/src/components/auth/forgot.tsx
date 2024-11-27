"use client";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/utils/cn";
import { Button } from "../ui/button";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { SubmitButton } from "../ui/submit-button";

export default function Forgot() {
  return (
    <div className="w-full lg:mx-4 mx-2 rounded-none md:rounded-2xl p-4 md:p-8">
      <div className="">
        <h2 className="font-bold text-lg text-neutral-800 dark:text-neutral-200">
          Forgot your password?
        </h2>
        <span className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Reset it here on LogicPulse. Enter your account email to regain access to your account. or? <Button variant="linkHover2" className="p-0 m-0"><Link href="login" className="text-purple-600 hover:text-purple-500"> login now </Link></Button>
        </span>
      </div>
      <form className="my-8">
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" placeholder="you@example.com" type="email" required />
        </LabelInputContainer>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
        </div>
        <SubmitButton name="Reset your account password" />
      </form>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
