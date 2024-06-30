import dataCountry from "./data/index.js"; // Importar la clase dataCountry para obtener información sobre los países

// Seleccionar elementos del DOM
const containerIndicator = document.querySelector(".indicators");
const containerQuestion = document.querySelector(".question-container");
const elementProgess = document.querySelector(".progress");
const $quiz = document.querySelector(".quiz");

// Cargar archivos de audio
const soundCorrectAnswer = new Audio("/public/audio/correct-choice.mp3");
const soundError = new Audio("/public/audio/error.mp3");
const soundSend = new Audio("/public/audio/shuffleandbridge.mp3");

// Crear mapas opciones
const IndicatorMap = new Map();
const OptionsMap = new Map();

// Array para almacenar las preguntas respondidas
const questionsAnswered = [];

// Limpiar el localStorage antes de jugar
localStorage.removeItem("questionsAnswered");

// Obtener datos de las preguntas
const data = await dataCountry.structureQuestions();
let currentCount = 0;
let score = 0;
let isSeledted = false;

// Renderizar los indicadores de preguntas
const renderIndicators = async () => {
  containerIndicator.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const element = document.createElement("li");
    element.className = "indicator";
    element.setAttribute("data-id", i);
    element.innerText = i + 1;
    if (containerIndicator) {
      containerIndicator.append(element);
    }
    element.addEventListener("click", () => anotherQuestion(i));
    // Guardar el elemento en el mapa para evitar buscarlo nuevamente
    IndicatorMap.set(i, element);
  }
};

// Cambiar a otra pregunta
function anotherQuestion(id) {
  if (id === currentCount) return; // Si se selecciona la misma pregunta, no hacer nada
  if (id < currentCount)
    currentCount = id; // Permitir volver a preguntas anteriores
  else currentCount = id;
  renderQuestion();
  renderOptions();
  showProgress();
}

/**
 * Renderizar la pregunta actual
 */
const renderQuestion = async () => {
  IndicatorMap.get(currentCount).classList.add("active");
  const { question } = data[currentCount];
  const elementTitle = document.createElement("h1");
  elementTitle.className = "text-question";
  elementTitle.textContent = question;
  if (containerQuestion) {
    containerQuestion.innerHTML = "";
    containerQuestion.append(elementTitle);
  }
};

// Renderizar las opciones de respuesta
const renderOptions = async () => {
  const finalCapitals = data[currentCount].options;

  const optionsCotainer = document.createElement("div");
  optionsCotainer.className = "options-container";
  optionsCotainer.innerHTML = "";
  finalCapitals.forEach((capital) => {
    const optionElement = document.createElement("button");
    optionElement.innerHTML = `<span>${capital}</span>`;
    optionElement.className = "option";
    optionsCotainer.appendChild(optionElement);
    optionElement.addEventListener("click", (e) => checkAnswer(e));

    // Guardar la opción en el mapa para su uso posterior
    OptionsMap.set(capital, optionElement);
  });
  containerQuestion.append(optionsCotainer);
};

// Verificar la respuesta seleccionada
async function checkAnswer(e) {
  if (isSeledted) return; // Evitar múltiples selecciones
  isSeledted = true;
  const { target } = e;
  const correctAnswer = data[currentCount].answer;
  const userAnswer = target.innerText;
  // Agregar clase active a la opción seleccionada
  target.classList.add("active");

  saveInStorage(); // Guardar la respuesta en el localStorage

  currentCount++; // Avanzar al siguiente conteo

  if (userAnswer === correctAnswer) {
    if (!questionsAnswered.includes(currentCount)) score++; // Incrementar el puntaje si es correcto
    soundCorrectAnswer.play();
    inserIcon(target, "/public/img/Check_round_fill.svg");
  } else {
    soundError.play();
    // Seleccionar la opción correcta para agregarle el ícono
    const element = OptionsMap.get(correctAnswer);
    inserIcon(target, "/public/img/Close_round_fill.svg");
    inserIcon(element, "/public/img/Check_round_fill.svg");
  }

  // Mostrar la siguiente pregunta después de un retraso
  setTimeout(() => {
    if (currentCount >= data.length) return gameOver(); // Finalizar el juego si no hay más preguntas
    soundSend.play();
    renderQuestion();
    renderOptions();
    moveScrollIndicator();
    showProgress();
    isSeledted = false;
  }, 2000);
}

// Guardar cada respuesta en el localStorage y verificar que no esté ya guardada
function saveInStorage() {
  if (!questionsAnswered.includes(currentCount)) {
    questionsAnswered.push(currentCount);
    localStorage.setItem(
      "questionsAnswered",
      JSON.stringify([...questionsAnswered])
    );
  }
}

// Mover el indicador de desplazamiento
function moveScrollIndicator() {
  if (window.innerWidth < 772 && containerIndicator) {
    const { clientHeight } = containerIndicator.querySelector(".indicator");
    containerIndicator.scrollLeft += clientHeight;
  }
}

// Mostrar el progreso actual
function showProgress() {
  if (elementProgess) {
    elementProgess.innerText = `${currentCount + 1}/${data.length}`;
  }
}

// Insertar ícono en el elemento
function inserIcon(element, url) {
  const iconCheck = document.createElement("img");
  iconCheck.src = `${url}`;
  iconCheck.alt = "icon check";
  iconCheck.classList.add("icon-option");
  element.append(iconCheck);
}

// Finalizar el juego y mostrar los resultados
function gameOver() {
  const CongrastsAudio = new Audio("/public/audio/congrasts.mp3");
  CongrastsAudio.play();
  const card = document.createElement("article");
  const btnAgain = document.createElement("button");
  card.className = "card";
  card.innerHTML = /*html*/ `
          <img src="/public/img/congrats.svg" alt="images of congrats" />
          <p class="legend">Congrats! You completed the quiz.</p>
          <p class="score">You answer ${score}/${data.length} correctly.</p>
  `;
  btnAgain.innerText = "Play again";
  btnAgain.className = "btn-again";
  btnAgain.addEventListener("click", () => {
    window.location.reload(true); // Recargar la página para jugar de nuevo
  });
  $quiz.innerHTML = "";
  $quiz.append(card);
}

// Iniciar la aplicación
renderIndicators();
renderQuestion();
renderOptions();
showProgress();
