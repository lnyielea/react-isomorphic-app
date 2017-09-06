const cssModulesTransform = require('babel-plugin-css-modules-transform').default;

module.exports = {
  plugins: [
    [
      cssModulesTransform,
      {
        extensions: ['.css', '.scss', '.less']
      }
    ]
  ]
};
