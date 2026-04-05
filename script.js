// Initialise Lucide icons
document.addEventListener('DOMContentLoaded', () => { lucide.createIcons(); });

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

// Hide placeholder when real image loads (card previews + case study cover)
document.querySelectorAll('.case-study__img, .cs-hero__img').forEach(img => {
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

document.querySelectorAll('.section__header, .case-study, .writing__item, .about__content').forEach((el) => {
  if (el.classList.contains('case-study') || el.classList.contains('writing__item')) {
    const siblings = el.parentElement.querySelectorAll(':scope > ' + el.tagName + ', :scope > a');
    const idx = Array.from(siblings).indexOf(el);
    if (idx > 0) el.dataset.delay = idx;
  }
  // Already in viewport on load — skip animation entirely
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) return;
  el.classList.add('reveal');
  revealObserver.observe(el);
});

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

// Nav: transparent at top, frosted on scroll
// Scroll indicator: fade out once past hero
const nav = document.querySelector('.nav');
const scrollIndicator = document.querySelector('.hero__scroll');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 24);
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
