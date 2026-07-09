// ===================================================
// Deltasoins 13010 — Script principal
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  // Menu mobile
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // Animation au scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  // Formulaire de contact -> ouverture du client mail avec le message pré-rempli
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value;
      const message = form.message.value.trim();

      const body = `Nom : ${name}%0ATéléphone : ${phone}%0AEmail : ${email}%0ASujet : ${subject}%0A%0AMessage :%0A${message}`;
      const mailto = `mailto:deltasoins13010@gmail.com?subject=${encodeURIComponent(
        'Demande de contact - ' + subject
      )}&body=${body}`;

      window.location.href = mailto;
    });
  }
});
