const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: 'qamrdu',
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    videosFolder: '../videos',
    screenshotsFolder: '../screenshots',
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'reports',
      overwrite: false,
      html: true,
      json: true,
      timestamp: 'mmddyyyy_HHMMss',
    },
    retries: { runMode: 1, openMode: 0 },
    defaultCommandTimeout: 8000,
    requestTimeout: 10000,
    setupNodeEvents(on, config) {
      on('task', {
        log(message) { console.log(message); return null; },
      });
    },
    supportFile: 'support/e2e.js',
    specPattern: 'e2e/**/*.cy.{js,jsx,ts,tsx}',
    fixturesFolder: 'fixtures',
  },
  env: {
    apiUrl: 'http://localhost:5001/api',
    adminEmail: 'admin@shopzone.com',
    adminPassword: 'Admin@123',
    userEmail: 'user@shopzone.com',
    userPassword: 'User@123',
  },
});
