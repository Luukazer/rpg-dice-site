const params = new URLSearchParams(window.location.search);
const playerId = params.get("playerId");

if (!playerId) {
  throw new Error("OBS sem playerId");
}

const rollRef = db.ref("players/" + playerId + "/lastRoll");

const video = document.getElementById("diceVideo");
const result = document.getElementById("result");
const count = document.getElementById("successCount");

let lastTimestamp = 0;

rollRef.on("value", snapshot => {
  if (!snapshot.exists()) return;

  const data = snapshot.val();
  if (data.timestamp <= lastTimestamp) return;
  lastTimestamp = data.timestamp;

  result.classList.remove("show");
  video.currentTime = 0;
  video.play();

  setTimeout(() => {
    count.textContent = data.successes;
    result.classList.add("show");
  }, 1000);

  setTimeout(() => {
    result.classList.remove("show");
  }, 7000);
});
