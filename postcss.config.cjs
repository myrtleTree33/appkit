let plugins = [
  require("postcss-import"),
  require("@tailwindcss/jit"),
  require("postcss-preset-env")({
    stage: 1,
    features: {
      "nesting-rules": true,
    },
  }),
];

module.exports = {
  plugins,
};
