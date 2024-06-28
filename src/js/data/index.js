export default class dataCountry {
  static questionsCache = [];
  static async getAllInfo() {
    try {
      let res;
      await fetch("https://restcountries.com/v3.1/all")
        .then((response) => response.json())
        .then((data) => {
          res = data;
        });
      this.questionsCache = [];
      this.questionsCache.push(...res);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   *
   * @param {Number} limit limite de de preguntas
   * @returns {}
   */
  static async structureQuestions(limit = 10) {
    await this.getAllInfo().then();
    try {
      const data = this.questionsCache;
      if (!data) return [];
      // Limitar la cantidad de información
      const splitData = data.slice(0, limit);

      const newData = splitData.map(({ name, capital, flag }, id) => {
        const newName = name.common;
        const newCapital = capital instanceof Object ? capital[0] : capital;
        return {
          id,
          name: newName,
          capital: newCapital,
          question: `What is the capital of ${newName} ${flag}?`,
          answer: newCapital,
        };
      });
      return newData;
    } catch (e) {
      console.error(e);
    }
  }

  static async extractCapital() {
    await this.getAllInfo().then();
    try {
      const data = this.questionsCache;
      const capitals = data.slice(0, 30).map((ques) => ques.capital[0]);
      return capitals;
    } catch (e) {
      console.error(e);
    }
  }
}
