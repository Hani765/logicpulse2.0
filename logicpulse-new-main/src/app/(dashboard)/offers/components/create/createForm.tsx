import React, { useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
    Select as ShadcnSelect,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { MdDelete } from 'react-icons/md';
import { API_URL, OFFERS } from '@/lib/apiEndPoints';
import revalidate from '@/components/revalidate';
import { ReloadIcon } from '@radix-ui/react-icons';
import myAxios from '@/lib/axios.config';
import { MultiValue } from 'react-select';
import SelectMulti from '@/components/base/TagsInput';
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { FaSearch } from 'react-icons/fa';
type DeviceType = 'windows' | 'mobiles' | 'linux' | 'android' | 'iOs';

interface TagInputProps {
    domains: DomainType[];
    token: string;
    users: UserType[];
    networks: NetworkType[];
    countries: CountryType[];
    doneFunction: any;
}

interface InputField {
    url: string;
    deviceType: DeviceType | '';
}

interface Option {
    value: string;
    label: string;
}
interface OfferState {
    offer_name: string;
    platform_name: string;
    age: string;
    rate: string;
    encryption: string;
    network_id: string;
    domain_id: string;
    proxy: string;
    details: string;
    users_ids: string;
    status: string;
    countries: string;
    urls: InputField[];
}

const CreateForm: React.FC<TagInputProps> = ({ domains, doneFunction, token, users, networks, countries }) => {
    const deviceTypes: DeviceType[] = ['windows', 'mobiles', 'linux', 'android', 'iOs'];
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: number]: string }>({});
    const [domainOpen, setDomainOpen] = useState(false);
    const [networkOpen, setNetworkOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(
        { network: "", domain: "" });
    const [offerState, setOfferState] = useState<OfferState>({
        offer_name: "",
        platform_name: "",
        age: "",
        rate: "",
        encryption: "",
        network_id: "",
        domain_id: "",
        proxy: "",
        details: "",
        users_ids: "",
        countries: "",
        status: "",
        urls: [{ url: '', deviceType: '' }],
    });
    const filteredDomains = domains.filter((domain) =>
        domain.name.toLowerCase().includes(searchTerm.domain.toLowerCase())
    );
    const filteredNetworks = networks.filter((network) =>
        network.name.toLowerCase().includes(searchTerm.network.toLowerCase())
    );
    const userOptions: Option[] = users.map(user => ({
        value: user.unique_id,
        label: user.name
    }));
    const userChange = (selected: MultiValue<Option>) => {
        const selectedUserIds = (selected || []).map(option => option.value).join(',');
        setOfferState(prevState => ({
            ...prevState,
            users_ids: selectedUserIds
        }));
    };
    const countryOptions: Option[] = countries.map(country => ({
        value: country.unique_id,
        label: country.name
    }));
    const countryChage = (selected: MultiValue<Option>) => {
        const selectedCountries = (selected || []).map(option => option.value).join(',');
        setOfferState(prevState => ({
            ...prevState,
            countries: selectedCountries
        }));
    };
    const handleAddInput = () => {
        setOfferState((prevState) => ({
            ...prevState,
            urls: [...prevState.urls, { url: '', deviceType: '' }],
        }));
    };

    const handleRemoveInput = (index: number) => {
        if (offerState.urls.length > 1) {
            setOfferState((prevState) => {
                const newUrls = prevState.urls.filter((_, i) => i !== index);
                return { ...prevState, urls: newUrls };
            });
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[index];
                return newErrors;
            });
        }
    };

    const handleInputChange = (index: number, field: keyof InputField, value: string) => {
        setOfferState((prevState) => {
            const newUrls = prevState.urls.map((input, i) => i === index ? { ...input, [field]: value } : input);
            return { ...prevState, urls: newUrls };
        });
        if (field === 'url') {
            validateUrl(index, value);
        }
    };

    const validateUrl = (index: number, url: string) => {
        try {
            new URL(url);
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[index];
                return newErrors;
            });
        } catch {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [index]: 'Invalid URL',
            }));
        }
    };

    const selectedDeviceTypes = offerState.urls.map(input => input.deviceType);

    const submitOffer = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        const endPoint = API_URL + OFFERS;
        myAxios.post(endPoint, offerState, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            const response = res.data;
            setLoading(false);
            toast.success("Offer has been added!");
            doneFunction();
            revalidate();
        }).catch((err) => {
            setLoading(false);
            if (err.response?.status === 422) {
                const errorResponse = err.response.data;
                toast.error(errorResponse.message);
            } else {
                toast.error("Something went wrong. Please try again!");
            }
        });
    };
    return (
        <form onSubmit={submitOffer} className='px-4'>
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full flex flex-col gap-2">
                    <div className="flex gap-2 flex-col sm:flex-row">
                        <div className="w-full">
                            <Label htmlFor="offerName">Offer Name:</Label>
                            <Input
                                type='text'
                                value={offerState.offer_name}
                                onChange={e => setOfferState({ ...offerState, offer_name: e.target.value })}
                                required
                                placeholder='Offer Name'
                            />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="platformName">Platform Name:</Label>
                            <Input
                                type='text'
                                value={offerState.platform_name}
                                onChange={e => setOfferState({ ...offerState, platform_name: e.target.value })}
                                required
                                placeholder='Platform Name'
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 flex-col sm:flex-row">
                        <div className="w-full">
                            <Label htmlFor="age">Age:</Label>
                            <Input
                                type='number'
                                value={offerState.age}
                                onChange={e => setOfferState({ ...offerState, age: e.target.value })}
                                required
                                placeholder='18+'
                            />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="rate">Rate:</Label>
                            <Input
                                type='number'
                                value={offerState.rate}
                                onChange={e => setOfferState({ ...offerState, rate: e.target.value })}
                                required
                                placeholder='150'
                            />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="encryption">Encryption:</Label>
                            <Input
                                type='password'
                                value={offerState.encryption}
                                onChange={e => setOfferState({ ...offerState, encryption: e.target.value })}
                                placeholder='*******'
                            />
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="col-span-2">
                            <Label htmlFor="network">Network:</Label>
                            <div>
                                <Popover open={networkOpen} onOpenChange={setNetworkOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={networkOpen}
                                            className="w-full justify-between"
                                        >
                                            {offerState.network_id !== ""
                                                ? networks.find((network) => network.unique_id === offerState.network_id)?.name
                                                : "Select network..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <div className="flex w-full py-1 border-b items-center ">
                                                <FaSearch className='text-muted text-lg ml-2' />
                                                <Input
                                                    placeholder="Search netwoks..."
                                                    className='border-none w-full rounded-none focus-visible:ring-0 focus-visible:ring-offset-0'
                                                    value={searchTerm.network}
                                                    onChange={e => setSearchTerm({ ...searchTerm, network: e.target.value })}
                                                />
                                            </div>
                                            <CommandList>
                                                <CommandEmpty>No network found.</CommandEmpty>
                                                <CommandGroup>
                                                    {filteredNetworks.map((network) => (
                                                        <CommandItem
                                                            key={network.unique_id}
                                                            value={network.unique_id}
                                                            onSelect={(network_id) => {
                                                                setOfferState((prevState) => ({
                                                                    ...prevState,
                                                                    network_id: prevState.network_id === network_id ? "" : network_id,
                                                                }));
                                                                setNetworkOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    offerState.network_id === network.unique_id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {network.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <Label htmlFor="domain">Domain:</Label>
                            <div>
                                <Popover open={domainOpen} onOpenChange={setDomainOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={domainOpen}
                                            className="w-full justify-between"
                                        >
                                            {offerState.domain_id !== ""
                                                ? domains.find((domain) => domain.unique_id === offerState.domain_id)?.name
                                                : "Select domain..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <div className="flex w-full py-1 border-b items-center ">
                                                <FaSearch className='text-muted text-lg ml-2' />
                                                <Input
                                                    placeholder="Search domain..."
                                                    className='border-none w-full rounded-none focus-visible:ring-0 focus-visible:ring-offset-0'
                                                    value={searchTerm.domain}
                                                    onChange={e => setSearchTerm({ ...searchTerm, domain: e.target.value })}
                                                />
                                            </div>
                                            <CommandList>
                                                <CommandEmpty>No domain found.</CommandEmpty>
                                                <CommandGroup>
                                                    {filteredDomains.map((domain) => (
                                                        <CommandItem
                                                            key={domain.unique_id}
                                                            value={domain.unique_id}
                                                            onSelect={(domain_id) => {
                                                                setOfferState((prevState) => ({
                                                                    ...prevState,
                                                                    domain_id: prevState.domain_id === domain_id ? "" : domain_id,
                                                                }));
                                                                setDomainOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    offerState.domain_id === domain.unique_id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {domain.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="w-full">
                            <Label>Proxy check</Label>
                            <ShadcnSelect
                                required
                                value={offerState.proxy}
                                onValueChange={proxy => setOfferState({ ...offerState, proxy })}
                            >
                                <SelectTrigger className="h-9 my-1">
                                    <SelectValue placeholder="proxy" />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {['yes', 'no'].map(statusOption => (
                                        <SelectItem key={statusOption} value={statusOption}>
                                            {statusOption}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </ShadcnSelect>
                        </div>
                    </div>
                    <div className="w-full">
                        <Label htmlFor="message">About:</Label>
                        <Textarea
                            name="message"
                            placeholder="Something about offer..."
                            id="message"
                            onChange={e => setOfferState({ ...offerState, details: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="w-full">
                    {offerState.urls.map((input, index) => (
                        <div key={index} className='w-full flex gap-2 mb-4'>
                            <div className="w-full pt-1">
                                <Label>Offer Url</Label>
                                <Input
                                    type="url"
                                    required
                                    placeholder='https://www.example-offer.com'
                                    className={`py-4 ${errors[index] ? 'border-red-500' : ''}`}
                                    value={input.url}
                                    onChange={(e) => handleInputChange(index, 'url', e.target.value)}
                                />
                                {errors[index] && <p className="text-red-500 text-sm">{errors[index]}</p>}
                            </div>
                            <div className="w-[300px]">
                                <Label>Device Type</Label>
                                <ShadcnSelect
                                    required
                                    value={input.deviceType}
                                    onValueChange={(value: DeviceType) => handleInputChange(index, 'deviceType', value)}
                                >
                                    <SelectTrigger className="h-9 my-1">
                                        <SelectValue placeholder="Device Type" />
                                    </SelectTrigger>
                                    <SelectContent side="top">
                                        {deviceTypes.filter(type => !selectedDeviceTypes.includes(type) || type === input.deviceType).map((statusOption) => (
                                            <SelectItem key={statusOption} value={statusOption}>
                                                {statusOption}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </ShadcnSelect>
                            </div>
                            <Button
                                type="button"
                                onClick={() => handleRemoveInput(index)}
                                className="text-red-500 bg-transparent mt-6 hover:bg-transparent hover:text-red-600"
                            >
                                <MdDelete />
                            </Button>
                        </div>
                    ))}
                    {offerState.urls.length < deviceTypes.length && (
                        <Button
                            type="button"
                            onClick={handleAddInput}
                            variant="ringHover"
                        >
                            Add URL
                        </Button>
                    )}
                </div>
            </div>
            <div className="w-full flex gap-2 flex-col sm:flex-row">
                <div className="w-full">
                    <SelectMulti
                        placeholder="Select users"
                        options={userOptions}
                        selectedOptions={userOptions.filter(option => offerState.users_ids.split(',').includes(option.value))}
                        handleChange={userChange}
                    />
                </div>
                <div className="w-full">
                    <SelectMulti
                        placeholder="Select countries"
                        options={countryOptions}
                        selectedOptions={countryOptions.filter(option => offerState.countries.split(',').includes(option.value))}
                        handleChange={countryChage}
                    />
                </div>
            </div>
            <hr className="my-2" />
            <div className="w-full items-center justify-end flex gap-2">
                <div className="w-full lg:max-w-36">
                    <ShadcnSelect
                        required
                        value={offerState.status}
                        onValueChange={status => setOfferState({ ...offerState, status })}
                    >
                        <SelectTrigger className="h-9 my-1">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {['active', 'inactive', 'paused'].map(statusOption => (
                                <SelectItem key={statusOption} value={statusOption}>
                                    {statusOption}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </ShadcnSelect>
                </div>
                <Button type='submit' disabled={loading} variant="gooeyRight">
                    {loading ? (<React.Fragment>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </React.Fragment>) : ("Submit")}</Button>
            </div>
        </form>
    );
};

export default CreateForm;
