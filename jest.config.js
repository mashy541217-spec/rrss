module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@rrss-auto/domain$': '<rootDir>/packages/domain/src/index.ts',
    '^@rrss-auto/application$': '<rootDir>/packages/application/src/index.ts',
    '^@rrss-auto/infrastructure$': '<rootDir>/packages/infrastructure/src/index.ts',
    '^@rrss-auto/testing$': '<rootDir>/packages/testing/src/index.ts',
    '^@rrss-auto/logger$': '<rootDir>/packages/logger/src/index.ts',
    '^@rrss-auto/configuration$': '<rootDir>/packages/configuration/src/index.ts',
    '^@rrss-auto/observability$': '<rootDir>/packages/observability/src/index.ts'
  },
  testMatch: [
    '**/tests/**/*.spec.ts',
    '**/tests/**/*.test.ts',
    '**/src/**/*.spec.ts',
    '**/src/**/*.test.ts'
  ]
};
