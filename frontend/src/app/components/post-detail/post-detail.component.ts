import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit {
  post: any = null;
  comments: any[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadPost(slug);
      }
    });
  }

  loadPost(slug: string): void {
    this.loading = true;
    this.postService.getPostBySlug(slug).subscribe({
      next: (response) => {
        this.post = response.post;
        this.comments = response.comments;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch post', err);
        this.error = 'Unable to load the requested post.';
        this.loading = false;
      }
    });
  }
}
