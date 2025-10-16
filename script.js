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
