- [x] Create a country quiz that matches the given design.

- [x] By default, generate 10 questions about countries with the given API.

- [x] In each question, users should see 4 options.

- [x] Save each question you answer to avoid duplicating points

- [x] When users select an answer, they should get the correct answer immediately with according indicators in the design.

- [x] User can navigate to any questions.

- [x] When users answer all 10 questions, they should see a congratulations page with the result and choose to play again.

- [x] make a list of scores and display them at the end of each game

- [x] Deploy the solution and submit Repository URL and Demo URL.

# Clase `dataCountry`

La clase `dataCountry` se encarga de obtener información de todos los países desde una API y estructurar preguntas sobre las capitales de estos países. Esta clase tiene dos métodos estáticos principales: `getAllInfo` y `structureQuestions`.

## Atributos

### `static questionsCache`

- **Descripción**: Un caché estático para almacenar la información de los países obtenida desde la API.
- **Tipo**: Array

## Métodos

### `static async getAllInfo()`

- **Descripción**: Este método obtiene información de todos los países desde la API `https://restcountries.com/v3.1/all` y la almacena en `questionsCache`.
- **Parámetros**: Ninguno
- **Retorno**: Ninguno (actualiza el atributo `questionsCache`)
- **Manejo de errores**: Captura cualquier error durante la obtención de datos y lo imprime en la consola.

#### Ejemplo de uso:

```javascript
await dataCountry.getAllInfo();
console.log(dataCountry.questionsCache); // Muestra la información de los países en consola
```

### static async structureQuestions(limit = 10):

- **Descripción**: Este método estructura las preguntas sobre las capitales de los países, limitando la cantidad de preguntas según el parámetro `limit`.
- **Parámetros**:
  - `limit` (Number): El número máximo de preguntas a estructurar. Valor por defecto: 10.
- **Retorno**: Un array de objetos que representan las preguntas estructuradas.
- **Manejo de errores**: Captura cualquier error durante la estructuración de las preguntas y lo imprime en la consola.

#### Ejemplo de uso:

```javascript
const questions = await dataCountry.structureQuestions(5);
console.log(questions); // Muestra las preguntas estructuradas en consola
```

## Estructura de cada pregunta en el retorno:

### Cada objeto de pregunta tiene la siguiente estructura:

- **id (Number)**: Identificador de la pregunta.
- **name (String)**: Nombre común del país.
- **capital (String)**: Capital del país.
- **question (String)**: Texto de la pregunta sobre la capital del país.
- **answer (String)**: Respuesta correcta (capital del país).
- **options (Array)**: Array de opciones para la respuesta, incluyendo la respuesta correcta y otras opciones aleatorias.

### Ejemplo de objeto pregunta:

```javascript
{
  id: 0,
  name: "France",
  capital: "Paris",
  question: "What is the capital of France 🇫🇷?",
  answer: "Paris",
  options: ["Berlin", "Madrid", "Lisbon", "Paris"]
}
```
