/**
 * ============================================================================
 * PRAVEEN KUMAR KAKARAPARTHI — MAIN INTERACTION & ANIMATION SYSTEM
 * 
 * Features:
 * 1. Single Cellular Metallic Arrow Cursor (NO circle)
 * 2. Animation 1: Cosmic Space Lines & Coordinate Grid Engine (#bg-mesh-canvas)
 *    (Inspired by 21hrs.space/overview space coordinate lines)
 * 3. Animation 2: Infinite Double-Track Editorial Marquee Controls
 * 4. Animation 3: 3D Holographic Card Tilt & Specular Cursor Spotlight
 * 5. Scroll-Driven Process Pipeline (Research → Design → Dev → Deploy)
 * 6. Scroll-Driven Full-Width Project Showcase Animations (Gruhu & TOLET)
 * 7. Dynamic Scroll Progress Bar
 * 8. Subtle Web Audio API Clicks & Audio Toggle
 * 9. Interactive Case Study Modal System
 * 10. Interactive Resume Modal & Download Management
 * 11. Contact Form & Clipboard Copy
 * ============================================================================
 */

(function () {
  'use strict';

  // Global State (Persisted in localStorage)
  let initialMuted = false;
  try {
    initialMuted = localStorage.getItem('praveen_portfolio_sound_muted') === '1';
  } catch (e) {}
  window.soundMuted = initialMuted;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // ==========================================================================
  // Web Audio FX Engine — Tactical UI Tap & Atmospheric Chimes
  // ==========================================================================
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function initAudioCtx() {
    if (!audioCtx && AudioContextClass) {
      try {
        audioCtx = new AudioContextClass();
      } catch (e) {}
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  }

  // Satisfying Acoustic Tactile UI Tap / Click Sound
  function playTapSound(pitch = 760, duration = 0.04) {
    if (window.soundMuted) return;
    initAudioCtx();
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Dual-stage transient: crisp high-tech pop descending cleanly
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + duration);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.01);
    } catch (e) {}
  }
  window.playTapSound = playTapSound;

  // Harmonic Chime when toggling sound ON / OFF
  function playChimeSound(unmuting = true) {
    if (window.soundMuted && !unmuting) return;
    initAudioCtx();
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      if (unmuting) {
        // Ascending harmonic chime
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else {
        // Descending mute tone
        osc.frequency.setValueAtTime(740, now);
        osc.frequency.setValueAtTime(320, now + 0.06);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.20);
        osc.start(now);
        osc.stop(now + 0.20);
      }

      osc.connect(gain);
      gain.connect(audioCtx.destination);
    } catch (e) {}
  }

  function playClickSound(freq = 540, duration = 0.05) {
    playTapSound(freq, duration);
  }

  // ==========================================================================
  // MASTER AUDIO CONTROLLER (Syncs Tap Sound FX & Hero Video Sound)
  // ==========================================================================
  function setGlobalSoundMuted(isMuted, playSoundFeedback = false) {
    window.soundMuted = isMuted;

    // 1. Synchronize Video Audio
    const heroVideo = document.getElementById('hero-intro-video');
    if (heroVideo) {
      heroVideo.muted = isMuted;
      if (!isMuted) {
        heroVideo.volume = 1.0;
      }
    }

    // Synchronize video equalizer bars on Hero
    const heroSoundBars = document.getElementById('hero-sound-bars');
    if (heroSoundBars) {
      if (isMuted) {
        heroSoundBars.classList.add('muted');
      } else {
        heroSoundBars.classList.remove('muted');
      }
    }

    // 2. Synchronize Navbar Sound Button UI
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    if (soundToggleBtn) {
      soundToggleBtn.classList.toggle('active', !isMuted);
      soundToggleBtn.classList.toggle('muted', isMuted);
      soundToggleBtn.setAttribute(
        'title',
        isMuted ? 'Sound: MUTED (Click to enable video & tap audio)' : 'Sound: ON (Video & Tap Audio Active)'
      );
      soundToggleBtn.setAttribute('aria-label', isMuted ? 'Unmute Sound' : 'Mute Sound');

      const icon = soundToggleBtn.querySelector('#sound-status-icon') || soundToggleBtn.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', isMuted ? 'volume-x' : 'volume-2');
      }

      const textSpan = document.getElementById('sound-toggle-text');
      if (textSpan) {
        textSpan.textContent = isMuted ? 'MUTED' : 'SOUND ON';
      }

      if (window.lucide) window.lucide.createIcons();
    }

    // 3. Persist State
    try {
      localStorage.setItem('praveen_portfolio_sound_muted', isMuted ? '1' : '0');
    } catch (e) {}

    // 4. Auditory Feedback
    if (playSoundFeedback) {
      playChimeSound(!isMuted);
    }
  }
  window.setGlobalSoundMuted = setGlobalSoundMuted;

  // ==========================================================================
  // 1. SINGLE CELLULAR METALLIC CURSOR (NO CIRCLE)
  // ==========================================================================
  const cursorPointer = document.getElementById('cursor-pointer');

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorPointer) {
      cursorPointer.style.left = `${mouseX}px`;
      cursorPointer.style.top = `${mouseY}px`;
      if (!cursorPointer.classList.contains('active')) {
        cursorPointer.classList.add('active');
      }
    }
  });

  window.addEventListener('mousedown', () => {
    playClickSound(720, 0.04);
  });

  function bindCursorInteractions() {
    const interactives = document.querySelectorAll(
      'a, button, input, textarea, .editorial-card, .flowing-step-card, .project-showcase-card, .soft-skill-card, .live-link-pill, .welcome-launch-pill, .hero-actions a, .dock-social-link, .connect-action-card, .connect-pill-btn, .connect-call-pill-btn, .live-direct-open-pill, .hero-video-play-toggle, .nav-connect-pill, .nav-cv-pill, .brand-logo, .hero-btn-gold, .hero-btn-glass, .nav-hire-btn, .hero-scroll-cue'
    );

    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (cursorPointer) cursorPointer.classList.add('hovering');
        playClickSound(850, 0.02);
      });
      el.addEventListener('mouseleave', () => {
        if (cursorPointer) cursorPointer.classList.remove('hovering');
      });
    });
  }

  // ==========================================================================
  // 2. DYNAMIC SCROLL PROGRESS BAR & ANIMATED NAVBAR DOCK
  // ==========================================================================
  const progressBar = document.getElementById('scroll-progress-bar');
  const siteHeader = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Nav Scroll Spy: Dynamically highlight active link
    let current = '';
    const scrollPos = scrollY + 160;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  });

  // Master Sound Controller Toggle Button in Navbar (Controls Tap Sound FX + Video Audio)
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setGlobalSoundMuted(!window.soundMuted, true);
    });
  }

  // Universal Tactile Tap Feedback Engine for interactive controls
  document.addEventListener('pointerdown', (e) => {
    const interactiveTarget = e.target.closest(
      'a, button, .nav-link, .editorial-btn, .editorial-card, .project-showcase-card, .soft-skill-card, .flowing-step-card, .tab-btn, .action-pill, .nav-cv-pill, .nav-connect-pill, .cd-launch-pill, .skip-intro-btn, input, textarea, select'
    );
    if (interactiveTarget) {
      playTapSound(760, 0.038);
    }
  });

  // Initialize Navbar Sound Button UI with current muted state
  setGlobalSoundMuted(window.soundMuted, false);

  // ==========================================================================
  // HERO PROFILE VIDEO: PLAY / PAUSE & SCROLL CONTROL ENGINE
  // 1. Plays unmuted ONLY when homepage appears after entering portfolio (if unmuted)
  // 2. Automatically PAUSES when scrolling down/away from Hero
  // 3. Automatically RESUMES when scrolling back into Hero view
  // 4. Interactive PLAY/PAUSE button with sound equalizer bars
  // ==========================================================================
  window.portfolioEntered = false;
  const heroVideo = document.getElementById('hero-intro-video');
  const heroVideoPlayBtn = document.getElementById('hero-video-play-btn');
  const heroPlayIcon = document.getElementById('hero-play-icon');
  const heroPlayLabel = document.getElementById('hero-play-label');

  function updatePlayBtnUI(isPlaying) {
    if (!heroVideoPlayBtn) return;
    if (isPlaying) {
      heroVideoPlayBtn.classList.add('playing');
      if (heroPlayLabel) heroPlayLabel.textContent = 'PAUSE';
      if (heroPlayIcon) {
        heroPlayIcon.setAttribute('data-lucide', 'pause');
        if (window.lucide) window.lucide.createIcons();
      }
    } else {
      heroVideoPlayBtn.classList.remove('playing');
      if (heroPlayLabel) heroPlayLabel.textContent = 'PLAY';
      if (heroPlayIcon) {
        heroPlayIcon.setAttribute('data-lucide', 'play');
        if (window.lucide) window.lucide.createIcons();
      }
    }
  }
  window.updatePlayBtnUI = updatePlayBtnUI;

  if (heroVideo) {
    // Explicitly start paused until user enters the portfolio
    heroVideo.pause();
    heroVideo.muted = !!window.soundMuted;
    heroVideo.volume = 1.0;
    updatePlayBtnUI(false);

    // Interactive button click
    if (heroVideoPlayBtn) {
      heroVideoPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (heroVideo.paused) {
          heroVideo.muted = !!window.soundMuted;
          heroVideo.volume = 1.0;
          heroVideo.play().then(() => {
            updatePlayBtnUI(true);
          }).catch(() => {
            heroVideo.muted = true;
            heroVideo.play().then(() => updatePlayBtnUI(true));
          });
          playClickSound(720, 0.05);
        } else {
          heroVideo.pause();
          updatePlayBtnUI(false);
          playClickSound(420, 0.05);
        }
      });
    }

    heroVideo.addEventListener('play', () => updatePlayBtnUI(true));
    heroVideo.addEventListener('pause', () => updatePlayBtnUI(false));

    // IntersectionObserver for Hero Section:
    // When scrolling down/away from the Hero section, stop/pause video!
    // When scrolling back up to the Hero section, resume video!
    const heroSection = document.getElementById('home');
    if (heroSection) {
      const heroObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Only control if the portfolio has been entered
            if (!window.portfolioEntered) return;

            if (entry.isIntersecting) {
              // Scrolled back into Hero view: resume playing
              if (heroVideo.paused) {
                heroVideo.muted = !!window.soundMuted;
                heroVideo.play().then(() => {
                  updatePlayBtnUI(true);
                }).catch(() => {});
              }
            } else {
              // Scrolled away from Hero view: stop/pause playing
              if (!heroVideo.paused) {
                heroVideo.pause();
                updatePlayBtnUI(false);
              }
            }
          });
        },
        { threshold: 0.18 }
      );
      heroObserver.observe(heroSection);
    }
  }

  // ==========================================================================
  // 3. ANIMATION 1: 3D SPACE ZOOM MOTION BACKGROUND (#bg-mesh-canvas)
  // Deep space warp zoom with very small delicate starlight points & mouse parallax
  // ==========================================================================
  const meshCanvas = document.getElementById('bg-mesh-canvas');
  if (meshCanvas) {
    const sctx = meshCanvas.getContext('2d');
    let sWidth = (meshCanvas.width = window.innerWidth);
    let sHeight = (meshCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      sWidth = meshCanvas.width = window.innerWidth;
      sHeight = meshCanvas.height = window.innerHeight;
    });

    // 3D Space Zoom Starfield
    const NUM_ZOOM_STARS = 450;
    const MAX_DEPTH = 1400;
    const zoomStars = [];
    const zoomSpeed = 2.0;

    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let parallaxX = 0;
    let parallaxY = 0;

    window.addEventListener('mousemove', (e) => {
      targetParallaxX = (e.clientX - sWidth / 2) * 0.12;
      targetParallaxY = (e.clientY - sHeight / 2) * 0.12;
    });

    class SpaceZoomStar {
      constructor(randomZ = true) {
        this.reset(randomZ);
      }

      reset(randomZ = false) {
        // Broad distribution across deep space frustum
        this.x = (Math.random() - 0.5) * (sWidth * 2.8);
        this.y = (Math.random() - 0.5) * (sHeight * 2.8);
        this.z = randomZ ? Math.random() * MAX_DEPTH + 10 : MAX_DEPTH;
        this.baseRadius = Math.random() * 0.65 + 0.45; // Very small light: 0.45px to 1.1px
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.025 + 0.015;
      }

      update() {
        this.z -= zoomSpeed;
        this.twinklePhase += this.twinkleSpeed;

        // When passing camera plane, recycle to deep space
        if (this.z <= 12) {
          this.reset(false);
        }
      }

      draw() {
        const focalLength = 400;
        const scale = focalLength / Math.max(1, this.z);

        const screenX = sWidth / 2 + this.x * scale + parallaxX;
        const screenY = sHeight / 2 + this.y * scale + parallaxY;

        // Skip if out of screen bounds
        if (screenX < -20 || screenX > sWidth + 20 || screenY < -20 || screenY > sHeight + 20) {
          return;
        }

        // Distance attenuation
        const depthRatio = 1 - this.z / MAX_DEPTH; // 0 (far) to 1 (near)
        const size = Math.max(0.35, Math.min(1.35, this.baseRadius * (scale * 0.95 + 0.5)));
        const twinkle = 0.8 + 0.2 * Math.sin(this.twinklePhase);
        const alpha = Math.max(0.12, Math.min(0.85, (depthRatio * 0.68 + 0.15) * twinkle));

        // For nearby zooming stars, draw delicate micro light-streak pointing toward center
        if (this.z < 380) {
          const prevZ = this.z + zoomSpeed * 2.2;
          const prevScale = focalLength / prevZ;
          const prevX = sWidth / 2 + this.x * prevScale + parallaxX;
          const prevY = sHeight / 2 + this.y * prevScale + parallaxY;

          sctx.save();
          sctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
          sctx.lineWidth = Math.max(0.4, size * 0.7);
          sctx.beginPath();
          sctx.moveTo(prevX, prevY);
          sctx.lineTo(screenX, screenY);
          sctx.stroke();
          sctx.restore();
        }

        // Very small pinpoint light star
        sctx.save();
        sctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        sctx.beginPath();
        sctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        sctx.fill();
        sctx.restore();
      }
    }

    for (let i = 0; i < NUM_ZOOM_STARS; i++) {
      zoomStars.push(new SpaceZoomStar(true));
    }

    function renderSpaceZoomBackground() {
      requestAnimationFrame(renderSpaceZoomBackground);
      sctx.clearRect(0, 0, sWidth, sHeight);

      // Smooth parallax easing
      parallaxX += (targetParallaxX - parallaxX) * 0.04;
      parallaxY += (targetParallaxY - parallaxY) * 0.04;

      for (let i = 0; i < zoomStars.length; i++) {
        zoomStars[i].update();
        zoomStars[i].draw();
      }
    }
    renderSpaceZoomBackground();
  }

  // ==========================================================================
  // 4. ANIMATION 3: 3D HOLOGRAPHIC CARD TILT & SPECULAR SPOTLIGHT
  // ==========================================================================
  function initCard3DTiltAndSpotlight() {
    const cards = document.querySelectorAll(
      '.editorial-card, .flowing-step-card, .project-showcase-card, .skill-category-card, .soft-skill-card, .connect-action-card, .hero-portrait-card'
    );

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set spotlight coordinates
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Compute normalized tilt (-1 to 1)
        const tiltX = (x / rect.width - 0.5) * 2;
        const tiltY = (y / rect.height - 0.5) * 2;

        card.style.setProperty('--tilt-x', tiltX.toFixed(3));
        card.style.setProperty('--tilt-y', tiltY.toFixed(3));
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--tilt-x', '0');
        card.style.setProperty('--tilt-y', '0');
        card.style.setProperty('--mouse-x', '-500px');
        card.style.setProperty('--mouse-y', '-500px');
      });
    });
  }

  // ==========================================================================
  // 5. STAGGERED SCROLL-DRIVEN CARD & TELEMETRY TYPEWRITER ANIMATIONS
  // ==========================================================================

  function initQuickFactsTypewriter() {
    const specCard = document.getElementById('spec-academic-card') || document.querySelector('.spec-table-card');
    if (!specCard || specCard.dataset.typewriterStarted === 'true') return;
    specCard.dataset.typewriterStarted = 'true';

    // If reduced motion is requested, leave full text in place
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const rows = specCard.querySelectorAll('.spec-row[data-typewrite]');
    if (!rows || rows.length === 0) return;

    // Collect initial row data
    const rowList = [];
    rows.forEach((row) => {
      const valEl = row.querySelector('.spec-val');
      if (!valEl) return;
      const targetText = row.getAttribute('data-typewrite') || valEl.textContent.trim();
      rowList.push({ row, valEl, targetText });
      valEl.textContent = ''; // clear for typing sequence
    });

    // Start typing after card slide-in transition finishes establishing (~380ms)
    let accumulatedDelay = 380;

    rowList.forEach((item, index) => {
      setTimeout(() => {
        typeRow(item, index === rowList.length - 1);
      }, accumulatedDelay);

      const charDuration = item.targetText.length * 20;
      accumulatedDelay += charDuration + 130;
    });

    function typeRow(item, isLast) {
      const { row, valEl, targetText } = item;
      row.classList.add('typing-active');

      const cursor = document.createElement('span');
      cursor.className = 'typewriter-cursor';
      cursor.textContent = '|';

      valEl.textContent = '';
      valEl.appendChild(cursor);

      let idx = 0;
      const typingSpeed = targetText.length > 25 ? 18 : 24;

      function step() {
        if (idx < targetText.length) {
          valEl.textContent = targetText.slice(0, idx + 1);
          valEl.appendChild(cursor);
          idx++;

          // Subtle micro audio click on every few characters if unmuted
          if (idx % 3 === 0) {
            playClickSound(800 + Math.random() * 120, 0.012);
          }

          setTimeout(step, typingSpeed);
        } else {
          // Finished typing this row
          row.classList.remove('typing-active');
          row.classList.add('typing-done');

          setTimeout(() => {
            if (cursor.parentNode) cursor.remove();
          }, 160);

          if (valEl.classList.contains('cgpa-highlight')) {
            // Smooth numerical counter up to 7.51
            let startVal = 0;
            const endVal = 7.51;
            const startTime = performance.now();
            const countDuration = 750;
            function countStep(now) {
              const elapsed = now - startTime;
              const prog = Math.min(elapsed / countDuration, 1);
              const ease = 1 - Math.pow(1 - prog, 3);
              const cur = (startVal + (endVal - startVal) * ease).toFixed(2);
              valEl.textContent = `${cur} / 10.0`;
              if (prog < 1) requestAnimationFrame(countStep);
            }
            requestAnimationFrame(countStep);
          }

          if (isLast) {
            specCard.classList.add('spec-dossier-verified');
            playClickSound(1080, 0.08); // Verified completion chime
          }
        }
      }

      step();
    }
  }

  function initScrollAnimations() {
    // 1. Observe Section Headings (Slide-in from Left)
    const headings = document.querySelectorAll('.section-heading-wrapper');
    const headingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            headingObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    headings.forEach((h) => headingObserver.observe(h));

    // 2. Observe All Reveal Cards (Staggered Left-to-Right Entrance)
    const revealCards = document.querySelectorAll('.reveal-card');
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            if (entry.target.classList.contains('waypoint-card')) {
              entry.target.classList.add('active');
            }
            // If this is the Quick Facts & Academic Record card, trigger typewriter
            if (entry.target.classList.contains('spec-table-card') || entry.target.id === 'spec-academic-card') {
              initQuickFactsTypewriter();
            }
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealCards.forEach((c) => cardObserver.observe(c));

    // 3. Fallback Observers for Roadmap Step Cards & Project Showcase Cards
    const stepCards = document.querySelectorAll('.flowing-step-card, .waypoint-card, .roadmap-box');
    const projectCards = document.querySelectorAll('.project-showcase-card');

    const roadmapObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    );
    stepCards.forEach((b) => roadmapObserver.observe(b));

    const projectObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    projectCards.forEach((p) => projectObserver.observe(p));
  }

  // ==========================================================================
  // FLOWING SCROLLING ROADMAP CONTROLLER
  // Reveals the 01-02-03-04 flowing milestone cards sequentially as the user scrolls
  // and triggers the animated SVG border drawing
  // ==========================================================================
  function initFlowingRoadmap() {
    const stepCards = document.querySelectorAll('.flowing-step-card');
    if (!stepCards.length) return;

    const flowObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view', 'active');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    stepCards.forEach((c) => flowObserver.observe(c));

    // Social & brand click listeners: converts icon to gold accent on click
    const socialClickables = document.querySelectorAll(
      '.dock-social-link, .connect-action-card, .connect-pill-btn, .footer-social-link'
    );
    socialClickables.forEach((el) => {
      el.addEventListener('click', () => {
        el.classList.add('clicked');
        const icon = el.querySelector('.connect-card-top-icon, .dock-social-svg, .btn-brand-svg');
        if (icon) icon.classList.add('clicked');
        playClickSound(880, 0.04);
      });
    });
  }

  // ==========================================================================
  // 6. PROJECT CASE STUDY MODAL SYSTEM (Gruhu & TOLET)
  // ==========================================================================
  const projectData = {
    'gruhu': {
      title: 'Gruhu — E-Commerce Platform & AI Interior Stylist',
      category: 'Java Full-Stack & Generative AI • Deployed on RENDER',
      role: 'Full-Stack Java Engineer & AI Integration Specialist',
      liveLink: 'https://gruhu.onrender.com',
      repoLink: 'https://github.com/praveen4848/gruhu',
      stack: ['Java', 'Jakarta Servlets', 'JSP', 'JSTL', 'JDBC', 'SQL', 'TiDB Cloud', 'Gemini API', 'Docker', 'Apache Tomcat', 'Maven', 'Render'],
      overview:
        'A comprehensive full-stack interior design and e-commerce platform with customer and administrator workflows for managing products, rooms, and orders. Features automated room image intelligence via the Gemini API to analyze uploaded room photos and generate personalized, AI-powered interior styling recommendations linked directly to platform catalog items.',
      architecture: [
        'Built backend features using Java, Jakarta Servlets, JSP, JSTL, JDBC, and robust MVC pattern with service and DAO layers.',
        'Integrated Google Gemini API to analyze room images and generate AI-powered interior styling recommendations tied to catalog products.',
        'Architected database storage with distributed TiDB Cloud MySQL database for scalable catalog and order management.',
        'Containerized the entire application with Docker and automated builds using Maven and Apache Tomcat, deployed live on Render.'
      ],
      metrics: 'Successfully deployed on Render with live Gemini API multimodal room analysis and multi-role customer/admin workflows.'
    },
    'tolet': {
      title: 'TOLET — Property Rental Platform',
      category: 'Full-Stack Next.js & Cloud Database • Deployed on VERCEL',
      role: 'Full-Stack Developer & Database Architect',
      liveLink: 'https://tolet-opal.vercel.app/',
      repoLink: 'https://github.com/praveen4848/TOLET',
      stack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Supabase', 'SQL', 'Vercel'],
      overview:
        'A modern property rental platform with dedicated customer, property-owner, and administrator workflows for property discovery and listing management. Implemented property search, favorites, inquiries, media uploads, availability management, and comprehensive property details.',
      architecture: [
        'Engineered booking availability validation algorithms to proactively prevent conflicting reservations across property dates.',
        'Implemented Supabase Auth and PostgreSQL Row Level Security (RLS) to enforce strict role-based access control for tenants, owners, and admins.',
        'Constructed fluid user interfaces using React, Next.js, TypeScript, and Tailwind CSS for mobile and desktop responsiveness.',
        'Deployed application on Vercel with high-availability edge routing and zero downtime.'
      ],
      metrics: 'Deployed live on Vercel with zero conflicting reservations and airtight PostgreSQL Row Level Security.'
    }
  };

  const caseStudyModal = document.getElementById('case-study-modal');
  const caseStudyTitle = document.getElementById('modal-case-title');
  const caseStudyCategory = document.getElementById('modal-case-category');
  const caseStudyRole = document.getElementById('modal-case-role');
  const caseStudyOverview = document.getElementById('modal-case-overview');
  const caseStudyArchList = document.getElementById('modal-case-arch');
  const caseStudyMetrics = document.getElementById('modal-case-metrics');
  const caseStudyStack = document.getElementById('modal-case-stack');
  const caseStudyLiveBtn = document.getElementById('modal-case-live-btn');

  document.querySelectorAll('.view-case-study-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];
      if (!data) return;

      playClickSound(750, 0.04);

      if (caseStudyTitle) caseStudyTitle.textContent = data.title;
      if (caseStudyCategory) caseStudyCategory.textContent = data.category;
      if (caseStudyRole) caseStudyRole.textContent = data.role;
      if (caseStudyOverview) caseStudyOverview.textContent = data.overview;
      if (caseStudyMetrics) caseStudyMetrics.textContent = data.metrics;

      if (caseStudyLiveBtn) {
        caseStudyLiveBtn.href = data.liveLink;
        caseStudyLiveBtn.style.display = 'inline-flex';
      }

      if (caseStudyStack) {
        caseStudyStack.innerHTML = data.stack
          .map((tech) => `<span class="tech-tag">${tech}</span>`)
          .join('');
      }

      if (caseStudyArchList) {
        caseStudyArchList.innerHTML = data.architecture
          .map((item) => `<li>${item}</li>`)
          .join('');
      }

      caseStudyModal?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Modal Close Handlers
  document.querySelectorAll('.modal-close-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      document.querySelectorAll('.modal-backdrop').forEach((m) => m.classList.remove('open'));
      document.body.style.overflow = 'auto';
      playClickSound(360, 0.04);
    });
  });

  // ==========================================================================
  // 7. RESUME MODAL HANDLER
  // ==========================================================================
  const resumeModal = document.getElementById('resume-modal');
  const openResumeTriggers = document.querySelectorAll('.open-resume-trigger');

  openResumeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      resumeModal?.classList.add('open');
      document.body.style.overflow = 'hidden';
      playClickSound(800, 0.04);
    });
  });

  // ==========================================================================
  // 8. CONTACT FORM SUBMISSION
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const formSuccessBanner = document.getElementById('form-success-banner');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Transmit Message';

      if (submitBtn) {
        submitBtn.innerHTML = `<span>Transmitting Message...</span>`;
        submitBtn.style.opacity = '0.7';
        submitBtn.disabled = true;
      }

      playClickSound(800, 0.12);

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = `<span>Message Transmitted Successfully</span>`;
          submitBtn.style.opacity = '1';
        }
        if (formSuccessBanner) {
          formSuccessBanner.style.display = 'block';
        }
        contactForm.reset();
        playClickSound(1050, 0.15);

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }
        }, 3500);
      }, 1100);
    });
  }

  // Copy Email to Clipboard
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'praveena2z029@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const span = copyEmailBtn.querySelector('.copy-text-target');
        if (span) {
          const prev = span.textContent;
          span.textContent = 'Copied to clipboard!';
          playClickSound(900, 0.06);
          setTimeout(() => {
            span.textContent = prev;
          }, 2400);
        }
      });
    });
  }

  // Back to Top button
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playClickSound(600, 0.05);
    });
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    bindCursorInteractions();
    initCard3DTiltAndSpotlight();
    initScrollAnimations();
    initFlowingRoadmap();
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  window.rebindCursor = bindCursorInteractions;
  window.initScrollAnimations = initScrollAnimations;
  window.initFlowingRoadmap = initFlowingRoadmap;
})();
