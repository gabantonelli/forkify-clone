// import string from "./models/Search";
// console.log(string);

// import { add, multiply, ID } from "./views/searchView";
// // alternativa
// // import * as searchView from './views/searchView' e poi richiamarli con searchView.a, searchView.ID etc...
// console.log(multiply(ID, 2));
import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";

/** GLOBAL STATE OF THE APP in other complex apps done by Redux
 * - Search object with all data about the search query and results
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

const controlSearch = async () => {
  //1. get query from the view
  const query = searchView.getInput();
  if (query) {
    //2. new search object and add it to state
    state.search = new Search(query);
    //3. prepare for displaying results on UI
    // clear previous results
    searchView.clearResults();
    renderLoader(elements.searchRes);
    // clear input field
    searchView.clearInput();
    //4. search for recipes
    await state.search.getResults();
    //5. render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault(); //to stop the page from reloading when submitting
  controlSearch();
});
