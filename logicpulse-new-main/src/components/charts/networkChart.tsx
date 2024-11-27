"use client"
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getSpeed } from '@/utils/speedTest';

interface SpeedData {
    name: string;
    speed: number | null;
}

const NetworkChart = () => {
    const [speedData, setSpeedData] = useState<SpeedData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const speed = await getSpeed();
                setSpeedData([
                    { name: 'Download', speed: speed.download },
                ]);
            } catch (error) {
                console.error('Error measuring speed:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Internet Speed Test</h1>
            <LineChart
                width={500}
                height={300}
                data={speedData}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="speed" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </div>
    );
};

export default NetworkChart;
