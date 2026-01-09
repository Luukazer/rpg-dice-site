document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const playerId = params.get("playerId");
  if (!playerId) return;

  const ref = db.ref("players/" + playerId);

  // STATUS
  ref.child("damage").on("value", s => {
    if (!s.exists()) return;
    obsDamage.textContent = `${s.val().current}/${s.val().total}`;
  });

  ref.child("pressure").on("value", s => {
    if (!s.exists()) return;
    obsPressure.textContent = s.val().current;
  });

  // DADOS (igual antes)
  const rollRef = ref.child("lastRoll");
  let last = 0;

  rollRef.on("value", snap => {
    if (!snap.exists()) return;
    const d = snap.val();
    if (d.timestamp <= last) return;
    last = d.timestamp;

    successCount.textContent = d.successes;
    diceWrapper.classList.add("show");
    diceVideo.currentTime = 0;
    diceVideo.play();

    setTimeout(() => {
      diceWrapper.classList.remove("show");
      diceVideo.pause();
    }, 7000);
  });
});
