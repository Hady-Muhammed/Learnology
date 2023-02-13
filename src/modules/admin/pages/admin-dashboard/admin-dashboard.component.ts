import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
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
        align: 'start',
        text: 'Revenue',
        font: {
          size: 20,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      bar: {
        borderRadius: 5,
      },
    },
    scales: {
      y: {
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, ticks) {
            return '$' + value + 'k';
          },
        },
      },
    },
  };
  polarChartData: ChartConfiguration<'polarArea'>['data'] = {
    datasets: [
      {
        data: [65, 59, 70, 81, 40],
        backgroundColor: ['blue', 'yellow', 'green', 'red', 'violet'],
        borderColor: 'transparent',
      },
    ],
    labels: [
      'Mobiles: 65 (20.43%)',
      'Others: 5 (5.38%)',
      'iPhone: 25 (45.12%)',
      'Desktop: 75 (29.38%)',
      'Windows: 42 (78.28%)',
    ],
  };
  polarChartOptions: ChartConfiguration<'polarArea'>['options'] = {
    plugins: {
      title: {
        display: true,
        align: 'center',
        text: 'Top Sales Unit',
        font: {
          size: 15,
        },
      },
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    elements: {},
    scales: {
      y: {
        display: false,
      },
      r: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  constructor() {}

  ngOnInit(): void {}
}
