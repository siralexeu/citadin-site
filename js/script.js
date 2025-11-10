// Încarcă header-ul
fetch('/components/header.html').then(response => response.text()).then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
    initLanguageToggle();
        
    window.addEventListener('scroll', function() {
      const header = document.querySelector('header');
      if (window.scrollY > 0) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
});

// Încarcă footer-ul
fetch('/components/footer.html').then(response => response.text()).then(data => {
    document.getElementById('footer-placeholder').innerHTML = data;

    const backToTopBtn = document.getElementById("backToTopBtn");

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
});

// Funcție pentru afișare modal custom
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

// Funcție pentru afișare modal PLUTITOR
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

// ⭐ Inițializare EmailJS GLOBALĂ (nu doar în DOMContentLoaded)
function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init('JKX55VRe-8G1AF8IT');
    console.log('EmailJS inițializat cu succes');
  } else {
    console.error('EmailJS nu este încărcat');
  }
}

// Încarcă formularul de contact plutitor
document.addEventListener('DOMContentLoaded', function() {

  // Încarcă formularul plutitor în toate paginile
  fetch('/components/contact-float.html').then(response => response.text()).then(data => {
      document.body.insertAdjacentHTML('beforeend', data);

        const ctaButton = document.getElementById('ctaOpenForm');
        const formContainer = document.getElementById('contactFormContainer');
        const navButton = document.getElementById('navOpenForm');
        
        if (ctaButton && formContainer) {
          ctaButton.addEventListener('click', (e) => {
            e.preventDefault(); // Previne navigarea și adăugarea #contact în URL
            e.stopPropagation(); // Previne declanșarea evenimentului global
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

      // Încarcă reCAPTCHA dinamic
      const recaptchaScript = document.createElement('script');
      recaptchaScript.src = 'https://www.google.com/recaptcha/api.js';
      recaptchaScript.async = true;
      recaptchaScript.defer = true;
      document.head.appendChild(recaptchaScript);

      // Așteaptă EmailJS
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
            console.error('EmailJS nu s-a încărcat în timp util.');
          }
        }, 100);
      }

      waitForEmailJS(() => {
        const toggleButton = document.getElementById('toggleFormButton');
        const formContainer = document.getElementById('contactFormContainer');
        const floatingForm = document.getElementById('floatingContactForm');

        if (toggleButton && formContainer) {
          toggleButton.addEventListener('click', (e) => {
            e.stopPropagation(); // împiedică declanșarea evenimentului global
            formContainer.classList.toggle('show');
          });
        }

        // Închide formularul când se face click în afară
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
              alert('reCAPTCHA nu este încă încărcat. Te rugăm să aștepți.');
              return;
            }

            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
              alert('Te rugăm să completezi reCAPTCHA.');
              return;
            }

            const terms = document.getElementById('terms2');
            if (!terms.checked) {
              alert('Te rugăm să accepți termenii și condițiile.');
              return;
            }

            const submitBtn = floatingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Se trimite...';
            submitBtn.disabled = true;

            const templateParams = {
              nume: document.getElementById('nume2').value,
              email: document.getElementById('email2').value,
              telefon: document.getElementById('telefon2').value,
              mesaj: document.getElementById('mesaj2').value
            };

            emailjs.send('service_citadin', 'template_citadin', templateParams)
              .then(function() {
                // Resetează imediat formularul și reCAPTCHA
                floatingForm.reset();
                grecaptcha.reset();

                // Arată modalul, închiderea formularului se face doar după OK
                showModalFloat(
                  'success',
                  'Mesaj trimis cu succes!',
                  'Mulțumim pentru mesajul tău! Vă vom răspunde cât mai curând.',
                  () => {
                    formContainer.classList.remove('show'); // formularul se închide după OK
                  }
                );
              })
              .catch(function() {
                showModalFloat(
                  'error',
                  'Eroare la trimitere',
                  'A apărut o eroare. Încearcă din nou sau contactează-ne direct.'
                );
              })
              .finally(function() {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
              });
          });
        }
      });
    })
    .catch(error => console.error('Eroare la încărcarea formularului plutitor:', error));
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

// Adaugă favicon dacă nu există deja
if (!document.querySelector('link[rel="icon"]')) {
  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/png';
  favicon.href = '/img/favicon.png'; // cale absolută din root
  document.head.appendChild(favicon);
}

