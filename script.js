const contactForm = document.getElementById('contact-form');
const submitButton = document.querySelector('button[type="submit"]');
const statusMessage = document.getElementById('status-message');

contactForm.addEventListener('submit', function (event) {
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