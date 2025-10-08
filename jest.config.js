/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',

  testEnvironment: 'node',

  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  //setupFilesAfterEnv : ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns : [
    "<rootDir>/src/v1/__tests__/database.test.ts",
    "<rootDir>/src/v1/__tests__/signs.test.ts"
  ]

};