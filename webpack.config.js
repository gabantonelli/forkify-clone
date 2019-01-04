const path = require("path"); //includiamo questo comando node per avere l'indirizzo assoluto

//comando nodejs per esportare oggetto contentente configurazioni
module.exports = {
  entry: "./src/js/index.js", //dove iniziare il bundle (1 o più files), quello che deve eseguire
  output: {
    //specifichiamo dove salvare il bundle file risultato, con indirizzo e nome file
    path: path.resolve(__dirname, "dist/js"),
    filename: "bundle.js"
  }
};
