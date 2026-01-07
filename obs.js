const params = new URLSearchParams(window.location.search);
const playerId = params.get("playerId");

if (!playerId) {
  console.error("OBS sem playerId");
  throw new Error("OBS sem playerId");
}

const rollRef = db.ref("players/" + playerId + "/lastRoll");

const wrapper = document.getElementById("diceWrapper");
const video = document.getElementById("diceVideo");
const count = document.getElementById("successCount");

if (!wrapper || !video || !count) {
  console.error("Elemento do OBS não encontrado", {
    wrapper,
    video,
    count
  });
  throw new Error("HTML do OBS incompatível com obs.js");
}

let lastTimestamp = 0;

rollRef.on("value", snapshot => {
  if (!snapshot.exists()) return;

  const data = snapshot.val();
  if (!data.timestamp || data.timestamp <= lastTimestamp) return;
  lastTimestamp = data.timestamp;

  // reset
  wrapper.classList.remove("show");
  video.pause();
  video.currentTime = 0;

  // força reflow (bug real de browser/OBS)
  void wrapper.offsetWidth;

  // mostra tudo
  count.textContent = data.successes;
  wrapper.classList.add("show");
  video.play();

  // esconde tudo junto
  setTimeout(() => {
    wrapper.classList.remove("show");
    video.pause();
    video.currentTime = 0;
  }, 7000);
});
