import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const blogDir = path.join(process.cwd(), 'app/blog');

// Format "Find the Best Montessori School" CTAs
function formatMontessoriCTAs(content: string): string {
  // Look for the Find the Best Montessori School CTA pattern
  return content.replace(
    /##?\s*Find the Best Montessori School for Your Child\s*\n\n(Explore a comprehensive database of verified Montessori schools[^]*?education\.)(\s*\n\n)?([^]*?)Browse by State/g,
    `
<div class="cta-container">

## Find the Best Montessori School for Your Child

$1

<a href="/states" class="cta-button">Browse by State</a>

</div>
`
  );
}

// Format inline reference links like [13] to have proper styling
function formatReferenceLinks(content: string): string {
  // Look for reference link patterns like [10], [13], etc.
  return content.replace(
    /\[(\d+)\]/g,
    '<span class="reference-link">[$1]</span>'
  );
}

async function fixBlogPostFile(filePath: string) {
  const filename = path.basename(filePath);
  const content = await fs.readFile(filePath, 'utf8');
  
  // Parse frontmatter
  const { data, content: markdownContent } = matter(content);
  
  // Fix CTA formatting
  let updatedContent = formatMontessoriCTAs(markdownContent);
  
  // Fix reference link formatting
  updatedContent = formatReferenceLinks(updatedContent);
  
  // Check if the content has changed
  if (updatedContent !== markdownContent) {
    // Create new file content with updated content
    const newFileContent = matter.stringify(updatedContent, data);
    
    // Write updated file
    await fs.writeFile(filePath, newFileContent, 'utf8');
    return { filename, updated: true };
  }
  
  return { filename, updated: false };
}

async function main() {
  console.log('Fixing CTA and reference link formatting in blog posts...');
  
  const files = (await fs.readdir(blogDir)).filter(f => f.endsWith('.md'));
  let updatedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(blogDir, file);
    const result = await fixBlogPostFile(filePath);
    
    if (result.updated) {
      console.log(`✅ Fixed formatting in: ${result.filename}`);
      updatedCount++;
    } else {
      console.log(`✓ No formatting fixes needed: ${result.filename}`);
    }
  }
  
  console.log(`\nDone. ${updatedCount} file(s) updated.`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 