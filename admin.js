const list = document.getElementById("playerList");
const historyDiv = document.getElementById("rollHistory");


/* =========================
   LISTA DE PLAYERS
========================= */

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

      <button onclick="deletePlayer('${id}')">
        Excluir
      </button>
    `;

    list.appendChild(li);

  });

});


/* =========================
   HISTÓRICO DE ROLAGENS
========================= */

db.ref("rollHistory").on("value", snapshot => {

  historyDiv.innerHTML = "";

  const rolls = [];

  snapshot.forEach(child => {

    const data = child.val();

    rolls.push({
      id: child.key,
      ...data
    });

  });


  // MAIS RECENTE PRIMEIRO
  rolls.reverse();


  rolls.forEach(roll => {

    const entry = document.createElement("div");

    entry.className = "roll-entry";


    const date = new Date(roll.timestamp);

    const time = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });


    entry.innerHTML = `

      <div class="roll-player">
        ${roll.playerName || "Player"}
      </div>

      <div class="roll-info">
        🎲 ${roll.results.length} dados
      </div>

      <div class="roll-results">
        ${roll.results.join(" • ")}
      </div>

      <div class="roll-successes">
        ${roll.successes} sucessos
      </div>

      <div class="roll-alignment ${getAlignmentClass(roll.alignment)}">
        ${roll.alignment || "Normal"}
      </div>

      <div class="roll-time">
        ${time}
      </div>

    `;


    historyDiv.appendChild(entry);

  });

});


/* =========================
   CLASSE DA TENDÊNCIA
========================= */

function getAlignmentClass(alignment) {

  if (alignment === "Ordem") {
    return "alignment-order";
  }

  if (alignment === "Caos") {
    return "alignment-chaos";
  }

  return "alignment-normal";

}


/* =========================
   LIMPAR HISTÓRICO
========================= */

function clearHistory() {

  if (!confirm("Limpar todo o histórico de rolagens?")) {
    return;
  }

  db.ref("rollHistory").remove();

}


/* =========================
   CRIAR PLAYER
========================= */

function createPlayer() {

  const name =
    document.getElementById("playerName")
      .value
      .trim();

  if (!name) return;


  db.ref("players").push({
    name: name
  });


  document.getElementById("playerName").value = "";

}


/* =========================
   EXCLUIR PLAYER
========================= */

function deletePlayer(id) {

  if (!confirm("Excluir este player?")) {
    return;
  }

  db.ref("players/" + id).remove();

}
