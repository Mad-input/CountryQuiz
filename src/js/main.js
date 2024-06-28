import dataCountry from "./data/index.js";
const containerIndicator = document.querySelector(".indicators");
const containerQuestion = document.querySelector(".question-container");
const IndicatorMap = new Map();
const OptionsMap = new Map();
const data = await dataCountry.structureQuestions();
const capitals = await dataCountry.extractCapital();
let currentCount = 0;
let isSeledted = false;

const renderIndicators = async () => {
  //   const data = await dataCountry.structureQuestions();
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
  //   const data = await dataCountry.structureQuestions();
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
  //   const data = await dataCountry.structureQuestions();

  const correctOption = data[currentCount].capital;
  const filteredCapitals = capitals
    .filter((capital) => capital !== correctOption)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const finalCapitals = [...filteredCapitals, correctOption].sort(
    () => Math.random() - 0.5
  );

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
  //   const data = await dataCountry.structureQuestions();
  const { target } = e;
  const correctAnswer = data[currentCount].answer;
  const userAnswer = target.innerText;
  target.classList.add("active");
  currentCount++;

  if (userAnswer === correctAnswer) {
    inserIcon(target, "/public/img/Check_round_fill.svg");
  } else {
    const element = OptionsMap.get(correctAnswer);
    inserIcon(target, "/public/img/Close_round_fill.svg");
    inserIcon(element, "/public/img/Check_round_fill.svg");
  }

  setTimeout(() => {
    renderQuestion();
    renderOptions();
    isSeledted = false;
  }, 2000);
}

function inserIcon(element, url) {
  const iconCheck = document.createElement("img");
  iconCheck.src = `${url}`;
  iconCheck.alt = "icon check";
  iconCheck.classList.add("icon-option");
  element.append(iconCheck);
}

renderIndicators();
renderQuestion();
renderOptions();
