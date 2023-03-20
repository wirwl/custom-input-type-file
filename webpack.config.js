const PugPlugin = require("pug-plugin");
const path = require('path');

module.exports = {
  entry: {
    // define your Pug files here
    index: "./src/pages/index/index.pug", // output dist/index.html
    // 'route/to/page': './src/views/page/index.pug', // output dist/route/to/page.html
  },
  devServer: {
    static: './dist',
    hot: false,
    liveReload: true
  },
  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '/'
  },
  plugins: [
    new PugPlugin(), // rendering of Pug files defined in Webpack entry
  ],
  module: {
    rules: [
      {
        test: /.pug$/,
        loader: PugPlugin.loader, // Pug loader
      },
      {
        test: /.css$/,
        use: [{
          loader: 'css-loader'          
        }]
      },
    ],
  },
};
