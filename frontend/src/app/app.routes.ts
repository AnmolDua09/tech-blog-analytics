import { Routes } from '@angular/router';
import { PostFeedComponent } from './components/post-feed/post-feed.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: PostFeedComponent },
  { path: 'post/:slug', component: PostDetailComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '' }
];
