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

  // =====================
  // VANTAGEM (APLICA SEMPRE)
  // =====================
  if (vantagem) {
    const qtd12 = results.filter(r => r === 12).length;

    for (let i = 0; i < qtd12; i++) {
      const idx = results.findIndex(r => r < 8);
      if (idx === -1) break;

      display[idx] = `<span>8(${results[idx]})</span>`;
      results[idx] = 8;
    }
  }

  // =====================
  // DESVANTAGEM (APLICA SEMPRE)
  // =====================
  if (desvantagem) {
    const qtd1 = results.filter(r => r === 1).length;

    for (let i = 0; i < qtd1; i++) {
      const max = Math.max(...results);
      const idx = results.indexOf(max);

      display[idx] = `<span>7(${results[idx]})</span>`;
      results[idx] = 7;
    }
  }

  // =====================
  // CONTAGEM DE SUCESSOS
  // =====================
  let successes = 0;
  results.forEach(r => {
    if (r >= 8) successes++;
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

// 🔥 PLAYER ESCUTA O PRÓPRIO RESULTADO
playerRef.child("lastRoll").on("value", snap => {
  const data = snap.val();
  if (!data) return;

  diceResultsDiv.innerHTML = data.displayResults.join(" ");
  successCountDiv.innerText = data.successes;

  resultsBox.classList.remove("hidden", "fade-out");
  resultsBox.classList.add("fade-in");

  // SE EXISTIR VÍDEO, TOCA
  if (video) {
    video.currentTime = 0;
    video.play();
  }

  // 🔥 APAGA RESULTADO APÓS 10s
  setTimeout(() => {
    resultsBox.classList.add("fade-out");
  }, 9000);

  setTimeout(() => {
    resultsBox.classList.add("hidden");
    resultsBox.classList.remove("fade-in", "fade-out");
    diceResultsDiv.innerHTML = "";
    successCountDiv.innerText = "";
  }, 10000);
});
