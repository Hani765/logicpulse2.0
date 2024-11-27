import React from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DataPoint {
    date: string;
    value: number;
}

interface RowChartProps {
    data: DataPoint[];
    placeholder: string;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: { payload: DataPoint }[];
    label?: string;
    placeholder?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, placeholder }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip text-sm font-light h-max relative flex flex-col gap-4">
                <div className="tooltip-section shadow bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-50 px-2 py-1 rounded-sm">
                    <p className="intro whitespace-nowrap">
                        {`${placeholder}: ${placeholder === "cvr" ?
                            `${payload[0].payload.value}%` :
                            payload[0].payload.value}`
                        }
                    </p>
                </div>
                <div className="tooltip-section shadow bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-50 px-2 py-1 rounded-sm">
                    <p className="label whitespace-nowrap">{`Date: ${label}`}</p>
                </div>
            </div>
        );
    }
    return null;
};

const RowChart: React.FC<RowChartProps> = ({ data, placeholder }) => {
    return (
        <>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    width={500}
                    height={400}
                    data={data}
                    margin={{
                        top: 2,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#DDA0DD" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#DDA0DD" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Tooltip content={<CustomTooltip placeholder={placeholder} />} />
                    <Area type="monotone" dataKey="value" stroke="#DDA0DD" fillOpacity={1} fill="url(#colorPurple)" />
                </AreaChart>
            </ResponsiveContainer>
        </>
    );
};

export default RowChart;
