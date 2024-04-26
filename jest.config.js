module.exports = {
  setupFilesAfterEnv: ["./tests/jest.setup.js"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js", "!src/index.js"],
  verbose: true,
};
