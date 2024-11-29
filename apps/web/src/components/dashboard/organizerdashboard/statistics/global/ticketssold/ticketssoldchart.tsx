"use client";

import { Events } from "@/interfaces/database_tables";
import React, { Component } from "react";
import Chart from "react-apexcharts";

interface IState {
    options: {
      chart: {
        id: string;
        toolbar: {
          show: boolean;
        };
      };
      tooltip?: Object;
      xaxis: {
        categories: Array<string>;
        tickPlacement: string;
        position: string;
        overwriteCategories?: any;
        labels: {
          show: boolean;
          rotate: number;
          rotateAlways: boolean;
        };
        tooltip?: Object;
      };
      yaxis?: Object;
      dataLabels: Object;
      legend: Object;
    };
    series: Array<{
      name: string;
      data: Array<number>;
      color: string;
    }>;
};

class GlobalTicketsSold extends Component<{
    events: Array<Events>,
    year: number,
}, IState> {
    constructor({ events, year }: { events: Array<Events>, year: number }) {
      super({ events, year });

      this.es = events;
      this.y = year;
      this.updateChart = this.updateChart.bind(this);
      this.updateChart("all");
      for (let i = new Date().getFullYear(); i >= year; i--) {
        this.yearlys.unshift(i.toString());
      };
  
      this.state = {
        options: {
          chart: {
            id: "basic-bar",
            toolbar: {
                show: false,
            },
          },
          tooltip: {
            enabled: true,
            x: {
              show: false,
            },
          },
          xaxis: {
            categories: this.categoryData,
            tickPlacement: "on",
            position: "bottom",
            labels: {
                show: true,
                rotate: -30,
                rotateAlways: true,
            },
          },
          yaxis: {
            tickAmount:
              this.seriesData.reduce((acc, val) => val > acc ? val : acc, 0) > 4 ||
              this.series2Data.reduce((acc, val) => val > acc ? val : acc, 0) > 4 ?
                4 :
                this.seriesData.reduce((acc, val) => val > acc ? val : acc, 0) >
                this.series2Data.reduce((acc, val) => val > acc ? val : acc, 0) ?
                  this.seriesData.reduce((acc, val) => val > acc ? val : acc, 0) :
                  this.series2Data.reduce((acc, val) => val > acc ? val : acc, 0),
            labels: {
              formatter: (val: string) => {
                return Math.floor(parseInt(val)).toString();
              },
            },
          },
          dataLabels: {
            enabled: false,
          },
          legend: {
            show: true,
            position: "top",
          },
        },
        series: [
          {
            name: "Regular",
            data: this.seriesData,
            color: "#1A56DB",
          },
          {
            name: "VIP",
            data: this.series2Data,
            color: "#A339F4",
          },
        ],
      };
    };

    seriesData: Array<number> = [];
    series2Data: Array<number> = [];
    categoryData: Array<string> = [];
    es: Array<Events> = [];
    y: number = 1970;
    total: number = 0;
    yearlys: Array<string> = [];

    updateChart(mode: string, year?: number) {
      const now: Date = new Date();
      this.seriesData = [];
      this.series2Data = [];
      this.categoryData = [];
      this.total = 0;

      if (mode === "yearly") {
        this.categoryData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      } else {
        for (let i = now.getFullYear(); i >= this.y; i--) {
          this.categoryData.unshift(i.toString());
        };
      };

      if (mode === "yearly" && year) {
        this.seriesData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.series2Data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let k in this.es) {
          const d: Date = new Date(this.es[k].eventDate);
          if (d.getFullYear() === year) {
            this.seriesData[d.getMonth()] += this.es[k].normalsSold;
            this.series2Data[d.getMonth()] += this.es[k].VIPsSold;
            this.total += this.es[k].normalsSold;
            this.total += this.es[k].VIPsSold;
          };
        };
      } else {
        for (let i = now.getFullYear(); i >= this.y; i--) {
          this.seriesData.unshift(0);
          this.series2Data.unshift(0);
        };
        for (let k in this.es) {
          const index: number = new Date(this.es[k].eventDate).getFullYear() - this.y;
          this.seriesData[index] += this.es[k].normalsSold;
          this.series2Data[index] += this.es[k].VIPsSold;
          this.total += this.es[k].normalsSold;
          this.total += this.es[k].VIPsSold;
        };
      };

      this.setState({
        options: {
          chart: {
            id: "basic-bar",
            toolbar: {
                show: false,
            },
          },
          tooltip: {
            enabled: true,
            x: {
              show: false,
            },
          },
          xaxis: {
            categories: [],
            tickPlacement: "on",
            position: "bottom",
            overwriteCategories: this.categoryData,
            labels: {
                show: true,
                rotate: mode === "all" ? -30 : -35,
                rotateAlways: true,
            },
          },
          yaxis: {
            tickAmount:
              this.seriesData.reduce((acc, val) => val > acc ? val : acc, 0) > 4 ||
              this.series2Data.reduce((acc, val) => val > acc ? val : acc, 0) > 4 ?
                4 :
                this.seriesData.reduce((acc, val) => val > acc ? val : acc, 0) >
                this.series2Data.reduce((acc, val) => val > acc ? val : acc, 0) ?
                  this.seriesData.reduce((acc, val) => val > acc ? val : acc, 0) :
                  this.series2Data.reduce((acc, val) => val > acc ? val : acc, 0),
            labels: {
              formatter: (val: string) => {
                return Math.floor(parseInt(val)).toString();
              },
            },
          },
          dataLabels: {
            enabled: false,
          },
          legend: {
            show: true,
            position: "top",
          },
        },
        series: [
          {
            name: "Regular",
            data: this.seriesData,
            color: "#1A56DB",
          },
          {
            name: "VIP",
            data: this.series2Data,
            color: "#A339F4",
          },
        ],
      });
    };

    toggleYearSelect(b: boolean) {
      const form = document.getElementById("globalticketsform") as HTMLFormElement;
      if (b) {
        form.style.display = "flex";
      } else {
        form.style.display = "none";
      };
    };
  
    render() {
      return (
        <div className="app p-4 rounded-md shadow-sm shadow-slate-400">
          <div className="row">
            <div className="text-center font-semibold">Tickets Sold: {this.total}</div>
          </div>
          <div className="row">
            <div className="mixed-chart">
              <Chart
                options={this.state.options}
                series={this.state.series}
                type="bar"
                width="100%"
              />
            </div>
          </div>
          <div className="row flex flex-row gap-4">
            <div className="col">
              <form className="ml-3">
                <select onChange={(e) => {
                  this.updateChart(e.target.value, e.target.value === "yearly" ?
                    new Date().getFullYear() :
                    undefined);
                    if (e.target.value === "yearly") {
                      this.toggleYearSelect(true);
                    } else {
                      this.toggleYearSelect(false);
                    };
                  }}
                  className="cursor-pointer w-32 h-8 bg-slate-600 bg-opacity-0 hover:bg-opacity-20 pl-2 rounded-md shadow-sm shadow-slate-600">
                    <option value="all">Lifetime</option>
                    <option value="yearly">Yearly</option>
                </select>
              </form>
            </div>
            <div className="col">
              <form className="ml-3 hidden" id="globalticketsform">
                <select onChange={(e) => {this.updateChart("yearly", parseInt(e.target.value))}}
                  className="cursor-pointer w-32 h-8 bg-slate-600 bg-opacity-0 hover:bg-opacity-20 pl-2 rounded-md shadow-sm shadow-slate-600">
                    {this.yearlys.map((item) => (
                      <option value={item}>{item}</option>
                    ))}
                </select>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }
  
  export default GlobalTicketsSold;