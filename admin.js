const list = document.getElementById("playerList");

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

const rollHistoryDiv = document.getElementById("rollHistory");

db.ref("rollHistory").on("value", snapshot => {

  rollHistoryDiv.innerHTML = "";

  const rolls = [];

  snapshot.forEach(child => {
    rolls.push({
      id: child.key,
      ...child.val()
    });
  });

  // Mais recentes primeiro
  rolls.reverse();

  rolls.forEach(roll => {

    const player = document.querySelector(
      `a[href="player.html?playerId=${roll.playerId}"]`
    );

    let playerName = "Player desconhecido";

    if (player) {
      playerName = player.parentElement.querySelector("strong")?.innerText
        || "Player desconhecido";
    }

    const div = document.createElement("div");

    const date = new Date(roll.timestamp);

    div.innerHTML = `
      <strong>${playerName}</strong>
      <br>
      🎲 ${roll.results.length} dados
      |
      ✅ ${roll.successes} sucessos
      <br>
      Resultado: ${roll.results.join(", ")}
      <br>
      <small>${date.toLocaleString("pt-BR")}</small>
      <br>
      <button onclick="deleteRoll('${roll.id}')">
        Excluir
      </button>
      <hr>
    `;

    rollHistoryDiv.appendChild(div);
  });

});


/* =========================
   EXCLUIR ROLAGEM
========================= */

function deleteRoll(id) {

  if (!confirm("Excluir esta rolagem?")) return;

  db.ref("rollHistory/" + id).remove();

}


/* =========================
   LIMPAR HISTÓRICO
========================= */

function clearRollHistory() {

  if (!confirm("Tem certeza que deseja apagar todo o histórico de rolagens?")) {
    return;
  }

  db.ref("rollHistory").remove();

}
