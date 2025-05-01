import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.join(process.cwd(), 'app/blog');

async function fixProblemTable(targetFile: string) {
  console.log(`Fixing problem table in ${targetFile}...`);
  
  // Build path to the target file
  const filePath = path.join(blogDir, targetFile);
  
  try {
    // Check if file exists
    await fs.access(filePath);
    
    // Read the file
    const content = await fs.readFile(filePath, 'utf8');
    
    // Parse frontmatter
    const { data, content: markdownContent } = matter(content);
    
    // Fix common pattern from the screenshot example - using a more compatible approach without 's' flag
    const pattern = /\| Material Type \| Cognitive Skill \| Learning Outcome \|([\s\S]*?)\| --- \| --- \| --- \|([\s\S]*?)\| Pink Tower \| Spatial reasoning \| Learning size relationships and order \|([\s\S]*?)\| Number Rods \| Mathematical logic \| Understanding numerical concepts through hands-on use \|/;
    
    const updatedContent = markdownContent.replace(
      pattern,
      `
| Material Type | Cognitive Skill | Learning Outcome |
| --- | --- | --- |
| Pink Tower | Spatial reasoning | Learning size relationships and order |
| Number Rods | Mathematical logic | Understanding numerical concepts through hands-on use |
`
    );
    
    // Only update if there were changes
    if (updatedContent !== markdownContent) {
      // Write updated content back to file
      const newFileContent = matter.stringify(updatedContent, data);
      await fs.writeFile(filePath, newFileContent, 'utf8');
      console.log('✅ Table fixed successfully!');
    } else {
      console.log('No problem table found matching the pattern.');
    }
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    console.log('Make sure the file exists in the app/blog directory.');
  }
}

async function main() {
  // Get filename from command line argument
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run blog:fix-table <filename.md>');
    console.log('Example: npm run blog:fix-table 10-benefits-of-montessori-education-for-early-learners.md');
    process.exit(0);
  }
  
  const targetFile = args[0];
  await fixProblemTable(targetFile);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 