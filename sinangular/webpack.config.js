// webpack.config.js
const path = require('path');
module.exports = {
    resolve: {
      extensions: ['.js']
    },
    context: __dirname,
    entry: {
      app: ['./public/dist/js/map/map.js']
    },
    output: {
      path: path.resolve(__dirname, 'public/dist/js/map'),
      filename: 'app.js'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'stage-2', 'react']
          }
        }
      ]
    }
  }

  