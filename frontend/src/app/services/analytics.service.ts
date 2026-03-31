import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  
  // Adjusted to point to the actual backend analytics route we verified earlier
  private apiUrl = 'http://localhost:3000/api/analytics/stats';

  constructor(private http: HttpClient) { }

  getStats(): Observable<any> {
    let headers = new HttpHeaders();
    
    // Check if we are in the browser to safely access localStorage
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<any>(this.apiUrl, { headers });
  }
}
