const list = document.getElementById("playerList");
const rollHistory = document.getElementById("rollHistory");

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

db.ref("players").on("value", snapshot => {

  list.innerHTML = "";
  rollHistory.innerHTML = "";

  snapshot.forEach(playerSnap => {

    const id = playerSnap.key;
    const player = playerSnap.val();
    const playerName = player.name || "Player";

    /* =========================
       LISTA DE PLAYERS
    ========================= */

    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${playerName}</strong><br>

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


    /* =========================
       HISTÓRICO DESTE PLAYER
    ========================= */

    const playerTitle = document.createElement("h3");
    playerTitle.innerText = playerName;

    rollHistory.appendChild(playerTitle);

    const clearButton = document.createElement("button");
    clearButton.innerText = "Apagar histórico";
    clearButton.onclick = () => clearRollHistory(id);

    rollHistory.appendChild(clearButton);

    playerSnap.child("rollHistory").forEach(rollSnap => {

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
