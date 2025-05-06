module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // testMatch: ['**/?(*.)+(spec|test).(ts|js)'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverageFrom: [
    'services/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  // coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  projects: [
    '<rootDir>/services/user-service/jest.config.js',
    '<rootDir>/services/content-service/jest.config.js',
    '<rootDir>/services/economy-service/jest.config.js',
    '<rootDir>/services/reader-action-service/jest.config.js',
    '<rootDir>/services/score-service/jest.config.js',
    '<rootDir>/services/ranking-service/jest.config.js',
    '<rootDir>/services/feed-service/jest.config.js',
    // '<rootDir>/services/portfolio-service/jest.config.js', // 未実装？ テストは存在
    // '<rootDir>/services/curation-service/jest.config.js', // 未実装？ テストは存在
    // '<rootDir>/services/archive-service/jest.config.js', // 未実装？ テストは存在
    // Note: 未実装とコメントがあるがテストが存在し PASS しているサービスは一旦含める
    '<rootDir>/services/portfolio-service/jest.config.js',
    '<rootDir>/services/curation-service/jest.config.js',
    '<rootDir>/services/archive-service/jest.config.js',
  ],
  // testPathIgnorePatterns: [
  //   '/node_modules/',
  // ], // 不要なので削除
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  testTimeout: 10000,
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    // 他のサービスで @src などのエイリアスを使っている場合はここに追加
    // 例: '^@content/(.*)$': '<rootDir>/services/content-service/src/$1'
  }
}; 