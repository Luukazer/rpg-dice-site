const playerId = new URLSearchParams(location.search).get("playerId");
const ref = db.ref("players/" + playerId + "/lastRoll");

const video = document.getElementById("vid");
const result = document.getElementById("result");
const count = document.getElementById("count");

let lastTimestamp = 0;

ref.on("value", snap => {
  if (!snap.exists()) return;
  const data = snap.val();
  if (data.timestamp <= lastTimestamp) return;
  lastTimestamp = data.timestamp;

  video.currentTime = 0;
  video.play();

  setTimeout(() => {
    count.innerText = data.successes;
    result.classList.add("show");
  }, 1000);

  setTimeout(() => {
    result.classList.remove("show");
  }, 7000);
});
