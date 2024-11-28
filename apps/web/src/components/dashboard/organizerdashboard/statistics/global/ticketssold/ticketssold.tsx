"use client";

import ApexCharts from "apexcharts";
import { Events } from "@/interfaces/database_tables";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function GlobalTicketsSold({ events }: { events: Array<Events> }) {
    let n = useSelector((state: {TGSSlice: {menuOpen: boolean}}) => state.TGSSlice.menuOpen);

    const normalData: Array<{ x: string, y: number }> = [];
    const VIPData: Array<{ x: string, y: number }> = [];

    for (let k in events) {
        const year: string = new Date(events[k].eventDate).getFullYear().toString();
        const findYearNormal = normalData.find((item) => {return item.x === year});
        const findYearVIP = VIPData.find((item) => {return item.x === year});
        if (findYearNormal && findYearVIP) {
            normalData[normalData.indexOf(findYearNormal)].y += events[k].normalsSold;
            VIPData[VIPData.indexOf(findYearVIP)].y += events[k].VIPsSold;
        } else {
            normalData.push({
                x: year,
                y: events[k].normalsSold,
            });
            VIPData.push({
                x: year,
                y: events[k].VIPsSold,
            });
        };
    };

    normalData.sort((a, b) => {
        return parseInt(a.x) - parseInt(b.x);
    });
    VIPData.sort((a, b) => {
        return parseInt(a.x) - parseInt(b.x);
    });

    const options = {
        colors: ["#1A56DB", "#A339F4"],
        series: [
            {
                name: "Regular",
                color: "#1A56DB",
                data: normalData,
            },
            {
                name: "VIP",
                color: "#A339F4",
                data: VIPData,
            },
        ],
        chart: {
            sparkline: {
                enable: false,
            },
            type: "bar",
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
            shared: true,
            intersect: false,
            style: {
                fontFamily: "Inter, sans-serif",
            },
        },
        states: {
            hover: {
                filter: {
                    type: "darken",
                    value: 1,
                },
            },
        },
        stroke: {
            show: true,
            width: 0,
            colors: ["transparent"],
        },
        grid: {
            show: false,
            strokeDashArray: 4,
            padding: {
                left: 2,
                right: 2,
                top: -14
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: true,
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
            },
        },
        fill: {
            opacity: 1,
        },
    };
    
    const OpenTicketsChart = () => {
        if(document.getElementById("ticket-chart") && typeof ApexCharts !== 'undefined') {
            const chart = new ApexCharts(document.getElementById("ticket-chart"), options);
            chart.render();
        };
    };

    useEffect(() => {
        if (n) {
            OpenTicketsChart();
        };
    }, [n]);

    return (
        <div className="col-start-1 col-end-2 row-start-1 row-end-2 flex flex-col gap-1 w-full">
            <div className="m-auto font-semibold">
                Tickets Sold
            </div>
            <div className="border border-black" id="ticket-chart" />
        </div>
    );
};