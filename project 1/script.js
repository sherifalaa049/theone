(() => {
  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

  // --------- Theme (Dark/Light) ---------
  const themeToggle = $('#themeToggle');
  const root = document.documentElement;

  function getPreferredTheme() {
    const saved = localStorage.getItem('ge-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');

    const icon = $('.theme-toggle-icon');
    if (icon) icon.textContent = theme === 'light' ? '☀' : '☾';
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem('ge-theme', next);
    });
  }

  // --------- Mobile Hamburger Menu ---------
  const navToggle = $('#navToggle');
  const navMenu = $('#navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu on link click (mobile)
    $$('#navMenu a[data-scroll]').forEach(a => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (navMenu.classList.contains('is-open') && !navMenu.contains(target) && !navToggle.contains(target)) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------- Smooth scrolling for anchor links ---------
  function setupSmoothScroll() {
    $$('a[data-scroll]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const headerOffset = 82;
        const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  }

  setupSmoothScroll();

  // --------- Scroll Reveal Animations ---------
  const revealEls = $$('.reveal');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    }, { threshold: 0.15 });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // --------- Back to top button ---------
  const toTop = $('#toTop');
  const onScroll = () => {
    if (!toTop) return;
    const show = window.scrollY > 600;
    toTop.classList.toggle('is-visible', show);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------- Menu Data + Rendering + Filtering ---------
  const menuItems = [
    { category: 'pizza', name: 'Ember Margherita', description: 'San Marzano tomato, fresh basil, mozzarella, ember-charred crust.', price: 18, img: 'https://images.unsplash.com/photo-1601924638867-3ec0f4c8a6d6?auto=format&fit=crop&w=1200&q=80' },
    { category: 'pizza', name: 'Truffle Gold Pizza', description: 'Truffle cream, wild mushrooms, parmesan snow, black pepper sparkle.', price: 26, img: 'https://images.unsplash.com/photo-1590947132387-155cc3a2fbd7?auto=format&fit=crop&w=1200&q=80' },
    { category: 'pizza', name: 'Spicy Gold Pepperoni', description: 'Pepperoni cups, roasted chilies, hot honey glaze, basil finish.', price: 24, img: 'https://images.unsplash.com/photo-1548365328-9f547bbf1d3c?auto=format&fit=crop&w=1200&q=80' },

    { category: 'burgers', name: 'Smash Ember Burger', description: 'Double smash patties, caramelized onions, ember sauce, brioche.', price: 20, img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80' },
    { category: 'burgers', name: 'Truffle Royale Burger', description: 'Truffle mayo, roasted garlic, fontina, crisp greens, gold dust.', price: 28, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80' },
    { category: 'burgers', name: 'Garden Heat Burger', description: 'Charred peppers, jalapeño relish, avocado silk, citrus crunch.', price: 22, img: 'https://images.unsplash.com/photo-1561758033-dca8f3d5d4f0?auto=format&fit=crop&w=1200&q=80' },

    { category: 'pasta', name: 'Truffle Cream Linguine', description: 'Silky truffle cream, parmesan, herb aroma, slow simmer depth.', price: 25, img: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?auto=format&fit=crop&w=1200&q=80' },
    { category: 'pasta', name: 'Smoky Pomodoro Rigatoni', description: 'Fire-roasted tomato, smoked basil, parmesan ribbons, al dente bite.', price: 21, img: 'https://images.unsplash.com/photo-1522156373667-4c7234bbd804?auto=format&fit=crop&w=1200&q=80' },
    { category: 'pasta', name: 'Lemon Herb Risotto', description: 'Zesty lemon, roasted garlic, fresh herbs, velvet finish.', price: 24, img: 'https://images.unsplash.com/photo-1601050690597-df2f8b6e1b2d?auto=format&fit=crop&w=1200&q=80' },

    { category: 'desserts', name: 'Golden Velvet Cheesecake', description: 'Creamy cheesecake, caramelized crust, gold honey drizzle.', price: 14, img: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1200&q=80' },
    { category: 'desserts', name: 'Warm Ember Brownie', description: 'Molten center, cocoa richness, vanilla bean cloud.', price: 13, img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80' },
    { category: 'desserts', name: 'Citrus Gold Tart', description: 'Bright citrus curd, buttery crust, delicate sugar finish.', price: 15, img: 'https://images.unsplash.com/photo-1464347744102-9dfb2d0d0b0c?auto=format&fit=crop&w=1200&q=80' },

    { category: 'drinks', name: 'Ember Iced Tea', description: 'Black tea, citrus, smoked hint, lightly sweetened premium chill.', price: 9, img: 'https://images.unsplash.com/photo-1513558161293-cdaf6091d9b5?auto=format&fit=crop&w=1200&q=80' },
    { category: 'drinks', name: 'Gold Citrus Spritz', description: 'Sparkling citrus, herbal aroma, elegant refresh with gold garnish.', price: 12, img: 'https://images.unsplash.com/photo-1527169402691-a3fbfbd5fe8a?auto=format&fit=crop&w=1200&q=80' },
    { category: 'drinks', name: 'Vanilla Noir Shake', description: 'Vanilla bean shake, cocoa swirl, creamy velvet sip.', price: 11, img: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=80' },
  ];

  const categoryLabels = {
    pizza: 'Pizza',
    burgers: 'Burgers',
    pasta: 'Pasta',
    desserts: 'Desserts',
    drinks: 'Drinks'
  };

  function renderMenu(items) {
    const grid = $('#menuGrid');
    if (!grid) return;

    grid.innerHTML = items.map(item => {
      return `
        <article class="menu-item reveal" data-category-item="${item.category}">
          <div class="media">
            <img src="${item.img}" alt="${escapeHtml(item.name)}" loading="lazy" />
          </div>
          <div class="content">
            <div class="row">
              <span class="badge">${categoryLabels[item.category] ?? item.category}</span>
              <span class="price">$${item.price}</span>
            </div>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </div>
        </article>
      `;
    }).join('');

    // Re-run reveal observer for newly injected cards
    if ('IntersectionObserver' in window) {
      const newReveal = $$('.menu-item.reveal');
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      }, { threshold: 0.12 });
      newReveal.forEach(el => io.observe(el));
    } else {
      $$('.menu-item.reveal').forEach(el => el.classList.add('is-visible'));
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '<')
      .replaceAll('>', '>')
      .replaceAll('"', '"')
      .replaceAll("'", '&#039;');
  }

  const chipButtons = $$('.chip');
  const searchInput = $('#menuSearch');

  let activeCategory = 'all';
  let activeQuery = '';

  function getFilteredMenu() {
    const q = activeQuery.trim().toLowerCase();
    return menuItems.filter(item => {
      const catOk = activeCategory === 'all' ? true : item.category === activeCategory;
      const qOk = !q ? true : (item.name + ' ' + item.description).toLowerCase().includes(q);
      return catOk && qOk;
    });
  }

  function updateMenu() {
    renderMenu(getFilteredMenu());
  }

  chipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      chipButtons.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      activeCategory = btn.dataset.category || 'all';
      updateMenu();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      activeQuery = searchInput.value;
      updateMenu();
    });
  }

  // Initial render
  renderMenu(menuItems);

  // --------- Offers ---------
  const offers = [
    { tag: 'This Week', discount: '20%', title: 'Chef’s Ember Tasting', desc: 'A premium 4-course experience with a truffle surprise. Limited seats every night.', cta: 'Book Tasting' },
    { tag: 'Limited', discount: 'Buy 1', title: 'Cocktail Pairing Deal', desc: 'Get the second house cocktail at 50% off with any entrée purchase.', cta: 'Get Deal' },
    { tag: 'New', discount: '15%', title: 'Family Feast Bundle', desc: 'Feeds 4–6: pizza, pasta, salads, dessert — assembled for celebrations.', cta: 'Reserve Bundle' },
  ];

  function renderOffers() {
    const grid = $('#offersGrid');
    if (!grid) return;

    grid.innerHTML = offers.map(o => `
      <article class="offer-card reveal">
        <div class="offer-top">
          <div class="offer-pill"><i aria-hidden="true">✦</i> ${escapeHtml(o.tag)}</div>
          <div class="offer-discount">${escapeHtml(o.discount)}</div>
        </div>
        <h3 class="offer-title">${escapeHtml(o.title)}</h3>
        <p class="offer-desc">${escapeHtml(o.desc)}</p>
        <div class="offer-cta">
          <a class="btn btn-gold btn-sm" href="#reservation" data-scroll>${escapeHtml(o.cta)}</a>
          <button class="btn btn-ghost btn-sm" type="button" data-offer="${escapeHtml(o.title)}">Learn More</button>
        </div>
      </article>
    `).join('');

    // Reveal newly injected
    if ('IntersectionObserver' in window) {
      const newReveal = $$('.offer-card.reveal');
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      }, { threshold: 0.12 });
      newReveal.forEach(el => io.observe(el));
    } else {
      $$('.offer-card.reveal').forEach(el => el.classList.add('is-visible'));
    }

    $$('[data-offer]').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.dataset.offer;
        btn.textContent = `Selected: ${title}`;
        btn.disabled = true;
      });
    });
  }

  renderOffers();

  // --------- Reservation Form Validation ---------
  const reservationForm = $('#reservationForm');
  const formStatus = $('#formStatus');

  function setStatus(msg, ok = true) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.classList.toggle('is-visible', true);
    formStatus.style.borderColor = ok ? 'rgba(215,180,106,.45)' : 'rgba(255,180,180,.45)';
    formStatus.style.background = ok ? 'rgba(215,180,106,.10)' : 'rgba(255,180,180,.10)';
  }

  function showError(inputEl, message) {
    if (!inputEl) return;
    const err = $(`.error[data-error-for="${inputEl.id}"]`);
    if (err) err.textContent = message;
  }

  function clearError(inputEl) {
    if (!inputEl) return;
    const err = $(`.error[data-error-for="${inputEl.id}"]`);
    if (err) err.textContent = '';
  }

  const validators = {
    name: (v) => {
      const s = v.trim();
      if (s.length < 2) return 'Please enter your name (at least 2 characters).';
      if (!/^[a-zA-ZÀ-ÿ'\-\s.]+$/.test(s)) return 'Name should contain only letters and common punctuation.';
      return '';
    },
    email: (v) => {
      const s = v.trim();
      if (!s) return 'Please enter your email.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return 'Please enter a valid email address.';
      return '';
    },
    phone: (v) => {
      const s = v.trim();
      if (!s) return 'Please enter your phone number.';
      // permissive international phone check
      if (!/^\+?[0-9][0-9\-()\s]{6,}$/.test(s)) return 'Please enter a valid phone number.';
      return '';
    },
    date: (v) => {
      if (!v) return 'Please choose a date.';
      const chosen = new Date(v + 'T00:00:00');
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (chosen < today) return 'Please choose a future date.';
      return '';
    },
    time: (v) => {
      if (!v) return 'Please select a time.';
      return '';
    },
    guests: (v) => {
      if (!v) return 'Please select number of guests.';
      const n = Number(v);
      if (!Number.isFinite(n) || n < 1 || n > 10) return 'Guests must be between 1 and 10.';
      return '';
    }
  };

  function validateField(inputId) {
    const el = document.getElementById(inputId);
    if (!el) return true;

    const name = el.getAttribute('name');
    const val = el.value;
    const validator = validators[name];
    if (!validator) return true;

    const msg = validator(val);
    if (msg) {
      el.classList.add('invalid');
      showError(el, msg);
      return false;
    }

    el.classList.remove('invalid');
    clearError(el);
    return true;
  }

  if (reservationForm) {
    // Set min date to today
    const dateEl = $('#rDate');
    if (dateEl) {
      const now = new Date();
      const todayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().slice(0, 10);
      dateEl.min = todayStr;
    }

    const inputs = ['rName', 'rEmail', 'rPhone', 'rDate', 'rTime', 'rGuests'].map(id => document.getElementById(id)).filter(Boolean);
    inputs.forEach(el => {
      el.addEventListener('blur', () => validateField(el.id));
      el.addEventListener('input', () => {
        if (formStatus) formStatus.classList.remove('is-visible');
      });
    });

    reservationForm.addEventListener('reset', () => {
      inputs.forEach(el => {
        el.classList.remove('invalid');
        clearError(el);
      });
      if (formStatus) formStatus.classList.remove('is-visible');
    });

    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!reservationForm) return;

      const ok = inputs.every(el => validateField(el.id));
      if (!ok) {
        setStatus('Please fix the highlighted fields and try again.', false);
        return;
      }

      const data = Object.fromEntries(new FormData(reservationForm).entries());
      const summary = `Reservation confirmed for ${data.guests} guest(s) on ${data.date} at ${data.time}. We’ll contact you at ${data.email}.`;

      setStatus(summary, true);
      reservationForm.reset();

      // Reset errors
      inputs.forEach(el => {
        el.classList.remove('invalid');
        clearError(el);
      });

      // Re-apply min date after reset
      if (dateEl) {
        const now = new Date();
        const todayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().slice(0, 10);
        dateEl.min = todayStr;
      }

      // Smooth status reveal
      formStatus?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // --------- Quick form (Hero) ---------
  const quickForm = $('#quickForm');
  if (quickForm) {
    const dateInput = quickForm.querySelector('input[name="date"]');
    if (dateInput) {
      const now = new Date();
      dateInput.min = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().slice(0, 10);
    }

    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(quickForm);
      const name = String(fd.get('name') || '').trim();
      const phone = String(fd.get('phone') || '').trim();

      if (name.length < 2) return alert('Please enter your name.');
      if (!/^\+?[0-9][0-9\-()\s]{6,}$/.test(phone)) return alert('Please enter a valid phone number.');

      const date = fd.get('date');
      const guests = fd.get('guests');
      alert(`Booking request sent!\n\nName: ${name}\nGuests: ${guests}\nDate: ${date}`);
      quickForm.reset();
    });
  }

  // --------- Footer year ---------
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();

