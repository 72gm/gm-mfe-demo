const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const webpack = require("webpack");
const { dependencies } = require("./package.json");
const Dotenv = require("dotenv-webpack");
const path = require("path");

module.exports = (args) => {
  return {
    entry: "./src/index",
    mode: "development",
    devServer: {
      port: 3000,
      historyApiFallback: true
    },
    output: {
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.(scss|css)$/i,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(js|jsx|)?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env", "@babel/preset-react"],
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "Parent",
        filename: "moduleEntry.js",
        remotes: {
          cvo: `Remote@http://localhost:3001/moduleEntry.js`,
          caveats: `Caveats@http://localhost:3002/moduleEntry.js`,
        },
        exposes: {},
        shared: {
          ...dependencies,
          react: {
            singleton: true,
            requiredVersion: dependencies["react"],
          },
          "react-dom": {
            singleton: true,
            requiredVersion: dependencies["react-dom"],
          },
          "msal-browser": {
            singleton: true,
            requiredVersion: dependencies["msal-browser"],
          },
          "msal-react": {
            singleton: true,
            requiredVersion: dependencies["msal-react"],
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      new Dotenv({
        path: path.resolve(__dirname, ".env." + args.configFile),
      }),
    ],
    resolve: {
      extensions: [".js", ".jsx"],
    },
    target: "web",
  };
};
