module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src/commerce-backend-ui-1'],
  testMatch: ['**/test/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json'
      }
    ]
  },
  collectCoverageFrom: [
    'src/commerce-backend-ui-1/**/*.{js,jsx,ts,tsx}',
    '!src/commerce-backend-ui-1/**/*.d.ts',
    '!src/commerce-backend-ui-1/**/node_modules/**',
    '!src/commerce-backend-ui-1/test/**',
    '!src/commerce-backend-ui-1/e2e/**',
    '!src/commerce-backend-ui-1/web-src/src/exc-runtime.js'
  ],
  moduleNameMapper: {
    '^@actions/(.*)$': '<rootDir>/src/commerce-backend-ui-1/actions/$1',
    '^@lib/(.*)$': '<rootDir>/src/commerce-backend-ui-1/lib/$1',
    '^@web/(.*)$': '<rootDir>/src/commerce-backend-ui-1/web-src/src/$1',
    '^@components/(.*)$': '<rootDir>/src/commerce-backend-ui-1/web-src/src/components/$1',
    '^@types/(.*)$': '<rootDir>/src/commerce-backend-ui-1/web-src/src/types/$1',
    '^@utils/(.*)$': '<rootDir>/src/commerce-backend-ui-1/web-src/src/utils/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testTimeout: 30000
}
