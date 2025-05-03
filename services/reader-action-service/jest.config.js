module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/../../shared/$1',
    '^@prisma/client$': '<rootDir>/src/generated/prisma',
    // '^@/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 20000
}; 