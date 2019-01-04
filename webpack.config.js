const path = require("path"); //includiamo questo comando node per avere l'indirizzo assoluto
const HtmlWebpackPlugin = require("html-webpack-plugin");

//comando nodejs per esportare oggetto contentente configurazioni
module.exports = {
  entry: ["babel-polyfill", "./src/js/index.js"], //dove iniziare il bundle (1 o più files), quello che deve eseguire
  output: {
    //specifichiamo dove salvare il bundle file risultato, con indirizzo e nome file
    path: path.resolve(__dirname, "dist"),
    filename: "js/bundle.js"
  },
  devServer: {
    //configurazione di webpack-dev-server
    contentBase: "./dist" //cartella da servire
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html"
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
