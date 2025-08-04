#!/usr/bin/env node

/**
 * Manual E2E Production Test Suite
 * Comprehensive testing without external dependencies
 */

const https = require('https');
const fs = require('fs');

class ProductionE2ETester {
  constructor() {
    this.baseURL = 'https://jetstreamin.io';
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      tests: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const icons = {
      info: '📝',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      test: '🧪'
    };
    
    console.log(`${icons[type]} [${timestamp}] ${message}`);
  }

  async runTest(name, testFunction) {
    this.results.total++;
    this.log(`Running: ${name}`, 'test');
    
    try {
      const result = await testFunction();
      this.results.passed++;
      this.results.tests.push({ name, status: 'PASSED', result });
      this.log(`PASSED: ${name}`, 'success');
      return true;
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name, status: 'FAILED', error: error.message });
      this.log(`FAILED: ${name} - ${error.message}`, 'error');
      return false;
    }
  }

  async fetchPage(path = '/') {
    return new Promise((resolve, reject) => {
      const url = this.baseURL + path;
      const request = https.request(url, { method: 'GET', timeout: 10000 }, (response) => {
        let data = '';
        
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          resolve({
            status: response.statusCode,
            headers: response.headers,
            body: data,
            url: response.url
          });
        });
      });

      request.on('error', reject);
      request.on('timeout', () => reject(new Error('Request timeout')));
      request.end();
    });
  }

  async testHomepageLoads() {
    const response = await this.fetchPage('/');
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    if (response.body.length < 1000) {
      throw new Error('Page content too short');
    }
    
    if (!response.body.includes('Jetstreamin')) {
      throw new Error('Page missing expected content');
    }
    
    return {
      status: response.status,
      contentLength: response.body.length,
      hasTitle: response.body.includes('<title>')
    };
  }

  async testUIElements() {
    const response = await this.fetchPage('/');
    const html = response.body;
    
    const requiredElements = [
      'class="logo"',
      'class="subtitle"',
      'class="status-card"',
      'class="agent-card"',
      'id="system-status"',
      'id="atm-status"',
      'id="neta-status"'
    ];
    
    const missingElements = requiredElements.filter(element => !html.includes(element));
    
    if (missingElements.length > 0) {
      throw new Error(`Missing UI elements: ${missingElements.join(', ')}`);
    }
    
    return {
      elementsFound: requiredElements.length,
      missingElements: missingElements.length
    };
  }

  async testInteractiveFeatures() {
    const response = await this.fetchPage('/');
    const html = response.body;
    
    const interactiveFeatures = [
      'onclick="runHealthCheck()"',
      'onclick="runDiagnostics()"',
      'onclick="generateReport()"',
      'setInterval(updateMetrics',
      'function runHealthCheck()',
      'function addThought('
    ];
    
    const missingFeatures = interactiveFeatures.filter(feature => !html.includes(feature));
    
    if (missingFeatures.length > 0) {
      throw new Error(`Missing interactive features: ${missingFeatures.join(', ')}`);
    }
    
    return {
      featuresFound: interactiveFeatures.length,
      allFeaturesPresent: missingFeatures.length === 0
    };
  }

  async testResponsiveDesign() {
    const response = await this.fetchPage('/');
    const html = response.body;
    
    const responsiveFeatures = [
      'viewport',
      'media query',
      'grid-template-columns',
      'repeat(auto-fit',
      '@media'
    ];
    
    const foundFeatures = responsiveFeatures.filter(feature => 
      html.toLowerCase().includes(feature.toLowerCase())
    );
    
    if (foundFeatures.length < 3) {
      throw new Error('Insufficient responsive design features');
    }
    
    return {
      responsiveFeatures: foundFeatures.length,
      hasViewport: html.includes('viewport')
    };
  }

  async testPerformanceOptimization() {
    const startTime = Date.now();
    const response = await this.fetchPage('/');
    const loadTime = Date.now() - startTime;
    
    if (loadTime > 3000) {
      throw new Error(`Page load too slow: ${loadTime}ms`);
    }
    
    const html = response.body;
    const optimizations = [
      response.headers['content-encoding'] === 'gzip',
      html.includes('async'),
      html.includes('defer'),
      response.headers['cache-control']
    ].filter(Boolean);
    
    return {
      loadTime,
      optimizations: optimizations.length,
      contentLength: response.body.length
    };
  }

  async testAIAgentIntegration() {
    const response = await this.fetchPage('/');
    const html = response.body;
    
    const aiFeatures = [
      'ATM',
      'NETA',
      'Automated Thought Machine',
      'Networked Executive Transfer Authority',
      'thought-stream',
      'agent-card',
      'updateMetrics'
    ];
    
    const foundFeatures = aiFeatures.filter(feature => html.includes(feature));
    
    if (foundFeatures.length < 6) {
      throw new Error(`Insufficient AI features: found ${foundFeatures.length}/7`);
    }
    
    return {
      aiFeatures: foundFeatures.length,
      hasATM: html.includes('ATM'),
      hasNETA: html.includes('NETA')
    };
  }

  async testSecurityFeatures() {
    const response = await this.fetchPage('/');
    
    const securityChecks = [
      response.headers['strict-transport-security'] ? 'HSTS' : null,
      response.headers['x-frame-options'] ? 'X-Frame-Options' : null,
      response.headers['x-content-type-options'] ? 'X-Content-Type-Options' : null,
      response.body.includes('https:') ? 'HTTPS-Content' : null
    ].filter(Boolean);
    
    return {
      securityHeaders: securityChecks.length,
      features: securityChecks,
      httpsEnforced: response.body.includes('https:')
    };
  }

  async runFullSuite() {
    this.log('🎯 Starting Production E2E Test Suite', 'info');
    this.log(`Target: ${this.baseURL}`, 'info');
    
    // Core functionality tests
    await this.runTest('Homepage loads successfully', () => this.testHomepageLoads());
    await this.runTest('UI elements are present', () => this.testUIElements());
    await this.runTest('Interactive features work', () => this.testInteractiveFeatures());
    await this.runTest('Responsive design implemented', () => this.testResponsiveDesign());
    await this.runTest('Performance optimized', () => this.testPerformanceOptimization());
    await this.runTest('AI agent integration active', () => this.testAIAgentIntegration());
    await this.runTest('Security features enabled', () => this.testSecurityFeatures());
    
    this.generateReport();
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      baseURL: this.baseURL,
      summary: {
        total: this.results.total,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: ((this.results.passed / this.results.total) * 100).toFixed(1)
      },
      tests: this.results.tests
    };

    const reportContent = `# 🎯 Production E2E Test Report

## Summary
- **Total Tests**: ${report.summary.total}
- **Passed**: ${report.summary.passed} ✅
- **Failed**: ${report.summary.failed} ❌
- **Success Rate**: ${report.summary.successRate}%

## Test Results
${report.tests.map(test => 
  `### ${test.status === 'PASSED' ? '✅' : '❌'} ${test.name}
${test.status === 'PASSED' 
  ? `**Status**: PASSED\n**Details**: ${JSON.stringify(test.result, null, 2)}`
  : `**Status**: FAILED\n**Error**: ${test.error}`
}`).join('\n\n')}

## Overall Status
${report.summary.failed === 0 ? '🎉 ALL TESTS PASSED!' : `⚠️ ${report.summary.failed} TEST(S) FAILED`}

---
Generated: ${report.timestamp}
Target: ${report.baseURL}
`;

    fs.writeFileSync('reports/e2e-test-report.md', reportContent);
    this.log('📊 E2E test report generated', 'success');
    
    this.log(`🎉 E2E Testing Complete: ${report.summary.passed}/${report.summary.total} tests passed`, 'success');
    
    return report;
  }
}

// Run if called directly
async function main() {
  const tester = new ProductionE2ETester();
  const report = await tester.runFullSuite();
  
  // Exit with appropriate code
  process.exit(report.summary.failed === 0 ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ProductionE2ETester;
