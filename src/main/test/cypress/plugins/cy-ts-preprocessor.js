const wp = require('cypress-webpack-preprocessor-v5');

module.exports = wp({
  webpackOptions: {
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
        },
      ],
    },
  },
});
