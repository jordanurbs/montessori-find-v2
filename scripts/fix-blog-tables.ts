import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const blogDir = path.join(process.cwd(), 'app/blog');

// Format Markdown tables that are not properly structured
function formatMarkdownTables(content: string): string {
  // First, look for raw table-like structures in the content
  const tablePattern = /\|\s*([^|\n]+)\s*\|(?:\s*([^|\n]+)\s*\|)+/g;
  
  // Collect all lines that look like they might be part of a table
  const tableLines: string[] = [];
  
  // Split the content into lines
  const lines = content.split('\n');
  
  // Process each line
  let inTableSection = false;
  let tableStartIndex = -1;
  let tableEndIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if the line looks like a table row
    if (line.startsWith('|') && line.endsWith('|') && line.includes('|', 1)) {
      if (!inTableSection) {
        // Start of a table section
        inTableSection = true;
        tableStartIndex = i;
      }
      // Update the end index with each table row
      tableEndIndex = i;
    } 
    // If we were in a table section and found a non-table line
    else if (inTableSection && line !== '') {
      inTableSection = false;
      
      // Process the table section we just found
      if (tableStartIndex >= 0 && tableEndIndex >= tableStartIndex) {
        // Extract the table
        const tableRows = lines.slice(tableStartIndex, tableEndIndex + 1);
        
        // Fix the table formatting
        const fixedTable = fixTableFormat(tableRows);
        
        // Replace the table in the original content
        lines.splice(tableStartIndex, tableEndIndex - tableStartIndex + 1, ...fixedTable);
        
        // Adjust indices for the modifications
        const diff = fixedTable.length - (tableEndIndex - tableStartIndex + 1);
        i += diff;
        tableEndIndex += diff;
      }
      
      tableStartIndex = -1;
      tableEndIndex = -1;
    }
    // Handle end of file with a table
    else if (inTableSection && i === lines.length - 1) {
      inTableSection = false;
      
      // Process the table section we just found
      if (tableStartIndex >= 0 && tableEndIndex >= tableStartIndex) {
        // Extract the table
        const tableRows = lines.slice(tableStartIndex, tableEndIndex + 1);
        
        // Fix the table formatting
        const fixedTable = fixTableFormat(tableRows);
        
        // Replace the table in the original content
        lines.splice(tableStartIndex, tableEndIndex - tableStartIndex + 1, ...fixedTable);
      }
    }
  }
  
  return lines.join('\n');
}

// Fix the formatting of a table
function fixTableFormat(tableRows: string[]): string[] {
  if (tableRows.length < 1) return tableRows;
  
  // Clean up the rows and split cells
  const cleanedRows = tableRows.map(row => {
    // Remove leading and trailing spaces, ensure single space after/before pipe
    return row.trim().replace(/\|\s+/g, '| ').replace(/\s+\|/g, ' |');
  });
  
  // Count the cells in the first row to determine column count
  const columnCount = (cleanedRows[0].match(/\|/g) || []).length - 1;
  
  // Check if we need to add a separator row (second row should be a separator)
  if (cleanedRows.length >= 2) {
    const secondRow = cleanedRows[1];
    // Check if the second row looks like a separator row (contains only |, -, :, and spaces)
    const isSecondRowSeparator = /^\|[-:\s|]+\|$/.test(secondRow);
    
    if (!isSecondRowSeparator) {
      // Create a separator row with the appropriate number of columns
      const separatorRow = '| ' + Array(columnCount).fill('---').join(' | ') + ' |';
      cleanedRows.splice(1, 0, separatorRow);
    }
  } else if (cleanedRows.length === 1) {
    // If we only have a header row, add a separator row
    const separatorRow = '| ' + Array(columnCount).fill('---').join(' | ') + ' |';
    cleanedRows.push(separatorRow);
  }
  
  // Add empty line before and after table for proper Markdown rendering
  return ['', ...cleanedRows, ''];
}

// Special handling for problematic tables in specific blog posts
function fixSpecificProblemTables(content: string): string {
  // Fix for the Material Type / Cognitive Skill / Learning Outcome table
  return content.replace(
    /\| Material Type \| Cognitive Skill \| Learning Outcome \| \| --- \| --- \| --- \| \| Pink Tower \| Spatial reasoning \| Learning size relationships and order \| \| Number Rods \| Mathematical logic \| Understanding numerical concepts through hands-on use \|/g,
    `
| Material Type | Cognitive Skill | Learning Outcome |
| --- | --- | --- |
| Pink Tower | Spatial reasoning | Learning size relationships and order |
| Number Rods | Mathematical logic | Understanding numerical concepts through hands-on use |
`
  );
}

async function fixBlogPostFile(filePath: string) {
  const filename = path.basename(filePath);
  const content = await fs.readFile(filePath, 'utf8');
  
  // Parse frontmatter
  const { data, content: markdownContent } = matter(content);
  
  // First, check for specific problem tables
  let updatedContent = fixSpecificProblemTables(markdownContent);
  
  // Then apply general table formatting
  updatedContent = formatMarkdownTables(updatedContent);
  
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
  console.log('Fixing table formatting in blog posts...');
  
  const files = (await fs.readdir(blogDir)).filter(f => f.endsWith('.md'));
  let updatedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(blogDir, file);
    const result = await fixBlogPostFile(filePath);
    
    if (result.updated) {
      console.log(`✅ Fixed tables in: ${result.filename}`);
      updatedCount++;
    } else {
      console.log(`✓ No table fixes needed: ${result.filename}`);
    }
  }
  
  console.log(`\nDone. ${updatedCount} file(s) updated.`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 