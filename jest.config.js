export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  // scriptsの配信ガードはNode標準のテストランナーで別途実行する。
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/scripts/"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
    "\\.(svg|png|jpg|jpeg|gif)$": "jest-transform-stub",
  },
};
