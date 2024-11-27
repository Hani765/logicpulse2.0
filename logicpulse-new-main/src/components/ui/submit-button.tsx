'use client';
import { useFormStatus } from 'react-dom';
import { Button } from './button';
import React from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';

export function SubmitButton({ name }: { name: string }) {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} variant="gooeyRight" className="relative px-4 w-full rounded-md h-10 font-medium shadow-lg bg-purple-900 hover:bg-purple-800 text-white">
            {pending ? (
                <React.Fragment>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                </React.Fragment>
            ) : (
                <>
                    {name}
                </>
            )}
        </Button>
    );
}
