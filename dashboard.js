function atualizarDashboard() {

  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

  // CONFIGURATION HOTEL
  const TOTAL_QUARTOS = 30;        // 10 Simples, 10 Suite, 10 Familiar
  const DIAS_ANO = 365;

  const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const diasPorMes = [31,28,31,30,31,30,31,31,30,31,30,31];

  // ---- RESERVAS CONFIRMADAS ----
  const reservasAtivas = reservas.filter(r => r.estado === "confirmada");

  // ---- CALCULS GLOBAUX ----
  const totalFaturado = reservasAtivas.reduce((s, r) => s + (r.precoTotal || 0), 0);
  const diasReservados = reservasAtivas.reduce((s, r) => s + (r.noites || 0), 0);

  let quartosLivres = TOTAL_QUARTOS - reservasAtivas.length;
  if (quartosLivres < 0) quartosLivres = 0;

  const ocupacaoAnual = Math.round(
    (diasReservados / (TOTAL_QUARTOS * DIAS_ANO)) * 100
  );

  // ---- OCUPAÇÃO ATUAL ----
  const hoje = new Date();
  const ocupadosHoje = reservasAtivas.filter(r => {
    const i = new Date(r.dataInicio);
    const f = new Date(r.dataFim);
    return hoje >= i && hoje <= f;
  }).length;

  const ocupacaoAtual = Math.round((ocupadosHoje / TOTAL_QUARTOS) * 100);

  // ---- AFFICHAGE CARTES ----
  document.getElementById("totalFaturado").innerText = totalFaturado + " €";
  document.getElementById("reservasAtivas").innerText = reservasAtivas.length;
  document.getElementById("diasReservados").innerText = diasReservados;
  document.getElementById("quartosLivres").innerText = quartosLivres;
  document.getElementById("ocupacaoAtual").innerText = ocupacaoAtual + "%";
  document.getElementById("ocupacaoAnual").innerText = ocupacaoAnual + "%";

  // ---- DONNÉES PAR MOIS ----
  let reservasPorMes = new Array(12).fill(0);
  let faturacaoPorMes = new Array(12).fill(0);
  let diasReservadosPorMes = new Array(12).fill(0);

  reservasAtivas.forEach(r => {
    const mes = new Date(r.dataInicio).getMonth();
    reservasPorMes[mes]++;
    faturacaoPorMes[mes] += r.precoTotal || 0;
    diasReservadosPorMes[mes] += r.noites || 0;
  });

  let ocupacaoPorMes = diasReservadosPorMes.map((dias, i) =>
    Math.round((dias / (diasPorMes[i] * TOTAL_QUARTOS)) * 100)
  );

  // ---- GRAPHIQUES ----
  new Chart(document.getElementById("graficoReservas"), {
    type: "line",
    data: {
      labels: meses,
      datasets: [{
        label: "Reservas",
        data: reservasPorMes,
        borderWidth: 2,
        fill: false
      }]
    }
  });

  new Chart(document.getElementById("graficoFaturacaoMes"), {
    type: "bar",
    data: {
      labels: meses,
      datasets: [{
        label: "€",
        data: faturacaoPorMes
      }]
    }
  });

  new Chart(document.getElementById("graficoOcupacaoMes"), {
    type: "line",
    data: {
      labels: meses,
      datasets: [{
        label: "Ocupação %",
        data: ocupacaoPorMes,
        borderWidth: 2,
        fill: false
      }]
    }
  });
}



