"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button';
import {
    Credenza,
    CredenzaClose,
    CredenzaContent,
    CredenzaHeader,
    CredenzaTitle,
} from "@/components/ui/credenza"
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import revalidate from '../revalidate';
import myAxios from '@/lib/axios.config';
import { UPDATE_PROFILE } from '@/lib/apiEndPoints';
import { MdCamera } from 'react-icons/md';
import Link from 'next/link';
export default function ChangeProfile({ token }: { token: string | undefined }) {
    const [profileOpen, setProfileOpen] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [errors, setErrors] = useState({
        profile_image: [],
    });
    const [loading, setLoading] = useState(false);
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
        }
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
            <Link href="#" className="flex items-center px-2 py-1 hover:bg-accent rounded" onClick={() => setProfileOpen(true)}>
                <MdCamera className=" w-4 h-4 mr-3 text-muted-foreground" />
                Profile pic
            </Link>
            <Credenza open={profileOpen} onOpenChange={setProfileOpen}>
                <CredenzaContent >
                    <CredenzaHeader>
                        <CredenzaTitle>Change profile</CredenzaTitle>
                    </CredenzaHeader>
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
                        <div className="mb-2 flex gap-4 flex-col">
                            <Button className="w-full" disabled={loading} variant="gooeyRight">
                                {loading ? "Processing.." : "Update Profile"}
                            </Button>
                            <CredenzaClose className='w-full'>
                                Cancel
                            </CredenzaClose>
                        </div>
                    </form>
                </CredenzaContent>
            </Credenza>
        </>
    )
}
