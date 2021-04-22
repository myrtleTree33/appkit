module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  plugins: ["@typescript-eslint"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  env: {
    es2020: true,
    node: true,
  },
  rules: {
    // For jest's module require.
    "@typescript-eslint/no-var-requires": 0,
  },
};
