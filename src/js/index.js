// import string from "./models/Search";
// console.log(string);

// import { add, multiply, ID } from "./views/searchView";
// // alternativa
// // import * as searchView from './views/searchView' e poi richiamarli con searchView.a, searchView.ID etc...
// console.log(multiply(ID, 2));
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
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

elements.searchResPages.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 *  RECIPE CONTROLLER
 */

const controlRecipe = async () => {
  //get id from the hash in the URL
  const id = window.location.hash.replace("#", "");
  if (id) {
    //prepare ui for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //highlight active recipe
    if (state.search) searchView.highlightSelected(id);
    // create new recipe object
    state.recipe = new Recipe(id);
    try {
      // get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // calc servings and time
      state.recipe.calcServings();
      state.recipe.calcTime();
      // render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      alert(error);
    }
  }
};

["hashchange", "load"].forEach(e => window.addEventListener(e, controlRecipe));

/**
 *  LIST CONTROLLER
 */
const controlList = () => {
  // Create a new list if there isn't already one
  if (!state.list) state.list = new List();
  // add each ingredient to the list
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

/**
 *  LIKES CONTROLLER
 */

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentId = state.recipe.id;
  if (!state.likes.isLiked(currentId)) {
    // user has not yet liked this recipe
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //toggle like button
    likesView.toggleLikeBtn(true);

    //add like to the ui list;
    likesView.renderLike(newLike);
  } else {
    //user wants to unlike the recipe
    state.likes.deleteLike(currentId);
    //toggle like button
    likesView.toggleLikeBtn(false);
    //remove like to the ui list;
    likesView.deleteLike(currentId);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener("load", () => {
  state.likes = new Likes();
  state.likes.readStorage();
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

//handle delete and update list events
elements.shopping.addEventListener("click", e => {
  const id = e.target.closest(".shopping__item").dataset.itemid;
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    //remove from state
    state.list.deleteItem(id);
    // remove from UI
    listView.deleteItem(id);
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

elements.recipe.addEventListener("click", e => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    //like controller
    controlLike();
  }
});
