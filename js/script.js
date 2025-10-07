console.log("Site-ul Citadin Consulting este funcțional ✅");

// Încarcă header-ul
fetch('header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
  });

// Încarcă footer-ul
fetch('footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer-placeholder').innerHTML = data;
  });
