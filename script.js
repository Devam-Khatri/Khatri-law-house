// ============================================
// Image placeholder fallback
// Called via onerror="" on any <img> inside a
// .img-placeholder wrapper. If the referenced file
// (e.g. images/founder.jpg) doesn't exist yet, shows
// the wrapper's data-label text instead of a broken icon.
// ============================================
function phImgFallback(img) {
  const wrap = img.closest('.img-placeholder');
  if (wrap) wrap.classList.add('img-missing');
}

// ============================================
// Disclaimer overlay
// Shown once per browser (remembered in localStorage).
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('disclaimer-overlay');
  if (overlay) {
    const alreadyAccepted = (() => {
      try { return localStorage.getItem('klh_disclaimer_accepted') === 'true'; }
      catch (e) { return false; }
    })();

    if (alreadyAccepted) {
      overlay.classList.add('hidden');
    } else {
      document.body.classList.add('disclaimer-locked');
    }

    const agreeBtn = document.getElementById('disclaimer-agree');
    const declineBtn = document.getElementById('disclaimer-decline');

    if (agreeBtn) {
      agreeBtn.addEventListener('click', () => {
        try { localStorage.setItem('klh_disclaimer_accepted', 'true'); } catch (e) {}
        overlay.classList.add('hidden');
        document.body.classList.remove('disclaimer-locked');
      });
    }
    if (declineBtn) {
      declineBtn.addEventListener('click', () => {
        window.location.href = 'https://www.google.com';
      });
    }
  }
});

// ============================================
// Scroll progress bar + sticky header shadow +
// back-to-top button
// All three read the same scroll position, so they
// share a single throttled scroll listener.
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const progressBar = document.getElementById('scroll-progress');
  const header = document.querySelector('.site-header');
  const backToTop = document.getElementById('back-to-top');

  if (!progressBar && !header && !backToTop) return;

  let ticking = false;

  function updateOnScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) progressBar.style.width = pct + '%';
    if (header) header.classList.toggle('scrolled', scrollTop > 8);
    if (backToTop) backToTop.classList.toggle('visible', scrollTop > 480);

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }, { passive: true });

  updateOnScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// ============================================
// Reveal-on-scroll
// Any element with class="reveal" fades/rises into
// view the first time it crosses into the viewport.
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }
});

// ============================================
// Mobile nav toggle
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a link is clicked (mobile)
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ============================================
  // Contact form handling
  // The form posts directly to FormSubmit (formsubmit.co),
  // which emails the submission to advocateroshankhatri@gmail.com.
  // No backend needed. FormSubmit redirects back to this page
  // with ?sent=true, which is what triggers the "Thanks" message
  // below (see the second DOMContentLoaded block further down).
  // ============================================
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
        return;
      }
      // Valid, let the form submit normally to FormSubmit.
    });
  }
});

// ============================================
// Show the "Thanks" success message if we've just been
// redirected back from FormSubmit after a real submission.
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const params = new URLSearchParams(window.location.search);

  if (params.get('sent') === 'true' && form && successMsg) {
    form.style.display = 'none';
    successMsg.classList.add('visible');
  }
});

// ============================================
// Click-to-copy phone number
// Used by every .phone-copy button (footer, contact
// page, CTA bands). Copies the number from data-phone
// and shows a small "Copied!" tooltip.
// ============================================
function copyPhoneNumber(btn) {
  const phone = btn.getAttribute('data-phone');
  if (!phone) return;

  const showCopied = () => {
    btn.classList.add('copied');
    clearTimeout(btn._copyTimeout);
    btn._copyTimeout = setTimeout(() => btn.classList.remove('copied'), 1800);
  };

  const fallbackCopy = (text) => {
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.opacity = '0';
    document.body.appendChild(temp);
    temp.focus();
    temp.select();
    try { document.execCommand('copy'); } catch (e) { /* no-op */ }
    document.body.removeChild(temp);
    showCopied();
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(phone).then(showCopied).catch(() => fallbackCopy(phone));
  } else {
    fallbackCopy(phone);
  }
}

// ============================================
// Testimonials page
// - Filters cards by source (All / Google / LawRato)
// - Reveals cards with a fade-up animation as they
//   scroll into view
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.testimonial-card'));
  const filterBtns = Array.from(document.querySelectorAll('.testi-filter'));
  const emptyMsg = document.getElementById('testi-empty');

  // Scroll-reveal animation
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    cards.forEach(card => observer.observe(card));
  } else {
    cards.forEach(card => card.classList.add('in-view'));
  }

  // Filtering
  function applyFilter(filter) {
    let visibleCount = 0;
    cards.forEach(card => {
      const matches = filter === 'all' || card.dataset.source === filter;
      card.classList.toggle('testi-hidden', !matches);
      if (matches) visibleCount++;
    });
    if (emptyMsg) emptyMsg.hidden = visibleCount !== 0;
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });
});
