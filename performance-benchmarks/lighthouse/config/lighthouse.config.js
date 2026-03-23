module.exports = {
  extends: 'lighthouse:default',

  settings: {
    onlyCategories: [
      'performance',
      'accessibility',
      'best-practices',
      'seo'
    ],

    // Desktop configuration
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
      cpuSlowdownMultiplier: 1
    },
    screenEmulation: {
      mobile: false,
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      disabled: false
    },
    emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  },

  // Custom audits for Angular applications
  passes: [
    {
      passName: 'defaultPass',
      gatherers: []
    }
  ],

  // Budget configuration for Angular bundle sizes
  budgets: [
    {
      resourceSizes: [
        {
          resourceType: 'script',
          budget: 500 // 500KB max for JS bundles
        },
        {
          resourceType: 'stylesheet',
          budget: 100 // 100KB max for CSS
        },
        {
          resourceType: 'image',
          budget: 200 // 200KB max for images
        },
        {
          resourceType: 'total',
          budget: 1000 // 1MB total budget
        }
      ],
      timings: [
        {
          metric: 'interactive',
          budget: 3500 // 3.5s max TTI
        },
        {
          metric: 'first-contentful-paint',
          budget: 2000 // 2s max FCP
        },
        {
          metric: 'largest-contentful-paint',
          budget: 2500 // 2.5s max LCP
        },
        {
          metric: 'speed-index',
          budget: 3000 // 3s max Speed Index
        }
      ]
    }
  ]
};
