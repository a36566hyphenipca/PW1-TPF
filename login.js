function login() {
  if (user.value === "admin" && pass.value === "1234") {
    localStorage.setItem("logado", "true");
    window.location.href = "dashboard.html";
  } else {
    erro.innerText = "Dados incorretos";
  }
}

