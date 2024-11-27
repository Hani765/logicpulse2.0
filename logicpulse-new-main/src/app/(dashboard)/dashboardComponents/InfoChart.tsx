import React from 'react';
import TrafficDonutChart from '@/components/charts/trafficDonutChart';
import UserChart from '@/components/charts/usersChart';
import { ScrollArea } from '@/components/ui/scroll-area';
export default async function InfoChart({ token, role }: { token: string, role: string }) {
    return (
        <ScrollArea className="h-[400px] w-full sm:max-w-sm">
            {role !== 'user' ? (
                <UserChart token={token} />
            ) : (
                <UserChart token={token} />
            )}
            <TrafficDonutChart />
        </ScrollArea>
    );
};

