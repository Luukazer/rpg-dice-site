const params = new URLSearchParams(window.location.search);
const playerId = params.get("playerId");

if (!playerId) throw new Error("OBS sem playerId");

const rollRef = db.ref("players/" + playerId + "/lastRoll");

const wrapper = document.getElementById("diceWrapper");
const video = document.getElementById("diceVideo");
const count = document.getElementById("successCount");

let lastTimestamp = 0;

rollRef.on("value", snapshot => {
  if (!snapshot.exists()) return;

  const data = snapshot.val();
  if (data.timestamp <= lastTimestamp) return;
  lastTimestamp = data.timestamp;

  // reset
  wrapper.classList.remove("show");
  video.pause();
  video.currentTime = 0;

  // start
  wrapper.classList.add("show");
  video.play();
  count.textContent = data.successes;

  // hide everything together
  setTimeout(() => {
    wrapper.classList.remove("show");
    video.pause();
    video.currentTime = 0;
  }, 7000);
});
