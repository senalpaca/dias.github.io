
document.addEventListener('DOMContentLoaded', () => {
  const dataEl = document.getElementById('tlineData');
  const markers = document.getElementById('tlineMarkers');
  const labels  = document.getElementById('tlineLabels');
  const track   = document.querySelector('.tline__track');
  const rail    = document.querySelector('.tline__rail');
  if (!dataEl || !markers || !labels || !track || !rail) return;

  // parse data
  let cfg;
  try { cfg = JSON.parse(dataEl.textContent); }
  catch(e){ console.error('Timeline JSON invalid:', e); return; }

  const start = new Date(cfg.start + 'T00:00:00Z');
  const end   = new Date(cfg.end   + 'T00:00:00Z');
  const span  = end - start;

  const pct = iso => ((new Date(iso + 'T00:00:00Z') - start) / span) * 100;

  // clear old
  markers.innerHTML = '';
  labels.innerHTML  = '';

  // render simple markers + side-aware labels
  (cfg.events || []).forEach(ev => {
    const left = Math.max(0, Math.min(100, pct(ev.date)));

    // marker
    const m = document.createElement('div');
    m.className = 'tline__marker';
    m.style.left = left + '%';
    m.title = ev.title;
    m.addEventListener('click', () => {
      // simple focus: scroll label into view
      const lbl = labels.querySelector(`[data-key="${cssSafeKey(ev)}"]`);
      lbl?.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
    });
    markers.appendChild(m);

    // label
    const l = document.createElement('div');
    l.className = 'tline__label' + (ev.side === 'bottom' ? ' tline__label--bottom' : '');
    l.style.left = left + '%';
    l.dataset.key = cssSafeKey(ev);
    const dateStr = ev.rangeEnd
      ? `${fmt(new Date(ev.date+'T00:00:00Z'))} – ${fmt(new Date(ev.rangeEnd+'T00:00:00Z'))}`
      : `${fmt(new Date(ev.date+'T00:00:00Z'))}`;
    l.innerHTML = `<span class="tline__labelTitle">${escapeHtml(ev.title)}</span>${escapeHtml(dateStr)}`;
    labels.appendChild(l);
  });

  function fmt(d){
    const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getUTCMonth()];
    return `${d.getUTCDate()} ${mo} ${d.getUTCFullYear()}`;
  }
  function cssSafeKey(ev){
    return (ev.date + '-' + (ev.title || '')).replace(/[^a-z0-9_-]+/gi,'-');
  }
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
});

