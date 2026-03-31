import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/posts`);
  }

  getPost(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/posts/${id}`);
  }

  createPost(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/posts`, data);
  }

  addComment(postId: string, commentData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/posts/${postId}/comments`, commentData);
  }

  getAnalyticsStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/stats`);
  }
}
