import dataCountry from "./data/index.js";
const containerIndicator = document.querySelector(".indicators");
const containerQuestion = document.querySelector(".question-container");
const elementProgess = document.querySelector(".progress");
const $quiz = document.querySelector(".quiz");
const soundCorrectAnswer = new Audio("/public/audio/correct-choice.mp3");
const soundError = new Audio("/public/audio/error.mp3");
const soundSend = new Audio("/public/audio/shuffleandbridge.mp3");
const IndicatorMap = new Map();
const OptionsMap = new Map();
const data = await dataCountry.structureQuestions();
let currentCount = 0;
let score = 0;
let isSeledted = false;

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
    // Guardar elemento el el map para evitar volver a buscar
    IndicatorMap.set(i, element);
  }
};

/**
 *
 * @param {Number} currentCount
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

    OptionsMap.set(capital, optionElement);
  });
  containerQuestion.append(optionsCotainer);
};

async function checkAnswer(e) {
  if (isSeledted) return;
  isSeledted = true;
  const { target } = e;
  const correctAnswer = data[currentCount].answer;
  const userAnswer = target.innerText;
  target.classList.add("active");
  currentCount++;

  if (userAnswer === correctAnswer) {
    score++;
    soundCorrectAnswer.play();
    inserIcon(target, "/public/img/Check_round_fill.svg");
  } else {
    soundError.play();
    // Seleccionar la opcion correcta para agregarle el icono
    const element = OptionsMap.get(correctAnswer);
    inserIcon(target, "/public/img/Close_round_fill.svg");
    inserIcon(element, "/public/img/Check_round_fill.svg");
  }

  setTimeout(() => {
    if (currentCount >= data.length) return gameOver();
    soundSend.play();
    renderQuestion();
    renderOptions();
    moveScrollIndicator();
    showProgress();
    isSeledted = false;
  }, 2000);
}

function moveScrollIndicator() {
  if (window.innerWidth < 772 && containerIndicator) {
    const { clientHeight } = containerIndicator.querySelector(".indicator");
    containerIndicator.scrollLeft += clientHeight;
  }
}

function showProgress() {
  if (elementProgess) {
    elementProgess.innerText = `${currentCount + 1}/${data.length}`;
  }
}

function inserIcon(element, url) {
  const iconCheck = document.createElement("img");
  iconCheck.src = `${url}`;
  iconCheck.alt = "icon check";
  iconCheck.classList.add("icon-option");
  element.append(iconCheck);
}
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
    window.location.reload(true);
  });
  card.append(btnAgain);
  $quiz.innerHTML = "";
  $quiz.append(card);
}

renderIndicators();
renderQuestion();
renderOptions();
showProgress();
