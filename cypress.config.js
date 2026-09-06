const { defineConfig } = require("cypress");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

module.exports = defineConfig({
  retries: {
    runMode: 2,
    openMode: 0,
  },
  defaultCommandTimeout: 10000,
  defaultBrowser: 'chrome',
  expose: {
    apiUrl: 'https://serverest.dev',
  },
  e2e: {
    baseUrl: 'https://front.serverest.dev/login',
    viewportWidth: 1920,
    viewportHeight: 1080,
    env: {
      allure: true,
    },
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      return config;
    },
  },
});
