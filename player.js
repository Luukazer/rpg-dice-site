const params = new URLSearchParams(window.location.search);
const playerId = params.get("playerId");

if (!playerId) {
  alert("Player inválido");
  throw new Error("Sem playerId");
}

const playerRef = db.ref("players/" + playerId);

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

  for (let i = 0; i < qtd; i++) {
    const r = Math.ceil(Math.random() * 12);
    results.push(r);
    display.push(String(r));
  }

  // VANTAGEM
  if (vantagem && results.includes(12)) {
    let idx = results.findIndex(r => r < 8);
    if (idx !== -1) {
      display[idx] = `8(${results[idx]})`;
      results[idx] = 8;
    }
  }

  // DESVANTAGEM
  if (desvantagem && results.includes(1)) {
    let max = Math.max(...results);
    let idx = results.indexOf(max);
    display[idx] = `7(${results[idx]})`;
    results[idx] = 7;
  }

  let successes = 0;
  results.forEach(r => {
    if (r >= 8) successes++;
    if (r === 12) successes += ordem3 ? 2 : 1;
  });

  playerRef.child("lastRoll").set({
    results: results,
    displayResults: display,
    successes: successes,
    timestamp: Date.now()
  });
}
