// Layout only. All venture content lives in portfolio-data.js → ventures.
window.renderFoundersAisle = function (ventures, close) {
  const root = document.createElement('div');
  root.className = 'founder-content';
  const esc = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const photo = (src, alt, cls = '') => src ? `<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy">` : `<div class="venture-placeholder">[ADD ${esc(alt.toUpperCase())}]</div>`;
  const jump = (id, label) => `<button type="button" data-venture-jump="${id}">${label}</button>`;
  const storyText = (p, v) => {
    let text = esc(p);
    (v.highlights || []).forEach(phrase => { text = text.replace(esc(phrase), `<strong>${esc(phrase)}</strong>`); });
    return text;
  };
  root.innerHTML = `
    <nav class="aisle-nav" aria-label="Founder’s Aisle"><button type="button" data-aisle-close>← Back to main menu</button><span>04 IDEAS / ONE AISLE</span></nav>
    <header class="aisle-hero" id="aisle-top" tabindex="-1">
      <div class="aisle-intro"><p class="aisle-eyebrow">01 / FOUNDER’S AISLE</p><h2 id="founder-title">THINGS <br>I’VE BUILT.</h2><p>Four ideas. Different stages. Different lessons.</p><p>From crystals and community to games, group buying and everyday plans.</p><em>Click an item or scroll down ↓</em></div>
      <div class="aisle-display"><div class="aisle-sign">FOUNDER’S AISLE<small>SAME CURIOSITY. DIFFERENT PRODUCTS.</small></div>
      <div class="venture-shelf">${ventures.map(v => `<button type="button" class="shelf-item" data-venture-jump="venture-${esc(v.id)}" style="--venture-color:${v.color}"><span class="shelf-art">${photo(v.shelfImage,v.name)}</span><span class="shelf-label"><strong>${esc(v.name)}</strong><small>${esc([v.role,v.year].filter(Boolean).join(' · '))}</small><span>${esc(v.category)}</span><small>${esc(v.metrics[0] ? v.metrics[0].join(' ') : v.stage)}</small><b aria-hidden="true">↗</b></span></button>`).join('')}</div></div>
    </header>
    <div class="venture-stories">${ventures.map((v,i) => `
      ${i ? '<p class="next-shelf">NEXT ON THE SHELF ↓</p>' : ''}
      <section class="venture-story story-${v.id}" id="venture-${v.id}" tabindex="-1" aria-labelledby="heading-${v.id}" style="--venture-color:${v.color}">
        <header class="wix-story-heading"><div class="venture-title-copy"><p class="aisle-eyebrow">0${i+1} / ${esc(v.stage)}</p><h3 id="heading-${v.id}">${esc(v.name)}</h3><p class="venture-tagline">${esc(v.tagline)}</p><div class="venture-tags">${[v.role,v.year,v.category].filter(Boolean).map(t=>`<span>${esc(t)}</span>`).join('')}</div>${v.url?`<a class="find-out-link" href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">Find out more ↗</a>`:''}</div><figure class="venture-title-image">${photo(v.headerImage || v.shelfImage,`${v.name} featured visual`)}</figure></header>
        <div class="wix-story-copy">${(v.story || [v.idea,v.whatIBuilt,v.whatIDid]).map(p=>`<p>${storyText(p,v)}</p>`).join('')}</div>
        <div class="wix-products"><h4>${v.id==='onz'?'THE CONCEPT':'PRODUCTS & CREATIVE WORK'}</h4><div class="wix-image-grid">${[{src:v.heroImage,caption:v.id==='onz'?'Original concept visuals':`${v.name} product visuals`},...v.gallery].map(g=>`<figure>${g.src?`<a href="${esc(g.src)}" target="_blank" rel="noopener" aria-label="Enlarge ${esc(g.caption)} (opens in new tab)">${photo(g.src,g.caption)}</a>`:photo('',`${v.name} product screenshot`)}<figcaption>${esc(g.caption)}</figcaption></figure>`).join('')}</div></div>
        ${v.testimonials.length ? `<div class="venture-reviews wix-reviews"><h4>REVIEWS FROM CUSTOMERS</h4><div class="wix-image-grid">${v.testimonials.map((s,n)=>`<figure><a href="${esc(s)}" target="_blank" rel="noopener" aria-label="Enlarge ${esc(v.name)} review ${n+1} (opens in new tab)">${photo(s,`${v.name} original customer review ${n+1}`)}</a></figure>`).join('')}</div></div>` : ''}
        ${v.learnings.length ? `<div class="venture-reflections"><h4>WHAT I LEARNED</h4><ol>${v.learnings.map(l=>`<li>${esc(l)}</li>`).join('')}</ol></div>` : ''}
        <footer class="venture-footer">${jump('aisle-top','Back to shelf ↑')}${v.url?`<a class="find-out-link" href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">Find out more ↗</a>`:''}</footer>
      </section>`).join('')}</div>
    <footer class="aisle-end"><p>Four experiments. Plenty more in store.</p><button type="button" data-aisle-close>Done exploring · back to cart +1 →</button></footer>`;
  root.querySelectorAll('[data-aisle-close]').forEach(b => b.addEventListener('click', close));
  root.querySelectorAll('[data-venture-jump]').forEach(b => b.addEventListener('click', () => {
    const target = root.querySelector(`#${b.dataset.ventureJump}`);
    target.focus({preventScroll:true});
    target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  }));
  return root;
};
