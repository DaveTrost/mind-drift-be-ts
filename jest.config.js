module.exports = {
  'testEnvironment': 'node',
  'preset': '@shelf/jest-mongodb',
  'roots': [
    '<rootDir>/lib',
    '<rootDir>/e2e'
  ],
  'testMatch': [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  'transform': {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
};
