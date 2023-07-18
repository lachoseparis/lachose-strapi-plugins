'use strict';

module.exports = {
  projects: [
    {
      displayName: 'api',
      testTimeout: 15000,
      collectCoverageFrom: ['src/api/**/*.js'],
      coverageReporters: ['clover', 'json', 'text'],
      testPathIgnorePatterns: ['/node_modules/', '.tmp', '.cache'],
      testMatch: ['<rootDir>/tests/api/**/*.test.js'],
      testEnvironment: 'node',
    },
    {
      displayName: 'integration',
      preset: 'jest-puppeteer',
      testTimeout: 10000,
      testMatch: ['<rootDir>/tests/integration/**/*.test.js'],
    },
  ],
};
