/**
 * SEO Testing Script
 * 
 * This script validates that our static pages have proper content for search engines
 * by fetching sample pages and validating their HTML content and metadata.
 */

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { exit } from 'process';

// Test configuration
const BASE_URL = 'http://localhost:3001'; // Make sure the site is running at this URL
const PAGES_TO_TEST = [
  '/',
  '/states/ca',
  '/states/ca/san-francisco',
  '/schools/ca/san-francisco/montessori-kids-universe-san-francisco',
  '/schools/tx/san-antonio/casa-dei-bambini-montessori-school'
];

// SEO validation criteria
interface SEOValidationResult {
  url: string;
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  canonicalUrl: string | null;
  hasSchemaMarkup: boolean;
  statusCode: number;
  isValid: boolean;
  issues: string[];
}

async function validatePage(url: string): Promise<SEOValidationResult> {
  const fullUrl = `${BASE_URL}${url}`;
  console.log(`Testing: ${fullUrl}`);
  
  const result: SEOValidationResult = {
    url,
    title: null,
    metaDescription: null,
    h1Count: 0,
    canonicalUrl: null,
    hasSchemaMarkup: false,
    statusCode: 0,
    isValid: false,
    issues: []
  };
  
  try {
    const response = await fetch(fullUrl);
    result.statusCode = response.status;
    
    if (!response.ok) {
      result.issues.push(`Failed to fetch page: ${response.statusText}`);
      return result;
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Check title
    result.title = $('title').text();
    if (!result.title || result.title.length < 10) {
      result.issues.push('Title missing or too short');
    }
    
    // Check meta description
    result.metaDescription = $('meta[name="description"]').attr('content') || null;
    if (!result.metaDescription || result.metaDescription.length < 50) {
      result.issues.push('Meta description missing or too short');
    }
    
    // Check h1 tags
    result.h1Count = $('h1').length;
    if (result.h1Count === 0) {
      result.issues.push('No H1 tag found');
    } else if (result.h1Count > 1) {
      result.issues.push(`Multiple H1 tags found (${result.h1Count})`);
    }
    
    // Check canonical URL
    result.canonicalUrl = $('link[rel="canonical"]').attr('href') || null;
    if (!result.canonicalUrl) {
      result.issues.push('Canonical URL missing');
    }
    
    // Check for schema markup
    result.hasSchemaMarkup = $('script[type="application/ld+json"]').length > 0;
    if (!result.hasSchemaMarkup) {
      result.issues.push('Schema markup missing');
    }
    
    // Mark as valid if no issues found
    result.isValid = result.issues.length === 0;
    
    return result;
  } catch (error) {
    result.issues.push(`Error: ${error}`);
    return result;
  }
}

async function runTests() {
  console.log('Starting SEO validation tests...');
  
  const results: SEOValidationResult[] = [];
  let passCount = 0;
  let failCount = 0;
  
  for (const url of PAGES_TO_TEST) {
    const result = await validatePage(url);
    results.push(result);
    
    if (result.isValid) {
      passCount++;
      console.log(`✅ ${url} - Passed`);
    } else {
      failCount++;
      console.log(`❌ ${url} - Failed: ${result.issues.join(', ')}`);
    }
  }
  
  // Print summary
  console.log('\n----- Test Summary -----');
  console.log(`Total tests: ${results.length}`);
  console.log(`Passed: ${passCount}`);
  console.log(`Failed: ${failCount}`);
  
  // Print detailed results
  console.log('\n----- Detailed Results -----');
  results.forEach(result => {
    console.log(`\nURL: ${result.url}`);
    console.log(`Status: ${result.isValid ? 'Pass' : 'Fail'}`);
    console.log(`Status Code: ${result.statusCode}`);
    console.log(`Title: ${result.title}`);
    console.log(`Meta Description: ${result.metaDescription}`);
    console.log(`H1 Count: ${result.h1Count}`);
    console.log(`Canonical URL: ${result.canonicalUrl}`);
    console.log(`Has Schema Markup: ${result.hasSchemaMarkup ? 'Yes' : 'No'}`);
    
    if (result.issues.length > 0) {
      console.log('Issues:');
      result.issues.forEach(issue => console.log(`- ${issue}`));
    }
  });
  
  // Exit with success/failure code
  if (failCount > 0) {
    console.log('\nSEO validation failed with issues.');
    process.exit(1);
  } else {
    console.log('\nSEO validation completed successfully!');
    process.exit(0);
  }
}

// Run the tests
runTests(); 