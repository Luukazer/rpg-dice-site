const params = new URLSearchParams(window.location.search);
const playerId = params.get("playerId");

if (!playerId) throw new Error("Player inválido");

const playerRef = db.ref("players/" + playerId);

/* ======================
   CONTROLE DE DADOS
====================== */
function changeDice(delta) {
  const input = document.getElementById("diceCount");
  input.value = Math.max(1, parseInt(input.value) + delta);
}

/* ======================
   STATUS
====================== */
function changeStat(type, delta) {
  const current = document.getElementById(type + "Current");
  current.value = Math.max(0, parseInt(current.value) + delta);

  playerRef.child(type).set({
    current: parseInt(document.getElementById(type + "Current").value),
    total: parseInt(document.getElementById(type + "Total").value)
  });
}

/* ======================
   ROLAGEM
====================== */
function rollDice() {
  const qtd = parseInt(diceCount.value);
  const ordem3 = ordem3Checkbox.checked;
  const vantagem = vantagemCheckbox.checked;
  const desvantagem = desvantagemCheckbox.checked;

  if (vantagem && desvantagem) {
    alert("Vantagem e Desvantagem não podem juntas");
    return;
  }

  let results = [];
  let display = [];
  let successes = 0;

  for (let i = 0; i < qtd; i++) {
    let r = Math.ceil(Math.random() * 12);

    // VANTAGEM: sempre que sair 12
    if (vantagem && r === 12) r = 8;

    // DESVANTAGEM: sempre que sair 1
    if (desvantagem && r === 1) r = 7;

    results.push(r);

    let spanClass = "";
    if (r === 1) spanClass = "die-one";
    if (r === 12) spanClass = "die-twelve";

    display.push(`<span class="${spanClass}">${r}</span>`);

    if (r >= 8) successes++;
    if (r === 12) successes += ordem3 ? 2 : 1;
  }

  // MOSTRAR RESULTADO NO PLAYER
  diceResults.innerHTML = display.join(" ");
  successCount.textContent = successes;
  resultsBox.classList.remove("hidden");

  // ESCONDER APÓS 10s
  setTimeout(() => {
    resultsBox.classList.add("hidden");
  }, 10000);

  // ENVIAR PARA OBS
  playerRef.child("lastRoll").set({
    successes,
    timestamp: Date.now()
  });
}
