window.renderEducation = function (education, close) {
  const root = document.createElement('div');
  root.className = 'education-content';
  const esc = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rich = (value, highlights=[]) => {
    let text=esc(value);
    highlights.forEach(phrase => { text=text.replace(esc(phrase),`<strong>${esc(phrase)}</strong>`); });
    return text;
  };
  const bullets = item => `<ul>${item.bullets.map(x=>`<li>${rich(x,item.highlights)}</li>`).join('')}</ul>`;
  const gallery = item => {
    const images = item.images || (item.image ? [item.image] : []);
    if (!images.length) return '';
    return `<div class="community-gallery gallery-${Math.min(images.length,4)}${item.galleryStyle ? ` ${esc(item.galleryStyle)}-gallery` : ''}">${images.map((src,index)=>`<figure><img src="${esc(src)}" alt="${esc(item.name)} ${images.length > 1 ? `photo ${index+1}` : 'photo'}" loading="lazy"></figure>`).join('')}</div>`;
  };
  const metrics = item => item.metrics.length ? `<div class="education-metrics">${item.metrics.map(m=>`<div><strong>${esc(m[0])}</strong><span>${esc(m[1])}</span></div>`).join('')}</div>` : '';
  const body = item => `<div class="community-body"><div><h5>What I did</h5>${bullets(item)}</div>${item.initiatives.length?`<div class="initiative-grid">${item.initiatives.map(x=>`<article><small>${esc(x.kicker)}</small><h5>${esc(x.title)}</h5><p>${rich(x.copy,['$250+','student entrepreneur bazaar','NUS and Korea University','500+'])}</p></article>`).join('')}</div>`:''}</div>`;
  root.innerHTML = `
    <nav class="education-nav"><button type="button" data-education-close>← Back to main menu</button><span>STUDENT ID · YW2026</span></nav>
    <section class="education-section education-first" id="education-top"><div class="education-section-title"><span>01</span><h2 id="education-title">Education</h2></div><div class="school-grid">${education.schools.map((school,i)=>`
      <article class="school-card"><div class="school-visual">${school.image?`<img src="${esc(school.image)}" alt="${esc(school.name)} emblem">`:`<span>${i?'NP':'NUS'}</span>`}</div><div class="school-heading"><p class="education-badge">${esc(school.badge)}</p><h4>${esc(school.name)}</h4><strong class="school-degree">${esc(school.degree)}</strong><p class="school-date">${esc(school.date)}</p></div><div class="school-points">${bullets(school)}</div></article>`).join('')}</div></section>
    <section class="education-section leadership-section"><div class="education-section-title"><span>02</span><h3>Leadership & communities</h3></div>${education.communities.map((item,i)=>`
      <article class="community-card${item.mediaLayout === 'side' ? ' media-side' : ''}" id="community-${i}"><header><div class="community-heading">${item.logo?`<img class="community-logo" src="${esc(item.logo)}" alt="${esc(item.name)} logo">`:''}<div><p class="education-badge">${esc(item.label)}</p><h4>${esc(item.name)}</h4><p><strong>${esc(item.role)}</strong> · ${esc(item.date)}</p><small>${esc(item.subtitle)}</small></div></div><span class="community-number">${String(i+1).padStart(2,'0')}</span></header>
      ${item.mediaLayout === 'side' ? `<div class="community-side-layout"><div>${metrics(item)}${body(item)}</div>${gallery(item)}</div>` : `${gallery(item)}${metrics(item)}${body(item)}`}
      ${item.links.length?`<footer>${item.links.map(link=>`<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)} ↗</a>`).join('')}</footer>`:''}
      </article>`).join('')}</section>
    <footer class="education-end"><p>Learning in class. Building beyond it.</p><button type="button" data-education-close>Done exploring · back to cart +1 →</button></footer>`;
  root.querySelectorAll('[data-education-close]').forEach(button=>button.addEventListener('click',close));
  return root;
};
