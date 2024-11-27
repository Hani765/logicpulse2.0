"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { DialogClose } from "@radix-ui/react-dialog";
import { signOut, useSession } from "next-auth/react";
import myAxios from "@/lib/axios.config";
import { LOGOUT_URL, UPDATE_PROFILE } from "@/lib/apiEndPoints";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { CircleUser } from "lucide-react";
import revalidate from "../revalidate";

export default function ProfileMenu({ token, profile_image }: { token: string | null, profile_image: string | undefined }) {

  const [logoutOpen, setLogOutOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState({
    profile_image: [],
  });
  const [loading, setLoading] = useState(false);
  const { update } = useSession();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };
  const logoutUser = async () => {
    setLoading(true);
    myAxios
      .post(
        LOGOUT_URL,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        signOut({
          callbackUrl: "/login",
          redirect: true,
        });
      })
      .catch((err) => {
        toast.error("Something went wrong.Please try again!");
      });
  };

  const updateProfile = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("profile_image", image ?? "");
    myAxios
      .post(UPDATE_PROFILE, formData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        const response = res.data;
        setLoading(false);
        update({ profile_image: response.image });
        toast.success("Profile image updated successfully!");
        revalidate();
        setProfileOpen(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response?.status == 422) {
          setErrors(err.response?.data?.errors);
        } else {
          toast.error("Something went wrong.please try again!");
        }
      });
  };
  return (
    <>
      {/* Logout dialog */}
      <Dialog open={logoutOpen} onOpenChange={setLogOutOpen}>
        <DialogContent className="max-w-lg rounded-sm">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action expire your session and you have to login back to
              access your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4">
            <Button variant="destructive" onClick={logoutUser}>
              Yes Logout!
            </Button>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Image update  */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()} className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Change profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={updateProfile}>
            <div className="mb-2">
              <Label htmlFor="profile">Profile Image</Label>
              <Input
                type="file"
                onChange={handleImageChange}
                className="file:text-white"
                accept="image/png,image/svg,image/jpeg,image/webp"
              />
              <span className="text-red-400">{errors.profile_image?.[0]}</span>
            </div>
            <div className="mb-2">
              <Button className="w-full" disabled={loading}>
                {" "}
                {loading ? "Processing.." : "Update Profile"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="w-10 h-10 rounded-full border overflow-hidden flex items-center justify-center">
            {profile_image ? (
              <Image
                src={getImageUrl(profile_image)}
                width={100}
                height={100}
                alt="logo"
              />
            ) : (
              <CircleUser className="h-5 w-5" />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setProfileOpen(true)}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLogOutOpen(true)}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
