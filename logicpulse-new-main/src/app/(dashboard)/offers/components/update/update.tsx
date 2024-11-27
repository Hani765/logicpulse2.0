'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
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
import UpdateForm from './UpdateForm';

interface UpdateProps {
  token: string;
  response: any;
}

export default function Update({ token, response }: UpdateProps) {
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
    <div className='px-4 h-full w-full'>
      {loading ? (
        <Skeleton className="h-full w-full rounded-xl" />
      ) : (<UpdateForm
        token={token}
        domains={dataDomain}
        users={dataUsers}
        networks={networksData}
        countries={countriesData}
        response={response}
      />
      )}
    </div>
  );
}
