const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  entry: path.join(__dirname, './client/index.tsx'),
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  target:"web",
  mode: "development",
  devServer: {
    publicPath: '/',
    contentBase: '/client/components',
    hot:true,
    proxy: [
      {
        context: ['/auth', '/secret', '/posts', '/comments'],
        target: 'http://localhost:3000',
      },
    ],
    // hot: true,
  },
  module: {
    rules: [
      // {
      //   test: /\.html$/,
      //   exclude: [/node_modules/, require.resolve('./client/components/index.html')],
      //   use: {
      //       loader: 'file-loader',
      //   },
    // },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-syntax-jsx']
          },
        },
      }, 
      {
        test: /\.(tsx)$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(ts)$/,
        use: 'ts-node',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
    resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './client/components/index.html'),
      filename: 'index.html',
      inject: 'body'
    }),
    // new MiniCssExtractPlugin({
    //   filename: "./src/yourfile.css",
    // }),
  ],
};