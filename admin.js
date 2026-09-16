const list = document.getElementById("playerList");
const rollHistory = document.getElementById("rollHistory");

db.ref("players").on("value", snapshot => {
  list.innerHTML = "";

  snapshot.forEach(child => {
    const id = child.key;
    const name = child.val().name;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${name}</strong><br>

      <a href="player.html?playerId=${id}" target="_blank">
        Player
      </a>
      |
      <a href="obs.html?playerId=${id}" target="_blank">
        OBS
      </a>
      |
      <a href="obs_integridade.html?playerId=${id}" target="_blank">
        OBS Integridade
      </a>

      <br>
      <button onclick="deletePlayer('${id}')">Excluir</button>
    `;

    list.appendChild(li);
  });
});

function createPlayer() {
  const name = document.getElementById("playerName").value.trim();
  if (!name) return;

  db.ref("players").push({
    name: name
  });

  document.getElementById("playerName").value = "";
}

function deletePlayer(id) {
  if (!confirm("Excluir este player?")) return;
  db.ref("players/" + id).remove();
}

/* =========================
   HISTÓRICO DE ROLAGENS
========================= */

db.ref("players").on("value", snapshot => {

  rollHistory.innerHTML = "";

  snapshot.forEach(playerSnap => {

    const player = playerSnap.val();
    const playerName = player.name || "Player";

    const history = player.rollHistory;

    if (!history) return;

    const playerTitle = document.createElement("h3");
    playerTitle.innerText = playerName;
    
    rollHistory.appendChild(playerTitle);
    
    const clearButton = document.createElement("button");
    clearButton.innerText = "Apagar histórico";
    clearButton.onclick = () => clearRollHistory(playerSnap.key);
    
    rollHistory.appendChild(clearButton);

    history.forEach(rollSnap => {

      const roll = rollSnap.val();

      const box = document.createElement("div");
      box.className = "roll-history-item";

      const quantidade = roll.results ? roll.results.length : 0;

      box.innerHTML = `
        <strong>${quantidade} dado(s)</strong>
        — <strong>${roll.successes} sucesso(s)</strong>
        <br>
        Resultados: ${roll.results ? roll.results.join(" | ") : ""}
        <br>
        <small>${new Date(roll.timestamp).toLocaleString("pt-BR")}</small>
      `;

      rollHistory.appendChild(box);

    });

  });

});

function clearRollHistory(playerId) {

  if (!confirm("Excluir todo o histórico de rolagens deste player?")) {
    return;
  }

  db.ref("players/" + playerId + "/rollHistory").remove();

}
