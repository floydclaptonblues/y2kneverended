const year = document.querySelector('[data-current-year]');
if (year) year.textContent = new Date().getFullYear();

const menuLinks = document.querySelectorAll('a[href^="#"]');
menuLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.setAttribute('tabindex', '-1');
  });
});
