module.exports = {
  plugins: [
    [
      require("babel-plugin-css-modules-transform").default,
      {
        "extensions": [".css", ".scss", ".less"]
      }
    ]
  ]
};