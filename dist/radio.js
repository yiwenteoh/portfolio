// Official YouTube playback; collapsing controls never pauses the track.
(function () {
  'use strict';
  const config = window.PORTFOLIO_DATA.audio;
  const panel = document.querySelector('[data-radio-panel]');
  const video = document.querySelector('[data-radio-video]');
  const toggle = document.querySelector('[data-radio]');
  const status = document.querySelector('[data-radio-status]');
  let wanted = false;
  let player;
  let ready = false;
  let loading;
  let loadTimer;
  let timer;
  let context;
  let buffer;
  let bufferPromise;
  let activeSource;
  let activeGain;
  let chatterLevel = config.chatterVolume;
  let playing = false;

  function label(text) {
    toggle.setAttribute('aria-pressed', String(wanted));
    toggle.querySelector('strong').textContent = text;
  }

  function stopChatter() {
    clearTimeout(timer);
    timer = null;
    if (activeSource) {
      try { activeSource.stop(); } catch (_) { /* Already ended. */ }
      activeSource = null;
      activeGain = null;
    }
  }

  function stop() {
    wanted = false;
    playing = false;
    clearTimeout(loadTimer);
    stopChatter();
    if (ready) player.pauseVideo();
    panel.hidden = true;
    video.hidden = true;
    label('OFF');
  }

  function fail(message) {
    stop();
    panel.hidden = false;
    status.textContent = message;
  }

  const random = (range) => range[0] + Math.random() * (range[1] - range[0]);

  function scheduleChatter(first = false) {
    if (!wanted || !playing || !buffer || !context || timer || activeSource || chatterLevel <= 0) return;
    timer = setTimeout(() => {
      timer = null;
      if (!wanted || !playing || document.hidden) return;
      const duration = Math.min(random(config.chatterDuration), buffer.duration);
      const now = context.currentTime;
      const source = context.createBufferSource();
      const lowpass = context.createBiquadFilter();
      const gain = context.createGain();
      source.buffer = buffer;
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 1450; // Distant, soft voices instead of sharp foreground speech.
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(chatterLevel, now + 1.5);
      gain.gain.setValueAtTime(chatterLevel, now + duration - 1.5);
      gain.gain.linearRampToValueAtTime(0, now + duration);
      source.connect(lowpass).connect(gain).connect(context.destination);
      activeSource = source;
      activeGain = gain;
      source.onended = () => {
        source.disconnect(); lowpass.disconnect(); gain.disconnect();
        if (activeSource === source) { activeSource = null; activeGain = null; scheduleChatter(); }
      };
      source.start(now, Math.random() * Math.max(0, buffer.duration - duration), duration);
    }, (first ? 5 : random(config.chatterGap)) * 1000);
  }

  function prepareChatter() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx || !config.chatter) return;
    context ||= new AudioCtx();
    context.resume().catch(() => {});
    bufferPromise ||= fetch(config.chatter)
      .then(response => { if (!response.ok) throw new Error('Missing chatter asset'); return response.arrayBuffer(); })
      .then(bytes => context.decodeAudioData(bytes))
      .then(result => { buffer = result; scheduleChatter(true); })
      .catch(() => { bufferPromise = null; if (wanted) status.textContent = 'Music is available; chatter could not load.'; });
  }

  function loadYouTube() {
    if (window.YT?.Player) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      window.onYouTubeIframeAPIReady = resolve;
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => { loading = null; script.remove(); reject(new Error('YouTube unavailable')); };
      document.head.appendChild(script);
    });
    return loading;
  }

  async function start() {
    wanted = true;
    panel.hidden = false;
    label('ON');
    status.textContent = 'Loading your track…';
    prepareChatter();
    clearTimeout(loadTimer);
    loadTimer = setTimeout(() => {
      if (wanted && !playing) {
        label('ON');
        status.textContent = 'YouTube has not started. Press Play if it appears; if the player stays blank, try this site in your regular browser.';
      }
    }, 10000);
    try {
      await loadYouTube();
      if (!wanted) return;
      if (ready) { player.playVideo(); return; }
      if (player) return;
      player = new YT.Player('store-youtube-player', {
        width: '100%', height: '203', videoId: config.youtubeId,
        playerVars: { playsinline: 1, fs: 0, controls: 1, loop: 1, playlist: config.youtubeId, origin: location.origin },
        events: {
          onReady(event) {
            ready = true;
            event.target.getIframe().title = 'Store Radio — selected YouTube track';
            event.target.getIframe().removeAttribute('allowfullscreen');
            event.target.setVolume(Number(config.musicVolume));
            if (wanted) event.target.playVideo();
          },
          onStateChange(event) {
            playing = event.data === 1;
            if (playing && !wanted) { player.pauseVideo(); playing = false; return; }
            if (!wanted) return;
            if (playing) {
              clearTimeout(loadTimer);
              label('ON'); status.textContent = 'Now playing · occasional soft chatter';
              scheduleChatter(true);
            } else {
              stopChatter();
              label('ON');
              status.textContent = event.data === 2 ? 'Music paused · chatter remains ready.' : 'Music loading · chatter is on.';
            }
          },
          onAutoplayBlocked() { if (wanted) { label('ON'); status.textContent = 'Chatter is on; music is waiting for browser playback.'; } },
          onError() { fail('YouTube could not play this track here. Try the YouTube link below, or switch Store Radio on to retry.'); }
        }
      });
    } catch (_) { fail('YouTube could not load. Check your connection and turn Store Radio on to retry.'); }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopChatter(); else scheduleChatter();
  });
  window.addEventListener('pagehide', stop);
  window.StoreRadio = { toggle: () => {
    if (!wanted) start();
    else stop();
  } };
})();
