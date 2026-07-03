/* ---------- data ---------- */
const TERMS = [
  { term: "Hypertension", category: "Diagnosis", plain: "Blood pressure that's higher than it should be, on an ongoing basis.", sentence: "“Your hypertension means your blood pressure runs high — we'll work on bringing it down.”" },
  { term: "Myocardial infarction", category: "Diagnosis", plain: "A heart attack — part of the heart muscle was cut off from blood flow.", sentence: "“What you had was a myocardial infarction — a heart attack.”" },
  { term: "Benign", category: "Diagnosis", plain: "Not cancerous, and not likely to cause serious harm.", sentence: "“The lump came back benign, so it's not cancer.”" },
  { term: "Chronic", category: "Diagnosis", plain: "Long-lasting or ongoing, rather than something that resolves quickly.", sentence: "“This is a chronic condition — something we'll manage over time, not cure overnight.”" },
  { term: "Metastasis", category: "Diagnosis", plain: "Cancer that has spread from where it started to another part of the body.", sentence: "“The scan shows metastasis, meaning the cancer has spread beyond the original site.”" },
  { term: "Asymptomatic", category: "Tests & Results", plain: "Not currently causing any symptoms you'd notice.", sentence: "“You're asymptomatic right now — you don't feel it, but the condition can still be there.”" },
  { term: "Prognosis", category: "Tests & Results", plain: "The expected course or outcome of a condition.", sentence: "“Your prognosis is good — we expect a positive outcome.”" },
  { term: "Idiopathic", category: "Tests & Results", plain: "A cause that isn't known yet, even after testing.", sentence: "“It's idiopathic — we don't yet know what's causing it.”" },
  { term: "Comorbidity", category: "Tests & Results", plain: "A second condition you have alongside the main one being treated.", sentence: "“Your diabetes is a comorbidity here — another condition alongside the main diagnosis.”" },
  { term: "Contraindicated", category: "Medication", plain: "Not safe to use, usually because of another condition or medicine.", sentence: "“This medication is contraindicated with what you're already taking — they can't mix safely.”" },
  { term: "Titrate", category: "Medication", plain: "To slowly raise or lower a dose until it's right for you.", sentence: "“We'll titrate your dose, adjusting it gradually until we find the right amount.”" },
  { term: "Palliative care", category: "Medication", plain: "Care focused on comfort and quality of life, rather than curing the illness.", sentence: "“We're moving to palliative care, which focuses on keeping you comfortable.”" },
  { term: "Biopsy", category: "Procedure", plain: "Removing a small tissue sample so it can be tested.", sentence: "“We'll do a biopsy — take a small sample and check it under a microscope.”" },
  { term: "Catheterization", category: "Procedure", plain: "Threading a thin, flexible tube through a vessel to check or treat the heart.", sentence: "“You'll need a catheterization to get a closer look at your heart's blood vessels.”" },
  { term: "Intubation", category: "Procedure", plain: "Placing a tube in the airway to help someone breathe.", sentence: "“Intubation just means placing a breathing tube for the procedure.”" }
];

const byTerm = Object.fromEntries(TERMS.map(t => [t.term.toLowerCase(), t]));

/* ---------- datalist ---------- */
const datalist = document.getElementById("term-list");
TERMS.forEach(t => {
  const opt = document.createElement("option");
  opt.value = t.term;
  datalist.appendChild(opt);
});

/* ---------- translator ---------- */
const form = document.getElementById("translator-form");
const input = document.getElementById("term-input");
const resultBox = document.getElementById("translation-result");
const hint = document.getElementById("hero-hint");

form.addEventListener("submit", e => {
  e.preventDefault();
  const key = input.value.trim().toLowerCase();
  const match = byTerm[key] || TERMS.find(t => t.term.toLowerCase().includes(key) && key.length > 2);

  if (match) {
    document.getElementById("result-category").textContent = match.category;
    document.getElementById("result-term").textContent = match.term;
    document.getElementById("result-plain").textContent = match.plain;
    document.getElementById("result-sentence").textContent = match.sentence;
    resultBox.hidden = false;
    hint.hidden = true;
  } else {
    resultBox.hidden = true;
    hint.hidden = false;
    hint.textContent = key
      ? `No exact match for “${input.value.trim()}” — try one of the fifteen terms in the index below.`
      : "Type a term above, then press Translate.";
  }
});

/* ---------- card grid ---------- */
const grid = document.getElementById("card-grid");

function renderCards(filter) {
  grid.innerHTML = "";
  const list = filter === "all" ? TERMS : TERMS.filter(t => t.category === filter);
  list.forEach(t => {
    const card = document.createElement("button");
    card.className = "index-card";
    card.type = "button";
    card.setAttribute("aria-pressed", "false");
    card.innerHTML = `
      <span class="punch" aria-hidden="true"></span>
      <span class="card-inner">
        <span class="card-face card-front">
          <span class="card-cat">${t.category}</span>
          <span class="card-term">${t.term}</span>
          <span class="card-flip-hint">tap to flip →</span>
        </span>
        <span class="card-face card-back">
          <span class="card-plain">${t.plain}</span>
        </span>
      </span>
    `;
    card.addEventListener("click", () => {
      const flipped = card.classList.toggle("flipped");
      card.setAttribute("aria-pressed", String(flipped));
    });
    grid.appendChild(card);
  });
}
renderCards("all");

/* ---------- tabs ---------- */
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    renderCards(btn.dataset.cat);
  });
});

/* ---------- rewrite demo: jargon note ---------- */
const original = document.getElementById("rewrite-original");
const noteParts = [
  "Patient presents with acute exacerbation of chronic ",
  { term: "Hypertension" },
  ". Labs indicate mild renal ",
  { term: "Comorbidity" },
  ", ",
  { term: "Asymptomatic" },
  " at present. Recommend ",
  { term: "Titrate" },
  "-style adjustment of antihypertensive regimen; ACE inhibitor ",
  { term: "Contraindicated" },
  " given renal profile. ",
  { term: "Prognosis" },
  " favorable with adherence."
];

const p = document.createElement("p");
noteParts.forEach(part => {
  if (typeof part === "string") {
    p.appendChild(document.createTextNode(part));
  } else {
    const data = byTerm[part.term.toLowerCase()];
    const span = document.createElement("span");
    span.className = "jargon";
    span.textContent = data.term;
    span.tabIndex = 0;
    span.setAttribute("role", "button");
    span.setAttribute("aria-expanded", "false");
    const tip = document.createElement("span");
    tip.className = "jargon-tip";
    tip.textContent = data.plain;
    span.appendChild(tip);
    const toggle = () => {
      const open = span.classList.toggle("open");
      span.setAttribute("aria-expanded", String(open));
    };
    span.addEventListener("click", toggle);
    span.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
    p.appendChild(span);
  }
});
original.appendChild(p);

/* ---------- reveal full rewrite ---------- */
const revealBtn = document.getElementById("reveal-btn");
const plainBlock = document.getElementById("rewrite-plain");
revealBtn.addEventListener("click", () => {
  const showing = !plainBlock.hidden;
  plainBlock.hidden = showing;
  revealBtn.textContent = showing ? "Show the plain-English version" : "Hide the plain-English version";
  revealBtn.classList.toggle("is-open", !showing);
});
