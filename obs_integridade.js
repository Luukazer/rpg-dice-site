const params = new URLSearchParams(window.location.search);
const playerId = params.get("playerId");

if (!playerId) throw new Error("OBS Integridade sem playerId");

const playerRef = db.ref("players/" + playerId);

// ELEMENTOS
const dmgCur = document.getElementById("obsDamageCurrent");
const dmgTot = document.getElementById("obsDamageTotal");
const presCur = document.getElementById("obsPressureCurrent");

// ESCUTA DADOS DO PLAYER
playerRef.on("value", snap => {
  const data = snap.val();
  if (!data) return;

  if (data.damage) {
    dmgCur.textContent = data.damage.current ?? 0;
    dmgTot.textContent = data.damage.total ?? 0;
  }

  if (data.pressure) {
    presCur.textContent = data.pressure.current ?? 0;
  }
});
