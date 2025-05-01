import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const blogDir = path.join(process.cwd(), 'app/blog');

// Extract date from content
function extractDateFromContent(content: string): string | null {
  const dateMatch = content.match(/[A-Z][a-z]+ \d+, \d{4}/);
  return dateMatch ? dateMatch[0] : null;
}

// Extract author from content after date
function extractAuthorFromContent(content: string): string | null {
  const authorMatch = content.match(/[A-Z][a-z]+ \d+, \d{4}\s+By\s+([^<\n]+)/);
  return authorMatch ? authorMatch[1].trim() : null;
}

// Fix tags in content - split runs of capitalized words
function fixTagsInContent(content: string): string {
  // Find blocks that look like tag sections (capitalized words without spaces)
  return content.replace(
    /\n\n([A-Z][a-z]+)([A-Z][a-z]+)([A-Z][a-z]+)?([A-Z][a-z]+)?\n\n/g,
    (match, tag1, tag2, tag3, tag4) => {
      // Create a formatted tag string
      const tags = [tag1, tag2];
      if (tag3) tags.push(tag3);
      if (tag4) tags.push(tag4);
      
      // Join with commas and add a newline before and after
      return `\n\n${tags.join(', ')}\n\n`;
    }
  );
}

async function fixBlogPostFile(filePath: string) {
  const filename = path.basename(filePath);
  const content = await fs.readFile(filePath, 'utf8');
  
  // Parse frontmatter
  const { data, content: markdownContent } = matter(content);
  let updated = false;
  let updatedFrontmatter = { ...data };
  
  // 1. Update the date field if it's a future date (e.g., 2025)
  if (data.date && data.date.includes('2025')) {
    const extractedDate = extractDateFromContent(markdownContent);
    if (extractedDate) {
      updatedFrontmatter.date = new Date(extractedDate).toISOString().slice(0, 10);
      updated = true;
    } else {
      // Set to current date if no valid date found
      updatedFrontmatter.date = new Date().toISOString().slice(0, 10);
      updated = true;
    }
  }
  
  // 2. Extract author if present in content but not in frontmatter
  if (!data.author) {
    const extractedAuthor = extractAuthorFromContent(markdownContent);
    if (extractedAuthor) {
      updatedFrontmatter.author = extractedAuthor;
      updated = true;
    }
  }
  
  // 3. Clean up description if it contains a date
  if (data.description && data.description.match(/^[A-Z][a-z]+ \d+, \d{4}/)) {
    // Extract author if available
    const authorMatch = data.description.match(/^[A-Z][a-z]+ \d+, \d{4}\s+By\s+([^<\n]+)/);
    if (authorMatch && !updatedFrontmatter.author) {
      updatedFrontmatter.author = authorMatch[1].trim();
    }
    
    // Remove date and author from description
    let cleanDescription = data.description
      .replace(/^[A-Z][a-z]+ \d+, \d{4}/, '')
      .replace(/^By\s+[^<\n]+/, '')
      .trim();
      
    // If description is now empty, create a generic one
    if (!cleanDescription) {
      cleanDescription = `Learn about ${data.title} in this Montessori education guide.`;
    }
    
    updatedFrontmatter.description = cleanDescription;
    updated = true;
  }
  
  // 4. Add tags if missing but present in content
  if (!data.tags) {
    // Look for a line that appears to have tags (capitalized words on a line by themselves)
    const tagMatch = markdownContent.match(/\n\n([A-Z][a-z]+)([A-Z][a-z]+)([A-Z][a-z]+)?([A-Z][a-z]+)?\n\n/);
    if (tagMatch) {
      const tags = [tagMatch[1]];
      if (tagMatch[2]) tags.push(tagMatch[2]);
      if (tagMatch[3]) tags.push(tagMatch[3]);
      if (tagMatch[4]) tags.push(tagMatch[4]);
      
      updatedFrontmatter.tags = tags.join(', ');
      updated = true;
    } else {
      // Default tags
      updatedFrontmatter.tags = 'Education, Montessori, School Choice';
      updated = true;
    }
  }
  
  // 5. Fix tags in the content (separate joined tags)
  const updatedContent = fixTagsInContent(markdownContent);
  const contentChanged = updatedContent !== markdownContent;
  
  if (updated || contentChanged) {
    // Create new file content with updated frontmatter
    const newFileContent = matter.stringify(
      contentChanged ? updatedContent : markdownContent, 
      updatedFrontmatter
    );
    
    // Write updated file
    await fs.writeFile(filePath, newFileContent, 'utf8');
    return { filename, updated: true };
  }
  
  return { filename, updated: false };
}

async function main() {
  console.log('Fixing formatting in blog posts...');
  
  const files = (await fs.readdir(blogDir)).filter(f => f.endsWith('.md'));
  let updatedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(blogDir, file);
    const result = await fixBlogPostFile(filePath);
    
    if (result.updated) {
      console.log(`✅ Fixed: ${result.filename}`);
      updatedCount++;
    } else {
      console.log(`✓ No changes needed: ${result.filename}`);
    }
  }
  
  console.log(`\nDone. ${updatedCount} file(s) updated.`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 