import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { FilterPostsPipe } from '../../pipes/filter-posts.pipe';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FilterPostsPipe],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.css'
})
export class PostFeedComponent implements OnInit {
  posts: any[] = [];
  tags: string[] = [];
  selectedTag: string | null = null;
  searchTerm: string = '';

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
      this.extractTags(posts);
    });
  }

  extractTags(posts: any[]): void {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach((tag: string) => tagSet.add(tag));
      }
    });
    this.tags = Array.from(tagSet).sort();
  }

  selectTag(tag: string | null): void {
    this.selectedTag = this.selectedTag === tag ? null : tag;
  }

  getFilteredPosts(posts: any[]): any[] {
    if (!this.selectedTag) return posts;
    return posts.filter(post => post.tags && post.tags.includes(this.selectedTag));
  }
}
