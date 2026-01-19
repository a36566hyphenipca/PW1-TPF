/* =========================
   AUTENTICAÇÃO SIMPLES
========================= */

function login(event) {
  event.preventDefault();

  const utilizador = document.getElementById("user").value;
  const password = document.getElementById("password").value;

  if (utilizador === "admin" && password === "admin") {
    window.location.href = "index.html";
  } else {
    alert("Credenciais inválidas");
  }
}
