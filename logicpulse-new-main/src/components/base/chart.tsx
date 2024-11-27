import React, { useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Chart({ data }: { data: any }) {
    const [isOpen, setIsOpen] = useState(true);

    const handleToggle = () => {
        setIsOpen(prevState => !prevState);
    };

    return (
        <>
            <Collapsible
                className='w-full shadow-sm rounded-sm border bg-white overflow-hidden dark:bg-slate-950'
                open={isOpen}
                onOpenChange={handleToggle}
            >
                <div className="header flex justify-between items-center px-2 py-1 bg-gray-100 dark:bg-gray-800">
                    <h2 className='font-serif text-lg'>Monthly chart</h2>
                    <CollapsibleTrigger asChild>
                        <button onClick={handleToggle} className="focus:outline-none">
                            {isOpen ? <FaAngleUp /> : <FaAngleDown />}
                        </button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className='h-64 w-full pt-4 pr-4'>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="rgba(75,192,192,1)" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CollapsibleContent>
            </Collapsible>
        </>
    );
}
