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

const feedback = ['Mathijs was always positive, always open to feedback, as shown in the multiple team discussions that we held, and cooperative within the team. It was a pleasure working alongside him',
  'Very motivated team player that is willing to listen to anything the team is struggling with. Provides quality work.',
  'Well spoken and easy to get along with. Knows when to work and when to be casual.',
  'Mathijs is a charismatic person who knows when to be informal but also when to put the team to work.'];
let currentFeedbackIndex = 0;

function changeFeedback() {
  const currentFeedbackElement = document.getElementById('current-feedback');

  currentFeedbackElement.style.opacity = 0;

  // After the fading out transition ends, update the content and fade in the next word
  setTimeout(() => {
    // Get the next word from the array
    currentFeedbackIndex = (currentFeedbackIndex + 1) % feedback.length;
    const nextFeedback = feedback[currentFeedbackIndex];

    // Update the content
    currentFeedbackElement.textContent = nextFeedback;

    // Start fading in the next word
    currentFeedbackElement.style.opacity = 1;
  }, 1000); // Adjust the delay (in milliseconds) to match the transition duration
}

// Call the changeWord function repeatedly with a time interval
setInterval(changeWord, 3000); // Adjust the interval (in milliseconds) between word changes
setInterval(changeFeedback, 6000);

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
  const playAgainBtn = document.getElementById('tr-play-again');
  const closeResultBtn = document.getElementById('tr-close-result');
  const exitButtons = [document.getElementById('tr-exit'), document.getElementById('tr-exit-2')].filter(Boolean);
  const restartBtn = document.getElementById('tr-restart');

  if (!startBtn || !overlay || !textEl || !wpmEl || !accEl || !progEl) return;

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
    if (timeEl) timeEl.textContent = `${elapsedSec}s`;
    if (wpmFinalEl) wpmFinalEl.textContent = String(wpm);
    if (accFinalEl) accFinalEl.textContent = `${acc}%`;
    if (correctEl) correctEl.textContent = String(correctCount);
    if (mistakesEl) mistakesEl.textContent = String(mistakesCount);
    resultCard.hidden = false;
  }

  startBtn.addEventListener('click', openOverlay);
  exitButtons.forEach(btn => btn && btn.addEventListener('click', closeOverlay));
  if (restartBtn) restartBtn.addEventListener('click', resetRace);
  overlay.addEventListener('keydown', onKeyDown);
  if (playAgainBtn) playAgainBtn.addEventListener('click', () => { resultCard.hidden = true; resetRace(); overlay.focus(); });
  if (closeResultBtn) closeResultBtn.addEventListener('click', () => { resultCard.hidden = true; closeOverlay(); });
})();
