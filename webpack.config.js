const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const GoogleFontsPlugin = require('@beyonk/google-fonts-webpack-plugin');

module.exports = {
  output: {
    path: __dirname + '/public',
    filename: "js/script.min.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
              reloadAll: true,
            },
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: "[local]___[hash:base64:5]"
            }
          },
          {
            loader: "less-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        include: /node_modules\//,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new GoogleFontsPlugin({
      fonts: [{
        family: 'Open Sans',
        variants: [ '300', '400', '600', '700' ]
      }]
    }),
    new HtmlWebPackPlugin({
      template: "./src/html/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: 'css/styles.min.css',
    }),
    new CopyPlugin([
      { from: 'media/img/', to: 'img' },
      { from: 'media/data/', to: 'data' },
      { from: 'favicon.png', to: '' },
    ])
  ]
};