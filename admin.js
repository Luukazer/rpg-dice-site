const list = document.getElementById("playerList");

db.ref("players").on("value", snapshot => {
  list.innerHTML = "";

  snapshot.forEach(child => {
    const id = child.key;
    const name = child.val().name;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${name}</strong><br>
      <a href="player.html?playerId=${id}" target="_blank">Player</a> |
      <a href="obs.html?playerId=${id}" target="_blank">OBS</a>
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
