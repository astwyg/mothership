var webpack = require('webpack');
var path = require('path');
var pkg = require('./package.json');
// var ignoreWoff2 = new webpack.IgnorePlugin(/\.woff2/ig);
// var ignoreWoff = new webpack.IgnorePlugin(/\.woff/ig);
// var ignoreTtf = new webpack.IgnorePlugin(/\.ttf/ig);
// var ignoreSvg = new webpack.IgnorePlugin(/\.svg/ig);


var entry = {};
// entry[pkg.name + '-' + pkg.version] = ['./components/index.js', './style/index.less'];
entry["vm"] = './app/vm.jsx';
entry["command"] = "./app/command.jsx"

module.exports = {
  entry: entry,

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: '[name].min.js',
  },

  externals: {
    'jquery': {
      root: 'jQuery',
      commonjs2: 'jquery',
      commonjs: 'jquery',
      amd: 'jquery'
    }
  },

  module: {
    loaders: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query:
      {
        presets:['es2015','react']
      }
    }, {
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },

  plugins: [
    //ignoreWoff2,ignoreWoff,ignoreTtf,ignoreSvg,
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      output: {
        ascii_only: true
      }
    })
  ],

  devtool: 'source-map'
};
