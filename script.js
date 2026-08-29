(() => {
  const header = document.querySelector('.site-header');
  const progress = document.getElementById('progressBar');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('siteNav');
  const navLinks = [...document.querySelectorAll('.site-nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const reveals = document.querySelectorAll('.reveal');
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const year = document.getElementById('year');

  if (year) year.textContent = new Date().getFullYear();

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 14);

    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;

    let active = '';
    for (const section of sections) {
      if (y >= section.offsetTop - 190) active = section.id;
    }
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${active}`));
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (menuToggle && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      document.body.classList.remove('menu-open');
    };

    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('open', !open);
      document.body.classList.toggle('menu-open', !open);
    });

    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

    form.addEventListener('submit', async event => {
      event.preventDefault();

      const required = [...form.querySelectorAll('[required]')];
      const invalid = required.find(field => !field.checkValidity());
      if (invalid) {
        invalid.reportValidity();
        if (status) status.textContent = 'Please complete the required fields.';
        return;
      }

      const email = form.elements.email;
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        email.setCustomValidity('Enter a valid email address.');
        email.reportValidity();
        email.setCustomValidity('');
        return;
      }

      // Honeypot: bots fill the hidden field; silently drop.
      const honeypot = form.elements.website;
      if (honeypot && honeypot.value.trim()) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending… <span aria-hidden="true">↗</span>';
      }
      if (status) status.textContent = 'Sending…';

      const params = new URLSearchParams();
      params.append('name', form.elements.name ? form.elements.name.value.trim() : '');
      params.append('email', email ? email.value.trim() : '');
      params.append('company', form.elements.company ? form.elements.company.value.trim() : '');
      params.append('type', form.elements.type ? form.elements.type.value : '');
      params.append('budget', form.elements.budget ? form.elements.budget.value : '');
      params.append('message', form.elements.message ? form.elements.message.value.trim() : '');
      params.append('website', honeypot ? honeypot.value.trim() : '');

      try {
        const res = await fetch('contact.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`);
        form.classList.add('form-success');
        if (status) status.textContent = 'Thank you — your project brief has been sent. I\'ll get back to you shortly.';
        form.reset();
      } catch (err) {
        if (status) status.textContent = 'Sorry, something went wrong sending your brief. Please email me directly instead.';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }
})();
