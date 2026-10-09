(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#site-navigation');
  const mobileViewport = window.matchMedia('(max-width: 600px)');

  if (menuButton && navigation) {
    const setMenuOpen = (open) => {
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      navigation.classList.toggle('is-open', open);
    };

    menuButton.addEventListener('click', () => {
      setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
    });

    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a') && mobileViewport.matches) setMenuOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        menuButton.focus();
      }
    });

    mobileViewport.addEventListener('change', (event) => {
      if (!event.matches) setMenuOpen(false);
    });
  }

  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const visibility = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      const visible = [...visibility.entries()]
        .filter(([, ratio]) => ratio > 0)
        .sort((a, b) => b[1] - a[1])[0]?.[0];

      if (!visible) return;
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${visible.id}`) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.15, 0.4] });

    sections.forEach((section) => observer.observe(section));
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
