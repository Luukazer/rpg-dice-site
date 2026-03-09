const params = new URLSearchParams(window.location.search);
const playerId = params.get("playerId");

if (!playerId) {
  alert("Player inválido");
  throw new Error("Sem playerId");
}

const playerRef = db.ref("players/" + playerId);

// ELEMENTOS DE TELA
const resultsBox = document.getElementById("results");
const diceResultsDiv = document.getElementById("diceResults");
const successCountDiv = document.getElementById("successCount");
const video = document.getElementById("diceVideo");

// 🔒 CONTROLE DE TIMERS
let fadeTimeout = null;
let hideTimeout = null;

/* =========================
   ROLAGEM DE DADOS
========================= */
function rollDice() {

  const qtd = parseInt(document.getElementById("diceCount").value);
  const ordem3 = document.getElementById("ordem3").checked;
  const vantagem = document.getElementById("vantagem").checked;
  const desvantagem = document.getElementById("desvantagem").checked;

  if (vantagem && desvantagem) {
    alert("Vantagem e Desvantagem não podem ser usadas juntas.");
    return;
  }

  let results = [];
  let display = [];

  // ROLAGEM BASE
  for (let i = 0; i < qtd; i++) {

    const r = Math.ceil(Math.random() * 12);
    results.push(r);

    let cls = "";
    if (r === 1) cls = "die-one";
    if (r === 12) cls = "die-twelve";

    display.push(`<span class="${cls}">${r}</span>`);

  }

  /* =====================
     CONTAGEM DE SUCESSOS
  ===================== */

  let successThreshold = 8;

  if (vantagem) successThreshold = 7;
  if (desvantagem) successThreshold = 9;

  let successes = 0;

  results.forEach(r => {

    if (r >= successThreshold) successes++;

    if (r === 12) successes += ordem3 ? 2 : 1;

  });

  // ENVIA PARA FIREBASE
  playerRef.child("lastRoll").set({
    results,
    displayResults: display,
    successes,
    ordem3,
    vantagem,
    desvantagem,
    timestamp: Date.now()
  });

}

/* =========================
   ESCUTA RESULTADO (10s)
========================= */

playerRef.child("lastRoll").on("value", snap => {

  const data = snap.val();
  if (!data) return;

  if (fadeTimeout) clearTimeout(fadeTimeout);
  if (hideTimeout) clearTimeout(hideTimeout);

  diceResultsDiv.innerHTML = data.displayResults.join(" ");
  successCountDiv.innerText = data.successes;

  resultsBox.classList.remove("hidden", "fade-out");
  resultsBox.classList.add("fade-in");

  if (video) {
    video.currentTime = 0;
    video.play();
  }

  fadeTimeout = setTimeout(() => {
    resultsBox.classList.add("fade-out");
  }, 9000);

  hideTimeout = setTimeout(() => {
    resultsBox.classList.add("hidden");
    resultsBox.classList.remove("fade-in", "fade-out");
    diceResultsDiv.innerHTML = "";
    successCountDiv.innerText = "";
  }, 10000);

});

/* =========================
   ÍNDICE DE DANO & PRESSÃO
========================= */

const damageCurrent = document.getElementById("damageCurrent");
const damageTotal = document.getElementById("damageTotal");
const pressureCurrent = document.getElementById("pressureCurrent");
const pressureTotal = document.getElementById("pressureTotal");

// CARREGA DO FIREBASE
playerRef.child("stats").on("value", snap => {

  const data = snap.val();
  if (!data) return;

  damageCurrent.value = data.damageCurrent ?? 0;
  damageTotal.value = data.damageTotal ?? 0;
  pressureCurrent.value = data.pressureCurrent ?? 0;
  pressureTotal.value = data.pressureTotal ?? 0;

});

// BOTÕES
function changeStat(type, delta) {

  let currentEl, totalEl;

  if (type === "damage") {
    currentEl = damageCurrent;
    totalEl = damageTotal;
  } else {
    currentEl = pressureCurrent;
    totalEl = pressureTotal;
  }

  let current = parseInt(currentEl.value) || 0;
  let total = parseInt(totalEl.value) || 0;

  current = Math.max(0, Math.min(current + delta, total));

  currentEl.value = current;

  saveStats();

}

// SALVA AO DIGITAR
[damageCurrent, damageTotal, pressureCurrent, pressureTotal].forEach(input => {
  input.addEventListener("change", saveStats);
});

/* =========================
   SALVAMENTO
========================= */

function saveStats() {

  const dmgCur = parseInt(damageCurrent.value) || 0;
  const dmgTot = parseInt(damageTotal.value) || 0;
  const presCur = parseInt(pressureCurrent.value) || 0;
  const presTot = parseInt(pressureTotal.value) || 0;

  playerRef.child("stats").set({
    damageCurrent: dmgCur,
    damageTotal: dmgTot,
    pressureCurrent: presCur,
    pressureTotal: presTot
  });

  playerRef.update({
    damage: {
      current: dmgCur,
      total: dmgTot
    },
    pressure: {
      current: presCur,
      total: presTot
    }
  });

}
