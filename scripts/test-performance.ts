/**
 * Performance Testing Script
 * 
 * Tests the performance of key pages by measuring load time, page size, 
 * and other metrics.
 */

import fetch from 'node-fetch';
import { performance } from 'perf_hooks';

// Test configuration
const BASE_URL = 'http://localhost:3001';
const PAGES_TO_TEST = [
  '/',
  '/states/ca',
  '/states/ca/san-francisco',
  '/schools/ca/san-francisco/montessori-kids-universe-san-francisco'
];
const TEST_RUNS = 3;

interface PerformanceResult {
  url: string;
  statusCode: number;
  loadTimeMs: number;
  pageSizeBytes: number;
  pageSizeKb: number;
  numRequests: number;
}

async function measurePerformance(url: string): Promise<PerformanceResult> {
  const fullUrl = `${BASE_URL}${url}`;
  console.log(`Testing performance of: ${fullUrl}`);
  
  const startTime = performance.now();
  const response = await fetch(fullUrl);
  const html = await response.text();
  const endTime = performance.now();
  
  const loadTimeMs = endTime - startTime;
  const pageSizeBytes = new TextEncoder().encode(html).length;
  const pageSizeKb = pageSizeBytes / 1024;
  
  // Count potential additional requests (scripts, stylesheets, images)
  // This is a simple estimation - a real browser would make more requests
  const scriptMatches = html.match(/<script[^>]*src=[^>]*>/g) || [];
  const linkMatches = html.match(/<link[^>]*href=[^>]*>/g) || [];
  const imgMatches = html.match(/<img[^>]*src=[^>]*>/g) || [];
  const numRequests = 1 + scriptMatches.length + linkMatches.length + imgMatches.length;
  
  return {
    url,
    statusCode: response.status,
    loadTimeMs,
    pageSizeBytes,
    pageSizeKb,
    numRequests
  };
}

async function runTest() {
  console.log('Starting performance tests...');
  
  const allResults: PerformanceResult[][] = [];
  
  // Run tests for each page
  for (const url of PAGES_TO_TEST) {
    console.log(`\nTesting ${url}...`);
    const pageResults: PerformanceResult[] = [];
    
    // Run multiple tests for more accurate measurements
    for (let i = 0; i < TEST_RUNS; i++) {
      console.log(`  Run ${i + 1}/${TEST_RUNS}`);
      const result = await measurePerformance(url);
      pageResults.push(result);
      
      // Simple delay between runs
      if (i < TEST_RUNS - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    allResults.push(pageResults);
    
    // Calculate average metrics
    const avgLoadTime = pageResults.reduce((sum, r) => sum + r.loadTimeMs, 0) / pageResults.length;
    const avgPageSize = pageResults.reduce((sum, r) => sum + r.pageSizeKb, 0) / pageResults.length;
    const avgRequests = pageResults.reduce((sum, r) => sum + r.numRequests, 0) / pageResults.length;
    
    console.log(`  Average load time: ${avgLoadTime.toFixed(2)}ms`);
    console.log(`  Average page size: ${avgPageSize.toFixed(2)}KB`);
    console.log(`  Average requests: ${avgRequests.toFixed(1)}`);
  }
  
  // Print summary table
  console.log('\n----- Performance Summary -----');
  console.log('URL | Avg Load Time (ms) | Avg Page Size (KB) | Avg Requests');
  console.log('--- | ----------------- | ----------------- | ------------');
  
  for (let i = 0; i < PAGES_TO_TEST.length; i++) {
    const url = PAGES_TO_TEST[i];
    const pageResults = allResults[i];
    
    const avgLoadTime = pageResults.reduce((sum, r) => sum + r.loadTimeMs, 0) / pageResults.length;
    const avgPageSize = pageResults.reduce((sum, r) => sum + r.pageSizeKb, 0) / pageResults.length;
    const avgRequests = pageResults.reduce((sum, r) => sum + r.numRequests, 0) / pageResults.length;
    
    console.log(`${url} | ${avgLoadTime.toFixed(2)} | ${avgPageSize.toFixed(2)} | ${avgRequests.toFixed(1)}`);
  }
  
  // Set performance thresholds (these are example values)
  const LOAD_TIME_THRESHOLD = 1000; // 1 second
  const PAGE_SIZE_THRESHOLD = 500; // 500KB
  
  // Check if any pages exceed thresholds
  let performanceIssues = false;
  
  for (let i = 0; i < PAGES_TO_TEST.length; i++) {
    const url = PAGES_TO_TEST[i];
    const pageResults = allResults[i];
    
    const avgLoadTime = pageResults.reduce((sum, r) => sum + r.loadTimeMs, 0) / pageResults.length;
    const avgPageSize = pageResults.reduce((sum, r) => sum + r.pageSizeKb, 0) / pageResults.length;
    
    if (avgLoadTime > LOAD_TIME_THRESHOLD) {
      console.log(`\n⚠️ Performance issue: ${url} load time (${avgLoadTime.toFixed(2)}ms) exceeds threshold (${LOAD_TIME_THRESHOLD}ms)`);
      performanceIssues = true;
    }
    
    if (avgPageSize > PAGE_SIZE_THRESHOLD) {
      console.log(`\n⚠️ Performance issue: ${url} page size (${avgPageSize.toFixed(2)}KB) exceeds threshold (${PAGE_SIZE_THRESHOLD}KB)`);
      performanceIssues = true;
    }
  }
  
  if (performanceIssues) {
    console.log('\nPerformance test completed with warnings.');
    process.exit(1);
  } else {
    console.log('\nPerformance test completed successfully!');
    process.exit(0);
  }
}

// Run the tests
runTest().catch(error => {
  console.error('Performance test failed:', error);
  process.exit(1);
}); 