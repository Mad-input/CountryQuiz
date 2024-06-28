import dataCountry from "./data/index.js";
const containerIndicator = document.querySelector(".indicators");
const containerQuestion = document.querySelector(".question-container");
const IndicatorMap = new Map();
let currentCount = 0;

const renderIndicators = async () => {
  const data = await dataCountry.structureQuestions();
  containerIndicator.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const element = document.createElement("button");
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
  const data = await dataCountry.structureQuestions();
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
  const data = await dataCountry.structureQuestions();
  const capitals = await dataCountry.extractCapital();
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
  finalCapitals.forEach((capital, i) => {
    const optionElement = document.createElement("button");
    optionElement.innerText = capital;
    optionElement.className = "option";
    optionsCotainer.appendChild(optionElement);
    optionElement.addEventListener("click", (e) => checkAnswer(e));
  });
  containerQuestion.append(optionsCotainer);
};

async function checkAnswer(e) {
  const data = await dataCountry.structureQuestions();
  const correctAnswer = data[currentCount].answer;
  const userAnswer = e.target.innerText;
  console.log(userAnswer, correctAnswer);
  currentCount++;
  renderQuestion();
  renderOptions();
  if (userAnswer === correctAnswer) {
  } else console.log("mal");
}

renderIndicators();
renderQuestion();
renderOptions();
