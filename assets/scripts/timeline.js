(function initTimeline() {
  const dataEl = document.getElementById("tlineData");
  if (!dataEl) return;

  const rail = document.getElementById("tlineRail");
  const markersEl = document.getElementById("tlineMarkers");
  const dotsEl = document.getElementById("tlineDots");

  const range = document.getElementById("tlineRange");
  const bubble = document.getElementById("tlineBubble");
  const caret = document.getElementById("tlineBubbleCaret");
  const fill = document.getElementById("tlineFill");

  const detail = document.getElementById("tlineDetail");
  const detailTitle = document.getElementById("tlineDetailTitle");
  const detailDate = document.getElementById("tlineDetailDate");
  const detailBody = document.getElementById("tlineDetailBody");
  const detailSub = document.getElementById("tlineDetailSub");
  const detailSubList = document.getElementById("tlineDetailSubList");
  const detailClose = document.getElementById("tlineDetailClose");

  let data;
  try { data = JSON.parse(dataEl.textContent); }
  catch (e) { console.error("Bad timeline JSON:", e); return; }

  const start = parseISO(data.start);
  const end = parseISO(data.end);
  const events = (data.events || []).map(e => ({
    ...e,
    _d: parseISO(e.date),
    _re: e.rangeEnd ? parseISO(e.rangeEnd) : null
  })).sort((a,b) => a._d - b._d);

  const totalDays = daysBetween(start, end);
  range.min = 0;
  range.max = totalDays;
  range.value = totalDays;

  // clear old
  markersEl.innerHTML = "";
  if (dotsEl) dotsEl.innerHTML = "";

  // render markers + dots
  events.forEach((ev, idx) => {
    const leftPct = pctForDate(ev._d, start, end);

    // marker wrapper
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "tline-marker";
    marker.style.left = leftPct + "%";
    marker.setAttribute("aria-label", `${ev.title} (${formatHuman(ev.date, ev.rangeEnd)})`);

    // dot
    const dot = document.createElement("span");
    dot.className = "tline-dot";
    marker.appendChild(dot);

    // tooltip
    const tip = document.createElement("div");
    const side = (ev.side || (idx % 2 ? "bottom" : "top")).toLowerCase();
    tip.className = "tline-tip " + (side === "bottom" ? "tline-tip--bottom" : "tline-tip--top");
    tip.innerHTML = `<strong>${escapeHtml(ev.title)}</strong><div>${escapeHtml(formatHuman(ev.date, ev.rangeEnd))}</div>`;
    marker.appendChild(tip);

    marker.addEventListener("click", () => openDetail(ev));
    markersEl.appendChild(marker);

    // mini dot row
    if (dotsEl) {
      const md = document.createElement("span");
      md.className = "tline-miniDot";
      md.style.left = leftPct + "%";
      dotsEl.appendChild(md);
    }
  });

  // slider updates bubble
  function syncSlider() {
    const v = Number(range.value || 0);
    const d = addDays(start, v);
    const p = (v / totalDays) * 100;

    bubble.textContent = formatDateShort(d);
    bubble.style.setProperty("--p", p + "%");
    caret.style.setProperty("--p", p + "%");

    // fill style: your bar uses left/width; we mimic your original
    fill.style.left = p + "%";
    fill.style.width = (100 - p) + "%";
  }

  range.addEventListener("input", syncSlider);
  syncSlider();

  // detail close
  detailClose?.addEventListener("click", () => {
    detail.hidden = true;
  });

  function openDetail(ev) {
    detailTitle.textContent = ev.title || "";
    detailDate.textContent = formatHuman(ev.date, ev.rangeEnd);

    detailBody.textContent = "";
    if (ev.body) {
      // allow simple text; if you later want HTML, we can whitelist/sanitize
      detailBody.textContent = ev.body;
    } else {
      detailBody.textContent = "No details yet.";
    }

    // sub timeline
    const sub = Array.isArray(ev.sub) ? ev.sub : [];
    detailSubList.innerHTML = "";
    if (sub.length) {
      sub.forEach(item => {
        const li = document.createElement("li");
        const t = document.createElement("time");
        t.textContent = item.date ? item.date : "";
        li.appendChild(t);
        li.appendChild(document.createTextNode(" " + (item.text || "")));
        detailSubList.appendChild(li);
      });
      detailSub.hidden = false;
    } else {
      detailSub.hidden = true;
    }

    detail.hidden = false;
    detail.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // helpers
  function parseISO(s) {
    const [y,m,d] = String(s).split("-").map(Number);
    return new Date(Date.UTC(y, (m||1)-1, d||1));
  }
  function daysBetween(a,b) {
    const ms = 24*60*60*1000;
    return Math.max(0, Math.round((b - a)/ms));
  }
  function addDays(a, days) {
    const d = new Date(a);
    d.setUTCDate(d.getUTCDate() + days);
    return d;
  }
  function pctForDate(d, start, end) {
    const total = (end - start);
    const pos = (d - start);
    if (total <= 0) return 0;
    return Math.min(100, Math.max(0, (pos / total) * 100));
  }
  function formatDateShort(d) {
    // e.g. "01 Oct 2025"
    return d.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric", timeZone:"UTC" });
  }
  function formatHuman(startISO, rangeEndISO) {
    if (!rangeEndISO) return startISO;
    return `${startISO} – ${rangeEndISO}`;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    })[c]);
  }
})();
