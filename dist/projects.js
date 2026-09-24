window.renderProjectsCreative = function (content, close) {
  const root = document.createElement('div');
  root.className = 'projects-content';
  const esc = value => String(value || '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const list = items => `<ul>${(items || []).map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
  const tags = items => `<div class="project-tags">${(items || []).map(item => `<span>${esc(item)}</span>`).join('')}</div>`;

  const projectCard = (project, index) => {
    if (project.placeholder) return `
      <article class="project-card project-placeholder">
        <div><p class="project-index">PROJECT ${String(index + 1).padStart(2, '0')}</p><h4>${esc(project.name)}</h4><p>${esc(project.headline)}</p>${tags(project.tags)}</div>
        <strong>${esc(project.achievement)}</strong>
      </article>`;

    const gallery = (project.gallery || []).map(image => `
      <figure><img src="${esc(image.src)}" alt="${esc(image.alt)}" loading="lazy"><figcaption>${esc(image.label)}</figcaption></figure>`).join('');
    const steps = project.steps ? `<section class="project-process"><h5>How it works</h5><ol>${project.steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol></section>` : '';
    const roadmap = project.roadmap ? `<section class="project-roadmap"><h5>Future product roadmap</h5><div>${project.roadmap.map((step, i) => `<span>${esc(step)}${i < project.roadmap.length - 1 ? '<b>→</b>' : ''}</span>`).join('')}</div></section>` : '';
    const video = project.videoEmbedUrl ? `<section class="project-video-player"><h5>${esc(project.videoLabel)}</h5><div><iframe src="${esc(project.videoEmbedUrl)}" title="${esc(project.videoLabel)}" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe></div><a href="${esc(project.videoUrl)}" target="_blank" rel="noopener noreferrer">Open the demo in Google Drive ↗</a></section>` : '';
    return `
      <details class="project-card" data-project-card>
        <summary>
          <div class="project-cover${project.coverFit === 'contain' ? ' project-cover-contain' : ''}"><img src="${esc(project.hero)}" alt="${esc(project.heroAlt)}"><span>${esc(project.achievement)}</span></div>
          <div class="project-summary-copy"><p class="project-index">PROJECT ${String(index + 1).padStart(2, '0')} · ${esc(project.event)}</p><h4>${esc(project.name)}</h4><p>${esc(project.headline)}</p>${tags(project.tags)}<span class="explore-project">Explore project <b aria-hidden="true">→</b></span></div>
        </summary>
        <div class="project-case-study">
          <p class="project-overview">${esc(project.overview)}</p>
          <div class="project-story-grid">
            <section><h5>The problem</h5><p>${esc(project.problem)}</p></section>
            <section><h5>What we built</h5>${list(project.built)}</section>
            <section><h5>My contribution</h5><p>${esc(project.contribution)}</p></section>
            <section class="project-outcome"><h5>Outcome / Recognition</h5><p>${esc(project.outcome)}</p></section>
          </div>
          ${steps}${roadmap}
          <div class="project-gallery">${gallery}</div>
          ${video}
        </div>
      </details>`;
  };

  root.innerHTML = `
    <nav class="projects-nav"><button type="button" data-projects-close>← Back to main menu</button><span>DEPARTMENT 02 · PROJECTS & CREATIVES</span></nav>
    <header class="projects-hero"><div><p>${esc(content.eyebrow)}</p><h2 id="projects-title">${esc(content.title)}</h2><p>${esc(content.intro)}</p></div><span>MADE<br>FROM<br>SCRATCH</span></header>

    <section class="projects-section projects-builds"><div class="projects-heading"><span>01</span><div><p>HACKATHONS & BUILDS</p><h3>Ideas with working parts.</h3></div></div><div class="project-list">${content.projects.map(projectCard).join('')}</div></section>

    <section class="projects-section projects-communities"><div class="projects-heading"><span>02</span><div><p>EVENTS & COMMUNITIES</p><h3>${esc(content.communities.title)}</h3><small>${esc(content.communities.subtitle)}</small></div></div><div class="community-timeline">${content.communities.events.map((event,index)=>`<article>${event.image ? `<img src="${esc(event.image)}" alt="${esc(event.imageAlt)}" loading="lazy">` : ''}<div class="community-event-copy"><span>${String(index+1).padStart(2,'0')}</span><div><h4>${esc(event.title)}</h4><p>${esc(event.copy)}</p></div></div></article>`).join('')}</div></section>

    <section class="projects-section projects-creative"><div class="projects-heading"><span>03</span><div><p>CREATIVE WORK</p><h3>${esc(content.creative.title)}</h3><small>${esc(content.creative.subtitle)}</small></div></div><article class="creative-feature"><div><span>SELECTED WORK ↗</span><h4>${esc(content.creative.headline)}</h4><p>${esc(content.creative.copy)}</p><div class="project-tags">${content.creative.tags.map(tag=>`<span>${esc(tag)}</span>`).join('')}</div></div><a href="${esc(content.creative.url)}" target="_blank" rel="noopener noreferrer">Explore my creative portfolio <b aria-hidden="true">→</b></a></article></section>
    <footer class="projects-end"><button type="button" data-projects-close>Done exploring · back to cart +1 →</button></footer>`;

  root.querySelectorAll('[data-projects-close]').forEach(button => button.addEventListener('click', close));
  root.querySelectorAll('[data-project-card]').forEach(card => card.addEventListener('toggle', () => {
    if (card.open) card.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
  }));
  return root;
};
