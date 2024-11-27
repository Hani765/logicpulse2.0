'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { MoreHorizontal } from 'lucide-react';
import { API_URL, OFFERS } from '@/lib/apiEndPoints';
import myAxios from '@/lib/axios.config';
import { toast } from 'sonner';
import revalidate from '@/components/revalidate';
import { ReloadIcon } from '@radix-ui/react-icons';
import Update from './update/update';
import { MdClose } from 'react-icons/md';

interface DropdownProps {
    rowCurrent: any;
    token: string;
    role: string;
}

interface ErrorResponse {
    response?: {
        data: any;
    };
}

export default function Dropdown({ rowCurrent, token, role }: DropdownProps) {
    const [updateOpen, setUpdateOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const unique_id = rowCurrent.unique_id;
    const endPoint = `${API_URL}${OFFERS}/${unique_id}`;

    const OfferById = useCallback(async () => {
        try {
            const response = await myAxios.get(endPoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setResponse(response.data);
        } catch (error) {
            const typedError = error as ErrorResponse;
            if (typedError.response) {
                toast.error(typedError.response.data);
            } else {
                toast.error('Request failed');
            }
        }
    }, [endPoint, token]);

    useEffect(() => {
        if (updateOpen) {
            OfferById();
        }
    }, [updateOpen, OfferById]);

    const handleCancelClick = () => {
        setDeleteOpen(false);
    };

    const handleDeleteClick = async () => {
        setLoading(true);
        try {
            const res = await myAxios.delete(endPoint, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.status === 200) {
                toast.success("Offer deleted successfully");
                revalidate();
            } else {
                toast.error("Failed to delete offer");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again!");
        } finally {
            setLoading(false);
            setDeleteOpen(false);
        }
    };

    return (
        <>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="focus:outline-none">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {role === 'admin' || role === 'administrator' ? (
                            <>
                                <DropdownMenuItem onClick={() => setUpdateOpen(true)}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                                    Delete
                                </DropdownMenuItem>
                            </>
                        ) : null}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Drawer open={updateOpen} onOpenChange={setUpdateOpen} direction="top" dismissible={false}>
                <DrawerContent className='h-full rounded-none'>
                    <DrawerHeader className='flex justify-between items-center'>
                        <DrawerTitle className='uppercase'>{rowCurrent.id}: {rowCurrent.name}</DrawerTitle>
                        <DrawerClose>
                            <MdClose />
                        </DrawerClose>
                    </DrawerHeader>
                    <div className="h-screen overflow-y-auto">
                        <Update token={token} response={response} />
                    </div>
                </DrawerContent>
            </Drawer>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className='max-w-lg'>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete? </DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. You are about to delete ({rowCurrent.id}: {rowCurrent.name})
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-4">
                        <DialogClose>
                            <Button onClick={handleCancelClick}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleDeleteClick} variant="destructive" disabled={loading}>
                            {loading ? (
                                <>
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting
                                </>
                            ) : (
                                "Yes, Delete"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
