// Încarcă header-ul
fetch('header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
    initLanguageToggle(); // activăm butonul DUPĂ ce header-ul e inserat
  });
  
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (window.scrollY > 0) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});
// Încarcă footer-ul
fetch('footer.html')
  .then(response => response.text())
  .then(data => {
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
  // === 2️⃣ Anul curent automat ===
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// Validare formular contact cu reCAPTCHA v2


// Funcție pentru afișare modal custom
function showModal(type, title, message) {
  const modal = document.getElementById('customModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  
  // Setează conținutul
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  
  // Adaugă clasa pentru tip (success/error)
  modal.className = 'modal-overlay show ' + type;
  
  // Închide modalul la click pe buton sau overlay
  const closeModal = () => {
    modal.classList.remove('show');
  };
  
  document.getElementById('modalClose').onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

document.addEventListener('DOMContentLoaded', function() {
  
  // Inițializare EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init('JKX55VRe-8G1AF8IT');
  }
  
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Verifică reCAPTCHA
      const recaptchaResponse = grecaptcha.getResponse();
      if (recaptchaResponse.length === 0) {
        alert('Te rugăm să completezi reCAPTCHA pentru a continua.');
        return;
      }
      
      // Verifică termenii și condițiile
      const terms = document.getElementById('terms');
      if (!terms.checked) {
        alert('Te rugăm să accepți termenii și condițiile pentru a continua.');
        return;
      }
      
      // Dezactivează butonul de submit
      const submitBtn = document.getElementById('contact-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Se trimite...';
      submitBtn.disabled = true;
      
      // Parametrii pentru email
      const templateParams = {
        nume: document.getElementById('nume').value,
        email: document.getElementById('email').value,
        telefon: document.getElementById('telefon').value,
        mesaj: document.getElementById('mesaj').value
      };
      
      // Trimite emailul prin EmailJS
      emailjs.send('service_citadin', 'template_citadin', templateParams)
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
          
          // Modal de succes
          showModal(
            'success',
            'Mesaj trimis cu succes!',
            'Mulțumim pentru mesajul dvs. Vă vom răspunde în cel mai scurt timp posibil.'
          );
          
          // Resetează formularul
          document.getElementById('contactForm').reset();
          grecaptcha.reset();
          
        }, function(error) {
          console.log('FAILED...', error);
          
          // Modal de eroare
          showModal(
            'error',
            'Eroare la trimitere',
            'A apărut o eroare la trimiterea mesajului. Te rugăm să încerci din nou sau să ne contactezi direct la alexandru.cavaler@citadinconsulting.ro'
          );
        })
        .finally(function() {
          // Reactivează butonul
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
    });
  }
});

// Încarcă formularul de contact plutitor DOAR dacă NU suntem pe pagina de contact
const currentPage = window.location.pathname;
const isContactPage = currentPage.includes('contact.html') || currentPage.endsWith('contact') || currentPage.includes('/en/contact');

console.log('Pagina curentă:', currentPage);
console.log('Este pagina de contact?', isContactPage);

if (!isContactPage) {
  console.log('Încarcă formularul plutitor...');
  fetch('/contact-float.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data);

      // Reîncarcă scriptul reCAPTCHA pentru elementul nou adăugat
      const recaptchaScript = document.createElement('script');
      recaptchaScript.src = 'https://www.google.com/recaptcha/api.js';
      recaptchaScript.async = true;
      recaptchaScript.defer = true;
      document.body.appendChild(recaptchaScript);

      // Activează butonul toggle
      const contactToggle = document.getElementById("toggleFormButton");
      const contactContainer = document.getElementById("contactFormContainer");
      contactToggle.addEventListener("click", () => {
        contactContainer.classList.toggle("show");
      });
    });
}

// Funcție pentru a afișa/ascunde formularul de contact
function toggleContactForm() {
  const formContainer = document.getElementById('contactFormContainer');
  if (formContainer.style.display === 'none' || formContainer.style.display === '') {
      formContainer.style.display = 'block'; // Afișează formularul
  } else {
      formContainer.style.display = 'none'; // Ascunde formularul
  }
}

function initLanguageToggle() {
  const langButton = document.getElementById("lang-toggle");
  if (!langButton) return;

  const currentUrl = window.location.pathname;

  // setăm textul butonului în funcție de limbă
  if (currentUrl.startsWith("/en/")) {
    langButton.textContent = "Română";
  } else {
    langButton.textContent = "English";
  }

  // la click, schimbăm limba
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