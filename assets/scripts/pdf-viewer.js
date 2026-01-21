(async function(){
  const host = document.getElementById('pdfHost');
  if(!host) return;

  const pdfUrl = host.getAttribute('data-pdf');
  const annUrl = host.getAttribute('data-annotations') || '';
  const tooltip = document.getElementById('docTooltip');
  const panel = document.querySelector('.doc-panel__content');

  if(!window.pdfjsLib) { console.error('pdfjsLib missing'); return; }
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  try {
    const [ann, pdf] = await Promise.all([
      // cache-bust + no-store ensures you always get the newest annotations
      fetch(annUrl + (annUrl.includes("?") ? "&" : "?") + "v=" + Date.now(), { cache: "no-store" })
        .then(r=>{ if(!r.ok) throw new Error('annotations '+r.status); return r.json(); }),
      pdfjsLib.getDocument(pdfUrl).promise
    ]);

    // group hotspots by page
    const byPage = new Map();
    (ann.hotspots || []).forEach(h=>{
      const p = Number(h.page) || 1;
      if(!byPage.has(p)) byPage.set(p, []);
      byPage.get(p).push(h);
    });

    for(let n=1; n<=pdf.numPages; n++){
      const page = await pdf.getPage(n);
      const viewport = page.getViewport({ scale: 1.25 });

      const wrap = document.createElement('div');
      wrap.className = 'pdf-page';
      wrap.dataset.page = String(n);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // internal bitmap size (crisp)
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // responsive DOM size (fit column)
      canvas.style.width = "100%";
      canvas.style.height = "auto";

      const overlay = document.createElement('div');
      overlay.className = 'pdf-overlay';

      wrap.appendChild(canvas);
      wrap.appendChild(overlay);
      host.appendChild(wrap);

      await page.render({ canvasContext: ctx, viewport }).promise;

      (byPage.get(n) || []).forEach(h=>{
        const el = document.createElement('div');
        el.className = 'doc-hotspot';
        el.style.left   = h.x + '%';
        el.style.top    = h.y + '%';
        el.style.width  = h.w + '%';
        el.style.height = h.h + '%';
        el.setAttribute('data-title', h.title || '');
        el.setAttribute('data-short', h.short || '');
        el.setAttribute('data-panel', h.panelHtml || '');
        el.setAttribute('tabindex','0');

        el.addEventListener('mouseenter', (e)=> showTooltip(tooltip, e.currentTarget, wrap));
        el.addEventListener('mouseleave', ()=> hideTooltip(tooltip));
        el.addEventListener('focus', (e)=> showTooltip(tooltip, e.currentTarget, wrap));
        el.addEventListener('blur',  ()=> hideTooltip(tooltip));
        el.addEventListener('click', (e) => {
            const t = e.currentTarget;  // The clicked hotspot element
            const title = t.getAttribute('data-title');
            const body  = t.getAttribute('data-panel');

            panel.innerHTML =
            (title ? ('<h3>' + escapeHtml(title) + '</h3>') : '') +
            (body || '<p>No details.</p>');

            // Get the position of the hotspot relative to its parent (pdf-overlay)
            const hotspotRect = t.getBoundingClientRect();  // Position of hotspot in the viewport

            // Get the position of the pdf-overlay relative to the document
            const pdfOverlay = document.querySelector('.pdf-overlay');
            const pdfOverlayRect = pdfOverlay.getBoundingClientRect();  // Position of pdf-overlay in the viewport

            // Get the content box where the information should appear
            const panelBox = document.getElementById('docPanelBox');  
            const panelHeight = panelBox.offsetHeight;  
            const panelWidth = panelBox.offsetWidth;  

            // Set position of the content box relative to the clicked hotspot
            panelBox.style.position = 'absolute';

            // Calculate the position of the content box relative to the pdf-overlay
            const panelLeft = 0;
            const panelTop = hotspotRect.top - pdfOverlayRect.top  // Align vertically with the hotspot

            // Ensure the content box stays within the right boundary of the pdf-overlay
            panelBox.style.left = panelLeft + 'px';
            panelBox.style.top = Math.max(panelTop, 0) + 'px';
        });

        overlay.appendChild(el);
      });
    }

    /* Placement Mode (editor only) — disabled by default
       Enabled automatically on localhost or when URL has ?edit=1
    */
    const canEdit = location.hostname === "localhost" || location.search.includes("edit=1");
    if (canEdit) enablePlacementMode(host);

  } catch(e) {
    console.error('PDF viewer error:', e);
  }

  function showTooltip(tip, hotspotEl, pageEl){
    const short = hotspotEl.getAttribute('data-short');
    if(!short) return;
    tip.textContent = short; tip.hidden = false;
    const pageRect = pageEl.getBoundingClientRect();
    const hsRect   = hotspotEl.getBoundingClientRect();
    tip.style.left = '0px'; tip.style.top = '0px';
    const left = Math.min(hsRect.left - pageRect.left + 8, pageRect.width - tip.offsetWidth - 8);
    const top  = Math.max(8, hsRect.top  - pageRect.top  - tip.offsetHeight - 6);
    tip.style.left = left + 'px';
    tip.style.top  = top  + 'px';
  }
  function hideTooltip(t){ t.hidden = true; t.textContent=''; }
  function escapeHtml(s){ return s.replace(/[&<>"']/g,c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])); }

  /* ---------- Editor-only placement mode ---------- */
  function enablePlacementMode(hostEl){

  /* ---------- Helper: show snippet overlay + fallback copy ---------- */
  function fallbackCopy(text){
    const ta = document.createElement('textarea');
    ta.value = text;
    // Visually hidden but selectable
    ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch(e) { console.warn('fallback copy failed', e); }
    ta.remove();
  }

  function showSnippetOverlay(snippet){
    // remove existing
    const old = document.getElementById('snippetOverlay'); if(old) old.remove();
    const ov = document.createElement('div');
    ov.id = 'snippetOverlay';
    Object.assign(ov.style, {
      position: 'fixed', right: '12px', bottom: '12px', zIndex: 10000,
      background: '#fff', color: '#000', border: '1px solid #000', padding: '12px',
      maxWidth: '60vw', maxHeight: '50vh', overflow: 'auto', fontSize: '12px', boxShadow: '0 6px 20px rgba(0,0,0,.2)'
    });

    const pre = document.createElement('pre');
    pre.textContent = snippet;
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.margin = '0 0 8px 0';

    const btnWrap = document.createElement('div');
    btnWrap.style.display = 'flex';
    btnWrap.style.gap = '8px';

    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy JSON';
    copyBtn.addEventListener('click', async ()=>{
      try {
        if(navigator.clipboard?.writeText){ await navigator.clipboard.writeText(snippet); alert('Copied to clipboard.'); }
        else { fallbackCopy(snippet); alert('Copied via fallback.'); }
      } catch(e){ fallbackCopy(snippet); alert('Copied via fallback.'); }
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', ()=> ov.remove());

    btnWrap.appendChild(copyBtn); btnWrap.appendChild(closeBtn);
    ov.appendChild(pre); ov.appendChild(btnWrap);
    document.body.appendChild(ov);
  }
    let placing=false, ghost=null, startX=0,startY=0, activePage=null;

    document.addEventListener('keydown',(e)=>{
      if(e.key.toLowerCase()==='p'){
        placing=!placing;
        console.log(`[place] ${placing?'ON':'OFF'} — click-drag on a page`);
        if(!placing && ghost){ ghost.remove(); ghost=null; }
      }
    });

    hostEl.addEventListener('mousedown',(e)=>{
      if(!placing) return;
      const page = e.target.closest('.pdf-page');
      if(!page) return;
      activePage = page;

      const r = page.getBoundingClientRect();
      startX = e.clientX - r.left;
      startY = e.clientY - r.top;

      ghost = document.createElement('div');
      ghost.className = 'place-ghost';
      ghost.style.left = startX+'px';
      ghost.style.top  = startY+'px';
      ghost.style.width='0px';
      ghost.style.height='0px';
      page.appendChild(ghost);

      const onMove = (ev)=>{
        const rr = page.getBoundingClientRect();
        const curX = ev.clientX - rr.left;
        const curY = ev.clientY - rr.top;
        const x = Math.min(curX, startX);
        const y = Math.min(curY, startY);
        const w = Math.abs(curX - startX);
        const h = Math.abs(curY - startY);
        ghost.style.left = x+'px'; ghost.style.top = y+'px';
        ghost.style.width = w+'px'; ghost.style.height = h+'px';
      };
      const onUp = ()=>{
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        if(!ghost) return;

        const rr = page.getBoundingClientRect();
        const xPct = (+ghost.style.left.replace('px','')   / rr.width) * 100;
        const yPct = (+ghost.style.top.replace('px','')    / rr.height)* 100;
        const wPct = (+ghost.style.width.replace('px','')  / rr.width) * 100;
        const hPct = (+ghost.style.height.replace('px','') / rr.height)* 100;
        const pageNum = Number(page.dataset.page) || 1;

        const title = window.prompt('Hotspot title (optional):','') || '';
        const short = window.prompt('Short tooltip (optional):','') || '';
        const panelHtml = window.prompt('Panel HTML (optional):','') || '';

        const hotspot = {
          id: `h_${Date.now()}`,
          page: pageNum,
          x: +xPct.toFixed(1),
          y: +yPct.toFixed(1),
          w: +wPct.toFixed(1),
          h: +hPct.toFixed(1),
          title, short, panelHtml
        };
        const snippet = JSON.stringify(hotspot, null, 2);
        console.log("[place] snippet:", hotspot);

        showSnippetOverlay(snippet);

        // Try clipboard, fallback+alert if blocked
        (async () => {
          try {
            if (navigator.clipboard?.writeText) {
              await navigator.clipboard.writeText(snippet);
              alert('Hotspot JSON copied to clipboard.\nPaste it into assets/docs/annotations.json → "hotspots".');
            } else {
              fallbackCopy(snippet);
              alert('Copied via fallback. Paste the JSON into annotations.json.');
            }
          } catch (e) {
            console.warn("Clipboard failed, using fallback:", e);
            fallbackCopy(snippet);
            alert("Copied via fallback. Paste the JSON into annotations.json.");
          }
        })();

        ghost.remove(); ghost=null; activePage=null;
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }
})();
