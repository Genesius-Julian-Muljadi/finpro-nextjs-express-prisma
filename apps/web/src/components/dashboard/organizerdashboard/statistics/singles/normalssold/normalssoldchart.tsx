"use client";

import { Transactions } from "@/interfaces/database_tables";
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
          style?: Object;
        };
      };
    };
    series: Array<{
      name: string;
      data: Array<number>;
      color: string;
    }>;
};

class SingleNormalsSold extends Component<{
    transactions: Array<Transactions>,
    date: Date,
}, IState> {
    constructor({ transactions, date }: { transactions: Array<Transactions>, date: Date}) {
      super({ transactions, date });

      this.ts = transactions;
      this.d = date;
      this.updateChart = this.updateChart.bind(this);
      this.updateChart(transactions, 7, date);
  
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
              formatter: (val: string) => {
                return this.categoryData[this.categoryData.findIndex((item) => item === val)];
              },
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
        },
        series: [
          {
            name: "series-1",
            data: this.seriesData,
            color: "blue",
          },
        ],
      };
    };

    seriesData: Array<number> = [];
    categoryData: Array<string> = [];
    ts: Array<Transactions> = [];
    d: Date = new Date();

    updateChart(transactions: Array<Transactions>, days: number, date: Date) {
      const now: Date = new Date();
      this.seriesData = [];
      this.categoryData = [];

      const capDate: Date = date.valueOf() < now.valueOf() ? date : now;
      const capVal = Math.floor(capDate.valueOf() / (1000 * 60 * 60 * 24));

      const transactionData = transactions.filter((item) => {
        const dateVal = Math.floor(new Date(item.dateCreated).valueOf() / (1000 * 60 * 60 * 24));
        if (capVal - dateVal <= days - 1 && capVal - dateVal >= 0) {
            return true;
        } else {
            return false;
        };
      });

      for (let i = 0; i < days; i++) {
        this.seriesData.push(0);
      };
      for (let k in transactionData) {
        const dateVal = Math.floor(new Date(transactionData[k].dateCreated).valueOf() / (1000 * 60 * 60 * 24));
        if (capVal - dateVal >= 0) {
          this.seriesData[(days - 1) - (capVal - dateVal)] += transactionData[k].ticketCount - transactionData[k].VIPs;
        };
      };

      for (let i = 0; i < days; i++) {
        const d: Date = new Date((capVal - i) * (1000 * 60 * 60 * 24));
        this.categoryData.unshift(`${d.getMonth() + 1}/${d.getDate()}`);
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
              formatter: (val: string) => {
                return this.categoryData[parseInt(val) - 1];
              },
            },
          },
          xaxis: {
            categories: [],
            tickPlacement: "on",
            position: "bottom",
            overwriteCategories: this.categoryData,
            labels: {
                show: true,
                rotate: days === 30 ? -80 : (days === 90 ? -90 : -30),
                rotateAlways: true,
                style: {
                  fontSize: days === 90 ? "7px" : "12px",
                },
            },
          },
        },
        series: [
          {
            name: "series-1",
            data: this.seriesData,
            color: "blue",
          },
        ],
      });
    };
  
    render() {
      return (
        <div className="app">
          <div className="row">
            <div className="text-center font-semibold">Regular Tickets Sold</div>
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
          <div className="row">
            <div className="col">
              <form className="ml-3">
                <select onChange={(e) => {this.updateChart(this.ts, parseInt(e.target.value), this.d)}}
                  className="cursor-pointer w-32 h-8 bg-slate-600 bg-opacity-0 hover:bg-opacity-20 rounded">
                    <option value="7">Last 7 days</option>
                    <option value="14">Last 14 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                </select>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }
  
  export default SingleNormalsSold;