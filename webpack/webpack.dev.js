const merge = require('webpack-merge');

module.exports = function(config) {
  const common = require('./webpack.common')(config);

  return merge.smart(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
      filename: config.bundleDev,
      publicPath: config.publicPath,
    },
    devServer: {
      contentBase: config.dist,
      open: true,
      inline: true,
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          include: /src/,
          exclude: /node_modules/,
          use: [
            { loader: 'babel-loader' },
            //{ loader: 'eslint-loader' }
          ],
        }
      ]
    }
  });
};
