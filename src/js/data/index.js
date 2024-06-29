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
      const data = structuredClone(this.questionsCache).sort(
        () => Math.random() - 0.5
      );
      if (!data) return [];
      // Limitar la cantidad de información
      const splitData = data.slice(0, limit);

      const randomCapitals = data
        .slice(0, 30)
        .map(({ capital }) =>
          capital instanceof Object ? capital[0] : capital
        );

      const newData = splitData.map(({ name, capital, flag }, id) => {
        const newName = name.common;
        const newCapital = capital instanceof Object ? capital[0] : capital;
        const newOptions = structuredClone(randomCapitals)
          .filter((capital) => capital !== newCapital)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        return {
          id,
          name: newName,
          capital: newCapital,
          question: `What is the capital of ${newName} ${flag}?`,
          answer: newCapital,
          options: [...newOptions, newCapital],
        };
      });
      return newData;
    } catch (e) {
      console.error(e);
    }
  }
}
