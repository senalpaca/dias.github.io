document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");
  initNavMenu();
  initTimelinePro();
  initEvidenceModule();
  initPdfViewer();
});

function initNavMenu() {
  const nav = document.getElementById("nav");
  const hamburger = document.querySelector(".hamburger");

  // Mobile hamburger toggle
  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }
  // Close mobile with ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      nav.classList.remove("open");
      hamburger?.focus();
    }
  });

  const items = Array.from(document.querySelectorAll(".menu-item.has-submenu"));

  // Helper: is 'child' inside 'parent'?
  const contains = (parent, child) => parent && child && parent.contains(child);

  // Desktop pointer behavior (no flicker)
  items.forEach((item) => {
    let closeTimer = null;

    const open = () => {
      clearTimeout(closeTimer);
      item.classList.add("open");
    };
    const scheduleClose = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => item.classList.remove("open"), 180);
    };

    // Use pointer events for better device coverage
    item.addEventListener("pointerenter", open);
    item.addEventListener("pointerleave", (e) => {
      // Only close if pointer actually left the whole item (including submenu)
      const toEl = e.relatedTarget;
      if (!contains(item, toEl)) scheduleClose();
    });

    // Keyboard: keep open while focus is inside
    item.addEventListener("focusin", open);
    item.addEventListener("focusout", (e) => {
      if (!contains(item, e.relatedTarget)) scheduleClose();
    });
  });

  // Touch behavior: first tap opens, second tap follows the link
  // We only enable this on touch-capable devices
  const isTouch = window.matchMedia("(hover: none)").matches;
  if (isTouch) {
    items.forEach((item) => {
      const topLink = item.querySelector(".menu-toplink");
      if (!topLink) return;

      let armed = false; // first tap opens; second tap navigates

      topLink.addEventListener("click", (e) => {
        // If submenu is not open, open it and block navigation once
        if (!item.classList.contains("open")) {
          e.preventDefault();
          // close others
          items.forEach(i => { if (i !== item) i.classList.remove("open"); });
          item.classList.add("open");
          armed = true;
          return;
        }
        // If it is open: first click after opening navigates
        if (armed) {
          armed = false; // allow navigation
          return;        // let the browser follow the link
        }
      });

      // Close when tapping anywhere outside header
      document.addEventListener("pointerdown", (ev) => {
        const header = document.getElementById("header");
        if (!header.contains(ev.target)) {
          items.forEach(i => i.classList.remove("open"));
          armed = false;
        }
      });
    });
  }

  // Click outside (desktop) closes submenus
  const header = document.getElementById("header");
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) {
      items.forEach((i) => i.classList.remove("open"));
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  initTimelinePro();
});

function initTimelinePro() {
  const dataEl = document.getElementById("tlineData");
  const rail = document.getElementById("tlineRail");
  const markersWrap = document.getElementById("tlineMarkers");
  const dotsWrap = document.getElementById("tlineDots");
  const range = document.getElementById("tlineRange");
  const fill = document.getElementById("tlineFill");
  const bubble = document.getElementById("tlineBubble");

  if (!dataEl || !rail || !markersWrap || !dotsWrap || !range || !fill || !bubble) return;

  const { start, end, events } = JSON.parse(dataEl.textContent);
  const startD = new Date(start + "T00:00:00Z");
  const endD   = new Date(end   + "T00:00:00Z");
  const totalMs = endD - startD;

  const toDate = (d) => new Date(d + "T00:00:00Z");
  const pct = (d) => ( (toDate(d) - startD) / totalMs ) * 100;

  // Render markers + labels
  markersWrap.innerHTML = "";
  events.forEach((ev, i) => {
    const leftPct = pct(ev.date);

    // marker dot
    const dot = document.createElement("div");
    dot.className = "tline-marker";
    dot.style.left = leftPct + "%";

    // label
    const pop = document.createElement("div");
    const side = (ev.side === "bottom") ? "bottom" : "top";
    pop.className = "tline-pop tline-pop--" + side;
    pop.style.left = leftPct + "%";

    const dateText = ev.rangeEnd
      ? fmtDate(ev.date) + " – " + fmtDate(ev.rangeEnd)
      : fmtDate(ev.date);

    pop.innerHTML = `
      <div class="tline-pop__title">${escapeHtml(ev.title)}</div>
      <div class="tline-pop__date">${escapeHtml(dateText)}</div>
    `;

    // click: move slider to this event
    dot.addEventListener("click", () => moveToDate(ev.date));

    markersWrap.appendChild(pop);
    markersWrap.appendChild(dot);
  });

  // Decorative mini dots (same positions)
  dotsWrap.innerHTML = "";
  events.forEach((ev) => {
    const d = document.createElement("div");
    d.className = "tline-dot";
    d.style.left = pct(ev.date) + "%";
    dotsWrap.appendChild(d);
  });

  // Slider setup
  const totalDays = Math.max(1, Math.round(totalMs / (24*3600*1000)));
  range.max = String(totalDays);
  range.value = String(totalDays); // start at end
  updateSliderUI();

  range.addEventListener("input", updateSliderUI);

  function updateSliderUI() {
    const days = Number(range.value);
    const p = (days / totalDays) * 100;
    // fill bar grows from left to thumb (like your reference uses left+width approach)
    fill.style.left = "0%";
    fill.style.width = p + "%";

    const d = new Date(startD.getTime() + days * 24*3600*1000);
    const label = fmtDateISO(d);
    bubble.style.setProperty("--p", `calc(${p}% )`);
    bubble.textContent = label;
  }

  function moveToDate(iso) {
    const ms = toDate(iso) - startD;
    const days = Math.round(ms / (24*3600*1000));
    range.value = String(Math.min(Math.max(0, days), totalDays));
    updateSliderUI();
  }

  function fmtDate(iso) {
    const d = toDate(iso);
    return fmtDateISO(d);
  }

  function fmtDateISO(d) {
    // e.g., "7 Oct 2023"
    const day = d.getUTCDate();
    const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()];
    const year = d.getUTCFullYear();
    return `${day} ${mon} ${year}`;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
}


// --- Evidence filter module --------------------------------------------

function initEvidenceModule() {
  const filterContainer = document.getElementById("evidence-filter");
  const listContainer = document.getElementById("evidence-list");
  if (!filterContainer || !listContainer) return;

  const evidenceItems = [
    { id: 1, type: "document", year: 2017, title: "Internal DIAS documentation (excerpt)" },
    { id: 2, type: "media", year: 2019, title: "Press article on DIAS and asylum seekers" },
    { id: 3, type: "legal", year: 2020, title: "Legal commentary on biometric evidence" },
    { id: 4, type: "document", year: 2022, title: "NGO report on voice biometrics" }
  ];

  const state = {
    types: new Set(["document", "media", "legal"])
  };

  // Build filter UI
  const filterTitle = document.createElement("h2");
  filterTitle.textContent = "Filter evidence";
  filterContainer.appendChild(filterTitle);

  const types = ["document", "media", "legal"];
  types.forEach((type) => {
    const id = `filter-${type}`;
    const wrapper = document.createElement("label");
    wrapper.className = "evidence-filter";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = id;
    checkbox.checked = true;

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        state.types.add(type);
      } else {
        state.types.delete(type);
      }
      renderEvidence();
    });

    wrapper.appendChild(checkbox);
    wrapper.appendChild(document.createTextNode(" " + type));
    filterContainer.appendChild(wrapper);
  });

  // Render evidence list
  function renderEvidence() {
    listContainer.innerHTML = "";
    const filtered = evidenceItems.filter((item) => state.types.has(item.type));

    if (filtered.length === 0) {
      const msg = document.createElement("p");
      msg.textContent = "No evidence visible with the current filters.";
      listContainer.appendChild(msg);
      return;
    }

    filtered.forEach((item) => {
      const card = document.createElement("article");
      card.className = "evidence-card";

      card.innerHTML = `
        <div class="evidence-card__meta">
          <strong>Type:</strong> ${item.type} |
          <strong>Year:</strong> ${item.year}
        </div>
        <div class="evidence-card__title">${item.title}</div>
      `;

      listContainer.appendChild(card);
    });
  }

  renderEvidence();
}

document.addEventListener("DOMContentLoaded", () => {
  initPdfViewer(); // <— add this
});

/** -------- PDF viewer with hotspots (PDF.js) -------- */
function initPdfViewer() {
  const host = document.querySelector(".pdf-canvas");
  if (!host || !window.pdfjsLib) return;

  const pdfUrl = host.getAttribute("data-pdf");
  const annUrl = host.getAttribute("data-annotations");
  if (!pdfUrl || !annUrl) return;

  const tooltip = host.querySelector("#docTooltip");
  const panel = document.querySelector(".doc-panel__content");

  Promise.all([
    fetch(annUrl + (annUrl.includes("?") ? "&" : "?") + "v=" + Date.now(), { cache: "no-store" })
    .then(r => r.json()),
    pdfjsLib.getDocument(pdfUrl).promise
  ])
  .then(([ann, pdf]) => renderPdfWithHotspots(host, pdf, ann, tooltip, panel))
  .catch(err => console.error("PDF viewer init error:", err));
}

function renderPdfWithHotspots(host, pdf, ann, tooltip, panel) {
  const hotspotsByPage = groupByPage(ann.hotspots || []);

  const renderAll = async () => {
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      // Scale for crispness on HiDPI screens
      const cssScale = 1.5;                 // visual size
      const viewport = page.getViewport({ scale: cssScale });
      const outputScale = window.devicePixelRatio || 1;

      const pageWrap = document.createElement("div");
      pageWrap.className = "pdf-page";

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = Math.floor(viewport.width) + "px";
      canvas.style.height = Math.floor(viewport.height) + "px";

      const transform = outputScale !== 1
        ? [outputScale, 0, 0, outputScale, 0, 0]
        : null;

      await page.render({ canvasContext: ctx, viewport, transform }).promise;

      const overlay = document.createElement("div");
      overlay.className = "pdf-overlay";
      pageWrap.appendChild(canvas);
      pageWrap.appendChild(overlay);
      host.appendChild(pageWrap);

      // Add hotspots for this page
      const pageHotspots = hotspotsByPage.get(pageNum) || [];
      pageHotspots.forEach(h => {
        const hs = document.createElement("div");
        hs.className = "doc-hotspot";
        // % positions mapped to canvas CSS size (not pixel buffer)
        hs.style.left = h.x + "%";
        hs.style.top = h.y + "%";
        hs.style.width = h.w + "%";
        hs.style.height = h.h + "%";

        hs.setAttribute("data-title", h.title || "");
        hs.setAttribute("data-short", h.short || "");
        hs.setAttribute("data-panel", h.panelHtml || "");
        hs.setAttribute("tabindex", "0");

        hs.addEventListener("mouseenter", (e) => {
          showTooltip(tooltip, e.currentTarget, pageWrap);
        });
        hs.addEventListener("mouseleave", () => hideTooltip(tooltip));
        hs.addEventListener("focus", (e) => {
          showTooltip(tooltip, e.currentTarget, pageWrap);
        });
        hs.addEventListener("blur", () => hideTooltip(tooltip));

        hs.addEventListener("click", (e) => {
          e.preventDefault();
          const t = e.currentTarget;
          const title = t.getAttribute("data-title");
          const body = t.getAttribute("data-panel");
          panel.innerHTML =
            (title ? `<h3>${escapeHtml(title)}</h3>` : "") +
            (body || "<p>No details.</p>");
          document.querySelector(".doc-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        overlay.appendChild(hs);
      });
    }
  };

  renderAll();

  // Hide tooltip when clicking outside hotspots
  host.addEventListener("click", (e) => {
    if (!e.target.classList.contains("doc-hotspot")) hideTooltip(tooltip);
  });
}

function groupByPage(items) {
  const map = new Map();
  items.forEach(h => {
    const p = Number(h.page) || 1;
    if (!map.has(p)) map.set(p, []);
    map.get(p).push(h);
  });
  return map;
}

/* Tooltip helpers – same logic as before */
function showTooltip(tooltip, hotspotEl, pageEl) {
  const short = hotspotEl.getAttribute("data-short");
  if (!short) return;

  tooltip.textContent = short;
  tooltip.hidden = false;

  // position within the page element box
  const pageRect = pageEl.getBoundingClientRect();
  const hsRect = hotspotEl.getBoundingClientRect();
  const offset = 8;

  // set first to measure width/height
  tooltip.style.left = "0px";
  tooltip.style.top = "0px";

  // place above/right of hotspot, clamped
  const left = Math.min(
    hsRect.left - pageRect.left + offset,
    pageRect.width - tooltip.offsetWidth - 8
  );
  const top = Math.max(8, hsRect.top - pageRect.top - tooltip.offsetHeight - 6);

  tooltip.style.left = left + "px";
  tooltip.style.top = top + "px";
}

function hideTooltip(tooltip) {
  tooltip.hidden = true;
  tooltip.textContent = "";
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

document.addEventListener("DOMContentLoaded", () => {
  const host = document.querySelector(".pdf-canvas");
  if (!host) return;

  let cursor;
  host.addEventListener("mousemove", (e) => {
    const page = e.target.closest(".pdf-page");
    if (!page) return;

    const r = page.getBoundingClientRect();
    const xPct = ((e.clientX - r.left) / r.width) * 100;
    const yPct = ((e.clientY - r.top) / r.height) * 100;

    if (!cursor) {
      cursor = document.createElement("div");
      cursor.className = "doc-cursor";
      page.appendChild(cursor);
    }
    cursor.textContent = `${xPct.toFixed(1)}%, ${yPct.toFixed(1)}%`;

    // keep label inside the page
    cursor.style.left = Math.min(e.clientX - r.left + 12, r.width - 90) + "px";
    cursor.style.top = Math.min(e.clientY - r.top + 12, r.height - 28) + "px";
  });

  host.addEventListener("mouseleave", () => {
    if (cursor) { cursor.remove(); cursor = null; }
  });
});
