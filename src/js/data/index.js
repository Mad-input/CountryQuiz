export default class dataCountry {
  static questionsCache = []; // Caché estático para almacenar los datos de las preguntas

  // Método para obtener información de todos los países
  static async getAllInfo() {
    try {
      // Llamada a la API para obtener datos de todos los países
      await fetch("https://restcountries.com/v3.1/all")
        .then((response) => response.json())
        .then((data) => {
          // Limpiar el caché y almacenar los nuevos datos
          this.questionsCache = data;
        });
    } catch (e) {
      console.error("Error fetching country data:", e); // Manejo de errores en caso de fallo en la llamada a la API
    }
  }

  /**
   * Método para estructurar preguntas sobre las capitales de los países
   * @param {Number} limit - Límite de preguntas
   * @returns {Array} - Array de preguntas estructuradas
   */
  static async structureQuestions(limit = 10) {
    await this.getAllInfo(); // Obtener información actualizada de todos los países
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
          capital instanceof Object
            ? capital[0]
            : capital == undefined
            ? "None of the above"
            : capital
        );

      // Estructurar los datos en un nuevo array de preguntas
      const newData = splitData.map(({ name, capital, flag }, id) => {
        const newName = name.common; // Nombre común del país
        const newCapital = capital instanceof Object ? capital[0] : capital; // Capital del país
        // Crear opciones de respuesta, excluyendo la capital correcta
        const newOptions = structuredClone(randomCapitals)
          .filter((capital) => capital !== newCapital)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        // Retornar un objeto con la pregunta estructurada
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
      console.error(e); // Manejo de errores en caso de fallo al estructurar las preguntas
    }
  }
}
