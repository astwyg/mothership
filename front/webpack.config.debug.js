var path = require('path');
var webpack = require('webpack');

entry={};
entry["vm"] = './app/vm.jsx';
entry["command"] = "./app/command.jsx";
entry[0] = 'webpack-dev-server/client?http://localhost:3000';
entry[1] = 'webpack/hot/only-dev-server';

module.exports = {
    // entry: [
    //   'webpack-dev-server/client?http://localhost:3000',
    //   'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    //   //'./components/index.jsx' // Your appʼs entry point
    //   './app/command.jsx',
    //   './app/vm.jsx',
    // ],
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/static/',
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
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'source-map'
}
