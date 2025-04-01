const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    moduleNameMapper: {
        "\\.(css|scss|sass)$": "identity-obj-proxy",
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    testEnvironment: "jsdom",
};

module.exports = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
module.exports = createJestConfig(customJestConfig);