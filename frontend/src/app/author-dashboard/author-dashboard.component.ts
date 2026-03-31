import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-author-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12 animate-fade-in">
      <!-- Analytics Overview Panel -->
      <div class="xl:col-span-3">
        <div class="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/30">
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full filter blur-3xl"></div>
          <div class="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl"></div>
          
          <div class="relative z-10">
            <h2 class="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">Author Dashboard</h2>
            <p class="text-indigo-200/80 max-w-xl text-lg">Detailed insights and publishing hub.</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Stats Cards -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Views</p>
              <h3 class="text-4xl font-extrabold text-slate-900">{{ stats?.totalViews || 0 }}</h3>
            </div>
            <div class="h-14 w-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
               <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Top Page</p>
              <h3 class="text-lg font-bold text-slate-900 truncate max-w-[150px]" [title]="topPageUrl">{{ topPageUrl || 'N/A' }}</h3>
            </div>
            <div class="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
               <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Database</p>
              <h3 class="text-lg font-bold text-emerald-600 flex items-center">
                <span class="h-2.5 w-2.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span> Configured
              </h3>
            </div>
            <div class="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
               <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="xl:col-span-2 space-y-8">
         <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <h3 class="text-xl font-bold text-slate-900 mb-6">Views Over Time</h3>
            <div class="h-[300px] w-full relative">
               <canvas #viewsChart></canvas>
               <div *ngIf="!hasViewsData" class="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                 <p class="text-slate-500 font-medium">Not enough data to graph.</p>
               </div>
            </div>
         </div>
         <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <h3 class="text-xl font-bold text-slate-900 mb-6">Top Performing URLs</h3>
            <div class="h-[300px] w-full relative">
               <canvas #popularChart></canvas>
               <div *ngIf="!hasPopularData" class="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                 <p class="text-slate-500 font-medium">Not enough data to graph.</p>
               </div>
            </div>
         </div>
      </div>
      
      <!-- Add Post -->
      <div class="xl:col-span-1">
          <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 sticky top-24 hover:shadow-md transition-all">
             <h3 class="text-xl font-bold text-slate-900 mb-6 flex items-center pb-4 border-b border-slate-100">
                <span class="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3 shadow-sm">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </span>
                Publish New Article
             </h3>
             <form (ngSubmit)="createPost()" #postForm="ngForm" class="space-y-5">
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-2">Title</label>
                  <input type="text" [(ngModel)]="newPost.title" name="title" required placeholder="A catchy title..." class="block w-full rounded-xl border-slate-300 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-slate-50">
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-2">Content</label>
                  <textarea [(ngModel)]="newPost.content" name="content" required rows="7" placeholder="Write your thoughts..." class="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-slate-50"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-2">Tags</label>
                  <input type="text" [(ngModel)]="tagsString" name="tagsString" placeholder="React, Node.js, Web..." class="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-slate-50">
                  <p class="mt-1 text-xs text-slate-500">Comma separated</p>
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-2">Author Name</label>
                  <input type="text" [(ngModel)]="newPost.author" name="author" placeholder="Jane Doe" class="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-slate-50">
                </div>
                <button type="submit" [disabled]="!postForm.valid || creating" class="w-full mt-4 flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-slate-900 hover:bg-slate-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 transition-all active:scale-95">
                  {{ creating ? 'Publishing...' : 'Publish Article' }}
                </button>
             </form>
             
             <!-- Success Message -->
             <div *ngIf="successMessage" class="mt-4 p-4 rounded-lg bg-green-50 text-green-800 border border-green-200 text-sm font-medium animate-fade-in flex items-start">
               <svg class="w-5 h-5 mr-2 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               {{ successMessage }}
             </div>
          </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.5s ease-out forwards;
    }
  `]
})
export class AuthorDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('viewsChart') viewsChartRef!: ElementRef;
  @ViewChild('popularChart') popularChartRef!: ElementRef;

  stats: any = null;
  topPageUrl: string = '';
  hasViewsData = false;
  hasPopularData = false;
  
  viewsChartInst: any = null;
  popularChartInst: any = null;

  creating = false;
  successMessage = '';
  tagsString = '';
  newPost = {
    title: '',
    content: '',
    author: '',
    tags: [] as string[]
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.loadStats();
  }

  loadStats() {
    this.apiService.getAnalyticsStats().subscribe({
      next: (data) => {
        this.stats = data;
        if (data.popularPages && data.popularPages.length > 0) {
          this.topPageUrl = data.popularPages[0].pageUrl;
        }
        this.renderCharts();
      },
      error: (err) => {
        console.error('Error loading stats', err);
      }
    });
  }

  renderCharts() {
    if (!this.stats) return;

    // Destroy old 
    if (this.viewsChartInst) this.viewsChartInst.destroy();
    if (this.popularChartInst) this.popularChartInst.destroy();

    const vData = this.stats.viewsOverTime || [];
    const pData = this.stats.popularPages || [];

    this.hasViewsData = vData.length > 0;
    this.hasPopularData = pData.length > 0;

    if (this.hasViewsData && this.viewsChartRef) {
      this.viewsChartInst = new Chart(this.viewsChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: vData.map((d: any) => d.date),
          datasets: [{
            label: 'Daily Views',
            data: vData.map((d: any) => d.views),
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#6366f1',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
             y: { beginAtZero: true, grid: { borderDash: [5, 5] }, ticks: { stepSize: 1 } },
             x: { grid: { display: false } }
          }
        }
      });
    }

    if (this.hasPopularData && this.popularChartRef) {
      this.popularChartInst = new Chart(this.popularChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: pData.map((d: any) => {
             // truncate long urls for labels
             const u = d.pageUrl;
             return u.length > 20 ? u.substring(0, 20) + '...' : u;
          }),
          datasets: [{
            label: 'Views',
            data: pData.map((d: any) => d.views),
            backgroundColor: '#8b5cf6',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
             legend: { display: false },
             tooltip: {
                callbacks: {
                   title: (context) => pData[context[0].dataIndex].pageUrl
                }
             }
          },
          scales: {
             y: { beginAtZero: true, grid: { borderDash: [5, 5] }, ticks: { stepSize: 1 } },
             x: { grid: { display: false } }
          }
        }
      });
    }
  }

  createPost() {
    this.creating = true;
    this.successMessage = '';
    
    // Parse tags
    if (this.tagsString) {
      this.newPost.tags = this.tagsString.split(',').map(s => s.trim()).filter(s => s);
    } else {
      this.newPost.tags = [];
    }

    this.apiService.createPost(this.newPost).subscribe({
      next: (res) => {
        this.creating = false;
        this.successMessage = 'Article published successfully!';
        
        // strict reset
        this.newPost = { title: '', content: '', author: '', tags: [] };
        this.tagsString = '';
        
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error(err);
        this.creating = false;
        this.successMessage = 'Error publishing article.';
      }
    });
  }
}
