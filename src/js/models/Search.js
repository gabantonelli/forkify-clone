import axios from "axios";
import * as config from "../APIconfig";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const res = await axios(
        `${config.proxy}https://www.food2fork.com/api/search?key=${
          config.key
        }&q=${this.query}`
      );
      this.result = res.data.recipes;
    } catch (error) {
      alert(error);
    }
  }
}
