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

  let results = [];
  let display = [];

  for (let i = 0; i < qtd; i++) {
    const r = Math.ceil(Math.random() * 12);
    results.push(r);
    display.push(String(r));
  }

  // VANTAGEM
  if (vantagem && results.includes(12)) {
    let lows = results
      .map((v, i) => ({ v, i }))
      .filter(o => o.v < 8);

    if (lows.length) {
      let target = lows.sort((a, b) => a.v - b.v)[0];
      display[target.i] = `8(${results[target.i]})`;
      results[target.i] = 8;
    }
  }

  // DESVANTAGEM
  if (desvantagem && results.includes(1)) {
    let highs = results
      .map((v, i) => ({ v, i }))
      .sort((a, b) => b.v - a.v);

    let target = highs[0];
    display[target.i] = `7(${results[target.i]})`;
    results[target.i] = 7;
  }

  let successes = 0;
  results.forEach(r => {
    if (r >= 8) successes++;
    if (r === 12) successes += ordem3 ? 2 : 1;
  });

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

  diceResultsDiv.innerText = data.displayResults.join(", ");
  successCountDiv.innerText = data.successes;

  resultsBox.classList.remove("hidden", "fade-out");
  resultsBox.classList.add("fade-in");

  video.currentTime = 0;
  video.play();

  setTimeout(() => {
    resultsBox.classList.add("fade-out");
  }, 6000);

  setTimeout(() => {
    resultsBox.classList.add("hidden");
    resultsBox.classList.remove("fade-in", "fade-out");
  }, 7000);
});
