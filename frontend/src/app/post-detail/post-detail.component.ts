import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="animate-fade-in pb-16">
      <button (click)="goBack()" class="mb-8 flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors group bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm hover:shadow">
        <svg class="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to feed
      </button>

      <div *ngIf="loading" class="flex justify-center my-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div *ngIf="post" class="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div class="px-8 py-12 md:px-12 lg:px-16 border-b border-slate-100 bg-gradient-to-b from-slate-50/50">
          <div class="flex flex-wrap gap-2 mb-6">
            <span *ngFor="let tag of post.tags" class="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800 tracking-wide uppercase">{{tag}}</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">{{ post.title }}</h1>
          
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <span class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg ring-4 ring-white">
                <span class="text-xl font-medium leading-none text-white">{{ post.author.charAt(0) }}</span>
              </span>
            </div>
            <div class="ml-4">
              <p class="text-lg font-bold text-slate-900">{{ post.author }}</p>
              <div class="flex space-x-2 text-sm text-slate-500 font-medium">
                <time [attr.datetime]="post.createdAt">{{ post.createdAt | date:'longDate' }}</time>
                <span>&bull;</span>
                <span>5 min read</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="px-8 py-12 md:px-12 lg:px-16 text-lg text-slate-700 leading-relaxed font-serif prose prose-indigo max-w-none">
          <p class="whitespace-pre-line">{{ post.content }}</p>
        </div>
      </div>

      <!-- Comments Section -->
      <div *ngIf="post" class="mt-16 max-w-4xl mx-auto">
        <h3 class="text-2xl font-bold text-slate-900 mb-8 flex items-center">
          Discussion
          <span class="ml-3 inline-flex items-center justify-center px-3 py-1 bg-slate-100 text-slate-700 text-sm font-bold rounded-full">{{comments.length}}</span>
        </h3>

        <!-- Add Comment form -->
        <div class="bg-white px-6 py-6 rounded-2xl shadow-md border border-slate-100 mb-10">
          <form (ngSubmit)="submitComment()" #commentForm="ngForm" class="space-y-4">
            <div>
              <label for="username" class="sr-only">Name</label>
              <input type="text" id="username" name="username" [(ngModel)]="newComment.username" required placeholder="Your name" class="block w-full rounded-lg border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 font-medium placeholder-slate-400">
            </div>
            <div>
              <label for="text" class="sr-only">Comment</label>
              <textarea id="text" name="text" rows="3" [(ngModel)]="newComment.text" required placeholder="Join the conversation..." class="block w-full rounded-lg border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 placeholder-slate-400 font-medium resize-none"></textarea>
            </div>
            <div class="flex justify-end">
              <button type="submit" [disabled]="!commentForm.valid || submitting" class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95">
                <span *ngIf="!submitting">Post Comment</span>
                <span *ngIf="submitting" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </span>
              </button>
            </div>
          </form>
        </div>

        <div class="space-y-6">
          <div *ngFor="let comment of comments" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4">
             <div class="flex-shrink-0">
                <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-bold">
                  {{ comment.username.charAt(0).toUpperCase() }}
                </span>
             </div>
             <div>
                <div class="flex items-center mb-1">
                  <h4 class="text-sm font-bold text-slate-900">{{ comment.username }}</h4>
                  <span class="text-slate-300 mx-2">&bull;</span>
                  <p class="text-xs font-medium text-slate-500"><time [attr.datetime]="comment.createdAt">{{ comment.createdAt | date:'medium' }}</time></p>
                </div>
                <p class="text-slate-700 mt-2 whitespace-pre-line">{{ comment.text }}</p>
             </div>
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
export class PostDetailComponent implements OnInit {
  post: any = null;
  comments: any[] = [];
  loading = true;
  submitting = false;

  newComment = {
    username: '',
    text: ''
  };

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
         this.loadPost(id);
      }
    });
  }

  loadPost(id: string) {
    this.loading = true;
    this.apiService.getPost(id).subscribe({
      next: (data) => {
        this.post = data.post;
        this.comments = data.comments;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching post', err);
        this.loading = false;
      }
    });
  }

  submitComment() {
    if (!this.newComment.username || !this.newComment.text || !this.post) return;
    
    this.submitting = true;
    this.apiService.addComment(this.post._id, this.newComment).subscribe({
      next: (comment) => {
        this.comments.unshift(comment); // add to top
        this.newComment.text = '';      // clear only text
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error adding comment', err);
        this.submitting = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
