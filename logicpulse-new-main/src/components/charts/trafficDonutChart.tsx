"use client"
import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const data = [
    {
        name: 'Google',
        value: 31.47,
    },
    {
        name: 'Facebook',
        value: 26.69,
    },
    {
        name: 'Snapchat',
        value: 15.69,
    },
    {
        name: 'Instagram',
        value: 8.22,
    },
    {
        name: 'TikTok',
        value: 18.63,
    }
];

const series = data.map(item => item.value);
const labels = data.map(item => item.name);

const options: ApexOptions = {
    chart: {
        type: 'donut',
        height: 200
    },
    plotOptions: {
        pie: {

            donut: {
                labels: {
                    show: true,
                    name: {
                        show: true,
                        offsetY: 20,
                        fontFamily: "Inter, sans-serif",
                        fontSize: '12px',
                        fontWeight: 400,
                        color: 'red',
                    },
                    value: {
                        show: true,
                        offsetY: -20,
                        fontFamily: "Inter, sans-serif",
                        fontSize: '12px',
                        fontWeight: 400,
                        color: 'red',
                        formatter: function (value: any) {
                            const numValue = Number(value);
                            return `${numValue.toFixed(2)}%`;
                        },
                    },
                    total: {
                        show: true,
                        label: 'Total Trafic',
                        fontFamily: "Inter, sans-serif",
                        fontSize: '12px',
                        fontWeight: 400,
                        color: 'red',
                        formatter: function (w: any) {
                            const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                            return `${total.toFixed(2)}%`;
                        },
                    }
                },
                size: "80%",
            },
        },
    },
    labels: labels,
    legend: {
        position: 'left',
        horizontalAlign: 'center',
        labels: {
            useSeriesColors: true
        }
    },
    dataLabels: {
        enabled: false
    },
    grid: {
        padding: {
            top: -2,
        },
    },
};

const TrafficDonutChart: React.FC = () => {
    return (
        <div className="bg-white rounded-sm shadow dark:bg-gray-800 p-2 mt-2">
            <div className="flex justify-between">
                <div className="flex justify-center items-center">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">Traffic sources</h5>
                </div>
                <div>
                    <button type="button" data-tooltip-target="data-tooltip" data-tooltip-placement="bottom" className="hidden sm:inline-flex items-center justify-center text-gray-500 w-8 h-8 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3" />
                        </svg>
                        <span className="sr-only">Download data</span>
                    </button>
                    <div id="data-tooltip" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                        Download CSV
                        <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                </div>
            </div>
            <Chart options={options} series={series} type="donut" height={200} />
        </div>
    );
};

export default TrafficDonutChart;
