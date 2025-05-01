import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// Types
export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  author?: string;
  coverImage?: string;
  tags?: string[] | string;
  readingTime?: string;
}

export interface BlogPost extends BlogPostMeta {
  contentHtml: string;
  relatedPosts?: BlogPostMeta[];
}

const postsDirectory = path.join(process.cwd(), 'app/blog');

// Estimate reading time based on word count (average 200 words per minute)
function estimateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

// Extract tags in a consistent way
export function extractTags(meta: any): string[] {
  // Try to extract tags from frontmatter (as array or comma-separated string)
  if (Array.isArray(meta.tags)) return meta.tags;
  if (typeof meta.tags === 'string') return meta.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
  // Default categories for Montessori posts if none are specified
  return ['Education', 'Montessori', 'School Choice'];
}

// Format pipe-delimited tables that may not be properly spaced
function formatMarkdownTables(content: string): string {
  // Find potential table sections (sequences of lines with pipe characters)
  return content.replace(
    /^\s*(\|.+\|\s*\n)+/gm,
    (tableBlock) => {
      // Split into rows and clean up
      const rows = tableBlock.trim().split('\n').map(row => row.trim());
      
      // Ensure there's a header separator row if it's a proper table
      if (rows.length >= 2) {
        // Check if the second row is a separator row (contains only |, -, :, and spaces)
        const isSecondRowSeparator = /^\|[-:\s|]+\|$/.test(rows[1]);
        
        // If not, insert a separator row
        if (!isSecondRowSeparator) {
          // Count the columns based on the first row
          const columnCount = (rows[0].match(/\|/g) || []).length - 1;
          
          // Create a separator row with the same number of columns
          const separatorRow = '| ' + Array(columnCount).fill('---').join(' | ') + ' |';
          
          // Insert the separator row after the header row
          rows.splice(1, 0, separatorRow);
        }
      }
      
      // Return the formatted table
      return rows.join('\n') + '\n\n';
    }
  );
}

// Get all posts metadata (for index page)
export function getAllPostsMeta(): BlogPostMeta[] {
  const files = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));
  const posts: BlogPostMeta[] = [];
  for (const filename of files) {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    // Required fields: title, date, description
    if (typeof data.title === 'string' && typeof data.date === 'string' && typeof data.description === 'string') {
      // Clean up description that might contain dates or other metadata
      let cleanDescription = data.description;
      
      // Check if description contains a date (common pattern in these posts)
      const dateMatch = cleanDescription.match(/^[A-Z][a-z]+ \d+, \d{4}/);
      if (dateMatch) {
        cleanDescription = cleanDescription.replace(dateMatch[0], '').trim();
        // If description starts with "By" after removing date
        if (cleanDescription.startsWith('By')) {
          const authorMatch = cleanDescription.match(/^By (.+?)(?=$|\n)/);
          if (authorMatch) {
            // Add author field if it doesn't exist
            if (!data.author) {
              data.author = authorMatch[1].trim();
            }
            cleanDescription = cleanDescription.replace(authorMatch[0], '').trim();
          }
        }
      }
      
      // If description is now empty, use a fallback
      if (!cleanDescription) {
        cleanDescription = `Learn about ${data.title} in this Montessori education guide.`;
      }
      
      posts.push({
        slug: slugFromFilename(filename),
        title: data.title,
        date: data.date,
        description: cleanDescription,
        author: data.author,
        coverImage: data.coverImage,
        tags: data.tags,
        readingTime: estimateReadingTime(content)
      });
    }
  }
  // Sort by date descending
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

// Find related posts based on tags
function findRelatedPosts(currentSlug: string, currentTags: string[]): BlogPostMeta[] {
  const allPosts = getAllPostsMeta();
  
  // Create a map of posts with their tag matches (excluding current post)
  const postMatches = allPosts
    .filter(post => post.slug !== currentSlug)
    .map(post => {
      const postTags = extractTags(post);
      const matchCount = postTags.filter(tag => currentTags.includes(tag)).length;
      return { post, matchCount };
    })
    .filter(item => item.matchCount > 0) // Only include posts with at least 1 matching tag
    .sort((a, b) => b.matchCount - a.matchCount) // Sort by most matching tags
    .map(item => item.post);
  
  // Return top 3 related posts
  return postMatches.slice(0, 3);
}

// Get full post data by slug (for post page)
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const filename = `${slug}.md`;
  const filePath = path.join(postsDirectory, filename);
  if (!fs.existsSync(filePath)) return null;
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  if (typeof data.title !== 'string' || typeof data.date !== 'string' || typeof data.description !== 'string') {
    return null;
  }
  
  // Format tables before processing with remark
  const formattedContent = formatMarkdownTables(content);
  
  // Process markdown with better HTML options
  const processedContent = await remark()
    .use(html, { sanitize: false }) // Allow HTML in markdown
    .process(formattedContent);
    
  let contentHtml = processedContent.toString()
    // Fix table rendering by adding appropriate classes
    .replace(/<table>/g, '<table class="border-collapse w-full my-8">')
    .replace(/<thead>/g, '<thead class="bg-gray-100">')
    .replace(/<th>/g, '<th class="border border-gray-300 px-4 py-3 text-left font-semibold">')
    .replace(/<td>/g, '<td class="border border-gray-300 px-4 py-3">')

    // Special handling for cognitive skill/material type tables
    .replace(
      /<table class="[^"]+">(?:<thead>)?<tr>(?:<th[^>]*>)Material Type(?:<\/th>)(?:<th[^>]*>)Cognitive Skill(?:<\/th>)(?:<th[^>]*>)Learning Outcome(?:<\/th>)<\/tr>(?:<\/thead>)?<tbody>/g,
      '<table class="border-collapse w-full my-8 bg-white"><thead class="bg-green-50"><tr><th class="border border-gray-300 px-4 py-3 text-left font-semibold">Material Type</th><th class="border border-gray-300 px-4 py-3 text-left font-semibold">Cognitive Skill</th><th class="border border-gray-300 px-4 py-3 text-left font-semibold">Learning Outcome</th></tr></thead><tbody>'
    )

    // Format CTA containers
    .replace(
      /<div class="cta-container">([\s\S]*?)<a href="\/states" class="cta-button">([\s\S]*?)<\/a>([\s\S]*?)<\/div>/g,
      '<div class="bg-green-50 border border-green-100 rounded-lg p-6 my-10 text-center"><div class="max-w-2xl mx-auto">$1<a href="/states" class="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 mt-4 rounded-md transition-colors">$2</a>$3</div></div>'
    )

    // Format reference links
    .replace(
      /<span class="reference-link">\[(\d+)\]<\/span>/g,
      '<a href="#reference-$1" class="inline-flex items-center justify-center text-xs font-medium bg-gray-100 text-gray-700 rounded-md h-5 w-auto px-1.5 hover:bg-gray-200 transition-colors" style="vertical-align:super;line-height:1">[$1]</a>'
    )

    // Fix blockquote styling
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-green-500 pl-4 py-3 italic bg-gray-50 rounded-r-sm my-8">')
    // Fix list styling
    .replace(/<ol>/g, '<ol class="list-decimal pl-6 my-6 space-y-3">')
    .replace(/<ul>/g, '<ul class="list-disc pl-6 my-6 space-y-3">')
    .replace(/<li>/g, '<li class="ml-2 mb-2">')
    // Fix headings
    .replace(/<h2/g, '<h2 class="text-2xl font-bold mt-12 mb-6"')
    .replace(/<h3/g, '<h3 class="text-xl font-bold mt-10 mb-4"')
    // Add spacing to paragraphs
    .replace(/<p>/g, '<p class="mb-6 leading-relaxed">')
    // Fix links to have proper styling
    .replace(/<a href=/g, '<a class="text-green-600 font-medium hover:text-green-700 hover:underline" href=');
    
  // Add section dividers
  contentHtml = contentHtml.replace(/<h2/g, '<div class="mt-12 mb-8 border-t border-gray-200 pt-4"></div><h2');
  
  // Special handling for Montessori-specific links
  contentHtml = contentHtml
    .replace(/MACTE(?!<\/a>)/g, '<a class="text-green-600 font-medium hover:text-green-700 hover:underline" href="https://www.macte.org/" target="_blank">MACTE</a>')
    .replace(/AMI\/AMS(?!<\/a>)/g, '<a class="text-green-600 font-medium hover:text-green-700 hover:underline" href="https://montessori-ami.org/" target="_blank">AMI/AMS</a>')
    .replace(/AMI(?!\/|<\/a>)/g, '<a class="text-green-600 font-medium hover:text-green-700 hover:underline" href="https://montessori-ami.org/" target="_blank">AMI</a>')
    .replace(/AMS(?!<\/a>)/g, '<a class="text-green-600 font-medium hover:text-green-700 hover:underline" href="https://amshq.org/" target="_blank">AMS</a>');
  
  // Split runs of tags that might be joined together incorrectly (like "EducationMontessoriSchool Choice")
  contentHtml = contentHtml.replace(
    /([A-Z][a-z]+)(?=[A-Z])/g, 
    (match, p1) => `${p1} <span class="tag-separator hidden md:inline-block mx-1">•</span> `
  );
  
  // Special handling for comparison tables often in Montessori articles
  const comparisonSectionRegex = /Montessori vs\. Traditional Education \(Quick Comparison\):[\s\S]*?<\/p>/;
  if (comparisonSectionRegex.test(contentHtml)) {
    contentHtml = contentHtml.replace(
      comparisonSectionRegex, 
      (match) => {
        // Extract rows by splitting on "|"
        const rows = match.split('|').filter(row => row.trim());
        
        // If we have enough rows for a table
        if (rows.length > 3) {
          let tableHtml = '<h3 class="text-xl font-bold mt-10 mb-6">Montessori vs. Traditional Education (Quick Comparison):</h3>';
          tableHtml += '<table class="border-collapse w-full my-8 mb-12">';
          tableHtml += '<thead class="bg-gray-100"><tr>';
          
          // Header row with "Aspect", "Montessori", "Traditional"
          tableHtml += '<th class="border border-gray-300 px-4 py-3 text-left font-semibold">Aspect</th>';
          tableHtml += '<th class="border border-gray-300 px-4 py-3 text-left font-semibold">Montessori</th>';
          tableHtml += '<th class="border border-gray-300 px-4 py-3 text-left font-semibold">Traditional</th>';
          tableHtml += '</tr></thead><tbody>';
          
          // Data rows
          for (let i = 1; i < rows.length; i += 3) {
            if (i + 2 < rows.length) {
              tableHtml += '<tr>';
              tableHtml += `<td class="border border-gray-300 px-4 py-3 font-medium">${rows[i].trim().replace(/^[a-zA-Z]+\s*:/, '').trim()}</td>`;
              tableHtml += `<td class="border border-gray-300 px-4 py-3">${rows[i+1].trim()}</td>`;
              tableHtml += `<td class="border border-gray-300 px-4 py-3">${rows[i+2].trim()}</td>`;
              tableHtml += '</tr>';
            }
          }
          
          tableHtml += '</tbody></table>';
          return tableHtml;
        }
        
        return match;
      }
    );
  }

  // Special handling for key questions section
  if (contentHtml.includes('Key Questions to Ask:')) {
    contentHtml = contentHtml.replace(
      /<p>Key Questions to Ask:<\/p>([\s\S]*?)(?=<h|$)/,
      '<h3 class="text-xl font-bold mt-10 mb-6">Key Questions to Ask:</h3><div class="space-y-6 mb-10">$1</div>'
    );
  }

  // Special handling for Pro Tips section
  if (contentHtml.includes('Pro Tips:')) {
    contentHtml = contentHtml.replace(
      /<p>Pro Tips:<\/p>([\s\S]*?)(?=<h|$)/,
      '<h3 class="text-xl font-bold mt-10 mb-6">Pro Tips:</h3><div class="space-y-4 mb-10 pl-4 border-l-4 border-gray-200">$1</div>'
    );
  }
  
  // Get tags in consistent format
  const tags = extractTags(data);
  
  // Find related posts
  const relatedPosts = findRelatedPosts(slug, tags);
  
  return {
    slug,
    title: data.title,
    date: data.date,
    description: data.description,
    author: data.author,
    coverImage: data.coverImage,
    tags: data.tags,
    readingTime: estimateReadingTime(content),
    contentHtml,
    relatedPosts,
  };
}

// Check if a tag exists in multiple posts (for tag filtering)
export function getPostsByTag(tag: string): BlogPostMeta[] {
  const allPosts = getAllPostsMeta();
  return allPosts.filter(post => {
    const postTags = extractTags(post);
    return postTags.some(t => t.toLowerCase() === tag.toLowerCase());
  });
}

// Get all unique tags across all posts
export function getAllTags(): string[] {
  const allPosts = getAllPostsMeta();
  const tagSet = new Set<string>();
  
  allPosts.forEach(post => {
    const tags = extractTags(post);
    tags.forEach(tag => tagSet.add(tag));
  });
  
  return Array.from(tagSet).sort();
}

// Helper: Generate slug from filename
function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '');
}

// For TDD: Export testable helpers
export const _test = { slugFromFilename, estimateReadingTime, extractTags }; 