import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { TrackingService } from './core/tracking.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50">
      <header class="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-extrabold tracking-tight cursor-pointer flex items-center gap-2" routerLink="/">
            <span class="bg-indigo-500 text-white px-2 py-1 rounded-md text-xl">TB</span>
            TechBlog <span class="text-indigo-400 font-light hidden sm:inline">Pro</span>
          </h1>
          <nav>
            <ul class="flex space-x-6 text-sm font-semibold uppercase tracking-wider">
              <li><a routerLink="/" routerLinkActive="text-indigo-400" [routerLinkActiveOptions]="{exact:true}" class="hover:text-indigo-300 transition-colors">Feed</a></li>
              <li><a routerLink="/dashboard" routerLinkActive="text-indigo-400" class="hover:text-indigo-300 transition-colors">Analytics</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main class="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 text-center text-sm mt-auto">
        <p>&copy; 2026 TechBlog Pro. Analytics Engine Active.</p>
      </footer>
    </div>
  `
})
export class AppComponent implements OnInit {
  // Inject tracking service to initialize it
  constructor(private trackingService: TrackingService) {}
  
  ngOnInit() {
  }
}
