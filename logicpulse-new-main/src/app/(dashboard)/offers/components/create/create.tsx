'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import CreateForm from './createForm';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { MdClose } from 'react-icons/md';
import { API_URL } from '@/lib/apiEndPoints';
import { fetchData } from '@/app/dataFetch/fetchData';

interface CreateProps {
    token: string;
}
interface FetchDataHookReturn {
    dataDomain: DomainType[];
    dataUsers: UserType[];
    networksData: NetworkType[];
    countriesData: CountryType[];
    loading: boolean;
    error: Error | null;
}
export default function Create({ token }: CreateProps) {
    const [open, setOpen] = useState(false);
    const [dataDomain, setDataDomain] = useState<DomainType[]>([]);
    const [dataUsers, setDataUsers] = useState<UserType[]>([]);
    const [networksData, setDataNetworks] = useState<NetworkType[]>([]);
    const [countriesData, setCountriesData] = useState<CountryType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const fetchDataAsync = useCallback(async () => {
        try {
            setLoading(true);
            const domainEndPoint = `${API_URL}/filter/domains`;
            const usersEndPoint = `${API_URL}/filter/users`;
            const networkEndPoint = `${API_URL}/filter/networks`;
            const countriesEndPoint = `${API_URL}/filter/countries`;

            const [domainResponse, usersResponse, networkResponse, countriesResponse] = await Promise.all([
                fetchData({ token, endPoint: domainEndPoint }),
                fetchData({ token, endPoint: usersEndPoint }),
                fetchData({ token, endPoint: networkEndPoint }),
                fetchData({ token, endPoint: countriesEndPoint })
            ]);

            // Assuming the fetchData function returns { data: any }
            setDataDomain(domainResponse.data);
            setDataUsers(usersResponse.data);
            setDataNetworks(networkResponse.data);
            setCountriesData(countriesResponse.data);
            setLoading(false);
        } catch (err) {
            setError(err as Error);
            setLoading(false);
        }
    }, [token]);

    const close = () => {
        setOpen(false);
    }

    useEffect(() => {
        fetchDataAsync();
    }, [fetchDataAsync]);

    useEffect(() => {
        if (error) {
            toast.error('Failed to load data');
        }
    }, [error]);

    return (
        <>
            <div className="bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-900 w-full shadow-sm flex justify-between items-center p-2 rounded">
                <h3 className="font-semibold">Offers</h3>
                <Button onClick={() => setOpen(true)} variant="gooeyRight">
                    Create New
                </Button>
            </div>
            <Drawer open={open} onOpenChange={setOpen} direction="top" dismissible={false}>
                <DrawerContent className='h-full rounded-none'>
                    <DrawerHeader className='flex justify-between items-center'>
                        <DrawerTitle>Create new offer</DrawerTitle>
                        <DrawerClose>
                            <MdClose />
                        </DrawerClose>
                    </DrawerHeader>
                    <div className="h-screen overflow-y-auto">
                        {loading ? (
                            <Skeleton className="h-full w-full rounded-xl" />
                        ) : (<CreateForm
                            token={token}
                            domains={dataDomain}
                            users={dataUsers}
                            networks={networksData}
                            countries={countriesData}
                            doneFunction={close}
                        />
                        )}
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}
