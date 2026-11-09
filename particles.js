/**
 * ============================================================================
 * CHRISTEN DIJOUX KINETIC TYPOGRAPHY & RIDGE LINES ENGINE
 * Inspired by https://christendijoux.com/
 * - Big Shoulders Display Variable-Weight Magnetic Cursor Waves (wght 120 -> 900)
 * - Autonomous Traveling Harmonic Sine Waves on Idle & Mobile
 * - Interactive Parallax on Joy Division Mountain Ridge Lines
 * - Fluid Launch & Entrance Transition into Portfolio
 * ============================================================================
 */

(function () {
  'use strict';

  const overlay = document.getElementById('welcome-overlay');
  if (!overlay) return;

  const mainContent = document.getElementById('main-content');
  const launchTrigger = document.getElementById('welcome-trigger');
  const skipBtn = document.getElementById('skip-intro-btn');
  const ridgeImage = document.getElementById('cd-ridge-image');
  const nameHeading = document.getElementById('cd-name-heading');

  // ==========================================================================
  // Web Audio Synth for Launch & Interaction
  // ==========================================================================
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && AudioContextClass) {
      try {
        audioCtx = new AudioContextClass();
      } catch (e) {}
    }
  }

  function playLaunchSound() {
    if (window.soundMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.32);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.85);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    } catch (e) {}
  }

  // ==========================================================================
  // Variable-Weight Magnetic Kinetic Typography (Christen Dijoux Pa Algorithm)
  // ==========================================================================
  const charElements = Array.from(overlay.querySelectorAll('.cd-display-name .char'));
  if (charElements.length === 0) return;

  const MIN_WEIGHT = 120;
  const MAX_WEIGHT = 900;
  const RADIUS = 340; // Magnetic reach radius in pixels

  // State
  let charCenters = [];
  const currentWeights = charElements.map(() => MIN_WEIGHT);

  let mouseX = -9999;
  let mouseY = -9999;
  let lastMouseMoveTime = 0;
  let isMouseActive = false;

  // Parallax target & current
  let targetParallaxX = 0;
  let targetParallaxY = 0;
  let currentParallaxX = 0;
  let currentParallaxY = 0;

  function recalculateCharCenters() {
    charCenters = charElements.map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    });
  }

  window.addEventListener('resize', recalculateCharCenters);
  window.addEventListener('scroll', recalculateCharCenters, { passive: true });
  // Call once on init and after fonts settle
  setTimeout(recalculateCharCenters, 50);
  setTimeout(recalculateCharCenters, 300);
  setTimeout(recalculateCharCenters, 800);

  // Mouse & Touch Movement
  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastMouseMoveTime = performance.now();
    isMouseActive = true;

    // Subtle parallax on ridge lines
    const normX = (e.clientX / window.innerWidth - 0.5);
    const normY = (e.clientY / window.innerHeight - 0.5);
    targetParallaxX = normX * 16;
    targetParallaxY = normY * 10;
  }, { passive: true });

  overlay.addEventListener('pointerleave', () => {
    isMouseActive = false;
    mouseX = -9999;
    mouseY = -9999;
    targetParallaxX = 0;
    targetParallaxY = 0;
  });

  // Touch handling
  overlay.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
      lastMouseMoveTime = performance.now();
      isMouseActive = true;
    }
  }, { passive: true });

  overlay.addEventListener('touchend', () => {
    isMouseActive = false;
    mouseX = -9999;
    mouseY = -9999;
  });

  // ==========================================================================
  // Main Animation Loop
  // ==========================================================================
  let isExited = false;
  let startTime = performance.now();

  function animate(now) {
    if (isExited) return;
    requestAnimationFrame(animate);

    const time = (now - startTime) * 0.001;
    const timeSinceLastMove = now - lastMouseMoveTime;

    // Smooth transition between magnetic mouse hover and ambient traveling wave
    const mouseInfluence = isMouseActive && timeSinceLastMove < 2200 ? 1.0 : Math.max(0, 1.0 - (timeSinceLastMove - 1200) / 1000);

    // Parallax easing on ridge lines
    if (ridgeImage) {
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.08;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.08;
      ridgeImage.style.transform = `scale(1.04) translate(${currentParallaxX.toFixed(2)}px, ${currentParallaxY.toFixed(2)}px)`;
    }

    // Update each character weight
    for (let i = 0; i < charElements.length; i++) {
      const charEl = charElements[i];
      const center = charCenters[i];
      if (!center) continue;

      let targetWeight = MIN_WEIGHT;

      // 1. Cursor Magnetic Influence (Exact Smoothstep from Christen Dijoux)
      let cursorTarget = MIN_WEIGHT;
      if (mouseX > -1000 && mouseY > -1000) {
        const d = Math.hypot(mouseX - center.x, mouseY - center.y);
        const u = Math.max(0, 1.0 - d / RADIUS);
        // Smoothstep: u * u * (3 - 2 * u)
        const smoothU = u * u * (3.0 - 2.0 * u);
        cursorTarget = MIN_WEIGHT + (MAX_WEIGHT - MIN_WEIGHT) * smoothU;
      }

      // 2. Ambient Traveling Sine Wave (Continuous fluid breathing across letters)
      const wavePhase = time * 2.8 - i * 0.42;
      const waveVal = 0.5 + 0.5 * Math.sin(wavePhase);
      // Non-linear wave shaping for crisp peaks
      const shapedWave = Math.pow(waveVal, 2.2);
      const ambientTarget = MIN_WEIGHT + (MAX_WEIGHT - MIN_WEIGHT) * shapedWave;

      // Blend based on mouse activity
      targetWeight = cursorTarget * mouseInfluence + ambientTarget * (1.0 - mouseInfluence);

      // Smooth spring lerp: factor 0.18 matching Christen Dijoux Pa implementation
      currentWeights[i] += 0.18 * (targetWeight - currentWeights[i]);

      const wghtVal = Math.round(currentWeights[i]);
      charEl.style.fontVariationSettings = `'wght' ${wghtVal}`;
      charEl.style.fontWeight = wghtVal;

      // Subtle dynamic vertical micro-lift on bold peaks
      const liftFactor = (currentWeights[i] - MIN_WEIGHT) / (MAX_WEIGHT - MIN_WEIGHT);
      const liftPx = -7 * Math.pow(liftFactor, 1.5);
      charEl.style.transform = `translateY(${liftPx.toFixed(1)}px)`;
    }
  }

  requestAnimationFrame(animate);

  // ==========================================================================
  // Enter Portfolio Transition
  // ==========================================================================
  function triggerLaunch() {
    if (isExited) return;
    isExited = true;

    playLaunchSound();

    if (overlay) {
      overlay.style.transition = 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)';
      overlay.style.opacity = '0';
      overlay.style.transform = 'scale(1.04)';
      overlay.style.pointerEvents = 'none';
    }

    setTimeout(() => {
      if (overlay) overlay.classList.add('hidden');
      if (mainContent) mainContent.classList.add('visible');
      document.body.style.overflow = 'auto';

      if (window.lucide) window.lucide.createIcons();
      if (window.rebindCursor) window.rebindCursor();
      if (window.initScrollAnimations) window.initScrollAnimations();
      if (window.initFlowingRoadmap) window.initFlowingRoadmap();

      window.portfolioEntered = true;
      const heroVid = document.getElementById('hero-intro-video');
      if (heroVid) {
        heroVid.muted = false;
        heroVid.volume = 1.0;
        heroVid.play().then(() => {
          if (window.updatePlayBtnUI) window.updatePlayBtnUI(true);
        }).catch(() => {
          heroVid.muted = true;
          heroVid.play().then(() => {
            if (window.updatePlayBtnUI) window.updatePlayBtnUI(true);
          }).catch(() => {});
        });
      }
    }, 700);
  }

  if (launchTrigger) {
    launchTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudio();
      triggerLaunch();
    });
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudio();
      triggerLaunch();
    });
  }

  // Click anywhere on overlay (outside the text selection) to launch
  overlay.addEventListener('click', (e) => {
    if (e.target.closest('#welcome-trigger') || e.target.closest('#skip-intro-btn')) return;
    initAudio();
    triggerLaunch();
  });

  window.PraveenChristenDijouxEngine = {
    triggerLaunch
  };
})();
