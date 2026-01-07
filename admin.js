const list = document.getElementById("playerList");

db.ref("players").on("value", snap => {
  list.innerHTML = "";
  snap.forEach(child => {
    const id = child.key;
    const name = child.val().name;
    const li = document.createElement("li");

    li.innerHTML = `
      ${name}<br>
      <a href="player.html?playerId=${id}" target="_blank">Player</a> |
      <a href="obs.html?playerId=${id}" target="_blank">OBS</a>
      <button onclick="deletePlayer('${id}')">X</button>
    `;
    list.appendChild(li);
  });
});

function createPlayer() {
  const name = document.getElementById("playerName").value;
  if (!name) return;
  db.ref("players").push({ name });
}

function deletePlayer(id) {
  db.ref("players/" + id).remove();
}
