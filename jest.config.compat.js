module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/lib/'],
  setupFilesAfterEnv: ['<rootDir>/test/initCompat.ts'],
};
