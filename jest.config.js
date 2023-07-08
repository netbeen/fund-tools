module.exports = {
  verbose: true,
  roots: ['src/tests'],
  moduleNameMapper: {
    '@/return': 'src/return',
    '@/constants': 'src/constants',
  },
  testRegex: 'tests/(.*?/)?.*test.ts$',
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
