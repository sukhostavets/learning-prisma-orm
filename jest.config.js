/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  globalSetup: './__tests__/jest.setup.ts',
  globalTeardown: './__tests__/jest.teardown.ts',
  testTimeout: 60000, // Increase timeout for tests using containers
}
