/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//const TerserPlugin         = require('terser-webpack-plugin');
const path                 = require('path');
const webpack              = require('webpack');
const autoprefixer         = require('autoprefixer');
const CopyWebpackPlugin    = require("copy-webpack-plugin");
const { InjectManifest }   = require('workbox-webpack-plugin');
const CompressionPlugin    = require("compression-webpack-plugin");
const nodeExternals        = require('webpack-node-externals');

const keyName= {};
let SETUP= {
  "NODE_ENV_DEV" : false,
};

Object.keys(process.env).map((key, i) => {
  if (key.indexOf("NODE_ENV") == 0) {
    return (keyName[key] = process.env[key]);
  }
});

if( keyName['NODE_ENV']=='development' ){
  SETUP['NODE_ENV_DEV'] = true;
}else{
  SETUP['NODE_ENV_DEV'] = false;
}

const browserConfig = {
  mode: 'development',
  entry: "./src/browser/index.js",
  output: {
    path: path.join(__dirname, 'public'),
    filename: "./bundle.js"
  },
  module: {
    rules: [
      {
        test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000000 }
          },
          "image-webpack-loader"
        ]
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
          },
          {
            loader: 'postcss-loader',
            options: { plugins: [autoprefixer()] },
          },
        ],
      },
      {
        test: /js$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
        query: { presets: ["react-app"] }
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": SETUP
    }),
    new CopyWebpackPlugin([
      { 
        from: "./src/server/public", 
        to  : "public/assets"
      }
    ]),
    new CompressionPlugin(),
    new MiniCssExtractPlugin({
      filename: "./css/[name].css"
    })
  ]
};

const serverConfig = {
  mode: 'development',
  entry: "./src/server/index.js",
  target: "node",
  output: {
    path: path.join(__dirname),
    filename: "server.js",
    libraryTarget: "commonjs2"
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000000 }
          },
          "image-webpack-loader"
        ]
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /js$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
        query: { presets: ["react-app"] }
      }
    ]
  }
};

module.exports = [browserConfig, serverConfig];
