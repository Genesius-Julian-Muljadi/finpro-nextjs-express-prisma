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
      };
      yaxis: Object;
      dataLabels: Object;
    };
    series: Array<{
      name: string;
      data: Array<number>;
      color: string;
    }>;
};

class SingleRevenue extends Component<{
    transactions: Array<Transactions>,
    date: Date,
}, IState> {
    constructor({ transactions, date }: { transactions: Array<Transactions>, date: Date}) {
      super({ transactions, date });

      this.ts = transactions;
      this.d = date;
      this.updateChart = this.updateChart.bind(this);
      this.updateChart(transactions, 7, date);
      for (let k in transactions) {
        this.total += transactions[k].total;
      };
  
      this.state = {
        options: {
          chart: {
            id: "basic-bar",
            toolbar: {
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
            show: true,
            labels: {
              show: true,
              formatter: function (val: string) {
                return parseInt(val).toLocaleString("id-ID");
              },
            },
          },
          dataLabels: {
            enabled: false,
          },
        },
        series: [
          {
            name: "series-1",
            data: this.seriesData,
            color: "#07a33d",
          },
        ],
      };
    };

    seriesData: Array<number> = [];
    categoryData: Array<string> = [];
    ts: Array<Transactions> = [];
    d: Date = new Date();
    total: number = 0;

    updateChart(transactions: Array<Transactions>, days: number, date: Date) {
      const now: Date = new Date();
      this.seriesData = [];
      this.categoryData = [];

      const capDate: Date = date.valueOf() < now.valueOf() ? date : now;
      const capVal = Math.floor(capDate.valueOf() / (1000 * 60 * 60 * 24));

      const transactionData = transactions.filter((item) => {
        const dateVal = Math.floor(new Date(item.dateCreated).valueOf() / (1000 * 60 * 60 * 24));
        if (capVal - dateVal <= days - 1) {
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
        this.seriesData[(days - 1) - (capVal - dateVal)] += transactionData[k].total;
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
          xaxis: {
            categories: [],
            tickPlacement: "on",
            position: "bottom",
            overwriteCategories: this.categoryData,
            labels: {
                show: true,
                rotate: days === 30 ? -80 : -30,
                rotateAlways: true,
            },
          },
          yaxis: {
            show: true,
            labels: {
              show: true,
              formatter: function (val: string) {
                return parseInt(val).toLocaleString("id-ID");
              },
            },
          },
          dataLabels: {
            enabled: false,
          },
        },
        series: [
          {
            name: "series-1",
            data: this.seriesData,
            color: "#07a33d",
          },
        ],
      });
    };
  
    render() {
      return (
        <div className="app">
          <div className="row">
            <div className="text-center font-semibold">Revenue: Rp {this.total.toLocaleString("id-ID")},00</div>
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
                </select>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }
  
  export default SingleRevenue;