const webpack = require("webpack");
// parse html
const HtmlWebpackPlugin = require("html-webpack-plugin");
//path overrides
const InterpolateHtmlPlugin = require("interpolate-html-plugin");
//federations
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
// use the env files
const Dotenv = require("dotenv-webpack");
const path = require("path");
const { dependencies } = require("./package.json");

module.exports = (args) => ({
  entry: "./src/index",
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 3001,
  },
  optimization: {//this has to be off to set up eager loading and let parent app to load the module
    splitChunks: false,
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: ["file-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.?(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "Remote",
      //the name of the file the calling app will use to load the module
      filename: "moduleEntry.js",
      remotes: {
      },
      exposes: {
        './routes': './src/routes/routes',
      },
      shared: {
        // the dependencies we are sharing, this will make sure that the calling app uses the same version of the dependencies
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
      // set the path to the env file, uses the args passed in from the npm script
      path: path.resolve(
        __dirname,
        ".env." + args.configFile
      ),
    }),
    new InterpolateHtmlPlugin({
      PUBLIC_URL: "static",
    }),
    new webpack.DefinePlugin({
      // if we are running the app standalone we want to use the local config file, otherwise we want to use the parent apps config file
      // this global variable is used in a few places and it needs an absolute path starting at src which is setup below
      AUTHCONFIG: args.configFile == 'local' ? JSON.stringify('config/authConfig') : JSON.stringify('parent/authConfig'),
    })
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    // add a path to the src file so we can use absolute references to imports as per line 114 here config/authConfig
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },
  target: "web",
});
