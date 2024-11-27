"use client";

import Link from "next/link";
import { CircleUser, LayoutGrid, LogOut, User } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import ChangeProfile from "./changeProfile";
import UserLogout from "./user-logout";
interface NavbarProps {
  username: string | undefined;
  email: string | undefined;
  token: string | undefined;
  profile_image: string | undefined;
}
export function UserNav({ username, email, token, profile_image }: NavbarProps) {
  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <div
                className="relative h-8 w-8 rounded-full overflow-hidden flex justify-center items-center border"
              >
                {profile_image ? (
                  <Image
                    src={getImageUrl(profile_image)}
                    width={0}
                    height={0}
                    alt="logo"
                    loading="lazy"
                    sizes="30"
                    className="cursor-pointer w-full h-full"
                  />
                ) : (
                  <CircleUser className="h-5 w-5 cursor-pointer" />
                )}
              </div>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{username ? (
              username
            ) : (
              "John Doe"
            )}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email ? (
                email
              ) : (
                "john-doe@domain.com"
              )}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/" className="flex items-center">
              <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/account" className="flex items-center">
              <User className=" w-4 h-4 mr-3 text-muted-foreground" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <ChangeProfile token={token} />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <UserLogout token={token} />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
