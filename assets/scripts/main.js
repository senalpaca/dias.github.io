document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");
  initNavMenu();
  initEvidenceModule();
  initPdfViewer();
  initHeroSecondary();
});

function initNavMenu() {
  const nav = document.querySelector(".main-nav");
  const navInner = document.querySelector(".nav-inner");
  const hamburger = document.querySelector(".hamburger");
  const items = document.querySelectorAll(".menu-item.has-submenu");

  let openItem = null;

  /* ------------------
     Mobile hamburger
  ------------------ */
  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSubmenu();
      nav.classList.remove("open");
      hamburger?.focus();
    }
  });

  /* ------------------
     Submenu helpers
  ------------------ */
  function openSubmenu(item) {
    if (openItem === item) return;

    closeSubmenu();

    const submenu = item.querySelector(".submenu");
    if (!submenu) return;

    item.classList.add("open");
    openItem = item;

    const h = submenu.offsetHeight;
    nav.style.setProperty("--submenu-height", `${h}px`);
    nav.classList.add("submenu-open");
  }

  function closeSubmenu() {
    if (!openItem) return;

    openItem.classList.remove("open");
    openItem = null;

    nav.classList.remove("submenu-open");
    nav.style.removeProperty("--submenu-height");
  }

   /* ------------------
     Desktop hover (OPEN only)
  ------------------ */
  items.forEach(item => {
    item.addEventListener("pointerenter", () => openSubmenu(item));
    item.addEventListener("focusin", () => openSubmenu(item));
  });

  /* ------------------
     Close when leaving NAV
  ------------------ */
  nav.addEventListener("pointerleave", closeSubmenu);

  /* ------------------
     Touch behavior
  ------------------ */
  const isTouch = window.matchMedia("(hover: none)").matches;
  if (isTouch) {
    items.forEach(item => {
      const topLink = item.querySelector(".menu-toplink");
      if (!topLink) return;

      topLink.addEventListener("click", (e) => {
        if (!item.classList.contains("open")) {
          e.preventDefault();
          openSubmenu(item);
        }
      });
    });
  }

  /* ------------------
     Click outside
  ------------------ */
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target)) {
      closeSubmenu();
    }
  });
}

// ======================
// HERO SECONDARY TOGGLE
// ======================
(function initHeroSecondary() {
  const hero = document.querySelector(".hero");
  const secondary = document.querySelector(".hero-secondary");
  const boxes = secondary?.querySelectorAll(".hero-secondary-box");
  const dataEl = document.getElementById("heroSecondaryData");

  if (!hero || !secondary || !boxes?.length || !dataEl) return;

  let data;
  try {
    data = JSON.parse(dataEl.textContent);
  } catch (e) {
    console.error("Bad heroSecondaryData JSON", e);
    return;
  }

  let activeKey = null;

  boxes.forEach((box) => {
    box.addEventListener("click", (e) => {
      e.stopPropagation();

      const key = box.dataset.heroKey;
      if (!key || !data[key]) return;

      // If clicking the currently active box -> collapse all
      if (activeKey === key) {
        activeKey = null;
        boxes.forEach((b) => {
          b.classList.remove("is-active");
          clearBox(b);
        });
        updateHeroState();
        return;
      }

      // Otherwise: deactivate others immediately (no width animation yet)
      activeKey = key;
      boxes.forEach((b) => {
        if (b.dataset.heroKey !== key) {
          b.classList.remove("is-active");
          clearBox(b);
        }
      });

      // IMPORTANT: render content first (still not active)
      renderBox(box, data[key]);

      // Next frame: activate (this is when flex width animation starts)
      requestAnimationFrame(() => {
        box.classList.add("is-active");
        updateHeroState();
      });
    });
  });


  function updateHeroState() {
    if (activeKey) {
      hero.classList.add("is-compressed");
      secondary.classList.add("is-expanded");
    } else {
      hero.classList.remove("is-compressed");
      secondary.classList.remove("is-expanded");
    }
    // NEW: lets CSS increase site-main padding-bottom while expanded
    document.body.classList.toggle("hero-secondary-open", !!activeKey);
  }

  function renderBox(box, detail) {
    const container = box.querySelector(".hero-secondary-content");
    if (!container) return;

    container.innerHTML = `
      <p class="hero-secondary-text">${detail.text}</p>
      <a href="${detail.link.href}" class="hero-small-btn secondary-btn">
        ${detail.link.label}
      </a>
    `;
  }

  function clearBox(box) {
    const container = box.querySelector(".hero-secondary-content");
    if (container) container.innerHTML = "";
  }
})();


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

/** -------- PDF viewer with hotspots (PDF.js) -------- */
function initPdfViewer() {
  const host = document.querySelector(".pdf-canvas");
  if (!host || !window.pdfjsLib) return;

  const pdfUrl = host.getAttribute("data-pdf");
  const annUrl = host.getAttribute("data-annotations");
  if (!pdfUrl || !annUrl) return;

  const tooltip = host.querySelector("#docTooltip");
  const panel = document.getElementById("docPanelContent");
  const flyout = document.getElementById("docFlyout");

  // If you use PDF.js via CDN, make sure worker is set somewhere globally.
  // (Leave this if you already set it elsewhere.)
  // pdfjsLib.GlobalWorkerOptions.workerSrc = ".../pdf.worker.min.js";

  Promise.all([
    fetch(annUrl + (annUrl.includes("?") ? "&" : "?") + "v=" + Date.now(), { cache: "no-store" })
      .then(r => {
        if (!r.ok) throw new Error("annotations " + r.status);
        return r.json();
      }),
    pdfjsLib.getDocument(pdfUrl).promise
  ])
    .then(([ann, pdf]) => renderPdfWithHotspots(host, pdf, ann, tooltip, panel, flyout))
    .catch(err => console.error("PDF viewer init error:", err));
}

function renderPdfWithHotspots(host, pdf, ann, tooltip, panel, flyout) {
  const hotspotsByPage = groupByPage(ann.hotspots || []);

  // clear old render (important if hot-reloading)
  host.querySelectorAll(".pdf-page").forEach(n => n.remove());

  const renderAll = async () => {
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      // Scale for crispness on HiDPI screens
      const cssScale = 1.5; // visual size
      const viewport = page.getViewport({ scale: cssScale });
      const outputScale = window.devicePixelRatio || 1;

      const pageWrap = document.createElement("div");
      pageWrap.className = "pdf-page";
      pageWrap.dataset.page = String(pageNum);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // internal bitmap
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);

      // CSS size (what your % hotspot coordinates refer to)
      canvas.style.width = Math.floor(viewport.width) + "px";
      canvas.style.height = Math.floor(viewport.height) + "px";

      const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

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
        hs.style.left = (Number(h.x) || 0) + "%";
        hs.style.top = (Number(h.y) || 0) + "%";
        hs.style.width = (Number(h.w) || 0) + "%";
        hs.style.height = (Number(h.h) || 0) + "%";

        hs.setAttribute("data-title", h.title || "");
        hs.setAttribute("data-short", h.short || "");
        hs.setAttribute("data-panel", h.panelHtml || "");
        hs.setAttribute("tabindex", "0");

        // Tooltip interactions
        hs.addEventListener("mouseenter", (e) => showTooltip(tooltip, e.currentTarget, pageWrap));
        hs.addEventListener("mouseleave", () => hideTooltip(tooltip));
        hs.addEventListener("focus", (e) => showTooltip(tooltip, e.currentTarget, pageWrap));
        hs.addEventListener("blur", () => hideTooltip(tooltip));

        // Click = update right panel + show flyout next to annotation
        hs.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          const t = e.currentTarget;
          const title = t.getAttribute("data-title") || "";
          const body = t.getAttribute("data-panel") || "";

          const html =
            (title ? `<h3>${escapeHtml(title)}</h3>` : "") +
            (body || "<p>No details.</p>");

          if (panel) panel.innerHTML = html;

          if (flyout) {
            showFlyoutNearHotspot(flyout, html, t, host);
          }

          document.querySelector(".doc-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        overlay.appendChild(hs);
      });
    }
  };

  renderAll().catch(err => console.error("PDF render error:", err));

  // Hide tooltip/flyout when clicking outside hotspots
  host.addEventListener("click", (e) => {
    if (!e.target.classList.contains("doc-hotspot")) {
      hideTooltip(tooltip);
      if (flyout) flyout.hidden = true;
    }
  });
}

/* ---------- Flyout helper (small box next to annotation) ---------- */
function showFlyoutNearHotspot(flyout, html, hotspotEl, hostEl) {
  flyout.innerHTML = html;
  flyout.hidden = false;

  const hostRect = hostEl.getBoundingClientRect();
  const hsRect = hotspotEl.getBoundingClientRect();

  // put flyout to the right of hotspot
  let left = (hsRect.right - hostRect.left) + 12;
  let top = (hsRect.top - hostRect.top);

  // measure after making it visible
  const fw = flyout.offsetWidth || 280;
  const fh = flyout.offsetHeight || 120;

  // if it would overflow right, place it left of hotspot
  if (left + fw > hostRect.width - 12) {
    left = (hsRect.left - hostRect.left) - fw - 12;
  }

  // clamp to host bounds
  left = Math.max(12, Math.min(left, hostRect.width - fw - 12));
  top = Math.max(12, Math.min(top, hostRect.height - fh - 12));

  flyout.style.left = left + "px";
  flyout.style.top = top + "px";
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

/* ---------- Tooltip helpers ---------- */
function showTooltip(tooltip, hotspotEl, pageEl) {
  if (!tooltip) return;
  const short = hotspotEl.getAttribute("data-short");
  if (!short) return;

  tooltip.textContent = short;
  tooltip.hidden = false;

  const pageRect = pageEl.getBoundingClientRect();
  const hsRect = hotspotEl.getBoundingClientRect();
  const offset = 8;

  tooltip.style.left = "0px";
  tooltip.style.top = "0px";

  const left = Math.min(
    hsRect.left - pageRect.left + offset,
    pageRect.width - tooltip.offsetWidth - 8
  );
  const top = Math.max(8, hsRect.top - pageRect.top - tooltip.offsetHeight - 6);

  tooltip.style.left = left + "px";
  tooltip.style.top = top + "px";
}

function hideTooltip(tooltip) {
  if (!tooltip) return;
  tooltip.hidden = true;
  tooltip.textContent = "";
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

/* (Your initPdfCursor can stay as-is) */
function initPdfCursor() {
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
    cursor.style.left = Math.min(e.clientX - r.left + 12, r.width - 90) + "px";
    cursor.style.top = Math.min(e.clientY - r.top + 12, r.height - 28) + "px";
  });

  host.addEventListener("mouseleave", () => {
    if (cursor) {
      cursor.remove();
      cursor = null;
    }
  });
}


