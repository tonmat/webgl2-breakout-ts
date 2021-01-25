const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',

  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          }, {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          }],
      },
      {
        test: /\.glsl$/,
        loader: 'ts-shader-loader',
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
      }],
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  devServer: {
    host: 'localhost',
    hot: true,
    open: true,
    port: 3001,
  },
};
