var path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'firestorter.js',
    libraryTarget: 'commonjs2' // THIS IS THE MOST IMPORTANT LINE! :mindblow: I wasted more than 2 days until realize this was the line most important in all this guide.
  },
  module: {
    loaders: [
      {
        test: /(\.js)$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components|build)/,
      }
    ]
  },
  externals: {
    mobx: 'mobx'
  }
};
