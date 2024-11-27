import MetaData from "@/action/metaData";
import { CardStackDemo } from "@/components/auth/cards";
import SocialLogin from "@/components/auth/social-login";
import TooltipDemo from "@/components/auth/tolltip-demo";
import { BackgroundBeams } from "@/components/ui/background-beams";
import React from "react";
import { FaStaylinked } from "react-icons/fa6";

export default function LoginLayoutComponent({
  children,
  heading,
  description,
  social,
  socialText,
}: {
  children: React.ReactNode;
  heading: string;
  description: string;
  socialText?: string | "or signin using";
  social?: Boolean | false;
}) {
  return (
    <>
      <div className="absolute left-4 top-2">
        <h2 className="flex w-full items-center justify-center gap-1 text-center text-xl font-bold text-neutral-800 dark:text-neutral-200">
          <FaStaylinked />
          LogicPulse
        </h2>
      </div>
      <div className="bg-white pt-4 dark:bg-slate-950 md:pt-0 lg:overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="col-span-2 min-h-screen overflow-hidden">
            <div className="relative my-4 flex h-full w-full flex-col items-center justify-center py-2 lg:col-span-2">
              {children}
              {social && (
                <>
                  <div className="my-4 h-[1px] w-full bg-gradient-to-r from-transparent via-purple-300 to-transparent dark:via-neutral-700" />
                  <div className="flex w-full items-center justify-center gap-2">
                    <p className="text-center text-sm">{socialText}</p>
                    <SocialLogin />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="relative hidden max-h-full min-h-screen w-full flex-1 flex-col items-center justify-center gap-3 overflow-hidden bg-primary pl-24 pt-10 bg-dot-white/[0.5] lg:col-span-3 lg:flex">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-primary [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <BackgroundBeams />
            <div className="flex flex-col items-start text-white">
              <h2 className="font-bold md:text-4xl">{heading}</h2>
              <p className="mb-10 text-gray-300 md:text-sm">{description}</p>
            </div>
            <div className="flex h-full w-full justify-start">
              <CardStackDemo />
            </div>
            <div className="absolute bottom-4 left-4 z-50 flex">
              <TooltipDemo />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
