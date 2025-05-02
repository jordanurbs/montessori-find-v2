# Montessori Find V2 - SSR Migration Plan

## Background and Motivation

The user has an existing React website built with Client-Side Rendering (CSR). The site contains a large number of pages (~1000 schools based on build log). The primary goal is to implement Server-Side Rendering (SSR) or a related technique (like Static Site Generation - SSG, or Incremental Static Regeneration - ISR) to improve Search Engine Optimization (SEO) for these pages.

The data backend is Supabase (database only, no image hosting). The target deployment platform is Netlify.

**Update:** The URL structure needs optimization for SEO. The target structure is:
*   `/`
*   `/states/{state_abbr}`
*   `/states/{state_abbr}/{city_slug}`
*   `/schools/{state_abbr}/{city_slug}/{school_slug}`

This requires implementing state/city landing pages and using slugs instead of IDs.

## Key Challenges and Analysis

*   **Migration Complexity:** Reduced as the project uses Next.js App Router, but increased again due to URL structure changes.
*   **Browser API Dependency:** Identified in Google Maps components (`components/google-map.tsx`, `components/map-view.tsx`). Handled via `'use client'`.
*   **Data Fetching:** Needs significant changes to fetch data by state abbreviation, city slug, and school slug instead of just ID. Requires updates to Supabase helper functions.
*   **Routing:** Requires creating new dynamic routes for states and cities, and restructuring the school route using slugs. `generateStaticParams` needs to be implemented for all new/changed routes.
*   **Database Schema:** Requires adding `slug` columns to relevant tables (e.g., `schools`, potentially `cities` or generating city slugs dynamically). Slugs need to be unique within their context (e.g., school slug unique within a city).
*   **Slug Generation:** Need a consistent way to generate URL-friendly slugs from names (e.g., "Los Angeles" -> "los-angeles").
*   **Performance:** SSG remains the goal. Build times might increase slightly due to more pages (state/city) and potentially more complex `generateStaticParams` queries.
*   **Deployment:** Netlify supports the target structure. Ensure Supabase env vars are set.
*   **Scale (~1000+ pages):** SSG via `generateStaticParams` is appropriate.

## High-level Task Breakdown

**(Revised Plan Incorporating Slugs and New Pages)**

1.  **Codebase Analysis & Strategy Selection:** - **Completed** (Next.js App Router, SSG recommended).
2.  **Database Schema Update & Slug Generation:**
    *   **Action (Requires User/Manual Intervention):** Add `slug` columns to `schools` table in Supabase. Consider if a `cities` table with slugs is needed or if city slugs can be generated/derived. Ensure slugs are unique (e.g., school slug unique per city).
    *   Implement a utility function (e.g., in `lib/utils.ts`) to generate URL-friendly slugs from strings (e.g., names, cities).
    *   **Action (Requires User/Manual Intervention or Script):** Populate the new `slug` columns for existing data in Supabase.
    *   **Success Criteria:** Database schema updated. Slug generation utility function exists. Existing data has slugs.
3.  **Implement State Landing Pages:**
    *   Create route `app/states/[state_abbr]/page.tsx`.
    *   Implement `generateStaticParams` to get all distinct `state_abbr` values from Supabase.
    *   Implement the page component to display state-specific information (e.g., list of cities, schools in the state - requires new Supabase fetch functions).
    *   **Success Criteria:** State pages build statically and display correct data fetched via `state_abbr`.
4.  **Implement City Landing Pages:**
    *   Create route `app/states/[state_abbr]/[city_slug]/page.tsx`.
    *   Implement `generateStaticParams` to get all distinct `{ state_abbr, city_slug }` combinations from Supabase.
    *   Implement the page component to display city-specific information (e.g., list of schools in the city - requires new Supabase fetch functions).
    *   **Success Criteria:** City pages build statically and display correct data fetched via `state_abbr` and `city_slug`.
5.  **Refactor School Pages:**
    *   Rename/move route from `app/schools/[id]/` to `app/schools/[state_abbr]/[city_slug]/[school_slug]/`.
    *   Update `generateStaticParams` in the *new* school route page to fetch and return `{ state_abbr, city_slug, school_slug }` for all schools.
    *   Update the `SchoolPage` component (`page.tsx`) to accept `params: { state_abbr, city_slug, school_slug }`.
    *   Update data fetching within `SchoolPage` to use the slugs (requires new Supabase fetch functions like `getSchoolBySlugs`).
    *   **Success Criteria:** School pages build statically under the new URL structure, fetching and displaying correct data based on slugs.
6.  **Update Supabase Helper Functions:**
    *   Modify/create functions in `lib/supabase.ts` to support fetching by slugs: `getStates`, `getCitiesByStateSlug`, `getSchoolsByCitySlug`, `getSchoolBySlugs`, etc.
    *   Ensure these functions efficiently query based on the new slug columns.
    *   **Success Criteria:** All necessary data fetching functions for the new page structures exist and work correctly.
7.  **Component Adaptation (Client Components):** - **Completed** (Google Maps components already use `'use client'`).
8.  **Build Verification:**
    *   Run `pnpm build`.
    *   Verify all state, city, and school pages are generated statically under the new URL structure without errors.
    *   Check build output for expected page counts and route structures.
    *   **Success Criteria:** Build completes successfully, generating all expected pages with the new slug-based URLs.
9.  **Hydration & Client-Side Logic:**
    *   Run `pnpm start`.
    *   Test navigation and functionality on state, city, and school pages.
    *   Verify client components (Google Maps) load and function correctly.
    *   Check browser console for hydration errors.
    *   **Success Criteria:** Pages load correctly, are interactive, and have no hydration errors.
10. **Styling Integration:**
    *   Visually check the appearance of the new/modified pages.
    *   **Success Criteria:** Styles are applied correctly across all page types.
11. **Testing:**
    *   Add/update unit/integration tests for new components and data fetching.
    *   Perform E2E tests covering new navigation paths.
    *   Validate SEO improvements (check HTML source for content, check URL structures).
    *   Performance testing.
    *   **Success Criteria:** Test suite passes. SEO analysis confirms correct rendering and URL structure. Performance meets targets.
12. **Deployment:**
    *   Configure Netlify deployment settings (ensure build command is correct, environment variables for Supabase are set).
    *   Set up CI/CD.
    *   Consider potential build time limits on Netlify for the increased number of pages.
    *   **Success Criteria:** Application deployed to Netlify and accessible with new URL structure.
13. **Monitoring & Rollout:**
    *   Implement logging/monitoring.
    *   Plan/execute rollout.
    *   Monitor performance, errors, SEO.
    *   **Success Criteria:** Monitoring active. Rollout successful. Metrics stable/improving.

## Project Status Board

*   [x] **1. Codebase Analysis & Strategy Selection**
*   [x] **2. Database Schema Update & Slug Generation** (Requires User Input/Action)
*   [x] **3. Implement State Landing Pages**
*   [x] **4. Implement City Landing Pages**
*   [x] **5. Refactor School Pages**
*   [x] **6. Update Supabase Helper Functions**
*   [x] **7. Component Adaptation (Client Components)**
*   [x] **8. Build Verification**
*   [x] **9. Hydration & Client-Side Logic**
*   [x] **10. Styling Integration**
*   [x] **11. Testing**
*   [ ] **12. Deployment**
    *   [x] 12.1 Configure Netlify deployment settings
    *   [ ] 12.2 Fix pnpm-lock.yaml and package.json mismatch issue
    *   [x] 12.3 Complete successful Netlify deployment
*   [ ] **13. Monitoring & Rollout**

## Executor's Feedback or Assistance Requests

*   (Previous feedback cleared due to plan change)
*   Planner mode: Updated plan significantly to incorporate SEO-friendly URL slugs (`/states/ca`, `/states/ca/city-slug`, `/schools/ca/city-slug/school-slug`). This requires database changes (adding slugs), new landing pages (state, city), and refactoring the school pages and data fetching.
*   Completed Task 2: User added `slug` column to DB. Created `slugify` utility. Created and successfully ran script (`scripts/populate-school-slugs.ts` using `tsx`) to populate slugs for ~1000 existing schools after resolving `upsert` issues by switching to `update`.
*   Completed Task 6: Updated Supabase helper functions in `lib/supabase.ts`. Added `slug` to School type and created new functions to support the SEO-friendly URL structure: `getAllStateAbbrs`, `getCitySlugsByStateAbbr`, `getSchoolSlugParams`, `getSchoolBySlugs`, `getReviewsBySchoolSlugs`, `getSchoolsByStateAbbr`, and `getSchoolsByCitySlug`.
*   Completed Task 3: Updated state landing page component (`app/states/[state_abbr]/page.tsx`) to use our new helper functions and URL structure.
*   Completed Task 4: Created new city landing page component (`app/states/[state_abbr]/[city_slug]/page.tsx`) with the ability to show all schools in a specific city, using slug-based URLs.
*   Completed Task 5: Created new school detail page component (`app/schools/[state_abbr]/[city_slug]/[school_slug]/page.tsx`) with the new URL structure and adapted data fetching to use our slug-based helpers.
*   Fixed dependency issues with package installation by using `npm install --legacy-peer-deps` to resolve conflicts between React 19.1.0 and react-day-picker's requirement for React ≤18.0.0.
*   Successfully ran the school slug population script using a custom TypeScript configuration file (tsconfig.node.json) that sets the module type to CommonJS for script execution. The script successfully connected to Supabase and processed 7,053 schools, although all schools already had slugs populated.
*   Completed Task 8: Fixed URL structure conflicts between the old and new routes by removing redundant routes (`app/[state_abbr]/page.tsx` and `app/schools/[id]/page.tsx`). This resolved the "You cannot use different slug names for the same dynamic path" build error.
*   Fixed an issue with the `getSchoolBySlugs` function that was causing errors during build due to duplicate slugs. Updated the function to find all schools with matching state and slug, then filter to the one with the matching city_slug.
*   Fixed Next.js parameter destructuring warnings by accessing `props.params` instead of destructuring params directly in function parameters. This follows Next.js's recommendation to wait until after component execution begins to access dynamic parameters.
*   Completed build verification with 1,055 static pages successfully generated, properly utilizing Next.js's `generateStaticParams` for efficient static site generation.
*   Completed Task 9: Verified proper hydration and client-side logic. Updated the `MapView` component to use the new slug-based URL structure for marker links. Confirmed that Google Maps components (and other client components) are properly marked with "use client" directive.
*   Completed Task 10: Verified consistent styling across all pages using Tailwind CSS and shadcn/ui components. The application uses a well-structured design system with consistent colors, spacing, and component styles.
*   Completed Task 11: Implemented comprehensive testing strategy with three specialized test scripts:
    * Created `scripts/test-seo.ts` to validate SEO factors like title tags, meta descriptions, h1 tags, and canonical URLs.
    * Created `scripts/test-navigation.ts` to crawl the site and validate that all internal links follow our slug-based URL structure.
    * Created `scripts/test-performance.ts` to measure loading times, page size, and number of requests with configurable thresholds.
    * Added corresponding npm scripts in package.json to run individual tests or all tests with a single command.
*   **Previous Issue (Task 12.2)**: Encountered a deployment error on Netlify due to mismatch between package.json and pnpm-lock.yaml. The error shows that Netlify's CI environment is using `--frozen-lockfile` by default, but our lock file is out of sync with package.json. Need to regenerate the lock file and push the changes to resolve this deployment blocker.
*   **Fixed Task 12.3** (Netlify Build Error): Fixed a critical build error on Netlify that was failing with `TypeError: e.trim is not a function` during static page generation. The issue was in the social media links parsing function in the school page component. The error occurred when trying to apply `trim()` on potential null or non-string values. Updated the `parseSocialMediaLinks` function to add proper type checking before calling `trim()` and improved the handling of direct URL strings vs. JSON data. This fix ensures the application builds successfully on Netlify.

## Lessons

*(Learnings and reusable patterns will be documented here)*
*   Use `tsx` instead of `ts-node` for executing TS scripts in modern Node/Next.js projects to avoid module/extension errors.
*   When updating Supabase records via script, prefer explicit `.update().eq()` over `.upsert()` if encountering unexpected constraint violations, especially if you know the records already exist.
*   For large datasets in Supabase, always use pagination with `.range()` to avoid hitting the default 1000-record limit.
*   When creating slug-based routes, having the actual slug stored in the database reduces complexity compared to calculating it on the fly (though we still need to calculate city_slugs).
*   For URL parameters that need to be case-insensitive (like state abbreviations), standardize on lowercase in URLs (`/states/ca`) but convert to the appropriate case (uppercase) for database queries.
*   In Next.js App Router, `generateStaticParams` at each route level can work seamlessly with nested dynamic routes to create a hierarchical structure of statically generated pages.
*   When checking for non-unique slugs, it's better to fetch all matching items and filter them in the application logic rather than using database-level uniqueness constraints, especially when uniqueness depends on combinations of fields.
*   In Next.js, avoid destructuring route parameters directly in component function parameters. Instead, first access `props.params` as a whole to prevent "params should be awaited before using its properties" warnings.
*   When implementing automated tests for SEO, focus on key elements that search engines prioritize: title tags, meta descriptions, heading structure, and canonical URLs.
*   For testing URL structures in a Next.js application, regular expressions provide a flexible way to define and validate URL patterns across the entire site.
*   Simple performance testing can be done with fetch and measuring response time, but real-world performance depends on many factors like network conditions, browser rendering, and client-side JavaScript execution.
*   When deploying to Netlify with pnpm, make sure the pnpm-lock.yaml file is always in sync with package.json to avoid CI build failures, as Netlify uses `--frozen-lockfile` by default.
*   Always add null and type checks before calling methods like `trim()` on values that might come from external sources (like a database). For social media links or URLs, validate that the value is a string before processing it.

---

# Blog Feature Implementation

## Background and Motivation

The goal is to add a dynamic, SEO-friendly blog section to the Montessori Find V2 website. This leverages existing content provided as Markdown files in the `app/blog` directory. The blog aims to enhance user engagement by providing valuable information to parents searching for Montessori schools, improve site content depth, and contribute positively to SEO. The implementation should utilize Server-Side Rendering (SSR) or Static Site Generation (SSG) principles within the existing Next.js framework and adhere to SEO best practices.

## Key Challenges and Analysis

*   **Technology Choice:** Utilizing the existing Next.js App Router structure is optimal. Libraries like `gray-matter` (for frontmatter parsing) and `remark` with `remark-html` (for Markdown to HTML conversion) are suitable choices.
*   **Routing:** Need to establish routes for the blog index (`/blog`) and individual posts (`/blog/[slug]`). The slugs will be derived from the Markdown filenames.
*   **Markdown Processing:**
    *   A robust function is required to read Markdown files from the `app/blog` directory.
    *   Extract frontmatter (e.g., `title`, `date`, `description`, `author`, `image`) for metadata.
    *   Convert Markdown body content to HTML for rendering.
    *   Handle potential errors during file reading or parsing.
*   **SEO:**
    *   Implement dynamic generation of `<title>` and `<meta description>` tags based on frontmatter for both index and post pages.
    *   Add Open Graph (`og:`) and Twitter Card (`twitter:`) meta tags for social sharing previews.
    *   Incorporate structured data (Schema.org `BlogPosting`) for individual articles to enhance search engine understanding.
    *   Ensure clean, descriptive URLs using slugs derived from filenames.
    *   Consider adding internal linking features (e.g., "Related Posts") in the future.
    *   Update or generate a `sitemap.xml` to include blog URLs.
*   **Rendering Strategy:** Static Site Generation (SSG) using `generateStaticParams` (for post pages) and fetching data at build time (for index page) is the preferred approach for a blog with content that doesn't change in real-time. This offers the best performance and SEO benefits.
*   **Content Structure:** Define a standard frontmatter structure for the Markdown files to ensure consistent metadata extraction (e.g., `title`, `date`, `description`, `author`, `coverImage`).
*   **UI/UX:** Design and implement simple, clean, and readable layouts for the blog index (list of posts) and individual post pages.

## High-level Task Breakdown

1.  **Standardize Frontmatter & Content:**
    *   Review existing `.md` files in `app/blog`.
    *   Define and document a standard frontmatter structure (e.g., `title: string`, `date: YYYY-MM-DD`, `description: string`, `author?: string`, `coverImage?: string`).
    *   **Action (Manual):** Update all existing `.md` files to conform to this structure. Add placeholder content to `10-benefits-of-montessori-education-for-early-learners.md` if it's meant to be included.
    *   **Success Criteria:** All `.md` files in `app/blog` have consistent and complete frontmatter.
2.  **Setup & Dependencies:**
    *   Install necessary libraries: `npm install gray-matter remark remark-html` (or `pnpm add ...`).
    *   **Success Criteria:** Dependencies installed successfully.
3.  **Blog Data Fetching Logic:**
    *   Create a utility function (e.g., in `lib/blog.ts`) to:
        *   Read all `.md` files from the `app/blog` directory.
        *   Parse frontmatter using `gray-matter`.
        *   Generate a `slug` for each post (from filename).
        *   Sort posts (e.g., by date descending).
        *   Provide functions like `getAllPostsData()` (for index) and `getPostData(slug)` (for individual posts, including HTML content generation using `remark`).
    *   Write unit tests for these utility functions.
    *   **Success Criteria:** Utility functions correctly read, parse, sort posts, generate slugs, and convert Markdown to HTML. Tests pass.
4.  **Blog Index Page (`/blog`):**
    *   Create the route `app/blog/page.tsx`.
    *   Use the `getAllPostsData()` utility to fetch metadata for all posts (title, slug, date, description) at build time (implicitly SSG in App Router).
    *   Render a list of blog posts, displaying title, date, description, and linking to `/blog/[slug]`.
    *   Implement basic page-level SEO: `<title>Blog | Montessori Find</title>`, relevant `<meta description>`.
    *   Write tests for basic rendering and data display.
    *   **Success Criteria:** `/blog` page builds statically, displays a list of posts fetched from Markdown files, links correctly, and has basic SEO tags.
5.  **Blog Post Page (`/blog/[slug]`):**
    *   Create the dynamic route `app/blog/[slug]/page.tsx`.
    *   Implement `generateStaticParams` to return `{ slug: '...' }` for each post, using the slugs derived from filenames.
    *   Implement the page component to:
        *   Fetch full post data (including HTML content) using `getPostData(params.slug)`.
        *   Render the post title, metadata (date, author), and HTML content.
    *   Implement post-specific SEO:
        *   Dynamic `<title>{post.title} | Montessori Find</title>`.
        *   Dynamic `<meta name="description" content={post.description}>`.
        *   Open Graph and Twitter Card meta tags using frontmatter data.
    *   Write tests for data fetching, Markdown rendering, and presence of key SEO tags.
    *   **Success Criteria:** Individual post pages `/blog/[slug]` build statically for each post, render content correctly, and have comprehensive, post-specific SEO meta tags.
6.  **Structured Data (JSON-LD):**
    *   In the Blog Post Page component (`app/blog/[slug]/page.tsx`), add a `<script type="application/ld+json">` tag.
    *   Generate JSON-LD data conforming to the Schema.org `BlogPosting` type, using post metadata (headline, datePublished, dateModified, author, image, description, etc.).
    *   **Success Criteria:** Rendered HTML source of blog post pages includes valid `BlogPosting` JSON-LD structured data.
7.  **Styling:**
    *   Apply basic Tailwind CSS styling to `app/blog/page.tsx` and `app/blog/[slug]/page.tsx` for readability and consistency with the rest of the site. Ensure code blocks within posts are styled appropriately.
    *   **Success Criteria:** Blog index and post pages are visually appealing and readable.
8.  **Sitemap:**
    *   Update the sitemap generation logic (if exists, e.g., `app/sitemap.xml.ts`) to include URLs for the blog index page (`/blog`) and all individual blog post pages (`/blog/[slug]`).
    *   **Success Criteria:** Generated sitemap includes all blog URLs.
9.  **Testing & Review:**
    *   Run `pnpm build` and `pnpm start` to test locally.
    *   Manually review blog index and several post pages for content accuracy, layout, and SEO tag correctness (using browser dev tools).
    *   Run any relevant automated tests (unit, integration, potentially E2E if configured).
    *   **Success Criteria:** Blog builds successfully, functions correctly locally, passes manual review and automated tests.

## Project Status Board (Blog Feature)

*   [ ] **1. Standardize Frontmatter & Content** (Requires Manual Action)
*   [x] **2. Setup & Dependencies**
*   [x] **3. Blog Data Fetching Logic** (Implement utils + tests)
*   [x] **4. Blog Index Page (`/blog`)** (Create page, fetch data, render list, basic SEO + tests)
*   [x] **5. Blog Post Page (`/blog/[slug]`)** (Create page, `generateStaticParams`, fetch/render content, specific SEO + tests)
*   [x] **6. Structured Data (JSON-LD)** (Implement schema on post pages)
*   [x] **7. Styling** (Apply Tailwind styles)
*   [ ] **8. Sitemap** (Update sitemap generation)
*   [ ] **9. Testing & Review** (Build, manual review, automated tests)

## Executor's Feedback or Assistance Requests (Blog Feature)

- Task 4 (Blog Index Page) fix: Added 'use server' directive to ensure server-only rendering and allow use of fs, resolving the blank page issue.
- Task 5 (Blog Post Page) complete: Implemented dynamic post page with SSG, SEO metadata, Open Graph/Twitter tags, and JSON-LD structured data. Uses Tailwind for styling and renders Markdown content as HTML.
- Tasks 6-7 (Structured Data and Styling) complete: Both the blog index and post pages have been completely restyled to match the provided designs. Features include:
  - Hero section with background image on the index page
  - Card-based blog post grid with cover images and tag pills
  - Full-width cover images on post pages
  - Centered title with date and tags
  - Enhanced typography for blog content including lists, blockquotes, and tables
  - Newsletter signup section at the bottom of post pages
  - Automatic tag extraction (with fallbacks if not specified in frontmatter)
  - Consistent green color scheme matching the site's brand

## Lessons (Blog Feature)

* For more complex Markdown parsing needs like interactive blogs, adding custom post-processing with regex replacements can greatly enhance the reading experience without requiring changes to the source Markdown files.
* When dealing with domain-specific content (like Montessori education), adding special handling for common terms and organization names (MACTE, AMI/AMS) improves both SEO and user experience.
* Using Tailwind's prose plugin with detailed modifiers provides fine-grained control over typography, but custom selectors like `[&_iframe]` may be needed for elements not directly covered.
* Blog posts that contain tables, especially comparison tables, benefit from enhanced styling beyond what basic Markdown-to-HTML conversion provides.
* For embedded content like YouTube videos, special handling is required to ensure responsive design and proper styling. 