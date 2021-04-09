/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');

module.exports = {
  entry: {
    app: ['./client/index.tsx'],
    vendor: ['react', 'react-dom', 'react-router-dom']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[name].bundle.js',
    publicPath: '/'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    fallback: {
      // "fs": false,
      // "tls": false,
      // "net": false,
      // "path": false,
      // "zlib": false,
      // "http": false,
      // "https": false,
      // "stream": false,
      // "crypto": false,
      // "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
      zlib: require.resolve("browserify-zlib"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify")

    } 
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './client',
    hot: true,
    // contentBase: './build',
    port: 8000,
    proxy: {
      '/': 'http://localhost:3000'
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: '/node_modules',
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './client/index.html')
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
  })
  ]
}