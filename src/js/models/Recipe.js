import axios from "axios";
import * as config from "../APIconfig";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `${config.proxy}https://www.food2fork.com/api/get?key=${
          config.key
        }&rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      alert(error);
    }
  }

  calcTime() {
    //we assume 15 minutes of preparation every 3 ingredients
    const numIng = this.ingredients.length;
    this.time = Math.ceil(numIng / 3) * 15;
  }

  calcServings() {
    this.servings = 4; //we assume recipes are for 4 servings
  }
}
