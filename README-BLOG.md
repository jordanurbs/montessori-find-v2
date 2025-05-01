# Montessori Find Blog System

The blog system is designed to create a collection of Montessori-focused articles using Markdown files for content, with server-side rendering for optimal performance and SEO.

## Features

- Server-side rendered blog posts from Markdown files
- Frontmatter for metadata (title, date, description, author, tags, etc.)
- Automatic reading time calculation
- Related posts based on tags
- Tag filtering and browsing
- Special styling for Montessori-specific content
- SEO optimization with metadata and structured data
- Responsive design for all device sizes

## File Structure

- `/app/blog/*.md` - Markdown files for blog posts
- `/app/blog/page.tsx` - Blog index page
- `/app/blog/[slug]/page.tsx` - Individual blog post page
- `/lib/blog.ts` - Utility functions for handling blog posts
- `/scripts/create-new-blog-post.ts` - Script to create new blog posts
- `/scripts/add-frontmatter-to-blog-posts.ts` - Script to fix missing frontmatter

## Creating New Blog Posts

You can create a new blog post using the provided script:

```bash
npm run blog:new
# or
pnpm blog:new
```

This will prompt you for:
- Post title
- URL slug (auto-generated from title, but you can customize)
- Short description
- Author name
- Tags (comma separated)

The script will create a new Markdown file in the `/app/blog` directory with the proper frontmatter.

## Markdown Format

Blog posts use standard Markdown format with frontmatter at the top:

```markdown
---
title: "Your Blog Post Title"
date: "2024-04-01"
description: "A brief description of your post (160 characters max)"
author: "Your Name"
tags: "Montessori, Education, Parenting"
coverImage: "https://example.com/your-image.jpg"
---

![Your Blog Post Title](https://example.com/your-image.jpg)

## Your Blog Post Title

Content starts here...
```

### Tables in Markdown

The blog system supports proper table formatting in Markdown. Use the standard pipe syntax with a separator row:

```markdown
| Header 1 | Header 2 | Header 3 |
| --- | --- | --- |
| Data 1 | Data 2 | Data 3 |
| More data | More details | Additional info |
```

This will render as a properly formatted HTML table with appropriate styling. Special styling is applied to:

- Material Type/Cognitive Skill tables
- Comparison tables
- Data tables with multiple rows

### Call-to-Action Blocks

The blog system supports styled call-to-action (CTA) blocks. Use HTML div elements with appropriate classes:

```markdown
<div class="cta-container">

## Find the Best Montessori School for Your Child

Explore a comprehensive database of verified Montessori schools, read authentic reviews, and make informed decisions about your child's education.

<a href="/states" class="cta-button">Browse by State</a>

</div>
```

This will render as a styled green box with centered text and a button. The CTA is fully responsive and draws attention to important actions readers can take.

### Reference Links

The blog system automatically formats reference links like `[10]` or `[13]` to appear as styled citation badges. You can use standard Markdown syntax for these references:

```markdown
One standout feature of these materials is the "control of error." This allows children to notice and correct their mistakes independently, promoting self-correction and analytical thinking without constant teacher guidance [10].
```

These references will be styled as small, superscript badges that link to the reference section. When users click on them, they'll be taken to the corresponding reference anchor.

## Frontmatter Fields

- `title` (required) - The title of the blog post
- `date` (required) - Publication date in YYYY-MM-DD format
- `description` (required) - Short description for SEO and previews
- `author` (optional) - Author's name
- `tags` (optional) - Comma-separated list or array of tags
- `coverImage` (optional) - URL to the cover image

## Special Content Handling

The blog system includes special handling for Montessori-specific content:

1. Automatic linking of Montessori terms:
   - MACTE → links to Montessori Accreditation Council for Teacher Education
   - AMI/AMS → links to Association Montessori Internationale
   - AMI → links to Association Montessori Internationale
   - AMS → links to American Montessori Society

2. Formatting for special sections:
   - "Key Questions to Ask:" sections get special styling
   - "Pro Tips:" sections are formatted with a side border
   - "Montessori vs. Traditional Education" comparisons get tabular formatting

## API Endpoints

The blog system includes API endpoints for programmatic access:

- `/api/blog/tags` - Get all available tags
- `/api/blog/tags?tag=Education` - Get all posts with the specified tag

## Utility Functions

The `lib/blog.ts` file contains several utility functions:

- `getAllPostsMeta()` - Get metadata for all blog posts
- `getPostBySlug(slug)` - Get a single post by its slug
- `getAllTags()` - Get all unique tags across all posts
- `getPostsByTag(tag)` - Get posts matching a specific tag
- `extractTags(post)` - Get tags in a consistent format

## Adding Frontmatter to Existing Posts

If you have blog posts without proper frontmatter, you can add it using:

```bash
npm run blog:fix
# or
pnpm blog:fix
```

This script will analyze the content to extract title, date, and description.

## Testing

The blog system includes tests in `lib/blog.test.ts`, which can be run with:

```bash
npm run test:unit
# or
pnpm test:unit
``` 