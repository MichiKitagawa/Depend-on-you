module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  moduleDirectories: [
    'node_modules',
    '<rootDir>',
  ],
  moduleNameMapper: {
    // tsconfig.json の paths に合わせる
    '^@src/(.*)$': '<rootDir>/src/$1',
    //'^@generated/(.*)$': '<rootDir>/generated/$1',
    // Prisma Client 自体の解決 (必要に応じて)
    // '@prisma/client': '<rootDir>/generated/prisma',
    // 相対パスによる参照も残す場合 (推奨されない)
    // '^../../src/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
}; 