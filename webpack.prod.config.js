const path = require("path");
const postcssAspectRatioMini = require('postcss-aspect-ratio-mini');
const postcssPxToViewport = require('postcss-px-to-viewport');
module.exports = {
  mode: "production",
  entry: path.join(__dirname, "src/calendar/index.tsx"),
  output: {
    path: path.join(__dirname , "/lib"),
    publicPath: '/lib/',
    library: "calendar",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        loader: ['babel-loader', 'ts-loader'],
        exclude: path.resolve(__dirname, "node_modules"),
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                postcssAspectRatioMini({}),
                postcssPxToViewport({
                  viewportWidth: 750, 
                  viewportHeight: 1334, 
                  unitPrecision: 3, 
                  viewportUnit: 'vw', 
                  selectorBlackList: ['.ignore', '.hairlines'],
                  minPixelValue: 1, 
                  mediaQuery: true 
                })
              ]
            }
          },
          'less-loader',
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', ".js", '.less']
  }
};
