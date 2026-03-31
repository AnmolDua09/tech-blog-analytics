import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts'; 
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public totalViews: number = 0;
  public lineChartType: ChartType = 'line';

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [], 
        label: 'Daily Post Views',
        backgroundColor: 'rgba(203, 32, 45, 0.2)',
        borderColor: '#CB202D',
        pointBackgroundColor: '#2D2D2D',
        pointBorderColor: '#fff',
        fill: 'origin',
        tension: 0.4 
      }
    ],
    labels: []
  };

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.analyticsService.getStats().subscribe({
      next: (data) => {
        this.totalViews = data.totalViews || 0;
        
        const popularPages = data.popularPages || [];

        // Map the 'post_slug' to chart labels and 'views' (or 'view_count') to chart data
        const labels = popularPages.map((p: any) => p.post_slug || 'Unknown');
        const dataPoints = popularPages.map((p: any) => parseInt(p.views || p.view_count || 0, 10));

        // Reassign the data object to trigger angular change detection for the chart
        this.lineChartData = {
          datasets: [
            {
              ...this.lineChartData.datasets[0],
              data: dataPoints
            }
          ],
          labels: labels
        };
      },
      error: (err) => {
        console.error('Error fetching dashboard analytics:', err);
      }
    });
  }
}