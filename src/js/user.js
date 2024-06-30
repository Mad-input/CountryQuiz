const form = document.getElementById("form");
const input = form.querySelector("#inputUser");
localStorage.removeItem("user");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const { value } = input;
  if (value) {
    localStorage.setItem("user", value);
    window.location.replace("/src/game.html");
  }
});
