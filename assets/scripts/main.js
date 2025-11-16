document.addEventListener("DOMContentLoaded", () => {
  initTimeline();
  initEvidenceModule();
});

// --- Simple timeline module --------------------------------------------

function initTimeline() {
  const timelineContainer = document.getElementById("timeline");
  if (!timelineContainer) return;

  const events = [
    { year: 2017, label: "DIAS introduced into asylum procedures." },
    { year: 2019, label: "NGOs and activists raise concerns about bias and opacity." },
    { year: 2023, label: "Ongoing debates on biometric systems and border technologies." }
  ];

  const list = document.createElement("div");
  let activeIndex = null;

  events.forEach((event, index) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `
      <span class="year">${event.year}</span>
      <span class="label">${event.label}</span>
    `;
    item.addEventListener("click", () => {
      activeIndex = index;
      updateActive();
    });
    list.appendChild(item);
  });

  function updateActive() {
    Array.from(list.children).forEach((child, idx) => {
      if (idx === activeIndex) {
        child.classList.add("timeline-item--active");
      } else {
        child.classList.remove("timeline-item--active");
      }
    });
  }

  timelineContainer.appendChild(list);
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
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });
  }
});
