import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
interface ChartData {
  serviceName: string;
  quantity: number;
  id: string;
}
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements AfterViewInit {
  chartData: { serviceName: string; total: number; date: Date }[] = [];
  lineChartData: ChartData[] = [];

  constructor(private elementRef: ElementRef, private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.fetchChartData();
    this.fetchDataAndCreateChart();
  }

  fetchChartData(): void {
    this.http
      .get<any[]>('https://65a95968219bfa3718691505.mockapi.io/chart/payment')
      .subscribe((data: any[]) => {
        this.chartData = data.map((item) => ({
          serviceName: item.serviceName,
          total: item.total,
          date: new Date(item.date),
        }));
        this.createChart();
      });
  }
  fetchDataAndCreateChart(): void {
    this.http.get<ChartData[]>('https://65a95968219bfa3718691505.mockapi.io/chart/service')
      .subscribe(data => {
        this.lineChartData = data;
        this.createLineChart();
      });
  }

  createChart(): void {
    const margin = { top: 20, right: 30, bottom: 80, left: 40 };
    const width = 1028 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    const svg = d3
      .select(this.elementRef.nativeElement)
      .select('.chart-container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
    const x = d3
      .scaleBand()
      .domain(this.chartData.map((d) => d.date.toLocaleDateString()))
      .range([0, width])
      .padding(0.1);
  
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.chartData, (d) => d.total)!])
      .range([height, 0]);
  
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
  
    svg.append('g').call(d3.axisLeft(y));
  
    // Add X axis label
    svg
      .append('text')
      .attr('transform', 'translate(' + (width / 2) + ' ,' + (height + margin.top + 20) + ')')
      .style('text-anchor', 'middle')
      .text('Date');
  
    // Add Y axis label
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Total');
  
    svg
      .selectAll('.bar')
      .data(this.chartData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.date.toLocaleDateString())!)
      .attr('y', (d) => y(d.total))
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - y(d.total))
      .attr('fill', '#93c6fd');
  }
  
  createLineChart(): void {
    const margin = { top: 20, right: 30, bottom: 80, left: 40 };
    const width = 1028 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    const svg = d3
      .select(this.elementRef.nativeElement)
      .select('.line-chart-container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
    const x = d3
      .scaleBand()
      .domain(this.lineChartData.map((d) => d.serviceName))
      .range([0, width])
      .padding(0.1);
  
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.lineChartData, (d) => d.quantity)!])
      .range([height, 0]);
  
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
  
    svg.append('g').call(d3.axisLeft(y));
  
    // Add X axis label
    svg
      .append('text')
      .attr('transform', 'translate(' + (width / 2) + ' ,' + (height + margin.top + 20) + ')')
      .style('text-anchor', 'middle')
      .text('Service Name');
  
    // Add Y axis label
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Quantity');
  
    const line = d3
      .line<ChartData>()
      .x((d) => x(d.serviceName)! + x.bandwidth() / 2)
      .y((d) => y(d.quantity));
  
    svg
      .append('path')
      .datum(this.lineChartData)
      .attr('fill', 'none')
      .attr('stroke', '#9ed49a')
      .attr('stroke-width', 2)
      .attr('d', line);
  
    svg
      .selectAll('.point')
      .data(this.lineChartData)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', (d) => x(d.serviceName)! + x.bandwidth() / 2)
      .attr('cy', (d) => y(d.quantity))
      .attr('r', 4)
      .attr('fill', '#f19959')
      .attr('stroke', 'white');
  }
  

}
