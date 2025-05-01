import { describe, it, expect } from 'vitest';
import { _test, getAllPostsMeta, getPostBySlug, getAllTags, getPostsByTag, extractTags } from './blog';

describe('blog utility functions', () => {
  describe('slugFromFilename', () => {
    it('removes .md extension from filename', () => {
      expect(_test.slugFromFilename('my-post.md')).toBe('my-post');
      expect(_test.slugFromFilename('another-post.md')).toBe('another-post');
    });
  });

  describe('estimateReadingTime', () => {
    it('estimates reading time based on word count', () => {
      expect(_test.estimateReadingTime('This is a five word test.')).toBe('1 min read');
      expect(_test.estimateReadingTime('This is a longer test. '.repeat(250))).toBe('7 min read');
    });
  });

  describe('extractTags', () => {
    it('extracts tags from array', () => {
      expect(_test.extractTags({ tags: ['A', 'B', 'C'] })).toEqual(['A', 'B', 'C']);
    });

    it('extracts tags from comma-separated string', () => {
      expect(_test.extractTags({ tags: 'A, B, C' })).toEqual(['A', 'B', 'C']);
    });

    it('returns default tags when none are specified', () => {
      expect(_test.extractTags({})).toEqual(['Education', 'Montessori', 'School Choice']);
    });
  });

  describe('getAllPostsMeta', () => {
    it('returns an array of post metadata', () => {
      const posts = getAllPostsMeta();
      expect(Array.isArray(posts)).toBe(true);
      if (posts.length > 0) {
        expect(posts[0]).toHaveProperty('slug');
        expect(posts[0]).toHaveProperty('title');
        expect(posts[0]).toHaveProperty('date');
        expect(posts[0]).toHaveProperty('description');
        expect(posts[0]).toHaveProperty('readingTime');
      }
    });
  });

  describe('getPostBySlug', () => {
    it('returns null for a non-existent slug', async () => {
      const post = await getPostBySlug('non-existent-slug');
      expect(post).toBeNull();
    });

    it('returns post data for a valid slug', async () => {
      // This test assumes there's at least one post in the blog directory
      const posts = getAllPostsMeta();
      if (posts.length > 0) {
        const slug = posts[0].slug;
        const post = await getPostBySlug(slug);
        expect(post).not.toBeNull();
        expect(post?.slug).toBe(slug);
        expect(post?.contentHtml).toBeDefined();
        expect(post?.relatedPosts).toBeDefined();
      }
    });
  });

  describe('getAllTags', () => {
    it('returns an array of unique tags', () => {
      const tags = getAllTags();
      expect(Array.isArray(tags)).toBe(true);
      
      // Check for duplicates
      const uniqueTags = new Set(tags);
      expect(uniqueTags.size).toBe(tags.length);
      
      // Check for non-empty values
      if (tags.length > 0) {
        expect(tags.every(tag => tag.trim() !== '')).toBe(true);
      }
    });
  });

  describe('getPostsByTag', () => {
    it('returns posts that match a given tag', () => {
      const tags = getAllTags();
      if (tags.length > 0) {
        const tag = tags[0];
        const filteredPosts = getPostsByTag(tag);
        
        // All returned posts should have the tag
        expect(filteredPosts.every(post => {
          const postTags = extractTags(post);
          return postTags.some(t => t.toLowerCase() === tag.toLowerCase());
        })).toBe(true);
      }
    });
  });
}); 