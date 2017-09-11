// webpack.config.js
module.exports = {
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    context: __dirname,
    entry: {
      app: ['./js/map/map.jsx']
    },
    output: {
      path: './build',
      filename: 'app.js',
      publicPath: '/build/'
    },
    module: {
      loaders: [
        {
          test: /(\.js|.jsx)$/,
          loader: 'babel',
          query: {
            presets: ['es2015', 'stage-2', 'react']
          }
        }
      ]
    }
  }