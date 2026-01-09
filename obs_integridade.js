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

playerRef.child("stats").on("value", snap => {
  const data = snap.val();
  if (!data) return;

  /* ========= DANO ========= */
  const dCur = data.damageCurrent ?? 0;
  const dTot = data.damageTotal ?? 1;

  dmgCurEl.textContent = dCur;
  dmgTotEl.textContent = dTot;

  if (lastDamage !== null && dCur !== lastDamage) {
    triggerImpact(dmgEl);
  }

  toggleWarning(dmgEl, dTot > 0 && dCur / dTot >= 0.8);
  lastDamage = dCur;

  /* ========= PRESSÃO ========= */
  const pCur = data.pressureCurrent ?? 0;
  const pTot = data.pressureTotal ?? 1;

  presCurEl.textContent = pCur;

  if (lastPressure !== null && pCur !== lastPressure) {
    triggerImpact(presEl);
  }

  toggleWarning(presEl, pTot > 0 && pCur / pTot >= 0.8);
  lastPressure = pCur;
});

/* =========================
   HELPERS
========================= */

function triggerImpact(el) {
  el.classList.remove("impact");
  void el.offsetWidth; // força reflow
  el.classList.add("impact");
}

function toggleWarning(el, active) {
  el.classList.toggle("warning", active);
}
