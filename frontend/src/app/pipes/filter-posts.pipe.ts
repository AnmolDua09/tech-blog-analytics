import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPosts',
  standalone: true
})
export class FilterPostsPipe implements PipeTransform {

  transform(posts: any[] | null, searchTerm: string): any[] {
    if (!posts) return [];
    if (!searchTerm || searchTerm.trim() === '') return posts;
    
    const lowerSearch = searchTerm.toLowerCase().trim();
    return posts.filter(post => 
      post.title && post.title.toLowerCase().includes(lowerSearch)
    );
  }

}
