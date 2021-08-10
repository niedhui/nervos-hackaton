var path = require('path');
const webpack = require('webpack');


module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      // http: 'stream-http',
      // https: 'https-browserify',
      // os: 'os-browserify/browser',
      process: 'process/browser',
      // vm: 'vm-browserify'
    })
  ],
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json'],
    fallback: {
      assert: require.resolve('assert'),
      crypto: require.resolve('crypto-browserify'),
      fs: false,
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      process: require.resolve('process/browser'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify')
    }
  }
};
