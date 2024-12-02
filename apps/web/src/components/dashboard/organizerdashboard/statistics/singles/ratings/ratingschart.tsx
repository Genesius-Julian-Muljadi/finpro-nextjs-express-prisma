"use client";

import { Event_Ratings } from "@/interfaces/database_tables";
import React, { Component } from "react";
import Chart from "react-apexcharts";

interface IState {
    options: {
      chart: Object;
      labels: Array<string>
      tooltip?: Object;
      xaxis: {
        labels: Object;
      };
      yaxis: Object;
      plotOptions: Object;
      legend: Object;
    };
    series: Array<number>;
};

class SingleRatings extends Component<{
    ratings: Array<Event_Ratings>,
    transactions: number,
}, IState> {
    constructor({ ratings, transactions }: { ratings: Array<Event_Ratings>, transactions: number }) {
      super({ ratings, transactions });

      const seriesData: Array<number> = [0, 0, 0, 0, 0, 0];
      for (let k in ratings) {
        seriesData[ratings[k].rating] += 1;
        this.avg += ratings[k].rating;
      };
      seriesData[0] = transactions - ratings.length;
      this.avg = this.avg / ratings.length;
  
      this.state = {
        options: {
          chart: {
            id: "basic-pie",
            toolbar: {
                show: false,
            },
            type: "pie",
          },
          labels: ["No rating", "1", "2", "3", "4", "5"],
          xaxis: {
            labels: {
                show: true,
                formatter: (val: string) => {
                  return val + "%";
                },
            },
          },
          yaxis: {
            labels: {
              show: true,
            },
          },
          plotOptions: {
            pie: {
              labels: {
                show: true,
              },
              size: "100%",
              dataLabels: {
                offset: -25
              }
            },
          },
          legend: {
            show: true,
            position: "bottom",
          },
        },
        series: seriesData,
      };
    };

    avg: number = 0;
  
    render() {
      return (
        <div className="app">
          <div className="row">
            <div className="text-center font-semibold">Ratings: Average {this.avg}</div>
          </div>
          <div className="mt-4 mr-2">
            <div className="pie-chart w-full flex">
              <Chart className="w-[80%] mx-auto"
                options={this.state.options}
                series={this.state.series}
                type="pie"
                width="100%"
              />
            </div>
          </div>
        </div>
      );
    }
  }
  
  export default SingleRatings;