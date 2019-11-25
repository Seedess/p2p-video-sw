const merge = require('webpack-merge');

module.exports = function(config) {
  const common = require('./webpack.common')(config);

  return merge.smart(common, {
    mode: 'production',
    devtool: 'eval',
    output: {
      filename: config.bundleProd
    }
  });
};
