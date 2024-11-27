'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import SelectMulti from '@/components/base/TagsInput';
import { toast } from 'sonner';
import { ReloadIcon } from '@radix-ui/react-icons';
import myAxios from '@/lib/axios.config';
import revalidate from '@/components/revalidate';
import { API_URL, DOMAIN } from '@/lib/apiEndPoints';
import { MultiValue } from 'react-select';
import { Credenza, CredenzaContent, CredenzaHeader, CredenzaTitle } from '@/components/ui/credenza';
import { fetchData } from '@/app/dataFetch/fetchData';

interface UpdateProps {
    token: string;
    domainEndpoint: string;
    rowCurrent: any;
}

interface UpdateState {
    name: string;
    status: string;
    users_ids: string;
}

interface Option {
    value: string;
    label: string;
}

interface UserType {
    unique_id: string;
    name: string;
}

export default function Update({ token, rowCurrent, domainEndpoint }: UpdateProps) {
    const [loading, setLoading] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [users, setUsers] = useState<UserType[]>([]);
    const [response, setResponse] = useState<any>(null);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [updateState, setUpdateState] = useState<UpdateState>({
        name: '',
        status: '',
        users_ids: '',
    });

    const endPoint = `${API_URL + DOMAIN}/${rowCurrent.unique_id}`;

    const fetchResponse = useCallback(async () => {
        try {
            setFetchLoading(true);
            const data: any = await fetchData({ token, endPoint });
            setResponse(data.data);
            setUpdateState({
                name: data.data.domain.name,
                status: data.data.domain.status,
                users_ids: data.data.user_ids.join(','),
            });
        } finally {
            setFetchLoading(false);
        }
    }, [token, endPoint]);

    const fetchUsers = useCallback(async () => {
        try {
            setFetchLoading(true);
            const userEndPoint = `${API_URL}/filter/users`;
            const data: any = await fetchData({ token, endPoint: userEndPoint });
            setUsers(data.data);
        } finally {
            setFetchLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUsers();
        fetchResponse();
    }, [fetchUsers, fetchResponse]);

    const userOptions: Option[] = users.map(user => ({
        value: user.unique_id,
        label: user.name,
    }));

    const userChange = (selected: MultiValue<Option>) => {
        const selectedUserIds = selected.map(option => option.value).join(',');
        setUpdateState(prevState => ({
            ...prevState,
            users_ids: selectedUserIds,
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        // Convert selectedUsers to an array of unique_ids
        const selectedUserIds = updateState.users_ids.split(',');

        // Prepare data to submit
        const dataToSubmit = {
            ...updateState,
            selectedUsers: selectedUserIds,
        };

        // Construct API endpoint URL
        const updateEndPoint = `${API_URL + DOMAIN}/${response.domain.unique_id}`;

        try {
            // Send a POST request to update the domain
            await myAxios.post(updateEndPoint, dataToSubmit, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Handle successful response
            toast.success('Domain has been updated!');
            revalidate();
        } catch (err: any) {
            // Handle request errors or validation errors
            if (err.response?.status === 422) {
                const errorResponse = err.response.data;
                toast.error(errorResponse.message);
            } else {
                toast.error('Something went wrong. Please try again!');
            }
        } finally {
            // Reset loading state
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant="ghost" size="sm" className="py-1 w-full m-0" onClick={() => setUpdateOpen(true)}>Edit</Button>
            <Credenza open={updateOpen} onOpenChange={setUpdateOpen}>
                <CredenzaContent>
                    <CredenzaHeader>
                        <CredenzaTitle>Edit Domain</CredenzaTitle>
                    </CredenzaHeader>
                    {fetchLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
                            Loading...
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600 dark:text-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="flex gap-2 items-center">
                                    <div className="w-full">
                                        <Label>Domain</Label>
                                        <Input
                                            required
                                            type="url"
                                            id="large-url"
                                            placeholder="https://www.example.com"
                                            className="rounded-sm mt-1 w-full"
                                            value={updateState.name}
                                            onChange={(e) =>
                                                setUpdateState({ ...updateState, name: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label>Status</Label>
                                        <Select
                                            value={updateState.status}
                                            onValueChange={(status) =>
                                                setUpdateState({ ...updateState, status })
                                            }
                                        >
                                            <SelectTrigger className="h-9 my-1">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent side="top">
                                                {['active', 'inactive'].map((statusOption) => (
                                                    <SelectItem key={statusOption} value={statusOption}>
                                                        {statusOption}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="w-full py-2">
                                    <SelectMulti
                                        placeholder="Select users"
                                        options={userOptions}
                                        selectedOptions={userOptions.filter(option => updateState.users_ids.split(',').includes(option.value))}
                                        handleChange={userChange}
                                    />
                                </div>
                                <div className="flex items-center justify-end">
                                    <Button type="submit" className="bg-blue-700 hover:bg-blue-600" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Submit'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </CredenzaContent>
            </Credenza>
        </>
    );
}
