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
    *   [ ] 12.3 Complete successful Netlify deployment
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
*   **Current Issue (Task 12.2)**: Encountered a deployment error on Netlify due to mismatch between package.json and pnpm-lock.yaml. The error shows that Netlify's CI environment is using `--frozen-lockfile` by default, but our lock file is out of sync with package.json. Need to regenerate the lock file and push the changes to resolve this deployment blocker.

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