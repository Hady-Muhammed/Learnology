import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, scales } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {

  // barChartData: ChartConfiguration<'bar'>['data'] = {
  //   labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
  //   datasets: [
  //     {
  //       data: [65, 59, 80, 81, 56, 55, 40],
  //       label: 'Series A',
  //       backgroundColor: '#8d46ff',
  //       barThickness: 15,
  //     },
  //   ],
  // };
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Yearly revenue',
        backgroundColor: '#8d46ff',
        barThickness: 15,
      },
    ],
  };
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    plugins: {
      title: {
        display: true,
        align: "start",
        text: "Revenue",
        font: {
          size: 20,
        }
      }
    },
    responsive: true,
    elements: {
      bar: {
        borderRadius: 5,
      }
    },
    scales: {
      y: {
        ticks: {
              // Include a dollar sign in the ticks
          callback: function(value, index, ticks) {
                return '$' + value + 'k';
          }
        }
      }
    }
  };

  constructor() {
  }

  ngOnInit(): void {}
}
