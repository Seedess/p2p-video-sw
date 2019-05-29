const path = require('path');

const ROOT_PATH = path.join(__dirname);

const APP_CONFIG = {
  src: path.join(ROOT_PATH, 'src'),
  indexJs: path.join(ROOT_PATH, 'src', 'index'),
  serviceWorkerJs: path.join(ROOT_PATH, 'src', 'sw'),
  indexHtml: path.join(ROOT_PATH, 'src', 'index.html'),
  dist:  path.join(ROOT_PATH, 'public'),
  bundleDev: '[name].bundle.js',
  bundleProd: '[name].bundle.[hash].js',
  publicPath: '/',
  root: ROOT_PATH
};

module.exports = env => {
  const config = require(`./config/webpack.${env}`)(APP_CONFIG);
  return config;
};
