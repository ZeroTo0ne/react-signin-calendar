const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const postcssAspectRatioMini = require("postcss-aspect-ratio-mini");
const postcssPxToViewport = require("postcss-px-to-viewport");
module.exports = {
  mode: "development",
  entry: path.join(__dirname, "example/index.tsx"),
  output: {
    path: path.resolve(__dirname , "/dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        loader: ["babel-loader", "ts-loader"],
        exclude: path.resolve(__dirname, "node_modules")
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: () => [
                postcssAspectRatioMini({}),
                postcssPxToViewport({
                  viewportWidth: 750,
                  viewportHeight: 1334,
                  unitPrecision: 3,
                  viewportUnit: "vw",
                  selectorBlackList: [".ignore", ".hairlines"],
                  minPixelValue: 1,
                  mediaQuery: true
                })
              ]
            }
          },
          "less-loader"
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "example/index.html")
    })
  ],
  devtool: "inline-source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    port: 8080
  }
};
