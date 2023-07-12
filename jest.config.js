const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  roots: ["<rootDir>/src", "<rootDir>/test"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "\\.css$": "<rootDir>/test/__helpers__/css-module.transformer.js",
  },
  testRegex: "(/test/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: "<rootDir>/",
    }),
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/test/__helpers__/",
    "/test/__mocks__",
  ],
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/test/__helpers__/jest.setup.ts"],
};
