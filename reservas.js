/* =========================
   GESTÃO DE RESERVAS
========================= */

// Gerar ID único para reservas
function gerarIdReserva() {
  return reservas.length + 1;
}

// Converter string de data para objeto Date
function converterData(data) {
  return new Date(data);
}

// Verificar se as datas são válidas e dentro de 2025
function datasValidas(dataInicio, dataFim) {
  const inicio = converterData(dataInicio);
  const fim = converterData(dataFim);

  if (inicio >= fim) return false;
  if (inicio.getFullYear() !== 2025 || fim.getFullYear() !== 2025) return false;

  return true;
}

// Verificar se o quarto está disponível no período escolhido
function quartoDisponivel(idQuarto, dataInicio, dataFim) {
  return !reservas.some(reserva => {
    if (reserva.idQuarto !== idQuarto || reserva.estado === "cancelada") {
      return false;
    }

    const inicioExistente = converterData(reserva.dataInicio);
    const fimExistente = converterData(reserva.dataFim);

    return (
      converterData(dataInicio) < fimExistente &&
      converterData(dataFim) > inicioExistente
    );
  });
}

/* =========================
   GESTÃO DE RESERVAS
========================= */

function gerarIdReserva() {
  return reservas.length > 0
    ? reservas[reservas.length - 1].id + 1
    : 1;
}

function datasValidas(inicio, fim) {
  const dInicio = new Date(inicio);
  const dFim = new Date(fim);

  if (dInicio >= dFim) return false;
  if (dInicio < new Date("2025-01-01")) return false;
  if (dFim > new Date("2025-12-31")) return false;

  return true;
}

function quartoDisponivel(idQuarto, inicio, fim) {
  return !reservas.some(r => {
    if (r.idQuarto !== idQuarto || r.estado === "cancelada") return false;

    const i = new Date(r.dataInicio);
    const f = new Date(r.dataFim);

    return new Date(inicio) < f && new Date(fim) > i;
  });
}

function calcularNoites(inicio, fim) {
  return Math.ceil(
    (new Date(fim) - new Date(inicio)) / (1000 * 60 * 60 * 24)
  );
}

function criarReserva(idQuarto, nomeCliente, inicio, fim) {
  if (!datasValidas(inicio, fim)) {
    alert("Datas inválidas (apenas 2025).");
    return;
  }

  if (!quartoDisponivel(idQuarto, inicio, fim)) {
    alert("Quarto indisponível.");
    return;
  }

  const quarto = quartos.find(q => q.id === idQuarto);
  const noites = calcularNoites(inicio, fim);

  const reserva = {
    id: gerarIdReserva(),
    idQuarto,
    nomeCliente,
    dataInicio: inicio,
    dataFim: fim,
    noites,
    precoTotal: noites * quarto.precoNoite,
    estado: "confirmada"
  };

  reservas.push(reserva);
  quarto.estado = "reservado";

  localStorage.setItem("reservas", JSON.stringify(reservas));
  localStorage.setItem("quartos", JSON.stringify(quartos));

  alert("Reserva criada com sucesso!");

  if (typeof atualizarDashboard === "function") {
    atualizarDashboard();
  }
}

function cancelarReserva(idReserva) {
  const reserva = reservas.find(r => r.id === idReserva);
  if (!reserva) return;

  reserva.estado = "cancelada";

  const quarto = quartos.find(q => q.id === reserva.idQuarto);
  quarto.estado = "livre";

  localStorage.setItem("reservas", JSON.stringify(reservas));
  localStorage.setItem("quartos", JSON.stringify(quartos));

  alert("Reserva anulada.");

  if (typeof atualizarDashboard === "function") {
    atualizarDashboard();
  }
}
