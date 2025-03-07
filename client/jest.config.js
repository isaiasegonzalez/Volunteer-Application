module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
    },
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/$1", // Support for @ alias
    },
    transformIgnorePatterns: [
      "node_modules/(?!(lucide-react)/)", // 👈 Force Jest to transform `lucide-react`
    ],
  };
  