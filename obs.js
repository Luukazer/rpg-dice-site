console.log("OBS JS NOVO CARREGADO");


function initOBS() {
  const params = new URLSearchParams(window.location.search);
  const playerId = params.get("playerId");

  if (!playerId) throw new Error("OBS sem playerId");

  const rollRef = db.ref("players/" + playerId + "/lastRoll");

  const wrapper = document.getElementById("diceWrapper");
  const video = document.getElementById("diceVideo");
  const count = document.getElementById("successCount");
  const alignment = document.getElementById("alignment");

  if (!wrapper || !video || !count || !alignment) {
    console.error("Elemento do OBS não encontrado", {
      wrapper,
      video,
      count,
      alignment
    });
    return;
  }

  let lastTimestamp = 0;

  rollRef.on("value", snapshot => {
    if (!snapshot.exists()) return;

    const data = snapshot.val();
    if (!data.timestamp || data.timestamp <= lastTimestamp) return;
    lastTimestamp = data.timestamp;

    wrapper.classList.remove("show");
    video.pause();
    video.currentTime = 0;

    void wrapper.offsetWidth;

    count.textContent = data.successes;

    // LIMPA AS BOLINHAS DA ROLAGEM ANTERIOR
    alignment.innerHTML = "";

    // CRIA UMA BOLINHA PARA CADA 12 E CADA 1
    if (Array.isArray(data.results)) {

      data.results.forEach(result => {

        const dot = document.createElement("span");

        if (result === 12) {
          dot.classList.add("order-dot");
          alignment.appendChild(dot);
        }

        if (result === 1) {
          dot.classList.add("chaos-dot");
          alignment.appendChild(dot);
        }

      });

    }

    wrapper.classList.add("show");
    video.play();

    setTimeout(() => {
      wrapper.classList.remove("show");
      video.pause();
      video.currentTime = 0;
    }, 7000);
  });
}

document.addEventListener("DOMContentLoaded", initOBS);
