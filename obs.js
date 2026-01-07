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

// estado inicial (IMPORTANTE pro OBS)
video.style.display = "none";
result.style.display = "none";

rollRef.on("value", snapshot => {
  if (!snapshot.exists()) return;

  const data = snapshot.val();
  if (!data.timestamp || data.timestamp <= lastTimestamp) return;
  lastTimestamp = data.timestamp;

  // RESET VISUAL
  result.classList.remove("show");
  result.style.display = "none";

  video.style.display = "block";
  video.currentTime = 0;
  video.play();

  // texto aparece 1s depois
  setTimeout(() => {
    count.textContent = data.successes;
    result.style.display = "block";
    result.classList.add("show");
  }, 1000);

  // tudo some junto no final do vídeo
  setTimeout(() => {
    result.classList.remove("show");
    result.style.display = "none";

    video.pause();
    video.currentTime = 0;
    video.style.display = "none";
  }, 7000);
});
