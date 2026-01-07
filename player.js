const playerId = new URLSearchParams(location.search).get("playerId");
const ref = db.ref("players/" + playerId);

function rollDice() {
  const qtd = parseInt(document.getElementById("diceCount").value);
  const ordem3 = document.getElementById("ordem3").checked;
  const vant = document.getElementById("vantagem").checked;
  const desv = document.getElementById("desvantagem").checked;

  if (vant && desv) return alert("Vantagem e Desvantagem não podem juntas");

  let results = [];
  for (let i = 0; i < qtd; i++) results.push(Math.ceil(Math.random() * 12));

  let display = [...results];
  let successes = 0;

  if (vant && results.includes(12)) {
    let idx = results.findIndex(r => r < 8);
    if (idx !== -1) {
      display[idx] = `8(${results[idx]})`;
      results[idx] = 8;
    }
  }

  if (desv && results.includes(1)) {
    let max = Math.max(...results);
    let idx = results.indexOf(max);
    display[idx] = `7(${results[idx]})`;
    results[idx] = 7;
  }

  results.forEach(r => {
    if (r >= 8) successes++;
    if (r === 12) successes += ordem3 ? 2 : 1;
  });

  ref.child("lastRoll").set({
    results,
    displayResults: display,
    successes,
    timestamp: Date.now()
  });
}
