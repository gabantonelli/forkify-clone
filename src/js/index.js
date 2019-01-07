// import string from "./models/Search";
// console.log(string);

// import { add, multiply, ID } from "./views/searchView";
// // alternativa
// // import * as searchView from './views/searchView' e poi richiamarli con searchView.a, searchView.ID etc...
// console.log(multiply(ID, 2));
import Search from "./models/Search";

const search = new Search("pizza");
console.log(search);
search.getResults();
