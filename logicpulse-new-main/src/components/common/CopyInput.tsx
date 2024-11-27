import React from 'react'
import { Input } from '../ui/input'
import { toast } from 'sonner';

export default function CopyInput({ url }: { url: string }) {

    const handleCopy = () => {
        navigator.clipboard.writeText(url).then(() => {
            toast.info('Offer url copied to clipboard!');
        }).catch(err => {
            toast.error('Failed to copy!', err);
        });
    }
    return (
        <div>
            <Input type="url" value={url} className="w-[300px] bg-muted"
                onClick={handleCopy} />
        </div>
    )
}
