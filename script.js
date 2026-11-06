const $ = id => document.getElementById(id);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

/* ---------- Gallery + lightbox ---------- */
let filter = "All", shown = [], cur = 0;
const media = g => g.src ? `<img src="${g.src}" alt="${g.title}" loading="lazy">` : g.emoji;
function drawGallery() {
  const cats = ["All", ...new Set(gallery.map(g => g.cat))];
  $("filters").innerHTML = cats.map(c => `<button aria-pressed="${c === filter}" data-c="${c}">${c}</button>`).join("");
  shown = gallery.filter(g => filter === "All" || g.cat === filter);
  $("grid").innerHTML = shown.map((g, i) => `<button class="photo" data-i="${i}"><div class="thumb">${media(g)}</div><span>${g.title}</span><small>${g.cat} · ${g.author}</small></button>`).join("");
}
$("filters").onclick = e => { if (e.target.dataset.c) { filter = e.target.dataset.c; drawGallery(); } };
$("grid").onclick = e => { const b = e.target.closest(".photo"); if (b) openLb(+b.dataset.i); };
function openLb(i) {
  cur = (i + shown.length) % shown.length; const g = shown[cur];
  $("lbImg").innerHTML = media(g);
  $("lbCap").innerHTML = `<b>${g.title}</b> (${g.cat}, by ${g.author})<br>${g.text}`;
  $("lb").hidden = false; $("lbClose").focus();
}
$("lbClose").onclick = () => $("lb").hidden = true;
$("lbPrev").onclick = () => openLb(cur - 1);
$("lbNext").onclick = () => openLb(cur + 1);
$("lb").onclick = e => { if (e.target === $("lb")) $("lb").hidden = true; };
document.onkeydown = e => {
  if ($("lb").hidden) return;
  if (e.key === "Escape") $("lb").hidden = true;
  if (e.key === "ArrowLeft") openLb(cur - 1);
  if (e.key === "ArrowRight") openLb(cur + 1);
};
drawGallery();

/* ---------- Game 1: Sort the waste ---------- */
const bins = { plastic: "Plastic & metal", paper: "Paper", glass: "Glass", organic: "Organic" };
const things = [
  ["🧴", "Shampoo bottle", "plastic"], ["🥫", "Tin can", "plastic"], ["🛍️", "Plastic bag", "plastic"],
  ["📰", "Newspaper", "paper"], ["📦", "Cardboard box", "paper"], ["📄", "Office paper", "paper"],
  ["🍾", "Glass bottle", "glass"], ["🫙", "Empty jar", "glass"],
  ["🍌", "Banana peel", "organic"], ["☕", "Coffee grounds", "organic"], ["🍎", "Apple core", "organic"], ["🥚", "Egg shells", "organic"]
];
let sQ, sI, sScore, sStreak, sLock;
function sStart() {
  sQ = shuffle(things).slice(0, 10); sI = 0; sScore = 0; sStreak = 0; sLock = false;
  $("sBins").innerHTML = Object.entries(bins).map(([k, v]) => `<button class="bin" data-k="${k}">${v}</button>`).join("");
  $("sRestart").hidden = true; $("sMsg").textContent = ""; sShow();
}
function sShow() {
  $("sRound").textContent = sI + 1; $("sScore").textContent = sScore; $("sStreak").textContent = sStreak;
  $("sItem").innerHTML = `${sQ[sI][0]}<small>${sQ[sI][1]}</small>`; sLock = false;
}
$("sBins").onclick = e => {
  const k = e.target.dataset.k; if (!k || sLock) return; sLock = true;
  const right = sQ[sI][2] === k, m = $("sMsg");
  if (right) { sScore++; sStreak++; m.className = "msg ok"; m.textContent = "Correct!" + (sStreak >= 3 ? ` 🔥 ${sStreak} in a row` : ""); }
  else { sStreak = 0; m.className = "msg no"; m.textContent = `Not quite: ${sQ[sI][1]} goes to “${bins[sQ[sI][2]]}”.`; }
  $("sScore").textContent = sScore; $("sStreak").textContent = sStreak;
  setTimeout(() => {
    if (++sI < sQ.length) { m.textContent = ""; sShow(); }
    else {
      $("sItem").innerHTML = sScore >= 8 ? "🏆" : sScore >= 5 ? "🌿" : "🌱";
      m.className = "msg"; m.textContent = `Finished! You scored ${sScore}/10.`;
      $("sRestart").hidden = false; sLock = true;
    }
  }, 1100);
};
$("sRestart").onclick = sStart; sStart();

/* ---------- Game 2: Memory ---------- */
const icons = ["♻️", "🌱", "💧", "🔄", "🛒", "🚲", "🌍", "🍎"];
let first = null, busy = false, moves = 0, pairs = 0;
function mStart() {
  moves = 0; pairs = 0; first = null; busy = false;
  $("mMoves").textContent = 0; $("mPairs").textContent = 0; $("mMsg").textContent = "";
  $("mBest").textContent = store.get("sdg12-best", "–");
  $("mBoard").innerHTML = shuffle([...icons, ...icons]).map(s => `<button class="tile" data-s="${s}" aria-label="Card">?</button>`).join("");
}
$("mBoard").onclick = e => {
  const t = e.target.closest(".tile");
  if (!t || busy || t === first || t.classList.contains("done")) return;
  t.classList.add("up"); t.textContent = t.dataset.s;
  if (!first) { first = t; return; }
  moves++; $("mMoves").textContent = moves; busy = true;
  if (first.dataset.s === t.dataset.s) {
    first.classList.add("done"); t.classList.add("done"); first = null; busy = false; $("mPairs").textContent = ++pairs;
    if (pairs === 8) {
      const best = store.get("sdg12-best", 999);
      if (moves < best) store.set("sdg12-best", moves);
      $("mBest").textContent = Math.min(best, moves);
      $("mMsg").textContent = `You found every pair in ${moves} moves. 🎉`;
    }
  } else setTimeout(() => {
    [first, t].forEach(x => { x.classList.remove("up"); x.textContent = "?"; }); first = null; busy = false;
  }, 800);
};
$("mRestart").onclick = mStart; mStart();

/* ---------- Quiz (answer = index of the correct option, starting at 0) ---------- */
const questions = [
  { q: "Which goal is “Responsible Consumption and Production”?", options: ["SDG 6", "SDG 12", "SDG 13", "SDG 14"], answer: 1 },
  { q: "Roughly how much of the world’s food is lost or wasted?", options: ["About 5%", "About 10%", "About one third", "About 70%"], answer: 2 },
  { q: "Which of the three R’s should come first?", options: ["Recycle", "Reduce", "Rot", "Resell"], answer: 1 },
  { q: "Your headphones are broken. What is the most sustainable first step?", options: ["Throw them away", "Try to repair them", "Bury them", "Buy three spare pairs"], answer: 1 },
  { q: "What does a circular economy aim for?", options: ["Making more new products", "Keeping materials in use for as long as possible", "Shipping goods faster", "Banning all packaging"], answer: 1 }
];
let qi = 0, qs = 0;
function qShow() {
  const q = questions[qi];
  $("quizBox").innerHTML = `<p class="note">Question ${qi + 1} of ${questions.length}</p><p class="q">${q.q}</p><div class="opts">${q.options.map((o, i) => `<button class="opt" data-i="${i}">${o}</button>`).join("")}</div><p id="qMsg" class="msg"></p>`;
}
$("quizBox").onclick = e => {
  const b = e.target.closest(".opt");
  if (b) {
    const i = +b.dataset.i, a = questions[qi].answer;
    document.querySelectorAll(".opt").forEach(x => x.disabled = true);
    document.querySelector(`.opt[data-i="${a}"]`).classList.add("right");
    if (i === a) qs++; else b.classList.add("wrong");
    $("qMsg").innerHTML = (i === a ? "Correct!" : "Not quite.") + ` <button class="btn ghost" id="qNext">${qi + 1 < questions.length ? "Next question" : "See result"}</button>`;
  } else if (e.target.id === "qNext") {
    if (++qi < questions.length) qShow();
    else $("quizBox").innerHTML = `<p class="q">Your score: ${qs} / ${questions.length}</p><p>${qs === 5 ? "Perfect! You are a sustainability expert." : qs >= 3 ? "Well done! A few more facts to learn." : "Good start. Try again after exploring the gallery."}</p><button class="btn" id="qAgain">Try again</button>`;
  } else if (e.target.id === "qAgain") { qi = 0; qs = 0; qShow(); }
};
qShow();

/* ---------- Poll (demo, saved only in this browser) ---------- */
const choices = ["Bring my own bag and bottle", "Repair instead of replace", "Plan meals to avoid food waste", "Buy second-hand first"];
let votes = store.get("sdg12-votes", choices.map(() => 0));
if (votes.length !== choices.length) votes = choices.map(() => 0);
$("pollOpts").innerHTML = choices.map((c, i) => `<button class="opt" data-i="${i}">${c}</button>`).join("");
function pollDraw() {
  const total = votes.reduce((a, b) => a + b, 0);
  $("pollChart").innerHTML = total ? choices.map((c, i) => { const p = Math.round(votes[i] / total * 100); return `<div class="bar"><span>${c}</span><div><i style="width:${p}%"></i></div><b>${p}%</b></div>`; }).join("") + `<p class="note">${total} vote(s) in this browser</p>` : `<p class="note">Vote to see the chart.</p>`;
}
$("pollOpts").onclick = e => { const b = e.target.closest(".opt"); if (!b) return; votes[+b.dataset.i]++; store.set("sdg12-votes", votes); pollDraw(); };
$("pollReset").onclick = () => { votes = choices.map(() => 0); store.set("sdg12-votes", votes); pollDraw(); };
pollDraw();
