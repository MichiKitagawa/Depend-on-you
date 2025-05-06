module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  // globals: { // globals はルートから削除したのでこちらも不要か？ tsconfig は ts-jest が自動で読むはず
  //   'ts-jest': {
  //     tsconfig: 'tsconfig.json'
  //   }
  // },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  // tsconfig の paths を Jest に認識させるための設定
  moduleNameMapper: {
    '^@prisma/client$': '<rootDir>/node_modules/.prisma/client',
    '^@src/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
}; 