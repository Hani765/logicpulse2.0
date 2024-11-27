'use client';
import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { PiEyeLight, PiEyeClosed } from 'react-icons/pi';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import SocialLogin from './social-login';
import { toast } from 'sonner';
import myAxios from '@/lib/axios.config';
import { REGISTER_URL } from '@/lib/apiEndPoints';
import { ReloadIcon } from '@radix-ui/react-icons';

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const [loading, setLoading] = useState<boolean>(false);
    const [authState, setAuthState] = useState({
        email: "",
        username: "",
        password: "",
        password_confirmation: "",
    });
    const initialState = {
        username: '',
        email: '',
        password: '',
        password_confirmation: "",
    };
    const [errors, setErrors] = useState({
        email: [],
        username: [],
        password: [],
    });
    const handleSubmit = async (event: React.FormEvent) => {
         event.preventDefault();
        setLoading(true);
        await myAxios
            .post(REGISTER_URL, authState)
            .then((res) => {
                const response = res.data;
                setLoading(false);
                toast.success(response.message);
                setAuthState(initialState);
            })
            .catch((err) => {
                setLoading(false);
                if (err.response?.status == 422) {
                    setErrors(err.response?.data?.errors);
                } else {
                    const errorMessage = err.response?.data?.message || "Something went wrong. Please try again!";
                    if (err.response?.data?.resend_email) {
                        toast.info(errorMessage);
                    } else {
                        toast.error(errorMessage);
                    }
                }
            });
    };
    return (
        <div className="w-full mx-2 lg:mx-4 rounded-none md:rounded-2xl p-4 md:p-8">
            <div className="">
                <h2 className="font-bold text-lg text-neutral-800 dark:text-neutral-200">
                    Welcome to Freelancing Network!
                </h2>
                <span className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                    Sign up now to connect with clients and grow your freelancing career. or?
                    <Button variant="linkHover2" className="p-0 m-0">
                        <Link href="login" className="text-purple-600 hover:text-purple-500"> Login now</Link>
                    </Button>
                </span>
            </div>
            <div className="my-8 w-full">
                <form className='w-full' onSubmit={handleSubmit}>
                    <div className="w-full flex gap-4 flex-col lg:flex-row mb-4">
                        <LabelInputContainer>
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" name="username" placeholder="eg: John Doe" type="text" value={authState.username}
                                onChange={(e) =>
                                    setAuthState({ ...authState, username: e.target.value })
                                }
                                required />
                        </LabelInputContainer>
                        <LabelInputContainer>
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" placeholder="you@example.com" type="email" value={authState.email}
                                onChange={(e) =>
                                    setAuthState({ ...authState, email: e.target.value })
                                }
                                required />
                        </LabelInputContainer>
                    </div>
                    <div className="w-full flex gap-4 flex-col lg:flex-row mb-4">
                        <LabelInputContainer>
                            <Label htmlFor="password">Password</Label>
                            <div className="relative w-full">
                                <Input id="password" name="password" placeholder="••••••••" type={showPassword ? "text" : "password"} required value={authState.password}
                                    onChange={(e) =>
                                        setAuthState({ ...authState, password: e.target.value })
                                    } />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer" onClick={toggleShowPassword} >
                                    {showPassword ? (<PiEyeLight />) : (<PiEyeClosed />)}
                                </div>
                            </div>
                        </LabelInputContainer>
                        <LabelInputContainer>
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <div className="relative w-full">
                                <Input id="confirm-password" name="confirmPassword" placeholder="••••••••" type={showConfirmPassword ? "text" : "password"} value={authState.password_confirmation}
                                    onChange={(e) =>
                                        setAuthState({
                                            ...authState,
                                            password_confirmation: e.target.value,
                                        })
                                    }
                                    required />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer" onClick={toggleShowConfirmPassword}>
                                    {showConfirmPassword ? (<PiEyeLight />) : (<PiEyeClosed />)}
                                </div>
                            </div>
                        </LabelInputContainer>
                    </div>
                    <div className="items-top flex space-x-2 mb-1">
                        <Checkbox id="terms1" required />
                        <div className="grid gap-1 leading-none">
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Accept terms and conditions
                            </label>
                            <p className="text-sm text-muted-foreground">
                                You agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </div>
                    <Button
                        disabled={loading}
                        className="w-full bg-purple-950 hover:bg-purple-800 text-white shadow-lg disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <React.Fragment>
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </React.Fragment>
                        ) : (
                            "Create new account"
                        )}
                    </Button>
                </form>
                <div className="bg-gradient-to-r from-transparent via-purple-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
                <div className="w-full flex justify-center gap-2 items-center">
                    <p className="text-center text-sm">
                        or sign up using
                    </p>
                    <SocialLogin />
                </div>
            </div>
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
