import fs from 'fs/promises';
import path from 'path';

const blogDir = path.join(process.cwd(), 'app/blog');

function extractTitleFromContent(content: string, filename: string): string {
  // Try to find the first non-empty line that looks like a heading
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^#+\s*(.+)$/);
    if (match) return match[1].trim();
  }
  // Fallback: use filename (replace dashes with spaces, capitalize)
  return filename.replace(/[-_]/g, ' ').replace(/\.md$/, '').replace(/\b\w/g, c => c.toUpperCase());
}

function extractDateFromContent(content: string): string {
  // Try to find a date in YYYY-MM-DD or similar format
  const match = content.match(/(\d{4}-\d{2}-\d{2})/);
  if (match) return match[1];
  // Fallback: use today
  return new Date().toISOString().slice(0, 10);
}

function extractDescriptionFromContent(content: string): string {
  // Use the first non-empty line that is not a heading or image
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.trim() && !line.startsWith('#') && !line.startsWith('![')) {
      return line.trim().slice(0, 160);
    }
  }
  return 'A Montessori blog post.';
}

async function hasFrontmatter(content: string): Promise<boolean> {
  return content.trimStart().startsWith('---');
}

async function addFrontmatterToFile(filePath: string) {
  const filename = path.basename(filePath);
  const content = await fs.readFile(filePath, 'utf8');
  if (await hasFrontmatter(content)) {
    return { updated: false, filename };
  }
  const title = extractTitleFromContent(content, filename);
  const date = extractDateFromContent(content);
  const description = extractDescriptionFromContent(content);
  const frontmatter = `---\ntitle: "${title}"\ndate: "${date}"\ndescription: "${description}"\n---\n\n`;
  await fs.writeFile(filePath, frontmatter + content, 'utf8');
  return { updated: true, filename };
}

async function main() {
  const files = (await fs.readdir(blogDir)).filter(f => f.endsWith('.md'));
  let updatedCount = 0;
  for (const file of files) {
    const filePath = path.join(blogDir, file);
    const result = await addFrontmatterToFile(filePath);
    if (result.updated) {
      console.log(`Added frontmatter to: ${result.filename}`);
      updatedCount++;
    } else {
      console.log(`Already has frontmatter: ${result.filename}`);
    }
  }
  console.log(`\nDone. ${updatedCount} file(s) updated.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 