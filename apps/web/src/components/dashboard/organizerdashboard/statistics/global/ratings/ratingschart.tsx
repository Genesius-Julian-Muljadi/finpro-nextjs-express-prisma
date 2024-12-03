"use client";

import { Event_Ratings, Events } from "@/interfaces/database_tables";
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
        categories?: Array<string>;
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

class GlobalRatings extends Component<{
    events: Array<Events>,
    year: number,
    ratings: Array<Event_Ratings>,
}, IState> {
    constructor({ events, year, ratings }: { events: Array<Events>, year: number, ratings: Array<Event_Ratings> }) {
      super({ events, year, ratings });

      this.es = events;
      this.rs = ratings;
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
              formatter: (val: string) => {
                return this.categoryData[parseInt(val) - 1];
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
          yaxis: {
            stepSize: 1,
            min: 0,
            max: 5,
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
        ],
      };
    };

    seriesData: Array<number> = [];
    categoryData: Array<string> = [];
    es: Array<Events> = [];
    rs: Array<Event_Ratings> = [];
    y: number = 1970;
    avg: number = 0;
    yearlys: Array<string> = [];

    updateChart(mode: string, year?: number) {
      const now: Date = new Date();
      this.seriesData = [];
      this.categoryData = [];
      this.avg = 0;

      if (mode === "yearly") {
        this.categoryData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      } else {
        for (let i = now.getFullYear(); i >= this.y; i--) {
          this.categoryData.unshift(i.toString());
        };
      };

      if (mode === "yearly" && year) {
        this.seriesData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let countarr: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let count = 0;
        for (let k in this.es) {
          const d: Date = new Date(this.es[k].eventDate);
          if (d.getFullYear() === year) {
            const ratingarr: Array<Event_Ratings> = this.rs.filter((item) => {
              return item.eventID === this.es[k].id;
            });
            for (let l in ratingarr) {
              const index: number = d.getMonth();
              countarr[index]++;
              this.seriesData[index] += ratingarr[l].rating;
              this.avg += ratingarr[l].rating;
              count++;
            };
          };
        };
        for (let k in this.seriesData) {
          this.seriesData[k] = Math.round((countarr[k] ? this.seriesData[k] / countarr[k] : 0)*100)/100;
        };
        this.avg = count === 0 ? 0 : this.avg / count;
      } else {
        let countarr: Array<number> = [];
        for (let i = now.getFullYear(); i >= this.y; i--) {
          this.seriesData.push(0);
          countarr.push(0);
        };
        let count = 0;
        for (let k in this.es) {
          if (new Date(this.es[k].eventDate).getFullYear() > new Date().getFullYear()) {
            continue;
          };
          const ratingarr: Array<Event_Ratings> = this.rs.filter((item) => {
            return item.eventID === this.es[k].id;
          });
          for (let l in ratingarr) {
            const index: number = new Date(this.es[k].eventDate).getFullYear() - this.y;
            countarr[index]++;
            this.seriesData[index] += ratingarr[l].rating;
            this.avg += ratingarr[l].rating;
            count++;
          };
        };
        for (let k in this.seriesData) {
          this.seriesData[k] = Math.round((countarr[k] ? this.seriesData[k] / countarr[k] : 0)*100)/100;
        };
        this.avg = count === 0 ? 0 : this.avg / count;
      };

      this.setState({
        options: {
          chart: {
            id: "basic-area",
            toolbar: {
                show: false,
            },
          },
          tooltip: {
            enabled: true,
            x: {
              show: true  ,
              formatter: (val: string) => {
                return this.categoryData[parseInt(val) - 1];
              },
            },
          },
          xaxis: {
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
            stepSize: 1,
            min: 0,
            max: 5,
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
            name: "Ratings",
            data: this.seriesData,
            color: "#1A56DB",
          },
        ],
      });
    };

    toggleYearSelect(b: boolean) {
      const form = document.getElementById("globalratingsform") as HTMLFormElement;
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
            <div className="text-center font-semibold">Ratings: {this.avg === 0 ? '-' : 'Average ' + Math.round(this.avg * 100)/100}</div>
          </div>
          <div className="row">
            <div className="mixed-chart">
              <Chart
                options={this.state.options}
                series={this.state.series}
                type="area"
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
              <form className="ml-3 hidden" id="globalratingsform">
                <select onChange={(e) => {this.updateChart("yearly", parseInt(e.target.value))}}
                  className="cursor-pointer w-32 h-8 bg-slate-600 bg-opacity-0 hover:bg-opacity-20 pl-2 rounded-md shadow-sm shadow-slate-600">
                    {this.yearlys.map((item, index) => (
                      <option key={index} value={this.yearlys[(this.yearlys.length - index) - 1]}>{this.yearlys[(this.yearlys.length - index) - 1]}</option>
                    ))}
                </select>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }
  
  export default GlobalRatings;