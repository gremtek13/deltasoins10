// ===================================================
// Deltasoins 13010 — Script principal
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Année du pied de page
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Menu mobile : s'ouvre depuis le bouton, se ferme avec Échap ou un clic sur un lien
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Fermer' : 'Menu';
    };
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !nav.classList.contains('open')) return;
      // Action clavier : fermeture instantanée, sans animation.
      nav.classList.add('no-anim');
      setOpen(false);
      toggle.focus();
      requestAnimationFrame(() => requestAnimationFrame(() => nav.classList.remove('no-anim')));
    });
  }

  // Entrées au scroll (une seule fois). Sans IntersectionObserver, tout est affiché d'emblée.
  // Les images qui s'ouvrent par un clip-path partent d'une surface nulle, que l'observateur ne « voit » pas :
  // on observe donc leur parent, et c'est l'image qui reçoit la classe.
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const targets = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (targets.get(entry.target) || []).forEach((el) => el.classList.add('is-in'));
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
    revealEls.forEach((el) => {
      const watched = el.matches('[data-reveal="shape"], .shutter') ? el.parentElement : el;
      if (!targets.has(watched)) { targets.set(watched, []); io.observe(watched); }
      targets.get(watched).push(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  // Vidéo en boucle : en pause hors de l'écran, et jamais en lecture si l'utilisateur limite les animations
  document.querySelectorAll('video[autoplay]').forEach((video) => {
    if (reduceMotion) { video.removeAttribute('autoplay'); video.pause(); return; }
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }).observe(video);
  });

  // Déroulement : accordéon de panneaux (un seul ouvert à la fois)
  document.querySelectorAll('[data-steps]').forEach((row) => {
    const stages = [...row.querySelectorAll('.stage')];
    stages.forEach((stage) => {
      stage.querySelector('.stage__tab').addEventListener('click', () => {
        stages.forEach((s) => {
          const open = s === stage;
          s.classList.toggle('is-open', open);
          s.querySelector('.stage__tab').setAttribute('aria-expanded', String(open));
        });
      });
    });
  });

  // « Passez-vous chez moi ? » : réponse immédiate selon le quartier choisi
  const zoneSelect = document.querySelector('#t-quartier');
  const zoneAnswer = document.querySelector('#zone-answer');
  if (zoneSelect && zoneAnswer) {
    const answers = {
      in: (q) => `Oui, ${q} est dans notre secteur. Appelez le <a class="link-plain" href="tel:0614149444">06 14 14 94 44</a> ou laissez-nous un message.`,
      near: (q) => `${q} est juste à côté de notre secteur : appelez-nous, nous vérifions nos disponibilités pour votre rue.`,
      out: () => 'Indiquez votre adresse dans le message : nous vous répondons rapidement.',
    };
    const update = () => {
      const opt = zoneSelect.selectedOptions[0];
      const zone = opt && opt.dataset.zone;
      zoneAnswer.innerHTML = zone ? answers[zone](opt.textContent.trim()) : 'Choisissez votre quartier : nous vous répondons tout de suite.';
      if (!reduceMotion && zoneAnswer.animate) {
        // Un léger flou masque le changement de texte : on voit une seule phrase qui se transforme.
        zoneAnswer.animate(
          [{ opacity: 0.2, transform: 'translateY(4px)', filter: 'blur(2px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
          { duration: 240, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }
        );
      }
    };
    zoneSelect.addEventListener('change', update);
  }

  // Formulaires -> ouverture de la messagerie avec le message pré-rempli
  const sendMail = (subject, lines) => {
    const body = lines.filter((l) => l !== null).join('\n');
    window.location.href = `mailto:deltasoins13010@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const tournee = document.querySelector('#tournee-form');
  if (tournee) {
    tournee.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = tournee.elements;
      const quartier = f.quartier.value || 'non précisé';
      sendMail(`Demande de soins à domicile - ${quartier}`, [
        `Nom : ${f.name.value.trim()}`,
        `Téléphone : ${f.phone.value.trim()}`,
        `Quartier : ${quartier}`,
        '',
        f.message.value.trim(),
      ]);
    });
  }

  const contact = document.querySelector('#contact-form');
  if (contact) {
    contact.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = contact.elements;
      sendMail(`Demande de contact - ${f.subject.value}`, [
        `Nom : ${f.name.value.trim()}`,
        `Téléphone : ${f.phone.value.trim()}`,
        `Email : ${f.email.value.trim()}`,
        f.quartier && f.quartier.value ? `Quartier : ${f.quartier.value}` : null,
        `Sujet : ${f.subject.value}`,
        '',
        'Message :',
        f.message.value.trim(),
      ]);
    });
  }
});
