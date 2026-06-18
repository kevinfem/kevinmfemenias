// Initialise Lucide icons
document.addEventListener('DOMContentLoaded', () => { lucide.createIcons(); });

// Experience card — dynamic years + timeline work history sections
(function () {
  const numEl = document.getElementById('exp-years');
  const track = document.querySelector('.hero-exp__track');
  if (!numEl) return;

  const timelineStart = new Date(2018, 0, 1);
  const now = new Date();
  const years = now.getFullYear() - 2018;
  numEl.textContent = years;

  if (track) {
    const jobs = [
      { role: 'Sr. UX Designer', company: 'Novacura', start: new Date(2024, 3, 1), end: now, label: 'Apr 2024 – Now' },
      { role: 'UX Designer', company: 'Novacura', start: new Date(2022, 4, 1), end: new Date(2024, 3, 1), label: 'May 2022 – Apr 2024' },
      { role: 'UX Design Intern', company: 'Norwegian Refugee Council', start: new Date(2021, 1, 1), end: new Date(2021, 10, 1), label: 'Feb 2021 – Nov 2021' },
      { role: 'Product Designer', company: 'Freelance, Berlin', start: new Date(2019, 8, 1), end: new Date(2022, 3, 1), label: 'Sep 2019 – Apr 2022' },
      { role: 'Product Designer', company: 'Canadian Streetfood UCG', start: new Date(2019, 6, 1), end: new Date(2019, 7, 1), label: 'Jul 2019 – Aug 2019' },
      { role: 'UX Design Intern', company: '', start: new Date(2018, 2, 1), end: new Date(2018, 5, 1), label: 'Mar 2018 – Jun 2018' },
    ].sort((a, b) => a.start - b.start);

    const totalSpan = now - timelineStart;
    const minWidth = 2.5; // percent
    const inset = 0.5; // percent, gap between adjacent sections

    // Shades of blue (Apple system blue family) from oldest to newest era
    const eraColors = ['#0040DD', '#0066FF', '#007AFF', '#0A84FF', '#409CFF', '#64D2FF'];
    jobs.forEach((job, i) => {
      job.color = eraColors[Math.min(i, eraColors.length - 1)];
    });

    // If a shorter role overlaps a longer one, split the longer one around
    // it so every role fits on a single row without stacking lanes
    function splitOverlaps(list) {
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (i === j) continue;
          const host = list[i];
          const filler = list[j];
          const hostDuration = host.end - host.start;
          const fillerDuration = filler.end - filler.start;
          const nested = filler.start >= host.start && filler.end <= host.end && fillerDuration < hostDuration;
          if (!nested) continue;
          const before = { ...host, end: filler.start };
          const after = { ...host, start: filler.end };
          const next = list.slice();
          next.splice(i, 1, before, after);
          return splitOverlaps(next);
        }
      }
      return list.filter(job => job.end > job.start).sort((a, b) => a.start - b.start);
    }

    const segments = splitOverlaps(jobs);

    segments.forEach(job => {
      job.left = ((job.start - timelineStart) / totalSpan) * 100;
      job.naturalWidth = ((job.end - job.start) / totalSpan) * 100;
    });

    // Widen short stints to a minimum size without overlapping the next role's start
    segments.forEach((job, i) => {
      const maxWidth = (i + 1 < segments.length ? segments[i + 1].left : 100) - job.left;
      const width = Math.min(Math.max(job.naturalWidth, minWidth), maxWidth);
      job.width = Math.max(width - inset, 1);
      job.left = job.left + inset / 2;
    });

    segments.forEach(job => {
      const segment = document.createElement('button');
      segment.type = 'button';
      segment.className = 'hero-exp__segment';
      segment.style.left = `${job.left}%`;
      segment.style.width = `${job.width}%`;
      segment.style.background = job.color;

      const edge = job.left + job.width;
      if (job.left < 15) segment.classList.add('hero-exp__segment--first');
      if (edge > 85) segment.classList.add('hero-exp__segment--last');

      const companyText = job.company ? ` at ${job.company}` : '';
      segment.setAttribute('aria-label', `${job.role}${companyText}, ${job.label}`);

      const companyLine = job.company ? `<span class="hero-exp__tooltip-company">${job.company}</span>` : '';
      segment.innerHTML = `
        <span class="hero-exp__tooltip">
          <strong>${job.role}</strong>${companyLine}
          <span class="hero-exp__tooltip-date">${job.label}</span>
        </span>
      `;

      segment.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = segment.classList.contains('is-active');
        document.querySelectorAll('.hero-exp__segment.is-active').forEach(s => s.classList.remove('is-active'));
        if (!isActive) segment.classList.add('is-active');
      });

      track.appendChild(segment);
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.hero-exp__segment.is-active').forEach(s => s.classList.remove('is-active'));
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        track.classList.add('is-visible');
        observer.disconnect();
      });
    }, { threshold: 0.4 });
    observer.observe(numEl.closest('.hero-exp'));
  }
})();

// About modal
(function () {
  const card     = document.getElementById('about');
  const modal    = document.getElementById('about-modal');
  const backdrop = document.getElementById('about-modal-backdrop');
  const closeBtn = document.getElementById('about-modal-close');
  if (!modal) return;

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    lucide.createIcons(); // re-run so the X icon inside the modal renders
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (card) card.focus();
  }

  if (card) {
    card.addEventListener('click', openModal);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
    });
  }

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();

// CTA card — torch / spotlight effect tracks cursor
const ctaCard = document.querySelector('.cta-card');
if (ctaCard) {
  ctaCard.addEventListener('mousemove', (e) => {
    const rect = ctaCard.getBoundingClientRect();
    ctaCard.style.setProperty('--x', ((e.clientX - rect.left) / rect.width  * 100) + '%');
    ctaCard.style.setProperty('--y', ((e.clientY - rect.top)  / rect.height * 100) + '%');
  });
}

// Hero photo — show image and hide placeholder once loaded
const heroImg = document.querySelector('.hero__photo-img');
const heroPlaceholder = document.querySelector('.hero__photo-placeholder');
if (heroImg) {
  const showPhoto = () => {
    if (heroImg.naturalWidth > 0) {
      heroImg.classList.add('loaded');
      heroPlaceholder.style.display = 'none';
    }
  };
  if (heroImg.complete) showPhoto();
  else heroImg.addEventListener('load', showPhoto);
}

// Hide placeholder when real image loads (card previews, post cards, case study cover)
document.querySelectorAll('.case-study__img, .post-card__thumb-img, .cs-hero__img').forEach(img => {
  const placeholder = img.nextElementSibling;
  if (!placeholder) return;
  if (img.complete && img.naturalWidth > 0) {
    placeholder.style.display = 'none';
  } else {
    img.addEventListener('load', () => { placeholder.style.display = 'none'; });
  }
});

// Mobile menu toggle
const burger = document.querySelector('.nav__burger');
const mobileMenu = document.querySelector('.nav__mobile-menu');

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);

    const spans = burger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    }
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const spans = burger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    });
  });
}

// Hero photo — 3D tilt on cursor hover
const heroPhoto = document.querySelector('.hero__photo');
if (heroPhoto) {
  // Clear animation after it finishes so JS can own the transform
  heroPhoto.addEventListener('animationend', () => {
    heroPhoto.style.animation = 'none';
    heroPhoto.style.opacity = '1';
    heroPhoto.style.transform = '';
  }, { once: true });

  heroPhoto.addEventListener('mousemove', (e) => {
    const rect = heroPhoto.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroPhoto.style.transition = 'transform 0.08s ease';
    heroPhoto.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.03)`;
  });

  heroPhoto.addEventListener('mouseleave', () => {
    heroPhoto.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    heroPhoto.style.transform = '';
  });
}

// Scroll reveal — fade + blur in elements as they enter the viewport
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '-80px 0px', threshold: 0.1 });

// initReveal() is called once on load for static elements, and again after
// dynamic card injection on writing.html. The skip guard prevents re-processing.
function initReveal() {
  document.querySelectorAll('.section__header, .case-study, .post-card, .writing__item, .about__content').forEach((el) => {
    // Skip elements already processed by a previous initReveal() call
    if (el.classList.contains('reveal') || el.classList.contains('visible')) return;

    if (el.classList.contains('case-study') || el.classList.contains('post-card') || el.classList.contains('writing__item')) {
      const siblings = el.parentElement.querySelectorAll(':scope > ' + el.tagName + ', :scope > a');
      const idx = Array.from(siblings).indexOf(el);
      if (idx > 0) el.dataset.delay = Math.min(idx, 8);
    }

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
      return;
    }
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
}

initReveal();

// Final design grid — staggered fade-up on scroll
const gridItems = document.querySelectorAll('.cs-grid__item');
if (gridItems.length) {
  const gridObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(gridItems).indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.08}s`;
        entry.target.classList.add('in-view');
        gridObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '-40px 0px', threshold: 0.08 });

  gridItems.forEach(item => gridObserver.observe(item));
}

// Feature stage — image floats up into centre as section scrolls into view
const featureStage = document.querySelector('.cs-feature-stage');
if (featureStage) {
  const featureImg = featureStage.querySelector('.cs-feature-stage__img');
  const updateFeatureImg = () => {
    const rect = featureStage.getBoundingClientRect();
    const viewH = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (viewH - rect.top) / (viewH * 0.75)));
    const ease = 1 - Math.pow(1 - progress, 3);
    featureImg.style.transform = `translateY(${(1 - ease) * 90}px)`;
  };
  window.addEventListener('scroll', updateFeatureImg, { passive: true });
  updateFeatureImg();
}

// Image showcase mosaic — staggered fade-up on scroll
const showcaseImgs = document.querySelectorAll('.cs-img-reveal');
if (showcaseImgs.length) {
  const showcaseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        showcaseObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '-60px 0px', threshold: 0.06 });

  showcaseImgs.forEach(el => showcaseObserver.observe(el));
}

// Cursor parallax — subtle floating depth effect on home page elements
(function () {
  if (!document.querySelector('.home-layout')) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const layers = [
    { selector: '.hero__headline',  depth: 0.008 },
    { selector: '.hero__tagline',   depth: 0.005 },
    { selector: '.hero__cta-btn',   depth: 0.010 },
    { selector: '.hero-skills',     depth: 0.004 },
    { selector: '.hero-exp',        depth: 0.005 },
    { selector: '.bento-about',     depth: 0.005 },
    { selector: '.cta-card',        depth: 0.006 },
    { selector: '.work__grid',      depth: 0.003 },
  ];

  const items = layers
    .map(({ selector, depth }) => ({ el: document.querySelector(selector), depth }))
    .filter(({ el }) => el);

  let mx = 0, my = 0, cx = 0, cy = 0, raf = null;

  window.addEventListener('mousemove', e => {
    mx = e.clientX - window.innerWidth  / 2;
    my = e.clientY - window.innerHeight / 2;
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });

  function tick() {
    cx += (mx - cx) * 0.07;
    cy += (my - cy) * 0.07;
    items.forEach(({ el, depth }) => {
      el.style.transform = `translate(${(cx * depth).toFixed(2)}px, ${(cy * depth).toFixed(2)}px)`;
    });
    raf = (Math.abs(mx - cx) > 0.05 || Math.abs(my - cy) > 0.05)
      ? requestAnimationFrame(tick)
      : null;
  }
})();

// Nav: transparent at top, frosted on scroll
// Scroll indicator: fade out once past hero
const nav = document.querySelector('.nav');
const scrollIndicator = document.querySelector('.hero__scroll');
window.addEventListener('scroll', () => {
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }
  if (scrollIndicator) {
    scrollIndicator.style.opacity = Math.max(0, 1 - window.scrollY / 120);
  }
}, { passive: true });

// ---- Polaroid: drag-to-flip + 3D tilt on hover ----
(function () {
  const polaroid = document.getElementById('about-polaroid');
  if (!polaroid) return;
  const inner = polaroid.querySelector('.polaroid__inner');

  let isFlipped = false;   // committed face (0° = front, 180° = back)
  let isDragging = false;
  let dragStartX = 0;
  let hasDragged = false;

  // Commit to a face with optional animation
  function snapTo(flipped) {
    inner.style.transition = '';
    isFlipped = flipped;
    inner.style.transform = `rotateY(${flipped ? 180 : 0}deg)`;
    polaroid.classList.toggle('is-flipped', flipped);
    polaroid.style.cursor = 'grab';
  }

  // ── Drag start ──────────────────────────────────
  function onDragStart(clientX) {
    isDragging = true;
    hasDragged = false;
    dragStartX = clientX;
    inner.style.transition = 'none'; // live feedback
    polaroid.style.cursor = 'grabbing';
  }

  polaroid.addEventListener('mousedown', (e) => {
    onDragStart(e.clientX);
    e.preventDefault(); // prevent text selection
  });

  polaroid.addEventListener('touchstart', (e) => {
    onDragStart(e.touches[0].clientX);
  }, { passive: true });

  // ── Drag move ───────────────────────────────────
  function onDragMove(clientX) {
    if (!isDragging) return;
    const delta = clientX - dragStartX;
    if (Math.abs(delta) > 4) hasDragged = true;
    // Clamp so card can't spin more than one full face in either direction
    const base = isFlipped ? 180 : 0;
    const angle = Math.max(base - 90, Math.min(base + 180, base + delta * 0.9));
    inner.style.transform = `rotateY(${angle}deg)`;
  }

  window.addEventListener('mousemove', (e) => onDragMove(e.clientX));
  window.addEventListener('touchmove', (e) => onDragMove(e.touches[0].clientX), { passive: true });

  // ── Drag end ────────────────────────────────────
  function onDragEnd(clientX) {
    if (!isDragging) return;
    isDragging = false;

    if (!hasDragged) {
      // Tap / click: just toggle
      snapTo(!isFlipped);
      return;
    }

    // Snap to nearest face
    const delta = clientX - dragStartX;
    const base = isFlipped ? 180 : 0;
    const angle = base + delta * 0.9;
    snapTo(Math.round(angle / 180) % 2 !== 0); // odd multiples of 180 = flipped
  }

  window.addEventListener('mouseup', (e) => onDragEnd(e.clientX));
  window.addEventListener('touchend', (e) => onDragEnd(e.changedTouches[0].clientX));

  // ── Hover tilt (front face only, not while dragging) ──
  polaroid.addEventListener('mousemove', (e) => {
    if (isDragging || isFlipped) return;
    const rect = polaroid.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    polaroid.style.transform = `rotateX(${y * -12}deg) rotateY(${x * 12}deg) scale(1.04)`;
  });

  polaroid.addEventListener('mouseleave', () => {
    if (!isDragging) polaroid.style.transform = '';
  });

  // ── Keyboard ────────────────────────────────────
  polaroid.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      snapTo(!isFlipped);
    }
  });
})();
