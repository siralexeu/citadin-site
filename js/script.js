// Încarcă header-ul
fetch('header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
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
});

// Validare formular contact cu reCAPTCHA v2
document.addEventListener('DOMContentLoaded', function() {
  
  document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
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
    
    // Colectează datele formularului
    const nume = document.getElementById('nume').value;
    const email = document.getElementById('email').value;
    const telefon = document.getElementById('telefon').value;
    const mesaj = document.getElementById('mesaj').value;
    
    // Creează link-ul mailto
    const subject = encodeURIComponent('Contact de la ' + nume);
    const body = encodeURIComponent(
      'Nume: ' + nume + '\n' +
      'Email: ' + email + '\n' +
      'Telefon: ' + telefon + '\n\n' +
      'Mesaj:\n' + mesaj
    );
    
    // Deschide clientul de email
    window.location.href = 'mailto:alexandru.cavaler@citadinconsulting.ro?subject=' + subject + '&body=' + body;
    
    // Resetează formularul
    this.reset();
    grecaptcha.reset(); // Resetează și reCAPTCHA
    alert('Mulțumim! Clientul tău de email s-a deschis. Te rugăm să trimiți mesajul.');
  });
});

// Încarcă formularul de contact plutitor
fetch('contact-float.html')
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

// Funcție pentru a afișa/ascunde formularul de contact
function toggleContactForm() {
  const formContainer = document.getElementById('contactFormContainer');
  if (formContainer.style.display === 'none' || formContainer.style.display === '') {
      formContainer.style.display = 'block'; // Afișează formularul
  } else {
      formContainer.style.display = 'none'; // Ascunde formularul
  }
}

// Schimbare limbă
fetch("header.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("header-placeholder").innerHTML = data;
    initLanguageToggle(); // activăm butonul DUPĂ ce header-ul e inserat
  });

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



