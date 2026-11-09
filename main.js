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
        document.body.classList.add('custom-cursor-active');
      }
    }
  }, { passive: true });

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
      }, { passive: true });
      el.addEventListener('mouseleave', () => {
        if (cursorPointer) cursorPointer.classList.remove('hovering');
      }, { passive: true });
    });
  }

  // ==========================================================================
  // 2. DYNAMIC SCROLL PROGRESS BAR & ANIMATED NAVBAR DOCK (ZERO REFLOW)
  // ==========================================================================
  const progressBar = document.getElementById('scroll-progress-bar');
  const siteHeader = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');

  let cachedDocHeight = 1;
  let sectionOffsets = [];

  function cacheLayoutPositions() {
    cachedDocHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    sectionOffsets = Array.from(sections).map((sec) => ({
      id: sec.getAttribute('id'),
      top: sec.offsetTop,
      bottom: sec.offsetTop + sec.offsetHeight
    }));
  }

  window.addEventListener('load', cacheLayoutPositions, { passive: true });
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(cacheLayoutPositions, 200);
  }, { passive: true });
  setTimeout(cacheLayoutPositions, 400);

  let scrollTicking = false;
  function onScrollUpdate() {
    const scrollY = window.scrollY;
    const progress = Math.min(100, Math.max(0, (scrollY / cachedDocHeight) * 100));

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (siteHeader) {
      siteHeader.classList.toggle('scrolled', scrollY > 40);
    }

    // Nav Scroll Spy using cached offsets (zero DOM reading during scroll!)
    let current = '';
    const scrollPos = scrollY + 160;
    for (let i = 0; i < sectionOffsets.length; i++) {
      const sec = sectionOffsets[i];
      if (scrollPos >= sec.top && scrollPos < sec.bottom) {
        current = sec.id;
        break;
      }
    }

    if (current) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('data-section') === current);
      });
    }

    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(onScrollUpdate);
      scrollTicking = true;
    }
  }, { passive: true });

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
  // 3. ANIMATION 1: SPACE ASTEROIDS & COSMIC DUST PARTICLES (#bg-mesh-canvas)
  // Subtle, minimal, aesthetic deep-space drifting micro-asteroids & stardust
  // ==========================================================================
  const meshCanvas = document.getElementById('bg-mesh-canvas');
  let isCanvasAnimRunning = false;
  let canvasAnimRAF = null;

  if (meshCanvas) {
    const sctx = meshCanvas.getContext('2d');
    let sWidth = (meshCanvas.width = window.innerWidth);
    let sHeight = (meshCanvas.height = window.innerHeight);

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        sWidth = meshCanvas.width = window.innerWidth;
        sHeight = meshCanvas.height = window.innerHeight;
      }, 150);
    }, { passive: true });

    // 1. Subtle Micro-Asteroids (floating irregular polygonal space rocks)
    const asteroids = [];
    const isMobile = window.innerWidth < 768;
    const NUM_ASTEROIDS = isMobile ? 18 : 32;

    class Asteroid {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = init ? Math.random() * sWidth : (Math.random() > 0.5 ? -30 : sWidth + 30);
        this.y = Math.random() * sHeight;
        this.radius = Math.random() * 3.0 + 1.6; // Small, subtle
        this.vx = (Math.random() - 0.5) * 0.32;
        this.vy = (Math.random() - 0.5) * 0.28;
        this.angle = Math.random() * Math.PI * 2;
        this.angularVelocity = (Math.random() - 0.5) * 0.012;
        this.alpha = Math.random() * 0.32 + 0.18;
        this.isGoldTinted = Math.random() < 0.12;

        // Generate irregular rock vertices
        this.numVertices = Math.floor(Math.random() * 3) + 5;
        this.vertexOffsets = [];
        for (let i = 0; i < this.numVertices; i++) {
          this.vertexOffsets.push(0.72 + Math.random() * 0.48);
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.angularVelocity;

        // Wrap around screen edges
        if (this.x < -40) this.x = sWidth + 40;
        if (this.x > sWidth + 40) this.x = -40;
        if (this.y < -40) this.y = sHeight + 40;
        if (this.y > sHeight + 40) this.y = -40;
      }

      draw() {
        sctx.save();
        sctx.translate(this.x, this.y);
        sctx.rotate(this.angle);

        sctx.beginPath();
        for (let i = 0; i < this.numVertices; i++) {
          const a = (i / this.numVertices) * Math.PI * 2;
          const r = this.radius * this.vertexOffsets[i];
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (i === 0) sctx.moveTo(px, py);
          else sctx.lineTo(px, py);
        }
        sctx.closePath();

        // Shaded surface facet
        if (this.isGoldTinted) {
          sctx.fillStyle = `rgba(255, 201, 0, ${this.alpha * 0.8})`;
          sctx.strokeStyle = `rgba(255, 201, 0, ${this.alpha * 1.2})`;
        } else {
          sctx.fillStyle = `rgba(148, 163, 184, ${this.alpha * 0.55})`;
          sctx.strokeStyle = `rgba(226, 232, 240, ${this.alpha * 0.85})`;
        }
        sctx.lineWidth = 0.8;
        sctx.fill();
        sctx.stroke();

        sctx.restore();
      }
    }

    for (let i = 0; i < NUM_ASTEROIDS; i++) {
      asteroids.push(new Asteroid());
    }

    // 2. Cosmic Tiny Dust Particles, Harmonic Waves & Clean Constellation Field
    const stardust = [];
    const NUM_DUST = isMobile ? 65 : 105;
    let canvasMouseX = -1000;
    let canvasMouseY = -1000;

    window.addEventListener('mousemove', (e) => {
      canvasMouseX = e.clientX;
      canvasMouseY = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      canvasMouseX = -1000;
      canvasMouseY = -1000;
    });

    class DustParticle {
      constructor() {
        this.x = Math.random() * sWidth;
        this.y = Math.random() * sHeight;
        this.radius = Math.random() * 1.1 + 0.45;
        this.vx = (Math.random() - 0.5) * 0.22;
        this.vy = (Math.random() - 0.5) * 0.22;
        this.baseAlpha = Math.random() * 0.42 + 0.18;
        this.pulseSpeed = Math.random() * 0.02 + 0.008;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.wavePhase = Math.random() * Math.PI * 2;
        this.isGold = Math.random() < 0.12;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy + Math.sin(this.wavePhase) * 0.1;
        this.pulsePhase += this.pulseSpeed;
        this.wavePhase += 0.015;

        // Subtle gentle drift away from cursor if very close
        if (canvasMouseX > 0 && canvasMouseY > 0) {
          const dx = this.x - canvasMouseX;
          const dy = this.y - canvasMouseY;
          const distSq = dx * dx + dy * dy;
          if (distSq < 6400 && distSq > 50) { // 80px
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 80) * 0.5;
            this.x += (dx / dist) * force;
            this.y += (dy / dist) * force;
          }
        }

        if (this.x < 0) this.x = sWidth;
        if (this.x > sWidth) this.x = 0;
        if (this.y < 0) this.y = sHeight;
        if (this.y > sHeight) this.y = 0;
      }

      draw() {
        const currentAlpha = Math.max(0.1, this.baseAlpha + Math.sin(this.pulsePhase) * 0.2);

        sctx.save();
        sctx.beginPath();
        sctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        if (this.isGold) {
          sctx.fillStyle = `rgba(255, 201, 0, ${currentAlpha * 0.75})`;
        } else {
          sctx.fillStyle = `rgba(245, 243, 239, ${currentAlpha * 0.85})`;
        }

        sctx.fill();
        sctx.restore();
      }
    }

    for (let i = 0; i < NUM_DUST; i++) {
      stardust.push(new DustParticle());
    }

    // 3. Graceful, Restrained Shooting Stars
    const shootingStars = [];
    class ShootingStar {
      constructor() {
        this.reset();
      }

      reset() {
        const angleVariants = [
          Math.PI / 4 + (Math.random() - 0.5) * 0.12,
          Math.PI / 3 + (Math.random() - 0.5) * 0.1
        ];
        this.angle = angleVariants[Math.floor(Math.random() * angleVariants.length)];
        this.x = Math.random() * (sWidth * 0.75);
        this.y = Math.random() * (sHeight * 0.4);
        this.length = Math.random() * 70 + 60;
        this.speed = Math.random() * 8 + 11;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.life = 0;
        this.maxLife = Math.random() * 40 + 30;
        this.isDying = false;
        this.color = Math.random() > 0.4 ? '#FFF7C2' : '#FFC900';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        if (this.life >= this.maxLife || this.x > sWidth + 100 || this.y > sHeight + 100) {
          this.isDying = true;
        }
      }

      draw() {
        const progress = this.life / this.maxLife;
        const alpha = progress < 0.15 ? progress / 0.15 : Math.max(0, 1 - (progress - 0.15) / 0.85);
        if (alpha <= 0) return;

        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        const grad = sctx.createLinearGradient(tailX, tailY, this.x, this.y);
        grad.addColorStop(0, 'rgba(255, 201, 0, 0)');
        grad.addColorStop(0.6, `rgba(255, 201, 0, ${alpha * 0.35})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.85})`);

        sctx.save();
        sctx.strokeStyle = grad;
        sctx.lineWidth = 1.3;
        sctx.beginPath();
        sctx.moveTo(tailX, tailY);
        sctx.lineTo(this.x, this.y);
        sctx.stroke();

        sctx.fillStyle = this.color;
        sctx.beginPath();
        sctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        sctx.fill();
        sctx.restore();
      }
    }

    let nextShootingStarTime = Date.now() + 2000;

    function renderSpaceAsteroids() {
      if (!isCanvasAnimRunning || document.hidden) {
        canvasAnimRAF = null;
        return;
      }
      canvasAnimRAF = requestAnimationFrame(renderSpaceAsteroids);
      sctx.clearRect(0, 0, sWidth, sHeight);

      // Draw Stardust Particles
      for (let i = 0; i < stardust.length; i++) {
        stardust[i].update();
        stardust[i].draw();
      }

      // Draw Clean Proximity Constellation Lines (ONLY star-to-star, NEVER to cursor)
      sctx.lineWidth = 0.55;
      for (let i = 0; i < stardust.length; i++) {
        for (let j = i + 1; j < stardust.length; j++) {
          const dx = stardust[i].x - stardust[j].x;
          const dy = stardust[i].y - stardust[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 6400) { // 80 * 80
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 80) * 0.12;
            sctx.strokeStyle = `rgba(226, 232, 240, ${lineAlpha})`;
            sctx.beginPath();
            sctx.moveTo(stardust[i].x, stardust[i].y);
            sctx.lineTo(stardust[j].x, stardust[j].y);
            sctx.stroke();
          }
        }
      }

      // Periodic Shooting Stars (Clean, graceful, occasional)
      const now = Date.now();
      if (now > nextShootingStarTime) {
        if (shootingStars.length < 2) {
          shootingStars.push(new ShootingStar());
        }
        nextShootingStarTime = now + Math.random() * 2500 + 2200;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        shootingStars[i].update();
        shootingStars[i].draw();
        if (shootingStars[i].isDying) {
          shootingStars.splice(i, 1);
        }
      }

      // Draw Floating Geometric Asteroids
      for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].update();
        asteroids[i].draw();
      }
    }

    function startBackgroundAnimation() {
      if (isCanvasAnimRunning) return;
      isCanvasAnimRunning = true;
      if (!canvasAnimRAF) {
        renderSpaceAsteroids();
      }
    }
    window.startBackgroundAnimation = startBackgroundAnimation;
    window.startCelestialSphere = startBackgroundAnimation;
    window.startSpaceZoom = startBackgroundAnimation;

    // Visibility Listener: pause when tab hidden to preserve CPU/battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (canvasAnimRAF) {
          cancelAnimationFrame(canvasAnimRAF);
          canvasAnimRAF = null;
        }
      } else if (isCanvasAnimRunning && !canvasAnimRAF) {
        renderSpaceAsteroids();
      }
    });

    startBackgroundAnimation();
  }

  // ==========================================================================
  // 4. ANIMATION 3: 3D HOLOGRAPHIC CARD TILT & SPECULAR SPOTLIGHT (BATCHED RAF)
  // ==========================================================================
  function initCard3DTiltAndSpotlight() {
    const cards = document.querySelectorAll(
      '.editorial-card, .flowing-step-card, .project-showcase-card, .skill-category-card, .soft-skill-card, .connect-action-card, .hero-portrait-card'
    );

    cards.forEach((card) => {
      let rect = null;
      let tiltRAF = null;

      card.addEventListener('mouseenter', () => {
        rect = card.getBoundingClientRect();
      }, { passive: true });

      card.addEventListener('mousemove', (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (tiltRAF) cancelAnimationFrame(tiltRAF);
        tiltRAF = requestAnimationFrame(() => {
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);

          const w = (rect && rect.width > 0) ? rect.width : 300;
          const h = (rect && rect.height > 0) ? rect.height : 200;
          const tiltX = Math.max(-1, Math.min(1, (x / w - 0.5) * 2)).toFixed(2);
          const tiltY = Math.max(-1, Math.min(1, (y / h - 0.5) * 2)).toFixed(2);

          card.style.setProperty('--tilt-x', tiltX);
          card.style.setProperty('--tilt-y', tiltY);
        });
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        if (tiltRAF) cancelAnimationFrame(tiltRAF);
        rect = null;
        card.style.setProperty('--tilt-x', '0');
        card.style.setProperty('--tilt-y', '0');
        card.style.setProperty('--mouse-x', '-500px');
        card.style.setProperty('--mouse-y', '-500px');
      }, { passive: true });
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
  function initializeApp() {
    bindCursorInteractions();
    initCard3DTiltAndSpotlight();
    initScrollAnimations();
    initFlowingRoadmap();
    if (window.lucide) {
      try {
        window.lucide.createIcons();
      } catch (e) {}
    }
    // Safety check: ensure cards currently visible or in DOM have in-view class
    setTimeout(() => {
      document.querySelectorAll('.section-heading-wrapper, .reveal-card, .flowing-step-card, .project-showcase-card').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 150) {
          el.classList.add('in-view');
        }
      });
    }, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }

  window.rebindCursor = bindCursorInteractions;
  window.initScrollAnimations = initScrollAnimations;
  window.initFlowingRoadmap = initFlowingRoadmap;
})();
