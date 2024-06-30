export default class dataCountry {
  static questionsCache = [];

  // Método para obtener información de todos los países
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
   * Método para estructurar preguntas sobre las capitales de los países
   * @param {Number} limit - Límite de preguntas
   * @returns {Array} - Array de preguntas estructuradas
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
        .slice(0, 40)
        .map(({ capital }) =>
          capital instanceof Object
            ? capital[0]
            : capital == undefined
            ? "None of the above"
            : capital
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
          options: [...newOptions, newCapital].sort(() => Math.random() - 0.5),
        };
      });
      return newData;
    } catch (e) {
      console.error(e);
    }
  }
}
