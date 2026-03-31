import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private apiUrl = 'http://localhost:3000/api/analytics/track';

  constructor(private http: HttpClient, private router: Router) {
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.trackPageView(event.urlAfterRedirects);
    });
  }

  private trackPageView(url: string) {
    // Fire and forget, no unsubscription needed
    this.http.post(this.apiUrl, { pageUrl: url }).subscribe({
      next: () => console.log('View tracked'),
      error: (err) => console.error('Tracking failed', err)
    });
  }
}
