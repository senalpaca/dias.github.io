(function() {
  const grid = document.getElementById('docsGrid');
  if (!grid) return;

  const cards   = Array.from(grid.querySelectorAll('.doc-card'));
  const filter  = document.getElementById('docsFilter');
  const countEl = document.getElementById('docsCount');
  const emptyEl = document.getElementById('docsEmpty');

  const getCheckedTypes = () =>
    Array.from(filter.querySelectorAll('input[name="type"]:checked')).map(i => i.value);
  const getQuery = () =>
    (filter.querySelector('input[name="q"]')?.value || '').trim().toLowerCase();

  function matches(card, types, q) {
    const type = (card.getAttribute('data-type') || '').toLowerCase();
    if (types.length && !types.includes(type)) return false;
    if (q) {
      const title = card.querySelector('.doc-card__title')?.textContent.toLowerCase() || '';
      const summary = card.querySelector('.doc-card__summary')?.textContent.toLowerCase() || '';
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      if (!(title + ' ' + summary + ' ' + tags).includes(q)) return false;
    }
    return true;
  }

  function applyFilters() {
    const types = getCheckedTypes();
    const q     = getQuery();
    let visible = 0;

    cards.forEach(card => {
      const ok = matches(card, types, q);
      card.style.display = ok ? 'block' : 'none';
      if (ok) visible++;
    });

    if (countEl) countEl.textContent = `Found ${visible} document(s).`;
    if (emptyEl) emptyEl.style.display = visible ? 'none' : 'block';
  }

  filter.addEventListener('change', applyFilters);
  filter.addEventListener('input',  applyFilters);
  applyFilters();
})();
