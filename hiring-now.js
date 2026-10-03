(function () {
  'use strict';

  function initHiringMotion() {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Content is visible by default. Only hide it for animation once we know
    // GSAP and ScrollTrigger actually loaded, so a blocked CDN never leaves the page blank.
    if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('hire-motion');

    gsap.from('.hire-hero-copy > *', {
      opacity: 0,
      y: 28,
      duration: 0.85,
      stagger: 0.09,
      ease: 'power3.out',
      delay: 0.15,
      clearProps: 'all'
    });

    gsap.from('.hire-hero-facts', {
      opacity: 0,
      y: 32,
      duration: 0.9,
      ease: 'power3.out',
      delay: 0.3,
      clearProps: 'all'
    });

    gsap.to('.hire-hero-media img', {
      scale: 1.12,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hire-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2
      }
    });

    gsap.utils.toArray('.hire-reveal').forEach(function (el) {
      gsap.fromTo(el,
        { autoAlpha: 0, y: 38 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        }
      );
    });

    // Role cards get their own stagger. clearProps keeps the CSS hover lift working afterwards.
    gsap.utils.toArray('.hire-bento-card').forEach(function (card, index) {
      gsap.fromTo(card,
        { autoAlpha: 0, y: 48 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay: (index % 4) * 0.07,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: card, start: 'top 90%', once: true }
        }
      );
    });

    gsap.to('.hire-apply-glow', {
      x: -120,
      y: 80,
      scale: 1.12,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hire-apply',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.3
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHiringMotion);
  } else {
    initHiringMotion();
  }
})();
