"use client"
import React, { useEffect, useState } from 'react';

function formatNumber(value: number | undefined | null): string {
    if (value === undefined || value === null) {
        return '0';
    } else if (value >= 1000000) {
        return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
        return `${(value / 1000).toFixed(2)}k`;
    } else {
        return value.toString();
    }
}

interface ProgressProps {
    currentValue: number;
    totalValue: number;
    label: string;
    placeholder: string;
}

const Progress: React.FC<ProgressProps> = ({ currentValue, totalValue, label, placeholder }) => {
    const [displayedValue, setDisplayedValue] = useState(0);
    const progressPercentage = (displayedValue / totalValue) * 100;

    useEffect(() => {
        let start = 0;
        const duration = 2000; // duration of the animation in milliseconds
        const startTime = performance.now();

        const animateCount = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(progress * currentValue);
            setDisplayedValue(value);

            if (progress < 1) {
                requestAnimationFrame(animateCount);
            }
        };

        requestAnimationFrame(animateCount);
    }, [currentValue]);

    return (
        <>
            <p className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-900 dark:text-gray-50">{label}</span>
                <span className="font-normal text-gray-600 dark:text-gray-50">
                    {placeholder === 'cvr' ? (
                        <>{currentValue}% / {totalValue}%</>
                    ) : (
                        <>{formatNumber(displayedValue)} / {formatNumber(totalValue)}</>
                    )}
                </span>
            </p >
            <div className="w-full bg-purple-200 rounded-full h-1.5 mb-2 dark:bg-purple-300 overflow-hidden">
                <div
                    className="bg-purple-600 h-1.5 rounded-full dark:bg-purple-500"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
        </>
    );
};

export default Progress;
