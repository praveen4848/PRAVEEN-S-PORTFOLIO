/**
 * ============================================================================
 * PRAVEEN KUMAR KAKARAPARTHI — CINEMATIC WELCOME & FULL-SCREEN DISPERSION ENGINE
 * Inspired by 21hrs.space/overview (Space Coordinate Telemetry & Cosmic Motion)
 * 
 * Sequence:
 * 1. Deep Space Void Screen (#08090B) with Coordinate Meridian & Horizon Lines
 * 2. Celestial Metallic Sphere descends gracefully along vertical meridian
 * 3. Sphere impacts center target, generating multi-frequency radar sonar ripples
 * 4. High-Resolution 16:9 Widescreen Portrait emerges with cinematic atmosphere
 * 5. "PRAVEEN" descends slowly into place (Instrument Serif typography)
 * 6. "PORTFOLIO // FULL-STACK ARCHITECT" expands with letter tracking
 * 7. Futuristic Cosmic Orbital Loading Symbol initializes with glowing pulse
 * 8. On click/tap anywhere:
 *    FULL-SCREEN REALISTIC DOT DISPERSION ("all the place dispersion"):
 *    Thousands of luminous dots (16:9 widescreen portrait + entire viewport)
 *    erupt and scatter with 3D space depth into the void, smoothly opening homepage!
 * ============================================================================
 */

(function () {
  'use strict';

  const canvas = document.getElementById('intro-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const overlay = document.getElementById('welcome-overlay');
  const backdrop = document.getElementById('welcome-backdrop');
  const mainContent = document.getElementById('main-content');
  const titlePraveen = document.getElementById('welcome-title-praveen');
  const titlePortfolio = document.getElementById('welcome-title-portfolio');
  const reactorTrigger = document.getElementById('welcome-trigger');
  const skipBtn = document.getElementById('skip-intro-btn');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  const dpr = window.devicePixelRatio || 1;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // ==========================================================================
  // Web Audio FX Engine
  // ==========================================================================
  const audioCtx = window.AudioContext ? new (window.AudioContext || window.webkitAudioContext)() : null;
  function playSound(type) {
    if (!audioCtx || window.soundMuted) return;
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'impact') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(42, now + 0.65);
        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        osc.start(now);
        osc.stop(now + 0.65);
      } else if (type === 'disperse') {
        // Celestial cosmic sweep sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 1.2);
        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.start(now);
        osc.stop(now + 1.2);
      }
    } catch (e) {}
  }

  // Animation States: 'FALLING', 'IMPACT', 'REVEALED', 'DOT_DISPERSION', 'EXITED'
  let state = 'FALLING';
  let frameCount = 0;

  // 1. Slow, Graceful Falling Gray Metallic Sphere along Vertical Meridian
  const grayBall = {
    x: width / 2,
    y: -40,
    vy: 0.55,
    gravity: 0.15, // Slow, elegant fall
    maxVy: 4.5,
    radius: 8.5,
    impactY: height * 0.44,
    trail: []
  };

  const shockwaves = [];
  function addShockwave(x, y, maxR, color = 'rgba(245, 243, 239, 0.95)', lineWidth = 2) {
    shockwaves.push({ x, y, r: 0, maxR, color, lineWidth, alpha: 1 });
  }

  // ==========================================================================
  // Full-Screen Dot Dispersion Engine ("Put all the place dispersion")
  // ==========================================================================
  const dispersionParticles = [];
  let sampleCoords = [];

  class RealisticDot {
    constructor(x, y, color = '#FFFFFF', radius = 1.5, isGoldSpark = false) {
      this.x = x;
      this.y = y;
      this.z = Math.random() * 2 + 0.5; // 3D depth
      this.color = color;
      this.radius = radius;
      this.baseRadius = radius;
      this.alpha = 1;
      this.vx = 0;
      this.vy = 0;
      this.vz = 0;
      this.friction = 0.942;
      this.isGoldSpark = isGoldSpark;
      this.turbulence = (Math.random() - 0.5) * 0.45;
      this.life = 1.0;
      this.decay = 0.015 + Math.random() * 0.012;
    }

    explode(originX, originY) {
      const dx = this.x - originX;
      const dy = this.y - originY;
      const dist = Math.hypot(dx, dy) || 1;
      
      // Radial explosion angle with organic swirl
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.75;
      
      // Distance-dependent blast force
      const speed = Math.random() * 28 + 12;
      const blastMultiplier = Math.max(0.7, 1.6 - (dist / Math.max(width, height)));
      const finalForce = speed * blastMultiplier;

      this.vx = Math.cos(angle) * finalForce;
      this.vy = Math.sin(angle) * finalForce;
      this.vz = (Math.random() - 0.5) * 8;

      if (this.isGoldSpark) {
        this.vx *= 1.35;
        this.vy *= 1.35;
      }
    }

    update() {
      // Apply velocity and air drag
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= this.friction;
      this.vy *= this.friction;

      // Realistic curl noise / turbulence
      this.vx += Math.sin(this.y * 0.015 + frameCount * 0.04) * this.turbulence;
      this.vy += Math.cos(this.x * 0.015 + frameCount * 0.04) * this.turbulence;

      // Gentle zero-gravity drift
      this.vy += 0.02;

      // Alpha & Size dissipation
      this.life -= this.decay;
      this.alpha = Math.max(0, this.life);
      this.radius *= 0.985;
    }

    draw(ctx) {
      if (this.alpha <= 0.01 || this.radius <= 0.2) return;
      ctx.save();
      ctx.globalAlpha = this.alpha;
      
      if (this.isGoldSpark) {
        ctx.fillStyle = '#FFC900';
        ctx.shadowColor = '#FFC900';
        ctx.shadowBlur = 8;
      } else {
        ctx.fillStyle = this.color;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 3;
      }

      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.4, this.radius), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Pre-load 16:9 widescreen portrait image to sample high-density dot cloud
  function prepareDotCloud() {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const offCanvas = document.createElement('canvas');
      const offCtx = offCanvas.getContext('2d');

      // Proportional fit for 16:9 widescreen within viewport
      const targetW = Math.min(width * 0.96, 1150);
      const aspect = img.height / img.width;
      const targetH = targetW * aspect;
      offCanvas.width = targetW;
      offCanvas.height = targetH;
      offCtx.drawImage(img, 0, 0, targetW, targetH);

      try {
        const imgData = offCtx.getImageData(0, 0, targetW, targetH).data;
        const startX = (width - targetW) / 2;
        const startY = (height - targetH) / 2;

        sampleCoords = [];
        const step = 5; // Fine resolution sampling
        for (let py = 0; py < targetH; py += step) {
          for (let px = 0; px < targetW; px += step) {
            const idx = (py * targetW + px) * 4;
            const r = imgData[idx];
            const g = imgData[idx + 1];
            const b = imgData[idx + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;

            if (lum > 20) {
              let color = '#CBD5E1';
              if (lum > 175) color = '#FFFFFF';
              else if (lum > 110) color = '#F1F5F9';
              else if (lum > 60) color = '#94A3B8';
              else color = '#64748B';

              sampleCoords.push({
                x: startX + px + (Math.random() - 0.5) * 3,
                y: startY + py + (Math.random() - 0.5) * 3,
                color,
                radius: 1.0 + (lum / 255) * 1.8,
                isGold: Math.random() < 0.04 // Rare golden sparks
              });
            }
          }
        }
      } catch (err) {
        // Fallback gracefully if canvas context security restricts
        sampleCoords = generateFallbackCoords();
      }
    };

    // Use embedded Base64 data if available to prevent any CORS issues
    if (window.PK_WELCOME_BG_B64) {
      img.src = window.PK_WELCOME_BG_B64;
    } else {
      img.src = 'assets/welcome_bg.jpg';
    }
  }
  prepareDotCloud();

  // Generate dots distributed across the ENTIRE VIEWPORT ("all the place dispersion")
  function generateFullScreenCoords() {
    const coords = [];
    
    // 1. Core 16:9 Widescreen Image Samples
    if (sampleCoords.length > 0) {
      coords.push(...sampleCoords);
    } else {
      // Fallback central portrait shape
      for (let i = 0; i < 3000; i++) {
        coords.push({
          x: width / 2 + (Math.random() - 0.5) * Math.min(width * 0.9, 900),
          y: height / 2 + (Math.random() - 0.5) * Math.min(height * 0.8, 600),
          color: Math.random() > 0.4 ? '#FFFFFF' : '#CBD5E1',
          radius: Math.random() * 2.2 + 0.8,
          isGold: Math.random() < 0.04
        });
      }
    }

    // 2. Full-Screen Omnipresent Viewport Cloud (covers entire screen / space lines)
    const ambientCount = 3000;
    for (let i = 0; i < ambientCount; i++) {
      coords.push({
        x: Math.random() * width,
        y: Math.random() * height,
        color: Math.random() > 0.5 ? '#F8FAFC' : '#94A3B8',
        radius: Math.random() * 1.8 + 0.6,
        isGold: Math.random() < 0.05 // Golden sparks
      });
    }

    return coords;
  }

  function generateFallbackCoords() {
    const coords = [];
    for (let i = 0; i < 4000; i++) {
      coords.push({
        x: Math.random() * width,
        y: Math.random() * height,
        color: Math.random() > 0.35 ? '#FFFFFF' : '#94A3B8',
        radius: Math.random() * 2 + 0.8,
        isGold: Math.random() < 0.04
      });
    }
    return coords;
  }

  // ==========================================================================
  // Step 2: Ball Impacts & Atmospheric Slow Reveal
  // ==========================================================================
  function triggerImpact() {
    state = 'IMPACT';
    playSound('impact');

    // Dual expanding radar/sonar shockwave rings (21hrs.space inspiration)
    addShockwave(width / 2, grayBall.impactY, Math.min(width, height) * 0.6, 'rgba(245, 243, 239, 0.95)', 2.5);
    setTimeout(() => {
      addShockwave(width / 2, grayBall.impactY, Math.min(width, height) * 0.45, 'rgba(255, 201, 0, 0.8)', 1.5);
    }, 120);

    // 1. Reveal High-Res 16:9 Atmospheric Backdrop smoothly
    setTimeout(() => {
      if (backdrop) backdrop.classList.add('visible');
    }, 250);

    // 2. PRAVEEN text descends SLOWLY from above
    setTimeout(() => {
      if (titlePraveen) titlePraveen.classList.add('visible');
    }, 600);

    // 3. PORTFOLIO text reveals slowly with tracking
    setTimeout(() => {
      if (titlePortfolio) titlePortfolio.classList.add('visible');
    }, 1200);

    // 4. Reveal Futuristic Orbital Reactor Trigger
    setTimeout(() => {
      state = 'REVEALED';
      if (reactorTrigger) reactorTrigger.classList.add('visible');
    }, 1800);
  }

  // ==========================================================================
  // Step 3: Trigger FULL-SCREEN REALISTIC DOT DISPERSION ("all the place")
  // ==========================================================================
  function triggerDotDisappearance(clickX, clickY) {
    if (state === 'DOT_DISPERSION' || state === 'EXITED') return;
    state = 'DOT_DISPERSION';

    const originX = (clickX !== undefined && clickX !== null) ? clickX : width / 2;
    const originY = (clickY !== undefined && clickY !== null) ? clickY : height / 2;

    playSound('disperse');

    // Massive cinematic shockwave spanning entire screen
    addShockwave(originX, originY, Math.max(width, height) * 1.35, 'rgba(255, 255, 255, 0.95)', 3);
    addShockwave(originX, originY, Math.max(width, height) * 0.95, 'rgba(255, 201, 0, 0.85)', 2);

    // Fade out DOM elements smoothly as dots take over the entire display
    if (backdrop) backdrop.classList.add('disintegrating');
    if (titlePraveen) {
      titlePraveen.style.opacity = '0';
      titlePraveen.style.transform = 'translateY(25px) scale(0.95)';
    }
    if (titlePortfolio) {
      titlePortfolio.style.opacity = '0';
      titlePortfolio.style.transform = 'translateY(15px)';
    }
    if (reactorTrigger) {
      reactorTrigger.style.opacity = '0';
      reactorTrigger.style.transform = 'scale(0.85)';
    }

    // Spawn 6,000+ dots across the ENTIRE SCREEN ("put all the place dispersion")
    dispersionParticles.length = 0;
    const allCoords = generateFullScreenCoords();

    for (let i = 0; i < allCoords.length; i++) {
      const c = allCoords[i];
      const dot = new RealisticDot(c.x, c.y, c.color, c.radius, c.isGold);
      dot.explode(originX, originY);
      dispersionParticles.push(dot);
    }

    // Seamless fade out of welcome overlay revealing the homepage
    setTimeout(() => {
      if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      }
    }, 850);

    setTimeout(() => {
      state = 'EXITED';
      if (overlay) overlay.classList.add('hidden');
      if (mainContent) mainContent.classList.add('visible');
      document.body.style.overflow = 'auto';

      // Re-trigger icon creation and scroll animations
      if (window.lucide) window.lucide.createIcons();
      if (window.rebindCursor) window.rebindCursor();
      if (window.initScrollAnimations) window.initScrollAnimations();
      if (window.initFlowingRoadmap) window.initFlowingRoadmap();
      
      // Video begins playback ONLY when entering the portfolio and homepage appears
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
    }, 1300);
  }

  // ==========================================================================
  // Click & Touch Bindings
  // ==========================================================================
  overlay.addEventListener('click', (e) => {
    if (state === 'REVEALED' || state === 'IMPACT') {
      triggerDotDisappearance(e.clientX, e.clientY);
    } else if (state === 'FALLING') {
      grayBall.y = grayBall.impactY;
      triggerImpact();
    }
  });

  if (reactorTrigger) {
    reactorTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerDotDisappearance(e.clientX || width / 2, e.clientY || height * 0.65);
    });
    reactorTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerDotDisappearance(width / 2, height * 0.65);
      }
    });
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerDotDisappearance(width / 2, height / 2);
    });
  }

  // ==========================================================================
  // Main Animation Loop
  // ==========================================================================
  function animate() {
    frameCount++;
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, width, height);

    // 1. SLOW FALLING GRAY METALLIC SPHERE
    if (state === 'FALLING') {
      grayBall.vy += grayBall.gravity;
      if (grayBall.vy > grayBall.maxVy) grayBall.vy = grayBall.maxVy;
      
      // Decelerate slightly as it reaches impact point for weight feel
      const distToImpact = grayBall.impactY - grayBall.y;
      if (distToImpact < 60 && distToImpact > 0) {
        grayBall.vy *= 0.94;
      }

      grayBall.y += grayBall.vy;
      grayBall.x = width / 2;

      // Add trail point
      grayBall.trail.push({ x: grayBall.x, y: grayBall.y });
      if (grayBall.trail.length > 18) grayBall.trail.shift();

      // Draw graceful luminous trail
      ctx.save();
      ctx.strokeStyle = 'rgba(245, 243, 239, 0.4)';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i < grayBall.trail.length; i++) {
        const pt = grayBall.trail[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      // Atmospheric outer aura
      const aura = ctx.createRadialGradient(
        grayBall.x, grayBall.y, 0,
        grayBall.x, grayBall.y, grayBall.radius * 3.5
      );
      aura.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      aura.addColorStop(0.3, 'rgba(226, 232, 240, 0.5)');
      aura.addColorStop(0.7, 'rgba(203, 213, 225, 0.15)');
      aura.addColorStop(1, 'rgba(8, 9, 11, 0)');

      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(grayBall.x, grayBall.y, grayBall.radius * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Brushed Metallic Gray Core
      const coreGrad = ctx.createRadialGradient(
        grayBall.x - 2.5, grayBall.y - 2.5, 1,
        grayBall.x, grayBall.y, grayBall.radius
      );
      coreGrad.addColorStop(0, '#FFFFFF');
      coreGrad.addColorStop(0.5, '#D1D5DB');
      coreGrad.addColorStop(1, '#4B5563');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(grayBall.x, grayBall.y, grayBall.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (grayBall.y >= grayBall.impactY) {
        triggerImpact();
      }
    }

    // 2. EXPANDING RADAR SHOCKWAVES
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.r += 14;
      sw.alpha *= 0.935;

      ctx.save();
      ctx.globalAlpha = sw.alpha;
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = sw.lineWidth;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      if (sw.alpha <= 0.015 || sw.r >= sw.maxR) {
        shockwaves.splice(i, 1);
      }
    }

    // 3. FULL-SCREEN REALISTIC DOT DISPERSION EXPLOSION
    if (state === 'DOT_DISPERSION') {
      for (let i = 0; i < dispersionParticles.length; i++) {
        const dot = dispersionParticles[i];
        dot.update();
        dot.draw(ctx);
      }
    }
  }

  requestAnimationFrame(animate);

  window.PraveenWelcomeEngine = {
    triggerDotDisappearance
  };
})();
