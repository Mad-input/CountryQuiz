class Quiz {
  constructor(data,options) {
    this.data = data
    this.options = options
    // Crear mapas opciones
    this.IndicatorMap = new Map();
    this.OptionsMap = new Map();

    // Array para almacenar las preguntas respondidas
    this.questionsAnswered = [];
    this.scoreboard = JSON.parse(localStorage.getItem("scoreboard")) || [];
    this.user = localStorage.getItem("user") || "unknown";

    // Limpiar el localStorage antes de jugar
    localStorage.removeItem("questionsAnswered");

    this.currentCount = 0;
    this.score = 0;
    this.isSeledted = false;
  }

  // Renderizar los indicadores de preguntas
  renderIndicators = async () => {
    this.options.containerIndicator.innerHTML = "";
    for (let i = 0; i < this.data.length; i++) {
      const element = document.createElement("li");
      element.className = "indicator";
      element.setAttribute("data-id", i);
      element.innerText = i + 1;
      if (this.options.containerIndicator) {
        this.options.containerIndicator.append(element);
      }
      element.addEventListener("click", () => this.anotherQuestion(i));
      // Guardar el elemento en el mapa para evitar buscarlo nuevamente
      this.IndicatorMap.set(i, element);
    }
  };

  // Cambiar a otra pregunta
  anotherQuestion(id) {
    if (id === this.currentCount) return; // Si se selecciona la misma pregunta, no hacer nada
    if (id < this.currentCount)
      this.currentCount = id; // Permitir volver a preguntas anteriores
    else this.currentCount = id;
    this.renderQuestion();
    this.renderOptions();
    this.showProgress();
  }

  /**
   * Renderizar la pregunta actual
   */
  renderQuestion = async () => {
    this.IndicatorMap.get(this.currentCount).classList.add("active");
    const { question } = this.data[this.currentCount];
    const elementTitle = document.createElement("h1");
    elementTitle.className = "text-question";
    elementTitle.textContent = question;
    if (this.options.containerQuestion) {
      this.options.containerQuestion.innerHTML = "";
      this.options.containerQuestion.append(elementTitle);
    }
  };

  // Renderizar las opciones de respuesta
  renderOptions = () => {
    const finalCapitals = this.data[this.currentCount].options;

    const optionsCotainer = document.createElement("div");
    optionsCotainer.className = "options-container";
    optionsCotainer.innerHTML = "";
    finalCapitals.forEach((capital) => {
      const optionElement = document.createElement("button");
      optionElement.innerHTML = `<span>${capital}</span>`;
      optionElement.className = "option";
      optionElement.setAttribute("data-capital", capital);
      optionsCotainer.appendChild(optionElement);
      optionElement.addEventListener("click", (e) => this.checkAnswer(e), true);

      // Guardar la opción en el mapa para su uso posterior
      this.OptionsMap.set(capital, optionElement);
    });
    this.options.containerQuestion.append(optionsCotainer);
  };

// Verificar la respuesta seleccionada
  checkAnswer(e) {
    if (this.isSeledted) return; // Evitar múltiples selecciones
    this.isSeledted = true;
    const { currentTarget } = e;
    const correctAnswer = this.data[this.currentCount].answer;
    const userAnswer = currentTarget.dataset.capital;

    // Agregar clase active a la opción seleccionada
    currentTarget.classList.add("active");

    this.saveInStorage(); // Guardar la respuesta en el localStorage

    this.currentCount++; // Avanzar al siguiente conteo

    if (userAnswer === correctAnswer) {
      if (!this.questionsAnswered.includes(this.currentCount)) this.score++; // Incrementar el puntaje si es correcto
      this.options.sounds.correct.play();
      this.inserIcon(currentTarget, this.options.icons.check);
    } else {
      this.options.sounds.error.play();
      // Seleccionar la opción correcta para agregarle el ícono
      const element = this.OptionsMap.get(correctAnswer);
      this.inserIcon(currentTarget, this.options.icons.error);
      this.inserIcon(element, this.options.icons.check);
    }

    // Mostrar la siguiente pregunta después de un retraso
    setTimeout(() => {
      if (this.currentCount >= this.data.length) return this.gameOver(); // Finalizar el juego si no hay más preguntas
      this.options.sounds.send.play()
      this.renderQuestion();
      this.renderOptions();
      this.moveScrollIndicator();
      this.showProgress();
      this.isSeledted = false;
    }, 2000);
  }

  // Guardar cada respuesta en el localStorage y verificar que no esté ya guardada
  saveInStorage() {
    if (!this.questionsAnswered.includes(this.currentCount)) {
      this.questionsAnswered.push(this.currentCount);
      localStorage.setItem(
        "questionsAnswered",
        JSON.stringify([...this.questionsAnswered])
      );
    }
  }

  // Mover el indicador de desplazamiento
  moveScrollIndicator() {
    if (window.innerWidth < 772 && this.options.containerIndicator) {
      const { clientHeight } = this.options.containerIndicator.querySelector(".indicator");
      this.options.containerIndicator.scrollLeft += clientHeight;
    }
  }

  // Mostrar el progreso actual
  showProgress() {
    if (this.options.elementProgess) {
      this.options.elementProgess.innerText = `${this.currentCount + 1}/${this.data.length}`;
    }
  }

  // Insertar ícono en el elemento
  inserIcon(element, url) {
    const iconCheck = document.createElement("img");
    iconCheck.src = `${url}`;
    iconCheck.alt = "icon check";
    iconCheck.classList.add("icon-option");
    element.append(iconCheck);
  }

  showScoreboard(element) {
    const scoreboardElement = document.createElement("div");
    const listScore = document.createElement("ul");
    scoreboardElement.className = "scoreboard";
    listScore.className = "list-score";

    this.scoreboard
      .sort((a, b) => b.currentScore - a.currentScore)
      .forEach((score, i) => {
        const liElement = document.createElement("li");
        const rank = i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th";
        liElement.className = "list-item-score";
        liElement.innerHTML = /*html*/ `
        <strong class="rank">${i + 1}${rank}.</strong>
        <strong class="name">${score.username}</strong>
        <small class="currentScore" >${score.currentScore}</small>
      `;
        listScore.append(liElement);
      });
    scoreboardElement.append(listScore);
    element.append(scoreboardElement);
  }

  saveScoreInStorage(username, currentScore) {
    this.scoreboard.push({ username, currentScore });
    localStorage.setItem("scoreboard", JSON.stringify([...this.scoreboard]));
  }

  // Finalizar el juego y mostrar los resultados
  gameOver() {
    this.options.sounds.congratulations.play()
    this.saveScoreInStorage(this.user, this.score);
    const card = document.createElement("article");
    const btnAgain = document.createElement("button");
    card.className = "card";
    card.innerHTML = /*html*/ `
            <img src="/public/img/congrats.svg" alt="images of congrats" />
            <p class="legend">Congrats! You completed the quiz.</p>
            <p class="score">You answer ${this.score}/${this.data.length} correctly.</p>`;
    btnAgain.innerText = "Play again";
    btnAgain.className = "btn-again";
    btnAgain.addEventListener("click", () => {
      window.location.replace("/"); // Recargar la página para jugar de nuevo
    });
    this.showScoreboard(card);
    card.append(btnAgain);
    this.options.$quiz.innerHTML = "";
    this.options.$quiz.append(card);
  }

  // Iniciar Juego
  init() {
    this.renderIndicators();
    this.renderQuestion();
    this.renderOptions();
    this.showProgress();
  }
}

export default Quiz
