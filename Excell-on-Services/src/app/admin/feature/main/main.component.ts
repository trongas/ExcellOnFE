import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { MainService } from './services/main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements AfterViewInit, OnInit {
  services : any[] = [];
  totalEmployees: number = 0;
  totalClients: number = 0;
  totalDepartments: number = 0;
  revenue: any[] = [];
  totalClientsForService: number = 0;

  constructor(private mainService: MainService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  this.loadService();

    this.mainService.getTotalEmployee().subscribe(data => this.totalEmployees = data);
    this.mainService.getClientCount().subscribe(data => this.totalClients = data);
    this.mainService.getDepartmentCount().subscribe(data => this.totalDepartments = data);
    this.mainService.getRevenue(2024).subscribe(data => {
      this.revenue = data;
      this.cdr.detectChanges(); // Manually trigger change detection
    });
    this.mainService.getTotalClientOfService(1).subscribe(data => this.totalClientsForService = data);
  }

  ngAfterViewInit() {
    this.setupChart();
  }
  loadService(): void {
    this.mainService.getService().subscribe(
      (data) => {
        this.services = data;
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
  }
  private setupChart() {
    const chartElement = document.getElementById('order-chart') as HTMLCanvasElement;

    if (chartElement) {
      const context = chartElement.getContext('2d');

      if (context) {
        new Chart(context, {
          type: 'line',
          data: {
            labels: this.generateNDays(7),
            datasets: [
              {
                label: 'Active',
                data: this.generateRandomData(7),
                borderWidth: 1,
                fill: true,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgb(59 130 246 / .05)',
                tension: 0.2,
              },
              {
                label: 'Completed',
                data: this.generateRandomData(7),
                borderWidth: 1,
                fill: true,
                pointBackgroundColor: 'rgb(16, 185, 129)',
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgb(16 185 129 / .05)',
                tension: 0.2,
              },
              {
                label: 'Canceled',
                data: this.generateRandomData(7),
                borderWidth: 1,
                fill: true,
                pointBackgroundColor: 'rgb(244, 63, 94)',
                borderColor: 'rgb(244, 63, 94)',
                backgroundColor: 'rgb(244 63 94 / .05)',
                tension: 0.2,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }

  generateNDays(n: number) {
    const data = [];
    for (let i = 0; i < n; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push(
        date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      );
    }
    return data;
  }

  generateRandomData(n: number) {
    const data = [];
    for (let i = 0; i < n; i++) {
      data.push(Math.round(Math.random() * 10));
    }
    return data;
  }

}
