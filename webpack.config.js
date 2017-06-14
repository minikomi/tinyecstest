var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: "./start.js",
  output: {
    filename: "bundle.js",
    path: __dirname + '/dest'
  },
  plugins: [new HtmlWebpackPlugin()],
  module:{
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
};
