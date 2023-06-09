const config = require('../jest.config');

module.exports = {
  ...config,
  rootDir: '.',
  testMatch: ['**/e2e/**/*.+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.e2e.json',
    },
  },
};
