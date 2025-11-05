// Contact form handling (if present)
const contactForm = document.getElementById('contact-form');
const submitButton = document.querySelector('button[type="submit"]');
const statusMessage = document.getElementById('status-message');

if (contactForm && submitButton && statusMessage) {
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    const formData = new FormData(contactForm);
    fetch('send_email.php', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        submitButton.disabled = false;
        submitButton.textContent = 'Send';
        statusMessage.textContent = data.message;
        statusMessage.classList.add(data.status === 'success' ? 'status-success' : 'status-error');
        setTimeout(() => {
          statusMessage.textContent = '';
          statusMessage.classList.remove('status-success', 'status-error');
        }, 3000);
        contactForm.reset();
      })
      .catch(error => {
        submitButton.disabled = false;
        submitButton.textContent = 'Send';
        statusMessage.textContent = 'Failed to submit form. Please try again later.';
        statusMessage.classList.add('status-error');
        setTimeout(() => {
          statusMessage.textContent = '';
          statusMessage.classList.remove('status-error');
        }, 3000);
      });
  });
}

const words = ['Universe Generation', 'Path Ray Tracing', 'Height Mapping Terrain', 'TCP Chatroom', 'AI plays Classic Games'];
let currentWordIndex = 0;

// Function to update the current word and trigger the sliding effect
function changeWord() {
  const currentWordElement = document.getElementById('current-word');

  currentWordElement.style.opacity = 0;

  // After the fading out transition ends, update the content and fade in the next word
  setTimeout(() => {
    // Get the next word from the array
    currentWordIndex = (currentWordIndex + 1) % words.length;
    const nextWord = words[currentWordIndex];

    // Update the content
    currentWordElement.textContent = nextWord;

    // Start fading in the next word
    currentWordElement.style.opacity = 1;
  }, 1000); // Adjust the delay (in milliseconds) to match the transition duration
}

// Call the changeWord function repeatedly with a time interval
setInterval(changeWord, 3000); // Adjust the interval (in milliseconds) between word changes

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', String(!expanded));
    navToggle.setAttribute('aria-expanded', String(!expanded));
  });
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal-on-scroll');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  // Fallback
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===============================
// Leaderboard-only overlay (openable from About)
// ===============================
(function initLeaderboardOverlay(){
  const overlay = document.getElementById('leaderboard-overlay');
  const listEl = document.getElementById('lb-list');
  const openBtn = document.getElementById('open-leaderboard');
  const closeButtons = [document.getElementById('lb-exit'), document.getElementById('lb-exit-2')].filter(Boolean);
  const endpoint = 'leaderboard.php';
  if (!overlay || !listEl) return;

  async function fetchAndRender(){
    try {
      listEl.innerHTML = '';
      const res = await fetch(endpoint + '?t=' + Date.now(), { cache: 'no-store' });
      const data = await res.json();
      const top = Array.isArray(data.top) ? data.top : [];
      top.slice(0, 50).forEach((row, idx) => {
        const li = document.createElement('li');
        const name = (row && row.name) ? String(row.name) : 'Anonymous';
        const score = (row && row.score) ? Number(row.score) : 0;
        const wpm = (row && row.wpm) ? Number(row.wpm) : 0;
        const time = (row && row.time) ? Number(row.time) : 0;
        li.textContent = `#${idx+1} ${name} - ${score} pts (WPM ${wpm}, ${time}s)`;
        listEl.appendChild(li);
      });
      if (!top.length){ listEl.innerHTML = '<li>No scores yet. Be the first!</li>'; }
    } catch (e) {
      listEl.innerHTML = '<li>Could not load leaderboard.</li>';
    }
  }

  function escToClose(e){ if (e.key === 'Escape') close(); }
  function open(){
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
    fetchAndRender();
    setTimeout(() => overlay.focus(), 50);
    document.addEventListener('keydown', escToClose);
  }
  function close(){
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', escToClose);
  }

  // Expose for Type Racer submit success
  window.openLeaderboardOverlay = open;

  if (openBtn) openBtn.addEventListener('click', open);
  closeButtons.forEach(btn => btn && btn.addEventListener('click', close));
})();

// ===============================
// Looping typewriter for greeting (top of page)
// Types and erases "greetings" in multiple languages
// ===============================
(function initGreetingTypewriter(){
  const el = document.querySelector('.introAnimation');
  if (!el) return;

  // Apply JS-driven typewriter styling (disables the old CSS overlay)
  el.classList.add('js-typewriter');

  // Short, readable variants of "greetings" in different languages
  // Use hex HTML entities for non-ASCII characters to avoid encoding issues
  const phrasesUnits = [
    // EN: Greetings!
    ['G','r','e','e','t','i','n','g','s','!'],
    // PL: Cześć!
    ['C','z','e','&#x015B;','&#x0107;','!'],
    // NL: Hoi!
    ['H','o','i','!'],
    // FR: Bonjour!
    ['B','o','n','j','o','u','r','!'],
    // ES: ¡Hola!
    ['&#x00A1;','H','o','l','a','!'],
    // DE: Guten Tag!
    ['G','u','t','e','n',' ','T','a','g','!'],
    // JA: こんにちは！
    ['&#x3053;','&#x3093;','&#x306B;','&#x3061;','&#x306F;','&#xFF01;'],
    // RU: Привет!
    ['&#x041F;','&#x0440;','&#x0438;','&#x0432;','&#x0435;','&#x0442;','!'],
    // KO: 안녕하세요!
    ['&#xC548;','&#xB155;','&#xD558;','&#xC138;','&#xC694;','!'],
    // ZH: 你好！
    ['&#x4F60;','&#x597D;','&#xFF01;'],
    // RO: Salut!
    ['S','a','l','u','t','!'],
  ];

  const typeDelay = 90;      // ms per character while typing
  const deleteDelay = 55;    // ms per character while deleting
  const holdAfterType = 900; // ms to hold the full word
  const holdAfterDelete = 300; // ms before starting next word

  let iPhrase = 0;
  let iChar = 0;
  let deleting = false;
  let paused = document.hidden === true;

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  // Decode HTML entities once to real strings, then split into code points
  function decodeEntities(html) {
    const span = document.createElement('span');
    span.innerHTML = html;
    return span.textContent || span.innerText || html;
  }

  const phrasesDecoded = phrasesUnits.map(units => decodeEntities(units.join('')));
  const phrasesCodepoints = phrasesDecoded.map(str => Array.from(str));

  // Pause typing while tab is hidden to save CPU/memory churn
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden === true;
  });

  async function loop(){
    while(true){
      if (paused) { await sleep(300); continue; }
      const cps = phrasesCodepoints[iPhrase];
      if (!deleting){
        // Type forward using textContent (faster/less churn than innerHTML)
        el.textContent = cps.slice(0, iChar + 1).join('');
        iChar++;
        if (iChar >= cps.length){
          await sleep(holdAfterType);
          deleting = true;
        }
        await sleep(typeDelay);
      } else {
        // Delete backward
        el.textContent = cps.slice(0, Math.max(0, iChar - 1)).join('');
        iChar--;
        if (iChar <= 0){
          deleting = false;
          iPhrase = (iPhrase + 1) % phrasesCodepoints.length;
          await sleep(holdAfterDelete);
        }
        await sleep(deleteDelay);
      }
    }
  }

  loop();
})();

// ===============================
// Type Racer for About section
// ===============================
(function initTypeRacer(){
  const startBtn = document.getElementById('start-typeracer');
  const overlay = document.getElementById('typeracer-overlay');
  const textEl = document.getElementById('tr-text');
  const wpmEl = document.getElementById('tr-wpm');
  const accEl = document.getElementById('tr-acc');
  const progEl = document.getElementById('tr-prog');
  const resultCard = document.getElementById('tr-result');
  const timeEl = document.getElementById('tr-time');
  const wpmFinalEl = document.getElementById('tr-wpm-final');
  const accFinalEl = document.getElementById('tr-acc-final');
  const correctEl = document.getElementById('tr-correct');
  const mistakesEl = document.getElementById('tr-mistakes');
  const scoreEl = document.getElementById('tr-score');
  const nameInput = document.getElementById('tr-name');
  const submitBtn = document.getElementById('tr-submit-score');
  const submitStatus = document.getElementById('tr-submit-status');
  const leaderboardList = document.getElementById('tr-leaderboard');
  const playAgainBtn = document.getElementById('tr-play-again');
  const closeResultBtn = document.getElementById('tr-close-result');
  const exitButtons = [document.getElementById('tr-exit'), document.getElementById('tr-exit-2')].filter(Boolean);
  const restartBtn = document.getElementById('tr-restart');

  if (!startBtn || !overlay || !textEl || !wpmEl || !accEl || !progEl) return;
  const leaderboardUrl = 'leaderboard.php';

  // Get the raw About text content (merge both cards)
  const aboutCards = document.querySelectorAll('#about .card-text');
  const aboutText = Array.from(aboutCards)
    .map(card => card.innerText.replace(/\s+/g, ' ').trim())
    .join(' ');

  let target = aboutText;
  let idx = 0;                 // current caret position (typed length)
  let hits = [];               // array of 1 (correct) or 0 (incorrect) for each typed char
  let startedAt = null;        // timestamp in ms
  let finished = false;
  let charSpans = [];          // spans representing each char
  let caretEl = null;          // line caret element

  function buildTextOnce() {
    // Build all character spans once for performance; then we update classes and caret position
    textEl.innerHTML = '';
    charSpans = new Array(target.length);
    const frag = document.createDocumentFragment();
    for (let i = 0; i < target.length; i++) {
      const span = document.createElement('span');
      span.className = 'tr-rem';
      span.textContent = target[i] || ' ';
      charSpans[i] = span;
      frag.appendChild(span);
    }
    caretEl = document.createElement('span');
    caretEl.className = 'tr-caret-line';
    caretEl.setAttribute('aria-hidden', 'true');
    textEl.appendChild(frag);
    textEl.appendChild(caretEl);
  }

  function renderProgress() {
    // Update classes up to idx
    for (let i = 0; i < charSpans.length; i++) {
      const span = charSpans[i];
      if (!span) continue;
      if (i < idx) {
        span.className = hits[i] === 1 ? 'tr-ok' : 'tr-miss';
      } else {
        span.className = 'tr-rem';
      }
    }
    // Position caret absolutely at the start of the current character (or end of content)
    if (!caretEl) return;
    const containerRect = textEl.getBoundingClientRect();
    let x = 0, y = 0, h = parseFloat(getComputedStyle(textEl).lineHeight) || 20;
    if (idx < charSpans.length) {
      const targetSpan = charSpans[idx];
      const r = targetSpan.getBoundingClientRect();
      x = r.left - containerRect.left + textEl.scrollLeft;
      y = r.top - containerRect.top + textEl.scrollTop;
      h = r.height || h;
    } else if (charSpans.length) {
      const lastSpan = charSpans[charSpans.length - 1];
      const r = lastSpan.getBoundingClientRect();
      x = r.right - containerRect.left + textEl.scrollLeft;
      y = r.bottom - containerRect.top + textEl.scrollTop - (r.height || h);
      h = r.height || h;
    }
  caretEl.style.left = `${Math.max(0, x)}px`;
  caretEl.style.top = `${Math.max(0, y)}px`;
  caretEl.style.height = `${h}px`;

    // Keep caret visible vertically
    const caretTop = y;
    const caretBottom = y + h;
    const viewTop = textEl.scrollTop;
    const viewBottom = viewTop + textEl.clientHeight;
    if (caretBottom > viewBottom - 10) {
      textEl.scrollTop = caretBottom - textEl.clientHeight + 10;
    } else if (caretTop < viewTop + 10) {
      textEl.scrollTop = Math.max(0, caretTop - 10);
    }
  }

  function resetRace() {
    idx = 0;
    hits = [];
    startedAt = null;
    finished = false;
    updateStats();
    buildTextOnce();
    renderProgress();
    // center view
    textEl.scrollTop = 0;
  }

  function openOverlay() {
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
    resetRace();
    setTimeout(() => overlay.focus(), 50);
    // trap focus basic
    document.addEventListener('keydown', escToClose);
  }

  function closeOverlay() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', escToClose);
  }

  function escToClose(e){ if (e.key === 'Escape') closeOverlay(); }

  function updateStats() {
    const elapsedMin = startedAt ? (Date.now() - startedAt) / 60000 : 0;
    const wordsTyped = idx / 5; // standard WPM metric
    const wpm = elapsedMin > 0 ? Math.round(wordsTyped / elapsedMin) : 0;
    const correctCount = hits.reduce((a, b) => a + (b === 1 ? 1 : 0), 0);
    const typed = idx;
    const acc = typed > 0 ? Math.max(0, Math.round((correctCount / typed) * 100)) : 100;
    const prog = Math.round((idx / target.length) * 100);
    wpmEl.textContent = String(wpm);
    accEl.textContent = `${acc}%`;
    progEl.textContent = `${prog}%`;
  }

  function onKeyDown(e) {
    if (finished) return;
    const key = e.key;
    // Start timer at first actionable key
    if (!startedAt && (key.length === 1 || key === 'Backspace' || key === ' ')) {
      startedAt = Date.now();
    }

    if (key === 'Backspace') {
      e.preventDefault();
      if (idx > 0) {
        idx--;
        hits[idx] = undefined;
        renderProgress();
        updateStats();
      }
      return;
    }

    // Ignore control/navigation keys
    if (key.length !== 1) return;

    e.preventDefault();
    const expected = target[idx] || '';
    const ok = normalizeChar(key) === normalizeChar(expected);
    hits[idx] = ok ? 1 : 0;
    if (!ok && caretEl) {
      caretEl.style.animation = 'none';
      void caretEl.offsetWidth;
      caretEl.style.animation = 'caret-blink 0.15s steps(2) 2';
      setTimeout(() => { caretEl.style.animation = ''; }, 200);
    }
    idx++;

  renderProgress();
  updateStats();

    if (idx >= target.length) {
      finished = true;
      showResults();
    }
  }

  function escapeHtml(s){
    return s
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }

  function normalizeChar(c){
    // map curly quotes and dashes and NBSP to simpler counterparts for friendlier typing
    if (c === '\u2019' || c === '\u2018') return "'";
    if (c === '\u2011' || c === '\u2010' || c === '\u2013' || c === '\u2014') return '-';
    if (c === '\u00A0') return ' ';
    return c;
  }

  function showResults() {
    if (!resultCard) return;
    const elapsedMs = startedAt ? (Date.now() - startedAt) : 0;
    const elapsedSec = Math.max(0, Math.round(elapsedMs / 1000));
    const elapsedMin = elapsedMs / 60000;
    const wpm = elapsedMin > 0 ? Math.round((idx / 5) / elapsedMin) : 0;
    const correctCount = hits.reduce((a, b) => a + (b === 1 ? 1 : 0), 0);
    const mistakesCount = hits.reduce((a, b) => a + (b === 0 ? 1 : 0), 0);
    const acc = idx > 0 ? Math.max(0, Math.round((correctCount / idx) * 100)) : 100;
    const score = correctCount * wpm; // scoring: correct chars × WPM
    if (timeEl) timeEl.textContent = `${elapsedSec}s`;
    if (wpmFinalEl) wpmFinalEl.textContent = String(wpm);
    if (accFinalEl) accFinalEl.textContent = `${acc}%`;
    if (correctEl) correctEl.textContent = String(correctCount);
    if (mistakesEl) mistakesEl.textContent = String(mistakesCount);
    if (scoreEl) scoreEl.textContent = String(score);
    resultCard.hidden = false;
    // Load leaderboard when results open
    fetchLeaderboard().catch(()=>{});
  }

  startBtn.addEventListener('click', openOverlay);
  exitButtons.forEach(btn => btn && btn.addEventListener('click', closeOverlay));
  if (restartBtn) restartBtn.addEventListener('click', resetRace);
  overlay.addEventListener('keydown', onKeyDown);
  if (playAgainBtn) playAgainBtn.addEventListener('click', () => { resultCard.hidden = true; resetRace(); overlay.focus(); });
  if (closeResultBtn) closeResultBtn.addEventListener('click', () => { resultCard.hidden = true; closeOverlay(); });

  // Leaderboard interactions
  async function fetchLeaderboard(){
    if (!leaderboardList) return;
    leaderboardList.innerHTML = '';
    try {
      const res = await fetch(leaderboardUrl + '?t=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) throw new Error('Network');
      const data = await res.json();
      const top = Array.isArray(data.top) ? data.top : [];
      renderLeaderboard(top);
    } catch (e) {
      // silently ignore
    }
  }

  function renderLeaderboard(items){
    if (!leaderboardList) return;
    leaderboardList.innerHTML = '';
    items.slice(0, 20).forEach((row, idx) => {
      const li = document.createElement('li');
      const name = (row && row.name) ? String(row.name) : 'Anonymous';
      const score = (row && row.score) ? Number(row.score) : 0;
      const wpm = (row && row.wpm) ? Number(row.wpm) : 0;
      li.textContent = `#${idx+1} ${name} - ${score} pts (WPM ${wpm})`;
      leaderboardList.appendChild(li);
    });
  }

  async function submitScore(){
    if (!submitBtn) return;
    submitBtn.disabled = true;
    if (submitStatus) submitStatus.textContent = 'Submitting…';
    // Recompute in case UI changed
    const timeStr = timeEl ? timeEl.textContent : '0s';
    const timeSec = Number((timeStr || '0s').replace(/s$/, '')) || 0;
    const wpm = Number(wpmFinalEl ? wpmFinalEl.textContent : '0') || 0;
    const correct = Number(correctEl ? correctEl.textContent : '0') || 0;
    const mistakes = Number(mistakesEl ? mistakesEl.textContent : '0') || 0;
    const score = Number(scoreEl ? scoreEl.textContent : '0') || (correct * wpm);
    let name = (nameInput && nameInput.value || '').trim();
    if (!name) name = 'Anonymous';
    name = name.slice(0, 24);
    try {
      const res = await fetch(leaderboardUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score, wpm, correct, mistakes, time: timeSec })
      });
      const data = await res.json().catch(()=>({ ok:false }));
      if (!res.ok || !data || data.ok === false){
        throw new Error('Submit failed');
      }
  if (submitStatus) submitStatus.textContent = 'Saved!';
  renderLeaderboard(Array.isArray(data.top) ? data.top : []);
  // Open the dedicated leaderboard overlay instead of navigating away
  setTimeout(() => { if (window.openLeaderboardOverlay) window.openLeaderboardOverlay(); }, 250);
    } catch (e) {
      if (submitStatus) submitStatus.textContent = 'Could not submit score.';
    } finally {
      setTimeout(()=>{ if (submitStatus) submitStatus.textContent = ''; }, 2000);
      submitBtn.disabled = false;
    }
  }

  if (submitBtn) submitBtn.addEventListener('click', submitScore);
})();
