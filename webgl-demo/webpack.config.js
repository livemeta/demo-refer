module.exports = {
  entry: {
    main: './src/main.js'
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: [/node_modules/, /lib/],
      loader: 'babel-loader'
    // }, {
    //   test: /\.css$/,
    //   loader: 'style-loader!css-loader'
    // }, {
    //   test: /\.js$/,
    //   loader: 'jsx-loader?harmony'
    // }, {
    //   test: /\.scss$/,
    //   loader: 'style!css!sass?sourceMap'
    // }, {
    //   test: /\.(png|jpg)$/,
    //   loader: 'url-loader?limit=8192'
    }]
  }
}
