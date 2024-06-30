export default class dataCountry {
  static questionsCache = []; // Caché estático para almacenar los datos de las preguntas

  // Método para obtener información de todos los países
  static async getAllInfo() {
    try {
      await fetch("https://restcountries.com/v3.1/all")
        .then((response) => response.json())
        .then((data) => {
          // Limpiar el caché y almacenar los nuevos datos
          this.questionsCache = data;
        });
    } catch (e) {
      console.error("Error fetching country data:", e);
    }
  }

  /**
   * Método para estructurar preguntas sobre las capitales de los países
   * @param {Number} limit - Límite de preguntas
   * @returns {Array} - Array de preguntas estructuradas
   */
  static async structureQuestions(limit = 10) {
    await this.getAllInfo();
    try {
      // Clonar y mezclar aleatoriamente los datos de las preguntas
      const data = structuredClone(this.questionsCache).sort(
        () => Math.random() - 0.5
      );

      if (!data) return [];

      // Limitar la cantidad de información según el parámetro 'limit'
      const splitData = data.slice(0, limit);

      // Seleccionar aleatoriamente hasta 40 capitales para las opciones
      const randomCapitals = data
        .slice(0, 40)
        .map(({ capital }) =>
          capital instanceof Array
            ? capital[0]
            : capital == undefined
            ? "None of the above"
            : capital
        );

      // Estructurar los datos en un nuevo array de preguntas
      const newData = splitData.map(({ name, capital, flag }, id) => {
        const newName = name.common;
        const newCapital = capital instanceof Array ? capital[0] : capital; // Capital del país
        // Crear opciones de respuesta, excluyendo la capital correcta
        const newOptions = structuredClone(randomCapitals)
          .filter((capital) => capital !== newCapital)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        return {
          id, // ID de la pregunta
          name: newName, // Nombre del país
          capital: newCapital, // Capital del país
          question: `What is the capital of ${newName} ${flag}?`, // Texto de la pregunta
          answer: newCapital, // Respuesta correcta
          options: [...newOptions, newCapital].sort(() => Math.random() - 0.5), // Opciones de respuesta, mezcladas aleatoriamente
        };
      });
      return newData; // Retornar el array de preguntas estructuradas
    } catch (e) {
      console.error(e);
    }
  }
}
