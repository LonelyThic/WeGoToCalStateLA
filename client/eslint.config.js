// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", "app/index.jsx"],
  },
  {
    files: ["**/*.jsx", "**/*.tsx"],
    rules: {
      "react/no-unescaped-entities": "warn",
    },
  },
  {
    files: ["app/index.jsx"],
    rules: {
      "no-dupe-keys": "off",
    },
  }
]);
