const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const open = require('open');
const makeWebpackConfig = require('./makeWebpackConfig');

module.exports = async (config, callback) => {
  const webpackConfig = await makeWebpackConfig(config, { production: false });
  const webpackDevServerConfig = {
    hot: true,
    stats: {},
    noInfo: true,
    quiet: true,
    clientLogLevel: 'none',
    compress: true,
    inline: true,
    watchOptions: { ignored: /node_modules/ },
    // Added to prevent Webpack HMR from breaking when iframeSandbox option is used
    // See: https://github.com/webpack/webpack-dev-server/issues/1604
    disableHostCheck: true,
    publicPath: config.baseUrl,
  };

  const compiler = webpack(webpackConfig);
  const devServer = new WebpackDevServer(compiler, webpackDevServerConfig);
  const { port, openBrowser } = config;

  devServer.listen(port, '0.0.0.0', (...args) => {
    const [err] = args;

    if (!err && openBrowser) {
      open(`http://localhost:${port}`);
    }

    if (typeof callback === 'function') {
      callback(...args);
    }
  });
};
