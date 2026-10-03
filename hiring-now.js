(function () {
  'use strict';

  function initHiringMotion() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      gsap.set('.hire-reveal', { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.from('.hire-hero-copy > *', {
      opacity: 0,
      y: 28,
      duration: 0.85,
      stagger: 0.09,
      ease: 'power3.out',
      delay: 0.15
    });

    gsap.from('.hire-hero-mark', {
      opacity: 0,
      scale: 0.72,
      rotation: -8,
      duration: 1.25,
      ease: 'power3.out',
      delay: 0.25
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

    gsap.to('.hire-hero-mark', {
      y: -90,
      rotation: 7,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hire-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    document.querySelectorAll('.hire-reveal').forEach((el) => {
      gsap.fromTo(el,
        { autoAlpha: 0, y: 38 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 84%', once: true }
        }
      );
    });

    gsap.utils.toArray('.hire-bento-card').forEach((card, index) => {
      gsap.fromTo(card,
        { y: 55, scale: 0.97 },
        {
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true }
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
