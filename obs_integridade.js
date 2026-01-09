const params = new URLSearchParams(window.location.search);
const playerId = params.get("playerId");

if (!playerId) throw new Error("OBS Integridade sem playerId");

const playerRef = db.ref("players/" + playerId);

// ELEMENTOS
const dmgEl = document.querySelector(".obs-stat.damage");
const presEl = document.querySelector(".obs-stat.pressure");

const dmgCurEl = document.getElementById("obsDamageCurrent");
const dmgTotEl = document.getElementById("obsDamageTotal");
const presCurEl = document.getElementById("obsPressureCurrent");

// ESTADO ANTERIOR
let lastDamage = null;
let lastPressure = null;

playerRef.on("value", snap => {
  const data = snap.val();
  if (!data) return;

  /* ========= DANO ========= */
  if (data.damage) {
    const cur = data.damage.current ?? 0;
    const tot = data.damage.total ?? 1;

    dmgCurEl.textContent = cur;
    dmgTotEl.textContent = tot;

    // tremida sempre que mudar
    if (lastDamage !== null && cur !== lastDamage) {
      triggerShake(dmgEl);
    }

    // alerta 80%
    toggleWarning(dmgEl, cur / tot >= 0.8);

    lastDamage = cur;
  }

  /* ========= PRESSÃO ========= */
  if (data.pressure) {
    const cur = data.pressure.current ?? 0;
    const tot = data.pressure.total ?? 1;

    presCurEl.textContent = cur;

    if (lastPressure !== null && cur !== lastPressure) {
      triggerShake(presEl);
    }

    toggleWarning(presEl, cur / tot >= 0.8);

    lastPressure = cur;
  }
});

/* =========================
   HELPERS
========================= */

function triggerShake(el) {
  el.classList.remove("shake");
  void el.offsetWidth; // força reflow
  el.classList.add("shake");
}

function toggleWarning(el, active) {
  el.classList.toggle("warning", active);
}
