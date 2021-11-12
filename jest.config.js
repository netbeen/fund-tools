module.exports = {
  verbose: true,
  roots: [
    'test'
  ],
  testRegex: 'test/(.*?/)?.*test.js$',
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*'
  ]
}
