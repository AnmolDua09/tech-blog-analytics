import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-reader-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-8 animate-fade-in">
      <div class="text-center py-10">
        <h2 class="text-4xl font-extrabold text-slate-800 tracking-tight sm:text-5xl">Latest Articles</h2>
        <p class="mt-4 max-w-2xl mx-auto text-xl text-slate-500">Discover new technologies and learn advanced skills.</p>
      </div>

      <div *ngIf="loading" class="flex justify-center my-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div *ngIf="!loading && posts.length === 0" class="text-center py-16 bg-white shadow-sm rounded-xl border border-slate-200">
        <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-slate-900">No posts</h3>
        <p class="mt-1 text-sm text-slate-500">Get started by migrating to the dashboard and creating a new post.</p>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article *ngFor="let post of posts" class="flex flex-col overflow-hidden rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white group cursor-pointer" [routerLink]="['/post', post._id]">
          <div class="flex-1 p-6 flex flex-col justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium tracking-wide text-indigo-600 mb-3 flex flex-wrap gap-2">
                <span *ngFor="let tag of post.tags" class="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">{{tag}}</span>
              </p>
              <div>
                <p class="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">{{ post.title }}</p>
                <p class="mt-4 text-base text-slate-500 line-clamp-3 leading-relaxed">{{ post.content }}</p>
              </div>
            </div>
            <div class="mt-6 flex items-center pt-6 border-t border-slate-50">
              <div class="flex-shrink-0">
                <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-inner">
                  <span class="text-lg font-medium leading-none text-white">{{ post.author.charAt(0) }}</span>
                </span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{{ post.author }}</p>
                <div class="flex space-x-1 text-sm text-slate-400">
                  <time [attr.datetime]="post.createdAt">{{ post.createdAt | date:'mediumDate' }}</time>
                </div>
              </div>
            </div>
          </div>
        </article>
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
export class ReaderViewComponent implements OnInit {
  posts: any[] = [];
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching posts', err);
        // Fallback for UI if db is offline
        this.loading = false;
      }
    });
  }
}
