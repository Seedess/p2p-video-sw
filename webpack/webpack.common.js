const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const browser = require('./webpack.browser');

module.exports = function(config) {
  const _config = {
    //target: "node",
    entry: {
      sw: [config.serviceWorkerJs],
      index: config.indexJs
    },
    output: {
      path: config.dist,
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          include: /src/,
          loader: 'babel-loader',
          options: {
            presets: [
              "react",
              "env",
              "stage-0"
            ]
          }
        },
        {
          test: /\.html$/,
          use: 'html-loader'
        },
        {
          test: /\.(gif|jpg|png|svg|ico)$/,
          use: 'image-webpack-loader'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: config.indexHtml,
        inject: 'head'
      })
    ]
  };

  return merge.smart(_config, browser);
};
