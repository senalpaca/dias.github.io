(function () {
  const filterRoot = document.getElementById("docsFilter");
  const searchInput = document.getElementById("table-search"); // your existing search
  const tbody = document.querySelector(".case-page__table tbody");
  const rows = Array.from(document.querySelectorAll("tr.doc-row"));
  const countEl = document.getElementById("docsCount");
  const emptyEl = document.getElementById("docsEmpty");

  if (!tbody || rows.length === 0) return;

  // Read active tag from URL (?tag=...)
  const params = new URLSearchParams(window.location.search);
  const activeTag = (params.get("tag") || "").toLowerCase();

  function getCheckedTypes() {
    if (!filterRoot) return [];
    return Array.from(
      filterRoot.querySelectorAll('input[name="type"]:checked')
    ).map((i) => (i.value || "").toLowerCase());
  }

  function getQuery() {
    return (searchInput?.value || "").trim().toLowerCase();
  }

  function rowMatches(row, types, q, tag) {
    const type = (row.dataset.type || "document").toLowerCase();
    const tags = (row.dataset.tags || "").toLowerCase();
    const title = (row.dataset.title || "").toLowerCase();

    // type filter
    if (types.length && !types.includes(type)) return false;

    // tag filter (from URL)
    if (tag && !tags.includes(tag)) return false;

    // search filter
    if (q) {
      // include visible text too (title in <h4>, etc.)
      const text = (row.textContent || "").toLowerCase();
      if (!(title + " " + tags + " " + text).includes(q)) return false;
    }

    return true;
  }

  function apply() {
    const types = getCheckedTypes();
    const q = getQuery();
    let visible = 0;

    rows.forEach((row) => {
      const ok = rowMatches(row, types, q, activeTag);
      row.style.display = ok ? "" : "none";
      if (ok) visible++;
    });

    if (countEl) countEl.textContent = `Found ${visible} item(s).`;
    if (emptyEl) emptyEl.style.display = visible ? "none" : "block";
  }

  // events
  if (filterRoot) {
    filterRoot.addEventListener("change", apply);
  }
  if (searchInput) {
    searchInput.addEventListener("input", apply);
  }

  // initial
  apply();
})();
