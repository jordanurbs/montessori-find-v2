import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

const blogDir = path.join(process.cwd(), 'app/blog');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt for input
function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')  // Remove special chars
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Remove consecutive hyphens
    .trim();
}

async function main() {
  console.log('Create a new Montessori blog post\n');
  
  const title = await prompt('Post title: ');
  const slug = createSlug(await prompt(`URL slug (default: ${createSlug(title)}): `) || title);
  const description = await prompt('Short description (160 chars max): ');
  const author = await prompt('Author name (optional): ');
  const tags = await prompt('Tags (comma separated): ');
  
  // Current date in YYYY-MM-DD format
  const date = new Date().toISOString().slice(0, 10);
  
  // Create frontmatter
  let frontmatter = `---\ntitle: "${title}"\ndate: "${date}"\ndescription: "${description}"\n`;
  if (author) frontmatter += `author: "${author}"\n`;
  if (tags) frontmatter += `tags: "${tags}"\n`;
  frontmatter += `coverImage: "https://images.unsplash.com/photo-1583468982228-19f19164aee2?auto=format&fit=crop&q=80"\n`;
  frontmatter += `---\n\n`;
  
  // Create template content
  const template = `
![${title}](https://images.unsplash.com/photo-1583468982228-19f19164aee2?auto=format&fit=crop&q=80)

## ${title}

${description}

## Introduction

Start your Montessori blog post here...

## Main Section 1

Content for first main section... Research has shown that Montessori education provides significant benefits for cognitive development [1].

### Sample Table

| Column 1 | Column 2 | Column 3 |
| --- | --- | --- |
| Data 1 | Data 2 | Data 3 |
| More data | More details | Additional info |

<div class="cta-container">

## Find the Best Montessori School for Your Child

Explore a comprehensive database of verified Montessori schools, read authentic reviews, and make informed decisions about your child's education.

<a href="/states" class="cta-button">Browse by State</a>

</div>

## Main Section 2

Content for second main section...

## Conclusion

Summarize the key points and provide a call to action...

## References

1. Smith, J. (2023). The Impact of Montessori Education on Child Development. *Journal of Educational Psychology*, 45(2), 112-128.
`;

  const filePath = path.join(blogDir, `${slug}.md`);
  
  // Check if file already exists
  try {
    await fs.access(filePath);
    console.error(`\nError: File already exists at ${filePath}`);
    process.exit(1);
  } catch (error) {
    // File doesn't exist, we can proceed
  }
  
  // Write the new file
  await fs.writeFile(filePath, frontmatter + template, 'utf8');
  console.log(`\nSuccess! Created blog post at: ${filePath}`);
  console.log(`Preview at: http://localhost:3000/blog/${slug} (when dev server is running)`);
  
  rl.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 