/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  // Gives Dexie a real (in-memory) IndexedDB in the Node test environment, so service tests
  // exercise actual Dexie behavior rather than hand-rolled SQL-string mocks.
  setupFiles: ['fake-indexeddb/auto'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/legacy-expo-src/'],
};
