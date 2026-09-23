window.renderWorkExperience = function (work, close) {
  const root = document.createElement('div');
  root.className = 'work-content';
  const esc = value => String(value || '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const rich = (value, highlights=[]) => {
    let text = esc(value);
    highlights.forEach(phrase => { text = text.replace(esc(phrase), `<strong>${esc(phrase)}</strong>`); });
    return text;
  };

  root.innerHTML = `
    <nav class="work-nav"><button type="button" data-work-close>← Back to main menu</button><span>EMPLOYEE ID · YW2026</span></nav>
    <header class="work-hero" id="work-top">
      <div><p>${esc(work.eyebrow)}</p><h2 id="work-title">${esc(work.title)}</h2><span>${esc(work.intro)}</span></div>
      <div class="work-stamp" aria-hidden="true">IN THE<br>WORKS</div>
    </header>
    <section class="work-timeline" aria-label="Selected work experience">
      ${work.roles.map((item,index)=>`
        <article class="work-card${item.image ? '' : ' no-photo'}" style="--work-color:${esc(item.color)}">
          <div class="work-index">${String(index+1).padStart(2,'0')}</div>
          <div class="work-copy">
            <div class="work-company"><div class="work-logo"><img src="${esc(item.logo)}" alt="${esc(item.company)} logo"></div><div><p>${esc(item.company)}</p><h3>${esc(item.role)}</h3><span>${esc(item.date)}</span></div></div>
            <div class="work-impacts">${(item.metrics || [[item.metric,item.metricLabel]]).map(metric=>`<div class="work-impact"><strong>${esc(metric[0])}</strong><span>${esc(metric[1])}</span></div>`).join('')}</div>
            <ul>${item.bullets.map(bullet=>`<li>${rich(bullet,item.highlights)}</li>`).join('')}</ul>
          </div>
          ${item.image ? `<figure class="work-photo"><img src="${esc(item.image)}" alt="${esc(item.company)} team experience" loading="lazy"></figure>` : `<div class="work-no-photo"><span>CREATOR<br>COMMERCE</span><small>Automation · campaigns · livestream growth</small></div>`}
        </article>`).join('')}
    </section>
    <footer class="work-end"><p>Different teams. One operating principle: make the work move better.</p><button type="button" data-work-close>Done exploring · back to cart +1 →</button></footer>`;

  root.querySelectorAll('[data-work-close]').forEach(button => button.addEventListener('click', close));
  return root;
};
