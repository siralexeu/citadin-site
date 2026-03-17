// Detect if we are in the English section
const isEnglish = window.location.pathname.startsWith('/en/');
// Define the base path for components based on language
const componentPath = '/en/components/';

// Load the header
fetch(componentPath + 'header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
    initLanguageToggle(); // Inițializăm butonul de schimbare limbă după ce se încarcă header-ul
    
    // Scroll effect pentru header
    window.addEventListener('scroll', function() {
      const header = document.querySelector('header');
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 0);
      }
    });
  });

// Load the footer
fetch(componentPath + 'footer.html').then(response => response.text()).then(data => {
    document.getElementById('footer-placeholder').innerHTML = data;

    const backToTopBtn = document.getElementById("backToTopBtn");
    if (!backToTopBtn) return;

    window.addEventListener("scroll", function() {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });

    backToTopBtn.addEventListener("click", function() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
}).catch(err => console.error('Error loading footer:', err));

// Function for custom modal display
function showModal(type, title, message) {
  const modal = document.getElementById('customModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modal.className = 'modal-overlay show ' + type;
  
  const closeModal = () => {
    modal.classList.remove('show');
    if (typeof onClose === 'function') onClose();
  };
  
  document.getElementById('modalClose').onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

// Function for FLOATING modal display
function showModalFloat(type, title, message) {
  const modal = document.getElementById('customModalFloat');
  const modalTitle = document.getElementById('modalTitleFloat');
  const modalMessage = document.getElementById('modalMessageFloat');
  
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modal.className = 'modal-overlay show ' + type;
  
  const closeModal = () => {
    modal.classList.remove('show');
  };
  
  document.getElementById('modalCloseFloat').onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

// ⭐ GLOBAL EmailJS Initialization
function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init('JKX55VRe-8G1AF8IT');
    console.log('EmailJS initialized successfully');
  } else {
    console.error('EmailJS is not loaded');
  }
}

// Load the floating contact form
document.addEventListener('DOMContentLoaded', function() {

  // Load the floating form from the language-specific components folder
  fetch(componentPath + 'contact-float.html').then(response => response.text()).then(data => {
      document.body.insertAdjacentHTML('beforeend', data);

        const ctaButton = document.getElementById('ctaOpenForm');
        const formContainer = document.getElementById('contactFormContainer');
        const navButton = document.getElementById('navOpenForm');
        
        if (ctaButton && formContainer) {
          ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            formContainer.classList.add('show');
          });
        }
        if (navButton && formContainer) {
          navButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            formContainer.classList.add('show');
          });
        }

      // Load reCAPTCHA dynamically
      const recaptchaScript = document.createElement('script');
      recaptchaScript.src = 'https://www.google.com/recaptcha/api.js';
      recaptchaScript.async = true;
      recaptchaScript.defer = true;
      document.head.appendChild(recaptchaScript);

      // Wait for EmailJS
      function waitForEmailJS(callback, maxAttempts = 50) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (typeof emailjs !== 'undefined') {
            clearInterval(interval);
            initEmailJS();
            callback();
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            console.error('EmailJS did not load in time.');
          }
        }, 100);
      }

      waitForEmailJS(() => {
        const toggleButton = document.getElementById('toggleFormButton');
        const formContainer = document.getElementById('contactFormContainer');
        const floatingForm = document.getElementById('floatingContactForm');

        if (toggleButton && formContainer) {
          toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            formContainer.classList.toggle('show');
          });
        }

        document.addEventListener('click', (e) => {
          if (
            formContainer &&
            formContainer.classList.contains('show') &&
            !formContainer.contains(e.target) &&
            e.target !== toggleButton
          ) {
            formContainer.classList.remove('show');
          }
        });

        if (floatingForm) {
          floatingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (typeof grecaptcha === 'undefined') {
              alert('reCAPTCHA is not loaded yet.');
              return;
            }

            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
              alert(isEnglish ? 'Please complete the reCAPTCHA.' : 'Te rugăm să completezi reCAPTCHA.');
              return;
            }

            const terms = document.getElementById('terms2');
            if (!terms.checked) {
              alert(isEnglish ? 'Please accept the terms.' : 'Te rugăm să accepți termenii.');
              return;
            }

            const submitBtn = floatingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = isEnglish ? 'Sending...' : 'Se trimite...';
            submitBtn.disabled = true;

            const templateParams = {
              nume: document.getElementById('nume2').value,
              email: document.getElementById('email2').value,
              telefon: document.getElementById('telefon2').value,
              mesaj: document.getElementById('mesaj2').value
            };

            emailjs.send('service_citadin', 'template_citadin', templateParams)
              .then(function() {
                floatingForm.reset();
                grecaptcha.reset();

                showModalFloat(
                  'success',
                  isEnglish ? 'Success!' : 'Succes!',
                  isEnglish ? 'Message sent!' : 'Mesaj trimis!',
                  () => {
                    formContainer.classList.remove('show');
                  }
                );
              })
              .catch(function() {
                showModalFloat('error', 'Error', 'Something went wrong.');
              })
              .finally(function() {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
              });
          });
        }
      });
    })
    .catch(error => console.error('Error loading form component:', error));
});


function initLanguageToggle() {
  const langButton = document.getElementById("lang-toggle");
  if (!langButton) return;

  const currentUrl = window.location.pathname;

  if (currentUrl.startsWith("/en/")) {
    langButton.textContent = "Română";
  } else {
    langButton.textContent = "English";
  }

  langButton.addEventListener("click", () => {
    let newUrl;
    if (currentUrl.startsWith("/en/")) {
      newUrl = currentUrl.replace("/en/", "/");
    } else {
      newUrl = "/en" + currentUrl;
    }
    window.location.href = newUrl;
  });
}

// Favicon check
if (!document.querySelector('link[rel="icon"]')) {
  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/png';
  favicon.href = '/img/favicon.png';
  document.head.appendChild(favicon);
}