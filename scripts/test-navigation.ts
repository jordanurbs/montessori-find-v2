/**
 * Navigation Testing Script
 * 
 * This script crawls the website starting from the homepage and validates that
 * all internal links follow our slug-based URL structure.
 */

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

// Test configuration
const BASE_URL = 'http://localhost:3001';
const MAX_PAGES_TO_CRAWL = 50; // Limit to avoid crawling the entire site
const VALID_URL_PATTERNS = [
  // Matches home page
  /^\/?$/,
  // Matches /states/[state_abbr]
  /^\/states\/[a-z]{2}$/,
  // Matches /states/[state_abbr]/[city_slug]
  /^\/states\/[a-z]{2}\/[a-z0-9-]+$/,
  // Matches /schools/[state_abbr]/[city_slug]/[school_slug]
  /^\/schools\/[a-z]{2}\/[a-z0-9-]+\/[a-z0-9-]+$/,
  // Other valid paths (browse page, admin, api, etc.)
  /^\/browse\/?$/,
  /^\/admin\/.+$/,
  /^\/api\/.+$/,
  /^\/blog\/?$/,
  /^\/about\/?$/,
  /^\/faq\/?$/
];

// Links to ignore
const IGNORE_PATTERNS = [
  /^mailto:/,
  /^tel:/,
  /^https?:\/\/(?!localhost)/,
  /^#/,
  /\.pdf$/,
  /\.jpg$/,
  /\.png$/,
  /\.svg$/
];

interface CrawlResult {
  url: string;
  statusCode: number;
  title: string | null;
  links: string[];
  isValid: boolean;
  issues: string[];
}

const crawledUrls = new Set<string>();
const urlQueue: string[] = ['/'];
const results: CrawlResult[] = [];

function isValidUrl(url: string): boolean {
  // Check if URL matches any valid pattern
  return VALID_URL_PATTERNS.some(pattern => pattern.test(url));
}

function shouldIgnore(url: string): boolean {
  // Check if URL should be ignored
  return IGNORE_PATTERNS.some(pattern => pattern.test(url));
}

function normalizeUrl(url: string, baseUrl: string): string | null {
  // Convert relative URLs to absolute
  if (url.startsWith('http')) {
    // Skip external URLs
    if (!url.startsWith(BASE_URL)) {
      return null;
    }
    url = url.replace(BASE_URL, '');
  }
  
  // Remove query params and hash
  url = url.split('?')[0].split('#')[0];
  
  // Add leading slash if missing
  if (url && !url.startsWith('/')) {
    url = '/' + url;
  }
  
  return url;
}

async function crawlPage(url: string): Promise<CrawlResult> {
  const fullUrl = `${BASE_URL}${url}`;
  console.log(`Crawling: ${fullUrl}`);
  
  const result: CrawlResult = {
    url,
    statusCode: 0,
    title: null,
    links: [],
    isValid: true,
    issues: []
  };
  
  try {
    const response = await fetch(fullUrl);
    result.statusCode = response.status;
    
    if (!response.ok) {
      result.issues.push(`Failed to fetch page: ${response.statusText}`);
      result.isValid = false;
      return result;
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract title
    result.title = $('title').text();
    
    // Extract links
    const links: string[] = [];
    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        const normalizedUrl = normalizeUrl(href, fullUrl);
        if (normalizedUrl && !shouldIgnore(normalizedUrl)) {
          links.push(normalizedUrl);
          
          // Check URL structure
          if (!isValidUrl(normalizedUrl)) {
            result.issues.push(`Invalid URL structure: ${normalizedUrl}`);
            result.isValid = false;
          }
        }
      }
    });
    
    result.links = links;
    return result;
  } catch (error) {
    result.issues.push(`Error: ${error}`);
    result.isValid = false;
    return result;
  }
}

async function runCrawl() {
  console.log('Starting navigation structure test...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Max pages to crawl: ${MAX_PAGES_TO_CRAWL}`);
  
  let validPages = 0;
  let invalidPages = 0;
  
  while (urlQueue.length > 0 && crawledUrls.size < MAX_PAGES_TO_CRAWL) {
    const url = urlQueue.shift()!;
    
    if (crawledUrls.has(url)) {
      continue; // Skip already crawled URLs
    }
    
    crawledUrls.add(url);
    const result = await crawlPage(url);
    results.push(result);
    
    if (result.isValid) {
      validPages++;
      console.log(`✅ ${url} - Valid`);
    } else {
      invalidPages++;
      console.log(`❌ ${url} - Invalid: ${result.issues.join(', ')}`);
    }
    
    // Add new URLs to queue
    for (const link of result.links) {
      if (!crawledUrls.has(link) && !urlQueue.includes(link)) {
        urlQueue.push(link);
      }
    }
  }
  
  // Print summary
  console.log('\n----- Crawl Summary -----');
  console.log(`Total pages crawled: ${crawledUrls.size}`);
  console.log(`Valid pages: ${validPages}`);
  console.log(`Invalid pages: ${invalidPages}`);
  
  // Print invalid pages with issues
  if (invalidPages > 0) {
    console.log('\n----- Invalid Pages -----');
    results.filter(r => !r.isValid).forEach(result => {
      console.log(`\nURL: ${result.url}`);
      console.log(`Title: ${result.title}`);
      console.log('Issues:');
      result.issues.forEach(issue => console.log(`- ${issue}`));
    });
  }
  
  if (invalidPages > 0) {
    console.log('\nNavigation test failed with invalid URLs.');
    process.exit(1);
  } else {
    console.log('\nNavigation test completed successfully!');
    process.exit(0);
  }
}

// Run the crawler
runCrawl().catch(error => {
  console.error('Crawl failed:', error);
  process.exit(1);
}); 