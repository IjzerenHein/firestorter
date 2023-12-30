/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  //preset: 'ts-jest',
  preset: 'ts-jest/presets/default-esm', // or other ESM presets
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/initCompat.ts'],
};
