"use client";

import ApexCharts from "apexcharts";
import { Events } from "@/interfaces/database_tables";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function GlobalRevenue({ events }: { events: Array<Events> }) {
    let n = useSelector((state: {TGSSlice: {menuOpen: boolean}}) => state.TGSSlice.menuOpen);

    const yearlyData: Array<{ x: string, y: number }> = [];

    for (let k in events) {
        const year: string = new Date(events[k].eventDate).getFullYear().toString();
        const findYear = yearlyData.find((item) => {return item.x === year});
        if (findYear) {
            yearlyData[yearlyData.indexOf(findYear)].y +=
            (events[k].normalsSold * events[k].normalPrice) +
            (events[k].VIPsSold * (events[k].VIPPrice ? events[k].VIPPrice : 0));
        } else {
            yearlyData.push({
                x: year,
                y: (events[k].normalsSold * events[k].normalPrice) +
                (events[k].VIPsSold * (events[k].VIPPrice ? events[k].VIPPrice : 0)),
            });
        };
    };

    yearlyData.sort((a, b) => {
        return parseInt(a.x) - parseInt(b.x);
    });

    while (yearlyData.length > 7) {
        yearlyData.shift();
    };

    const options = {
        colors: ["#1A56DB"],
        series: [
            {
                name: "Revenue",
                color: "#1A56DB",
                data: yearlyData,
            },
        ],
        chart: {
            sparkline: {
                enable: false,
            },
            type: "area",
            height: "180px",
            fontFamily: "Inter, sans-serif",
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                columnWidth: "100%",
                borderRadiusApplication: "end",
                borderRadius: 0,
            },
        },
        tooltip: {
            enabled: true,
            style: {
                fontFamily: "Inter, sans-serif",
            },
            x: {
                show: false,
            },
        },
        stroke: {
            show: true,
            width: 6,
        },
        grid: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
            position: "top",
        },
        xaxis: {
            floating: false,
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-black'
                },
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-black'
                },
                formatter: (val: string) => {
                    const value = Number(val);
                    return value.toLocaleString("id-ID");
                },
            },
        },
        fill: {
            opacity: 1,
        },
    };
    
    const OpenRevenueChart = () => {
        if(document.getElementById("revenue-chart") && typeof ApexCharts !== 'undefined') {
            const chart = new ApexCharts(document.getElementById("revenue-chart"), options);
            chart.render();
        };
    };

    useEffect(() => {
        if (n) {
            OpenRevenueChart();
        };
    }, [n]);

    return (
        <div className="col-start-2 col-end-3 row-start-1 row-end-2 flex flex-col gap-1 w-full">
            <div className="m-auto font-semibold">
                Revenue
            </div>
            <div className="border border-black" id="revenue-chart" />
        </div>
    );
};