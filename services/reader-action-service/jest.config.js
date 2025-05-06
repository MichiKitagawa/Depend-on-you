module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  // moduleNameMapper: { // ルートの設定を使うためコメントアウト
  //   '^@shared/(.*)$': '<rootDir>/../../shared/$1',
  //   '^@prisma/client$': '<rootDir>/src/generated/prisma',
  // },
  testTimeout: 20000
}; 