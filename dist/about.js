window.renderAboutMe = function (about, managerSheet, close) {
  const root = document.createElement('div');
  root.className = 'about-content';
  const esc = value => String(value || '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const sectionTitle = (number, title) => `<div class="about-section-title"><span>${number}</span><h3>${esc(title)}</h3></div>`;

  root.innerHTML = `
    <nav class="about-nav"><button type="button" data-about-close>← Back to main menu</button><span>STORE MANAGER FILE · YW2026</span></nav>
    <header class="about-hero" id="about-top">
      <div class="about-photo"><img src="${esc(managerSheet)}" alt="Yi Wen, store manager"></div>
      <div class="about-intro"><p class="about-eyebrow">${esc(about.eyebrow)}</p><h2 id="about-title">${esc(about.title)}</h2>${about.intro.map(paragraph=>`<p>${esc(paragraph)}</p>`).join('')}<div class="about-stats"><span><strong>17</strong>first business</span><span><strong>20+</strong>founder events</span><span><strong>6 MO</strong>in HCMC</span></div></div>
    </header>

    <section class="about-section about-curious">${sectionTitle('01','Curious about')}<div class="about-card-grid">${about.curious.map(item=>`<article><span>${esc(item.icon)}</span><h4>${esc(item.title)}</h4><p>${esc(item.copy)}</p></article>`).join('')}</div></section>

    <section class="about-section about-doing">${sectionTitle('02','Things I like doing')}<div class="doing-grid">${about.doing.map((item,index)=>`<article><span>${String(index+1).padStart(2,'0')}</span><div><h4>${esc(item.title)}</h4><p>${esc(item.copy)}</p></div></article>`).join('')}</div></section>

    <section class="about-section about-toolkit">${sectionTitle('03','My toolkit')}<div class="toolkit-receipt"><p>YI WEN’S BUILDING SUPPLIES</p>${about.toolkit.map(item=>`<div><strong>${esc(item.label)}</strong><span>${esc(item.items)}</span></div>`).join('')}<small>TOOLS CHANGE · CURIOSITY STAYS</small></div></section>

    <section class="about-section about-exploring">${sectionTitle('04','Currently exploring')}<div class="exploring-grid">${about.exploring.map(item=>`<article><h4>${esc(item.title)}</h4><p>${esc(item.copy)}</p></article>`).join('')}</div><p class="exploring-conclusion">${esc(about.exploringConclusion)}</p></section>

    <section class="about-section about-places">${sectionTitle('05','Places that shaped me')}<div class="places-grid">${about.places.map(item=>`<article><span>${esc(item.icon)}</span><h4>${esc(item.title)}</h4><p>${esc(item.copy)}</p></article>`).join('')}</div></section>

    <section class="about-section about-cart">${sectionTitle('06','Currently in my cart')}<div class="current-cart-grid">${about.cart.map(item=>`<article><span>${esc(item.icon)}</span><div><h4>${esc(item.title)}</h4><p>${esc(item.copy)}</p></div></article>`).join('')}</div></section>

    <section class="about-section about-facts">${sectionTitle('07','A few things about me')}<div class="facts-list">${about.facts.map(fact=>`<p>${esc(fact)}</p>`).join('')}</div></section>

    <footer class="about-end"><p>Still curious? There’s always room for one more conversation.</p><button type="button" data-about-close>Done exploring · back to cart +1 →</button></footer>`;

  root.querySelectorAll('[data-about-close]').forEach(button => button.addEventListener('click', close));
  return root;
};
