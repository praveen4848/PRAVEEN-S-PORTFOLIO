/**
 * ============================================================================
 * POSTMINIMAL 4D CELESTIAL SPHERE ENGINE — PHOTOREALISTIC STARLIGHT MANIFOLD
 * - Pure Monochrome White Starlight only (zero color tint)
 * - Flawless Round Spherical Silhouette & Geodesic Villarceau Filaments
 * - Dual-layer Photometric Rendering: Luminous Wireframe Strands + Airy-Disk Starlight Points
 * - True Thin-Lens Optical Depth-of-Field Bokeh (Circle of Confusion)
 * - Atmospheric Celestial Limb Bloom & Micro-scintillation (Twinkling)
 * - 4D Hyper-rotations ($SO(4)$) with Physical Inertia & Continuous Breathing Zoom
 * ============================================================================
 */

(function () {
  'use strict';

  const canvas = document.getElementById('intro-canvas');
  if (!canvas) return;

  const overlay = document.getElementById('welcome-overlay');
  const mainContent = document.getElementById('main-content');
  const launchTrigger = document.getElementById('welcome-trigger');
  const skipBtn = document.getElementById('skip-intro-btn');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let dpr = Math.min(window.devicePixelRatio || 1, 2.0);

  // ==========================================================================
  // Web Audio Synth (Pure harmonic frequencies)
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

  function playSignalSound() {
    if (window.soundMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now);
      osc.frequency.exponentialRampToValueAtTime(264, now + 0.85);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    } catch (e) {}
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
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.92);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.92);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.92);
    } catch (e) {}
  }

  // ==========================================================================
  // 4D Rotation State & Camera Parallax Physics
  // ==========================================================================
  let rotXW = 0.38;
  let rotYW = 0.26;
  let rotZW = 0.0;
  let rotXY = 0.28;
  let rotXZ = 0.24;
  let rotYZ = 0.16;

  let dragVelocityX = 0;
  let dragVelocityY = 0;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

  // Natural mouse parallax drift
  let mouseParallaxX = 0;
  let mouseParallaxY = 0;
  let targetParallaxX = 0;
  let targetParallaxY = 0;

  let zoomPhase = 0;
  let interactiveZoom = 1.0;
  let targetInteractiveZoom = 1.0;
  let warpScale = 1.0;
  let state = 'ACTIVE';

  let signalActive = 0.0;
  let signalProgress = 0.0;

  // Central reticle target coordinate
  let reticleScreenX = width * 0.5;
  let reticleScreenY = height * 0.44;
  let reticleTargetX = width * 0.5;
  let reticleTargetY = height * 0.44;

  // ==========================================================================
  // Mouse & Touch Controls with Parallax Inertia
  // ==========================================================================
  if (overlay) {
    overlay.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      dragVelocityX = 0;
      dragVelocityY = 0;
      initAudio();
    });

    window.addEventListener('mousemove', (e) => {
      // Camera parallax
      targetParallaxX = (e.clientX / window.innerWidth - 0.5) * 0.15;
      targetParallaxY = (e.clientY / window.innerHeight - 0.5) * 0.15;

      if (!isDragging) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      dragVelocityX = dx * 0.0065;
      dragVelocityY = dy * 0.0065;

      rotXW += dragVelocityX;
      rotYW += dragVelocityY;
      rotXZ += dragVelocityX * 0.5;
      rotYZ += dragVelocityY * 0.5;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    overlay.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
        dragVelocityX = 0;
        dragVelocityY = 0;
        initAudio();
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - lastMouseX;
      const dy = e.touches[0].clientY - lastMouseY;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;

      dragVelocityX = dx * 0.0065;
      dragVelocityY = dy * 0.0065;

      rotXW += dragVelocityX;
      rotYW += dragVelocityY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    overlay.addEventListener('wheel', (e) => {
      rotZW += e.deltaY * 0.0008;
      targetInteractiveZoom = Math.max(0.65, Math.min(1.65, targetInteractiveZoom - e.deltaY * 0.001));
    }, { passive: true });

    overlay.addEventListener('click', (e) => {
      if (e.target.closest('#welcome-trigger') || e.target.closest('#skip-intro-btn')) return;
      signalActive = 1.0;
      signalProgress = 0.0;
      playSignalSound();
    });
  }

  // ==========================================================================
  // WebGL 4D Sphere Shader Engine
  // ==========================================================================
  let gl = null;
  try {
    gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      depth: false,
      preserveDrawingBuffer: false,
      premultipliedAlpha: false
    }) || canvas.getContext('experimental-webgl');
  } catch (e) {
    gl = null;
  }

  // 4D Rotation matrix math
  function make4DRotationMatrix(axw, ayw, azw, axy, axz, ayz) {
    let m = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];

    function multiply4x4(a, b) {
      const out = new Float32Array(16);
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          out[i * 4 + j] =
            a[i * 4 + 0] * b[0 * 4 + j] +
            a[i * 4 + 1] * b[1 * 4 + j] +
            a[i * 4 + 2] * b[2 * 4 + j] +
            a[i * 4 + 3] * b[3 * 4 + j];
        }
      }
      return out;
    }

    if (axw !== 0) {
      const c = Math.cos(axw), s = Math.sin(axw);
      m = multiply4x4(m, [
        c, 0, 0, -s,
        0, 1, 0,  0,
        0, 0, 1,  0,
        s, 0, 0,  c
      ]);
    }

    if (ayw !== 0) {
      const c = Math.cos(ayw), s = Math.sin(ayw);
      m = multiply4x4(m, [
        1, 0, 0,  0,
        0, c, 0, -s,
        0, 0, 1,  0,
        0, s, 0,  c
      ]);
    }

    if (azw !== 0) {
      const c = Math.cos(azw), s = Math.sin(azw);
      m = multiply4x4(m, [
        1, 0, 0,  0,
        0, 1, 0,  0,
        0, 0, c, -s,
        0, 0, s,  c
      ]);
    }

    if (axy !== 0) {
      const c = Math.cos(axy), s = Math.sin(axy);
      m = multiply4x4(m, [
        c, -s, 0, 0,
        s,  c, 0, 0,
        0,  0, 1, 0,
        0,  0, 0, 1
      ]);
    }

    if (axz !== 0) {
      const c = Math.cos(axz), s = Math.sin(axz);
      m = multiply4x4(m, [
        c, 0, -s, 0,
        0, 1,  0, 0,
        s, 0,  c, 0,
        0, 0,  0, 1
      ]);
    }

    if (ayz !== 0) {
      const c = Math.cos(ayz), s = Math.sin(ayz);
      m = multiply4x4(m, [
        1,  0, 0, 0,
        0,  c, -s, 0,
        0,  s,  c, 0,
        0,  0, 0, 1
      ]);
    }

    return m;
  }

  // ==========================================================================
  // WebGL Shaders — PHOTOREALISTIC PURE STARLIGHT MANIFOLD
  // ==========================================================================
  if (gl) {
    const vsSource = `
      precision highp float;

      attribute float a_layer;
      attribute float a_fiberAngle;
      attribute float a_t;
      attribute float a_tilt;
      attribute float a_seed;

      uniform float u_time;
      uniform float u_zoom;
      uniform vec2 u_resolution;
      uniform mat4 u_rot4D;
      uniform float u_signalProgress;
      uniform float u_signalActive;
      uniform float u_isLine;
      uniform vec2 u_parallax;

      varying vec4 v_color;
      varying float v_blur;
      varying float v_isLine;

      void main() {
        v_isLine = u_isLine;

        // Continuous smooth orbital circulation along fibers
        float speed = 0.08 + a_layer * 0.035;
        float xi1 = a_t + u_time * speed;
        float xi2 = a_fiberAngle;
        float eta = a_tilt;

        // 4D Hopf Fibration on 3-Sphere S3:
        vec4 p4 = vec4(
          sin(eta) * cos(xi1 + xi2),
          sin(eta) * sin(xi1 + xi2),
          cos(eta) * cos(xi1),
          cos(eta) * sin(xi1)
        );

        // 4D Rotation in SO(4)
        vec4 rot = u_rot4D * p4;

        // FLAWLESS ROUND SPHERICAL BOUNDARY:
        // By scaling by sphere radius, the boundary envelope is mathematically a ROUND SPHERE!
        float sphereRadius = 2.05 * a_layer;
        float internalDepth = 1.0 + rot.w * 0.14;
        vec3 p3 = rot.xyz * sphereRadius * internalDepth;

        // 3D Perspective Camera with Parallax Shift
        float fov = 38.0;
        float cameraDist = 4.8 / u_zoom;
        vec3 viewPos = vec3(p3.x + u_parallax.x, p3.y + u_parallax.y, p3.z - cameraDist);

        float focalLen = 1.0 / tan(radians(fov * 0.5));
        float aspect = u_resolution.x / u_resolution.y;

        vec4 clipPos;
        clipPos.x = viewPos.x * focalLen / aspect;
        clipPos.y = viewPos.y * focalLen;
        clipPos.z = (viewPos.z + cameraDist * 0.5) * 0.08;
        clipPos.w = -viewPos.z;

        gl_Position = vec4(clipPos.x, clipPos.y, clipPos.z, clipPos.w);

        // Physical Thin-Lens Optical Circle of Confusion (Bokeh):
        float focusPlane = -cameraDist;
        float distFromFocus = abs(viewPos.z - focusPlane);
        float blur = clamp(distFromFocus * 0.54, 0.0, 3.2);
        v_blur = blur;

        // Point size scaling with perspective & optical CoC expansion
        float baseSize = (u_resolution.y / 960.0) * (2.4 / clipPos.w * 5.2);
        gl_PointSize = clamp(baseSize * (1.0 + blur * 2.2), 1.0, 32.0);

        // Physical Starlight Scintillation (Micro-Twinkling):
        float twinkle = 0.88 + 0.12 * sin(u_time * 7.5 + a_seed * 62.83);

        // Volumetric Depth Shading (Front hemisphere shines brighter, back is softer):
        float zDepth = (rot.z + 1.0) * 0.5;
        float wDepth = (rot.w + 1.0) * 0.5;
        float radiance = (0.36 + zDepth * 0.50 + wDepth * 0.14) * twinkle;

        // Signal ripple wave
        if (u_signalActive > 0.5) {
          float waveDist = abs(rot.w - (1.0 - u_signalProgress * 1.8));
          if (waveDist < 0.28) {
            float waveBoost = (1.0 - waveDist / 0.28);
            radiance += waveBoost * 0.75;
          }
        }

        // Transparency:
        // Lines are delicate, ethereal pure white filament wireframes
        // Points are brilliant, piercing starlight beads
        float alpha;
        if (u_isLine > 0.5) {
          alpha = mix(0.24, 0.06, blur / 3.2);
          alpha = clamp(alpha * (0.4 + zDepth * 0.6), 0.04, 0.35);
        } else {
          alpha = mix(0.96, 0.24, blur / 3.2);
          alpha = clamp(alpha * radiance, 0.12, 1.0);
        }

        v_color = vec4(1.0, 1.0, 1.0, alpha);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec4 v_color;
      varying float v_blur;
      varying float v_isLine;

      void main() {
        if (v_isLine > 0.5) {
          // Pure white luminous filament line
          gl_FragColor = vec4(1.0, 1.0, 1.0, v_color.a);
          return;
        }

        // Photorealistic Starlight Point Sprite:
        // Dual-layer Photometric Profile:
        // 1. Dazzling Gaussian specular core (Airy disk)
        // 2. Soft atmospheric diffraction halo
        // 3. Optical bokeh disc rim
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord) * 2.0;

        if (dist > 1.0) discard;

        float sharpness = 1.0 / (1.0 + v_blur * 1.8);
        float core = exp(-dist * dist * (4.8 * sharpness + 1.4));
        float halo = exp(-dist * 2.2) * 0.38;
        float rim = smoothstep(1.0, 0.68, dist);
        float intensity = mix(rim * 0.65 + halo, core + halo, sharpness);

        // STRICTLY PURE WHITE ONLY:
        gl_FragColor = vec4(1.0, 1.0, 1.0, v_color.a * intensity);
      }
    `;

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('Shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // Uniform locations
    const u_time_loc = gl.getUniformLocation(program, 'u_time');
    const u_zoom_loc = gl.getUniformLocation(program, 'u_zoom');
    const u_resolution_loc = gl.getUniformLocation(program, 'u_resolution');
    const u_rot4D_loc = gl.getUniformLocation(program, 'u_rot4D');
    const u_signalProgress_loc = gl.getUniformLocation(program, 'u_signalProgress');
    const u_signalActive_loc = gl.getUniformLocation(program, 'u_signalActive');
    const u_isLine_loc = gl.getUniformLocation(program, 'u_isLine');
    const u_parallax_loc = gl.getUniformLocation(program, 'u_parallax');

    // Attribute locations
    const a_layer_loc = gl.getAttribLocation(program, 'a_layer');
    const a_fiberAngle_loc = gl.getAttribLocation(program, 'a_fiberAngle');
    const a_t_loc = gl.getAttribLocation(program, 'a_t');
    const a_tilt_loc = gl.getAttribLocation(program, 'a_tilt');
    const a_seed_loc = gl.getAttribLocation(program, 'a_seed');

    // ========================================================================
    // Golden Spiral Spherically Uniform Manifold (~51,840 Particles)
    // Distributed on Concentric Geodesic Orbits for a Flawless Round Sphere
    // ========================================================================
    const LAYERS = 3;
    const FIBERS_PER_LAYER = 36;
    const POINTS_PER_FIBER = 480;
    const totalPoints = LAYERS * FIBERS_PER_LAYER * POINTS_PER_FIBER;
    const totalFibers = LAYERS * FIBERS_PER_LAYER;

    const layerArray = new Float32Array(totalPoints);
    const fiberAngleArray = new Float32Array(totalPoints);
    const tArray = new Float32Array(totalPoints);
    const tiltArray = new Float32Array(totalPoints);
    const seedArray = new Float32Array(totalPoints);

    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    let idx = 0;
    for (let l = 0; l < LAYERS; l++) {
      // 3 Concentric spherical shells: core to outer mantle
      const layerRad = 0.68 + (l / (LAYERS - 1)) * 0.32;

      for (let f = 0; f < FIBERS_PER_LAYER; f++) {
        const y = 1 - (f / (FIBERS_PER_LAYER - 1)) * 2; // -1 to 1
        const tilt = Math.acos(y);
        const fiberAngle = f * goldenAngle + (l * 0.5);

        for (let p = 0; p < POINTS_PER_FIBER; p++) {
          const t = (p / POINTS_PER_FIBER) * Math.PI * 2;

          layerArray[idx] = layerRad;
          fiberAngleArray[idx] = fiberAngle;
          tArray[idx] = t;
          tiltArray[idx] = tilt;
          seedArray[idx] = Math.random();
          idx++;
        }
      }
    }

    function makeBuffer(data) {
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return buf;
    }

    const layerBuf = makeBuffer(layerArray);
    const fiberAngleBuf = makeBuffer(fiberAngleArray);
    const tBuf = makeBuffer(tArray);
    const tiltBuf = makeBuffer(tiltArray);
    const seedBuf = makeBuffer(seedArray);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2.0);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    // ========================================================================
    // Ambient Floating Starlight Dust in Empty Space
    // ========================================================================
    const bokehOrbs = [];
    for (let i = 0; i < 65; i++) {
      bokehOrbs.push({
        x: (Math.random() - 0.5) * 4.2,
        y: (Math.random() - 0.5) * 3.4,
        z: (Math.random() - 0.5) * 3.0,
        radius: 2.8 + Math.random() * 8.0,
        alpha: 0.05 + Math.random() * 0.13,
        vx: (Math.random() - 0.5) * 0.0008,
        vy: (Math.random() - 0.5) * 0.0008,
        vz: (Math.random() - 0.5) * 0.0005,
        pulse: Math.random() * Math.PI * 2
      });
    }

    // HUD Canvas for Photographic Post-Processing, Film Grain, Vignette & Reticle
    const hudCanvas = document.createElement('canvas');
    hudCanvas.style.position = 'absolute';
    hudCanvas.style.top = '0';
    hudCanvas.style.left = '0';
    hudCanvas.style.width = '100%';
    hudCanvas.style.height = '100%';
    hudCanvas.style.pointerEvents = 'none';
    hudCanvas.style.zIndex = '3';
    if (overlay) overlay.insertBefore(hudCanvas, overlay.firstChild);
    const hudCtx = hudCanvas.getContext('2d');

    // Pre-rendered film grain canvas for performance
    const grainCanvas = document.createElement('canvas');
    grainCanvas.width = 128;
    grainCanvas.height = 128;
    const grainCtx = grainCanvas.getContext('2d');
    const grainData = grainCtx.createImageData(128, 128);
    for (let i = 0; i < grainData.data.length; i += 4) {
      const g = Math.floor(Math.random() * 255);
      grainData.data[i] = g;
      grainData.data[i + 1] = g;
      grainData.data[i + 2] = g;
      grainData.data[i + 3] = Math.floor(Math.random() * 14); // 5% subtle film noise
    }
    grainCtx.putImageData(grainData, 0, 0);

    function resizeHud() {
      hudCanvas.width = width * dpr;
      hudCanvas.height = height * dpr;
      hudCtx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resizeHud);
    resizeHud();

    // ========================================================================
    // Main Render Loop
    // ========================================================================
    let startTime = performance.now();

    function render(now) {
      if (state === 'EXITED') return;
      requestAnimationFrame(render);

      const elapsed = (now - startTime) * 0.001;

      // Camera parallax lerping
      mouseParallaxX += (targetParallaxX - mouseParallaxX) * 0.05;
      mouseParallaxY += (targetParallaxY - mouseParallaxY) * 0.05;

      // Smooth 4D and 3D rotations with momentum
      if (!isDragging) {
        rotXW += 0.0022;
        rotYW += 0.0015;
        rotZW += 0.0008;
        rotXY += 0.0012;
        rotXZ += 0.0014;
        rotYZ += 0.0009;

        rotXW += dragVelocityX;
        rotYW += dragVelocityY;
        dragVelocityX *= 0.94;
        dragVelocityY *= 0.94;
      }

      // SPHERE ZOOM ANIMATION: Continuous smooth breathing perspective zoom
      zoomPhase += 0.016;
      interactiveZoom += (targetInteractiveZoom - interactiveZoom) * 0.06;
      const continuousZoom = 1.0 + Math.sin(zoomPhase) * 0.22;
      const currentZoom = continuousZoom * interactiveZoom * warpScale;

      // Signal wave progress
      if (signalActive > 0.5) {
        signalProgress += 0.034;
        if (signalProgress >= 1.6) {
          signalActive = 0.0;
          signalProgress = 0.0;
        }
      }

      const rotMatrix = make4DRotationMatrix(rotXW, rotYW, rotZW, rotXY, rotXZ, rotYZ);

      // WebGL Pipeline
      gl.useProgram(program);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // Additive blending for pure starlight luminosity

      // Empty Universe Background: Deep Matte Obsidian Void (#121214)
      gl.clearColor(0.07, 0.07, 0.078, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(u_time_loc, elapsed);
      gl.uniform1f(u_zoom_loc, currentZoom);
      gl.uniform2f(u_resolution_loc, canvas.width, canvas.height);
      gl.uniformMatrix4fv(u_rot4D_loc, false, rotMatrix);
      gl.uniform1f(u_signalProgress_loc, signalProgress);
      gl.uniform1f(u_signalActive_loc, signalActive);
      gl.uniform2f(u_parallax_loc, mouseParallaxX, mouseParallaxY);

      // Attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, layerBuf);
      gl.enableVertexAttribArray(a_layer_loc);
      gl.vertexAttribPointer(a_layer_loc, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, fiberAngleBuf);
      gl.enableVertexAttribArray(a_fiberAngle_loc);
      gl.vertexAttribPointer(a_fiberAngle_loc, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, tBuf);
      gl.enableVertexAttribArray(a_t_loc);
      gl.vertexAttribPointer(a_t_loc, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, tiltBuf);
      gl.enableVertexAttribArray(a_tilt_loc);
      gl.vertexAttribPointer(a_tilt_loc, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, seedBuf);
      gl.enableVertexAttribArray(a_seed_loc);
      gl.vertexAttribPointer(a_seed_loc, 1, gl.FLOAT, false, 0, 0);

      // PASS 1: Render Continuous Luminous Filament Wireframe Curves
      gl.uniform1f(u_isLine_loc, 1.0);
      for (let i = 0; i < totalFibers; i++) {
        gl.drawArrays(gl.LINE_STRIP, i * POINTS_PER_FIBER, POINTS_PER_FIBER);
      }

      // PASS 2: Render Dazzling Starlight Points (Airy Disk + Specular Pinpoint Cores)
      gl.uniform1f(u_isLine_loc, 0.0);
      gl.drawArrays(gl.POINTS, 0, totalPoints);

      // ======================================================================
      // HUD Overlay: Atmospheric Limb Bloom, Film Grain & Focal Reticle
      // ======================================================================
      hudCtx.clearRect(0, 0, width, height);

      const sphereCenterX = width * 0.5 + mouseParallaxX * 60;
      const sphereCenterY = height * 0.44 + mouseParallaxY * 60;
      const visualRadius = Math.min(width, height) * 0.40 * (currentZoom / 1.0);

      // 1. Celestial Atmospheric Core Glow & Limb Horizon
      const bloomGrad = hudCtx.createRadialGradient(
        sphereCenterX, sphereCenterY, visualRadius * 0.15,
        sphereCenterX, sphereCenterY, visualRadius * 1.35
      );
      bloomGrad.addColorStop(0, 'rgba(255, 255, 255, 0.09)');
      bloomGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0.04)');
      bloomGrad.addColorStop(0.85, 'rgba(255, 255, 255, 0.015)');
      bloomGrad.addColorStop(1, 'rgba(18, 18, 20, 0)');

      hudCtx.fillStyle = bloomGrad;
      hudCtx.beginPath();
      hudCtx.arc(sphereCenterX, sphereCenterY, visualRadius * 1.35, 0, Math.PI * 2);
      hudCtx.fill();

      // Delicate Spherical Limb Horizon Ring
      hudCtx.save();
      hudCtx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      hudCtx.lineWidth = 1.2;
      hudCtx.beginPath();
      hudCtx.arc(sphereCenterX, sphereCenterY, visualRadius, 0, Math.PI * 2);
      hudCtx.stroke();
      hudCtx.restore();

      // 2. Ambient Floating Starlight Dust
      for (let i = 0; i < bokehOrbs.length; i++) {
        const orb = bokehOrbs[i];
        orb.x += orb.vx;
        orb.y += orb.vy;
        orb.z += orb.vz;
        orb.pulse += 0.016;

        if (orb.x < -2.4) orb.x = 2.4;
        if (orb.x > 2.4) orb.x = -2.4;
        if (orb.y < -2.0) orb.y = 2.0;
        if (orb.y > 2.0) orb.y = -2.0;

        const screenX = width / 2 + orb.x * (width * 0.28) + mouseParallaxX * 40;
        const screenY = height / 2 + orb.y * (height * 0.28) + mouseParallaxY * 40;
        const alpha = orb.alpha * (0.8 + Math.sin(orb.pulse) * 0.25);

        const grad = hudCtx.createRadialGradient(
          screenX, screenY, 0,
          screenX, screenY, orb.radius
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        grad.addColorStop(0.4, `rgba(255, 255, 255, ${alpha * 0.35})`);
        grad.addColorStop(1, 'rgba(18, 18, 20, 0)');

        hudCtx.fillStyle = grad;
        hudCtx.beginPath();
        hudCtx.arc(screenX, screenY, orb.radius, 0, Math.PI * 2);
        hudCtx.fill();
      }

      // 3. High-Precision Technical Singularity Reticle (`⨀`)
      reticleTargetX = sphereCenterX + Math.sin(elapsed * 0.75) * (visualRadius * 0.18);
      reticleTargetY = sphereCenterY + Math.cos(elapsed * 0.6) * (visualRadius * 0.14);
      reticleScreenX += (reticleTargetX - reticleScreenX) * 0.08;
      reticleScreenY += (reticleTargetY - reticleScreenY) * 0.08;

      hudCtx.save();
      hudCtx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      hudCtx.lineWidth = 1;

      // Outer reticle circle
      hudCtx.beginPath();
      hudCtx.arc(reticleScreenX, reticleScreenY, 11, 0, Math.PI * 2);
      hudCtx.stroke();

      // Center pure white starlight dot
      hudCtx.fillStyle = '#FFFFFF';
      hudCtx.beginPath();
      hudCtx.arc(reticleScreenX, reticleScreenY, 1.8, 0, Math.PI * 2);
      hudCtx.fill();

      // 4 Fine cross-hair ticks
      const tickLen = 3;
      hudCtx.beginPath();
      hudCtx.moveTo(reticleScreenX - 14, reticleScreenY);
      hudCtx.lineTo(reticleScreenX - 14 + tickLen, reticleScreenY);
      hudCtx.moveTo(reticleScreenX + 14 - tickLen, reticleScreenY);
      hudCtx.lineTo(reticleScreenX + 14, reticleScreenY);
      hudCtx.moveTo(reticleScreenX, reticleScreenY - 14);
      hudCtx.lineTo(reticleScreenX, reticleScreenY - 14 + tickLen);
      hudCtx.moveTo(reticleScreenX, reticleScreenY + 14 - tickLen);
      hudCtx.lineTo(reticleScreenX, reticleScreenY + 14);
      hudCtx.stroke();
      hudCtx.restore();

      // 4. Photorealistic Lens Vignette
      const vigGrad = hudCtx.createRadialGradient(
        width / 2, height / 2, Math.min(width, height) * 0.45,
        width / 2, height / 2, Math.max(width, height) * 0.78
      );
      vigGrad.addColorStop(0, 'rgba(18, 18, 20, 0)');
      vigGrad.addColorStop(1, 'rgba(12, 12, 14, 0.65)');
      hudCtx.fillStyle = vigGrad;
      hudCtx.fillRect(0, 0, width, height);

      // 5. Film Grain / Micro Photon Noise (Eliminates digital banding)
      hudCtx.save();
      hudCtx.globalAlpha = 0.55;
      const grainPattern = hudCtx.createPattern(grainCanvas, 'repeat');
      hudCtx.fillStyle = grainPattern;
      hudCtx.fillRect(0, 0, width, height);
      hudCtx.restore();
    }

    requestAnimationFrame(render);
  }

  // ==========================================================================
  // Enter Portfolio Transition
  // ==========================================================================
  function triggerLaunch() {
    if (state === 'LAUNCHING' || state === 'EXITED') return;
    state = 'LAUNCHING';

    playLaunchSound();

    let start = performance.now();
    function expandSphere(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / 800);
      warpScale = 1.0 + progress * 5.5;

      if (progress < 1) {
        requestAnimationFrame(expandSphere);
      }
    }
    requestAnimationFrame(expandSphere);

    setTimeout(() => {
      if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      }
    }, 450);

    setTimeout(() => {
      state = 'EXITED';
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
    }, 780);
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

  window.PraveenTesseractEngine = {
    triggerLaunch
  };
})();
