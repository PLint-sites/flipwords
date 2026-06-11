const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'tests/e2e/specs/**/*.js',
    supportFile: 'tests/e2e/support/index.js',
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
  },
  component: {
    specPattern: 'tests/component/**/*.spec.js',
    supportFile: 'cypress/support/component.js',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
})
