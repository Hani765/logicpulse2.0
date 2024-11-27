'use client';

import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

// TrafficDonutChart component definition
const TrafficDonutChart: React.FC<{ response: any }> = ({ response }) => {
    const data = response?.users_count || []; // Handle potential null/undefined response
    const series = data.map((item: any) => item.total); // Adjusted to handle any type
    const labels = data.map((item: any) => item.role); // Adjusted to handle any type

    const options: ApexOptions = {
        chart: {
            type: 'donut',
            height: 100,
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            offsetY: 20,
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '12px',
                            fontWeight: 400,
                            color: 'red',
                        },
                        value: {
                            show: true,
                            offsetY: -20,
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '12px',
                            fontWeight: 400,
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '4px',
                            fontWeight: 400,
                        },
                    },
                    size: '80%',
                },
            },
        },
        labels: labels,
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            labels: {
                useSeriesColors: true,
            },
        },
        dataLabels: {
            enabled: false,
        },
        grid: {
            padding: {
                top: -2,
            },
        },
    };

    return (

        <Chart options={options} series={series} type="donut" height={100} />
    );
};

export default TrafficDonutChart;
