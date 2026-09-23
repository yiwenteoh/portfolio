(function () {
  'use strict';

  const data = window.PORTFOLIO_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const collected = new Set();
  let dialogueIndex = 0;
  let audioContext = null;
  let dialogueChatter = null;
  let chatterStopTimer = null;
  let managerStopTimer = null;
  let activeCategory = null;
  let toastTimer = null;
  let openingCategory = false;

  const intro = $('[data-screen="intro"]');
  const shop = $('[data-screen="shop"]');
  const modal = $('[data-modal]');
  const checkoutModal = $('[data-checkout-modal]');
  const itemContainer = $('[data-cart-items]');
  const receiptList = $('[data-receipt-list]');
  const checkoutButton = $('[data-checkout]');
  const progress = $('[data-progress]');
  const plusOne = $('[data-plus-one]');

  function init() {
    const theme = data.theme || {};
    const rootStyle = document.documentElement.style;
    ['pink', 'sage', 'cyan', 'yellow'].forEach(key => {
      if (/^#[0-9a-f]{6}$/i.test(theme[key] || '')) rootStyle.setProperty(`--${key}`, theme[key]);
    });
    if (Number.isFinite(theme.imageGap)) rootStyle.setProperty('--venture-image-gap', `${Math.max(0, Math.min(40, theme.imageGap))}px`);
    if (Number.isFinite(theme.storyWidth)) rootStyle.setProperty('--venture-story-width', `${Math.max(560, Math.min(1100, theme.storyWidth))}px`);
    $$('[data-site-name]').forEach((el) => { el.textContent = data.siteName; });
    $('[data-header-logo]').src = data.titleImage;
    const title = $('.intro-summary');
    title.replaceChildren(...(data.titleLines || [data.siteName]).map(line => {
      const text = document.createElement('span'); text.textContent = line; return text;
    }));
    if (data.titleImage) {
      const image = document.createElement('img');
      image.src = data.titleImage;
      image.alt = 'Yiwen Portfolio Mart';
      image.width = 791; image.height = 299;
      image.className = 'portfolio-title-art';
      title.replaceChildren(image);
      title.parentElement.classList.add('has-title-art');
    }
    $('[data-today]').textContent = new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date()).toUpperCase();
    $('[data-total]').textContent = data.categories.length;
    $('[data-find-count]').textContent = data.categories.length;
    $('[data-story-count]').textContent = data.categories.length;
    progress.setAttribute('aria-valuemax', data.categories.length);
    $$('[data-email-link]').forEach(link => { link.href = `mailto:${data.email}`; });
    $$('[data-resume-link]').forEach(link => {
      if (data.resumeUrl && data.resumeUrl !== '#') link.href = data.resumeUrl;
      else { link.removeAttribute('href'); link.textContent = 'Résumé coming soon'; link.setAttribute('aria-disabled', 'true'); }
    });
    $('[data-quick-title]').textContent = data.quickLook.title;
    $('[data-quick-copy]').textContent = data.quickLook.copy;
    (data.quickHighlights || []).forEach((highlight, index) => {
      const card = document.createElement('article'); card.className = 'logo-sticker';
      if (highlight.logos.length > 1) card.classList.add('employer-sticker');
      if (highlight.emoji) card.classList.add('global-sticker');
      card.title = highlight.caption;
      card.setAttribute('aria-label', `${highlight.title}: ${highlight.caption}`);
      const logos = document.createElement('div'); logos.className = 'quick-logo-row';
      if (highlight.emoji) {
        const emoji = document.createElement('span'); emoji.className = 'global-emoji';
        emoji.textContent = highlight.emoji; emoji.setAttribute('aria-hidden', 'true'); logos.append(emoji);
      }
      highlight.logos.forEach(logo => {
        const item = document.createElement('div'); item.className = 'quick-logo';
        const img = document.createElement('img'); img.src = logo.src; img.alt = logo.alt;
        item.append(img);
        if (logo.label) { const label = document.createElement('small'); label.textContent = logo.label; item.append(label); }
        logos.append(item);
      });
      const title = document.createElement('h2'); title.textContent = highlight.title;
      card.append(logos, title);
      $(index < 2 ? '[data-interest-left]' : '[data-interest-right]').append(card);
    });

    if (data.managerTalkingSheet) {
      $('[data-manager-rest]').src = data.managerTalkingSheet;
      $('[data-manager-speaking]').src = data.managerTalkingSheet;
      $('[data-manager-portrait]').hidden = false;
      $('[data-photo-placeholder]').hidden = true;
    } else if (data.managerPhoto) {
      const image = $('[data-manager-photo]');
      image.src = data.managerPhoto;
      image.alt = 'Yi Wen, store manager of this portfolio';
      image.style.display = 'block';
      $('[data-photo-placeholder]').hidden = true;
    }

    renderDialogue();
    renderItems();
    renderReceipt();
    wireEvents();
  }

  function renderDialogue() {
    const step = data.dialogue[dialogueIndex];
    $('[data-dialogue-title]').textContent = step.title;
    $('[data-dialogue-copy]').textContent = step.copy;
    $('[data-dialogue-back]').disabled = dialogueIndex === 0;
    $('[data-dialogue-next]').textContent = 'Next →';
    $('[data-dialogue-next]').setAttribute('aria-label', dialogueIndex === data.dialogue.length - 1 ? 'Next: enter the cart' : 'Next introduction message');
  }

  // Reuse the existing chatter asset for a brief, user-triggered conversational cue.
  // The Store Radio implementation remains unchanged and still owns continuous ambience.
  function playDialogueChatter() {
    stopManagerSpeech();
    const portrait = $('[data-manager-portrait]');
    if (!reducedMotion && !portrait.hidden) {
      // Restart the short mouth-only sprite animation on each deliberate replay.
      void portrait.offsetWidth;
      portrait.classList.add('is-speaking');
      managerStopTimer = setTimeout(() => portrait.classList.remove('is-speaking'), 850);
    }
    if (!data.audio?.chatter) return;
    dialogueChatter ||= new Audio(data.audio.chatter);
    dialogueChatter.volume = Math.min(Number(data.audio.chatterVolume || 0.055), 0.12);
    dialogueChatter.currentTime = 0;
    clearTimeout(chatterStopTimer);
    dialogueChatter.play().catch(() => {});
    chatterStopTimer = window.setTimeout(() => dialogueChatter.pause(), 850);
  }

  function stopManagerSpeech() {
    clearTimeout(managerStopTimer);
    clearTimeout(chatterStopTimer);
    $('[data-manager-portrait]').classList.remove('is-speaking');
    dialogueChatter?.pause();
  }

  function renderItems() {
    itemContainer.innerHTML = data.categories.map((category, index) => `
      <button class="cart-item ${category.featured ? 'is-featured' : ''}" type="button" data-category="${category.id}" style="--item-color:${category.color};--tilt:${[-3, 2, -1, 3, -2, 2, -3, 1][index] || 0}deg" aria-label="Explore ${category.label}">
        <span class="item-label">${category.shortLabel}</span>
        <span class="item-icon" aria-hidden="true">${category.icon}</span>
        <span class="item-name">${category.label}</span>
        ${category.featured ? '<span class="item-featured-tag">START HERE</span>' : ''}
      </button>
    `).join('');
  }

  function renderReceipt(newId) {
    receiptList.innerHTML = data.categories.map((category) => `
      <li class="${collected.has(category.id) ? 'receipt-found' : 'placeholder'} ${category.id === newId ? 'just-collected' : ''}">
        <span>${collected.has(category.id) ? category.shortLabel : '— — —'}</span>
        <span>${collected.has(category.id) ? '✓' : '…'}</span>
      </li>
    `).join('');
    $('[data-collected]').textContent = collected.size;
    progress.setAttribute('aria-valuenow', collected.size);
    $('span', progress).style.width = `${(collected.size / data.categories.length) * 100}%`;
    const full = collected.size === data.categories.length;
    checkoutButton.disabled = !full;
    checkoutButton.innerHTML = full
      ? '<span>CART FULL — CHECKOUT</span><small>SAY HELLO AT THE COUNTER</small>'
      : '<span>CHECKOUT</span><small>EXPLORE ALL ITEMS FIRST</small>';
  }

  function enterShop() {
    stopManagerSpeech();
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    playStoreBell();
    intro.classList.remove('is-active');
    intro.hidden = true;
    shop.hidden = false;
    shop.classList.add('is-active');
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => window.scrollTo(0, 0)));
    if (!reducedMotion) shop.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.2,.8,.2,1)' });
    $('#shop-title').focus?.();
  }

  function openCategory(category) {
    if (openingCategory || modal.open) return;
    openingCategory = true;
    clearTimeout(toastTimer); plusOne.hidden = true;
    playBeep();
    $('[data-loader]').hidden = false;
    window.setTimeout(() => {
      $('[data-loader]').hidden = true;
      fillModal(category);
      activeCategory = category;
      modal.showModal();
      openingCategory = false;
    }, reducedMotion ? 0 : 430);
  }

  function collectFinishedCategory() {
    const category = activeCategory;
    activeCategory = null;
    if (!category || collected.has(category.id)) return;
    collected.add(category.id);
    $(`[data-category="${category.id}"]`).classList.add('is-collected');
    renderReceipt(category.id);
    playBeep();
    $('[data-receipt-update]').textContent = `+1 ${category.shortLabel} ADDED`;
    plusOne.replaceChildren();
    const count = document.createElement('strong'); count.textContent = '+1';
    const message = document.createElement('span');
    message.textContent = `${category.label} collected! ${collected.size} of ${data.categories.length} stories on your receipt.`;
    const jump = document.createElement('button'); jump.type = 'button'; jump.textContent = 'See receipt ↓';
    jump.addEventListener('click', () => $('.receipt-panel').scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth', block:'center'}));
    plusOne.append(count, message, jump);
    plusOne.hidden = false;
    toastTimer = setTimeout(() => { plusOne.hidden = true; }, 6500);
  }

  function fillModal(category) {
    const isFounder = category.id === 'entrepreneurship';
    const isEducation = category.id === 'education';
    const isWork = category.id === 'work';
    const isAbout = category.id === 'about';
    const isProjects = category.id === 'projects';
    modal.classList.toggle('founder-modal', isFounder);
    modal.classList.toggle('education-modal', isEducation);
    modal.classList.toggle('work-modal', isWork);
    modal.classList.toggle('about-modal', isAbout);
    modal.classList.toggle('projects-modal', isProjects);
    modal.querySelector('.modal-body').hidden = isFounder || isEducation || isWork || isAbout || isProjects;
    let aisle = modal.querySelector('.founder-content');
    if (aisle) aisle.remove();
    let education = modal.querySelector('.education-content');
    if (education) education.remove();
    let work = modal.querySelector('.work-content');
    if (work) work.remove();
    let about = modal.querySelector('.about-content');
    if (about) about.remove();
    let projects = modal.querySelector('.projects-content');
    if (projects) projects.remove();
    modal.setAttribute('aria-labelledby', isFounder ? 'founder-title' : isEducation ? 'education-title' : isWork ? 'work-title' : isAbout ? 'about-title' : isProjects ? 'projects-title' : 'modal-title');
    if (isFounder) {
      modal.append(window.renderFoundersAisle(data.ventures, () => modal.close()));
      modal.scrollTop = 0;
      return;
    }
    if (isEducation) {
      modal.append(window.renderEducation(data.education, () => modal.close()));
      modal.scrollTop = 0;
      return;
    }
    if (isWork) {
      modal.append(window.renderWorkExperience(data.workExperience, () => modal.close()));
      modal.scrollTop = 0;
      return;
    }
    if (isAbout) {
      modal.append(window.renderAboutMe(data.aboutMe, data.managerTalkingSheet, () => modal.close()));
      modal.scrollTop = 0;
      return;
    }
    if (isProjects) {
      modal.append(window.renderProjectsCreative(data.projectsCreative, () => modal.close()));
      modal.scrollTop = 0;
      return;
    }
    $('[data-modal-accent]').style.background = category.color;
    $('[data-modal-number]').textContent = String(data.categories.findIndex((item) => item.id === category.id) + 1).padStart(2, '0');
    $('[data-modal-tag]').textContent = category.tag;
    $('[data-modal-title]').textContent = category.label;
    $('[data-modal-summary]').textContent = category.summary;
    $('[data-modal-metric]').textContent = category.metric;
    $('[data-modal-entries]').innerHTML = category.entries.map((entry) => `
      <article class="entry-card">
        <h3>${entry.title}</h3>
        <p class="meta">${entry.meta}</p>
        <p>${entry.text}</p>
      </article>
    `).join('');
    const imageSlot = $('[data-modal-image]');
    imageSlot.innerHTML = category.image
      ? `<img src="${category.image}" alt="${category.label} portfolio highlight" />`
      : '<span>ADD A CRISP<br />PROJECT IMAGE<small>Set image in portfolio-data.js</small></span>';
  }

  function playBeep() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    audioContext ||= new Ctx();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(820, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1240, audioContext.currentTime + .06);
    gain.gain.setValueAtTime(.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.11, audioContext.currentTime + .01);
    gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + .12);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + .13);
  }

  function playStoreBell() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    audioContext ||= new Ctx();
    audioContext.resume?.().catch(() => {});
    const now = audioContext.currentTime;
    [[1046.5, 0], [1318.5, .14]].forEach(([frequency, offset]) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, now + offset);
      gain.gain.setValueAtTime(.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(.14, now + offset + .015);
      gain.gain.exponentialRampToValueAtTime(.0001, now + offset + .72);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + .75);
    });
  }

  function wireEvents() {
    const advanceDialogue = () => {
      if (dialogueIndex < data.dialogue.length - 1) {
        dialogueIndex += 1;
        renderDialogue();
        playDialogueChatter();
      } else enterShop();
    };
    $('[data-dialogue-back]').addEventListener('click', () => {
      if (dialogueIndex > 0) { dialogueIndex -= 1; renderDialogue(); playDialogueChatter(); }
    });
    $('[data-enter-cart]').addEventListener('click', enterShop);
    // Sound begins only after a deliberate interaction, never forced autoplay.
    intro.addEventListener('pointerdown', () => { playStoreBell(); }, { once: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopManagerSpeech(); });
    $('[data-dialogue-next]').addEventListener('click', advanceDialogue);
    window.addEventListener('keydown', (event) => {
      if (intro.hidden || (event.key !== ' ' && event.key !== 'Enter')) return;
      if (event.repeat || event.target.closest('button, a, input, textarea, select, [contenteditable]')) return;
      event.preventDefault();
      advanceDialogue();
    });
    itemContainer.addEventListener('click', (event) => {
      const button = event.target.closest('[data-category]');
      if (!button) return;
      openCategory(data.categories.find((item) => item.id === button.dataset.category));
    });
    $('[data-modal-close]').addEventListener('click', () => modal.close());
    modal.addEventListener('close', collectFinishedCategory);
    $('[data-checkout-close]').addEventListener('click', () => checkoutModal.close());
    $$('[data-back-cart]').forEach((button) => button.addEventListener('click', () => {
      modal.close();
      checkoutModal.close();
    }));
    modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });
    checkoutModal.addEventListener('click', (event) => { if (event.target === checkoutModal) checkoutModal.close(); });
    checkoutButton.addEventListener('click', () => { playBeep(); checkoutModal.showModal(); });
    $('[data-radio]').addEventListener('click', () => window.StoreRadio.toggle());
    $$('[data-return-intro]').forEach((button) => button.addEventListener('click', () => {
      stopManagerSpeech();
      dialogueIndex = 0;
      renderDialogue();
      shop.hidden = true;
      intro.hidden = false;
      intro.classList.add('is-active');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }));

    if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
      window.addEventListener('pointermove', (event) => {
        $$('[data-depth]').forEach((sticker) => {
          const depth = Number(sticker.dataset.depth || .3);
          sticker.style.translate = `${(event.clientX / innerWidth - .5) * 12 * depth}px ${(event.clientY / innerHeight - .5) * 12 * depth}px`;
        });
      });
    }
  }

  init();
})();
