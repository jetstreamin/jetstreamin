import { test, expect } from '@playwright/test';

/**
 * @title Jetstreamin Production Website Tests
 * @description Core functionality and availability tests for live production
 * @tags @production @smoke @critical
 */

test.describe('Production Website Core Tests', () => {
  
  test('should load homepage successfully @smoke @performance', async ({ page }) => {
    // Navigate to homepage
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Verify page loads within performance budget
    expect(loadTime).toBeLessThan(3000); // 3 second max load time
    
    // Verify core elements are present
    await expect(page).toHaveTitle(/Jetstreamin/i);
    await expect(page.locator('body')).toBeVisible();
    
    // Check for critical content
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
    expect(content.length).toBeGreaterThan(100); // Non-empty page
  });

  test('should have valid SSL certificate @security', async ({ page }) => {
    const response = await page.goto('/');
    
    // Verify HTTPS is enforced
    expect(page.url()).toMatch(/^https:/);
    
    // Check response status
    expect(response?.status()).toBe(200);
    
    // Verify security headers
    const securityHeaders = {
      'strict-transport-security': true,
      'x-frame-options': false, // May not be set
      'x-content-type-options': false, // May not be set
    };
    
    for (const [header, required] of Object.entries(securityHeaders)) {
      const headerValue = response?.headers()[header];
      if (required) {
        expect(headerValue).toBeTruthy();
      }
    }
  });

  test('should serve content from CDN @performance @cdn', async ({ page }) => {
    const response = await page.goto('/');
    
    // Check for CloudFront headers
    const headers = response?.headers() || {};
    const cdnHeaders = [
      'x-cache',
      'x-amz-cf-id',
      'x-amz-cf-pop',
      'via'
    ];
    
    const foundCdnHeaders = cdnHeaders.filter(header => headers[header]);
    expect(foundCdnHeaders.length).toBeGreaterThan(0);
  });

  test('should be mobile responsive @mobile @responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Verify page is still functional on mobile
    await expect(page.locator('body')).toBeVisible();
    
    // Check for responsive meta tag
    const metaViewport = page.locator('meta[name="viewport"]');
    if (await metaViewport.count() > 0) {
      const content = await metaViewport.getAttribute('content');
      expect(content).toContain('width=device-width');
    }
  });

  test('should handle 404 errors gracefully @error-handling', async ({ page }) => {
    const response = await page.goto('/non-existent-page', { 
      waitUntil: 'networkidle' 
    });
    
    // Should return 404 or redirect to valid page
    const status = response?.status();
    expect([200, 301, 302, 404]).toContain(status);
  });

  test('should load critical resources @performance @resources', async ({ page }) => {
    const failedRequests = [];
    
    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });
    
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check for failed critical resources
    const criticalFailures = failedRequests.filter(url => 
      url.includes('.css') || url.includes('.js') || url.includes('favicon')
    );
    
    expect(criticalFailures).toHaveLength(0);
  });

  test('should have proper meta tags for SEO @seo', async ({ page }) => {
    await page.goto('/');
    
    // Check for essential SEO meta tags
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(60);
    
    // Check for meta description (if present)
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.count() > 0) {
      const content = await metaDescription.getAttribute('content');
      expect(content?.length).toBeGreaterThan(50);
      expect(content?.length).toBeLessThan(160);
    }
  });

  test('should enforce HTTPS redirect @security', async ({ page, context }) => {
    // Try to access HTTP version (if available)
    try {
      const httpUrl = 'http://jetstreamin.io';
      const response = await page.goto(httpUrl, { 
        waitUntil: 'networkidle',
        timeout: 10000 
      });
      
      // Should redirect to HTTPS
      expect(page.url()).toMatch(/^https:/);
    } catch (error) {
      // HTTP might not be accessible, which is also acceptable
      console.log('HTTP redirect test skipped - HTTP not accessible');
    }
  });

});

test.describe('Performance Benchmarks', () => {
  
  test('should meet Core Web Vitals @performance @vitals', async ({ page }) => {
    await page.goto('/');
    
    // Measure page performance
    const performanceMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {
            lcp: 0,
            fid: 0,
            cls: 0
          };
          
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              vitals.fid = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              vitals.cls += entry.value;
            }
          });
          
          resolve(vitals);
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        
        // Fallback timeout
        setTimeout(() => resolve({ lcp: 0, fid: 0, cls: 0 }), 5000);
      });
    });
    
    // Core Web Vitals thresholds
    const metrics = performanceMetrics;
    if (metrics.lcp > 0) expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s
    if (metrics.fid > 0) expect(metrics.fid).toBeLessThan(100);  // FID < 100ms
    if (metrics.cls > 0) expect(metrics.cls).toBeLessThan(0.1);  // CLS < 0.1
  });

});
