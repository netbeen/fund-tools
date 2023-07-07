module.exports = {
  verbose: true,
  roots: ['src/tests'],
  testRegex: 'tests/(.*?/)?.*test.ts$',
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
