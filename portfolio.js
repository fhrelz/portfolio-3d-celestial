/**
 * CELESTIAL AURORA 3D PORTFOLIO ENGINE — MUHAMMAD FAHREL YULIYANTO
 * Features:
 * 1. Three.js 3D Particle Starfield & Rotating Celestial Constellation Sphere
 * 2. Mouse Parallax & Dynamic Shooting Stars / Meteors
 * 3. Web Audio API Cosmic Ambient Sound Synthesizer (No external mp3 required)
 * 4. Interactive Project Filter & High-Res Image Modal Viewer
 * 5. Multilingual Engine (Indonesian <-> English)
 * 6. Theme Engine (Daylight Celestial White/Sky Blue <-> Deep Cosmic Night)
 */

document.addEventListener('DOMContentLoaded', () => {
  initThreeJSCosmos();
  initRealisticMoon();
  initThemeEngine();
  initLanguageEngine();
  initCosmicAudio();
  initProjectFilters();
  initPressFilters();
  initLiveWebFilter();
  initLiveWebModal();
  initModalViewer();
  initNavbarScroll();
  initContactActions();
});

/* ===================================================================
   COSMIC AUDIO ENGINE: BACKSOUND & INTERACTIVE CELESTIAL SFX
   Web Audio API Procedural Synthesizer (Zero External Audio Dependencies)
   =================================================================== */
const CosmicAudio = {
  ctx: null,
  masterGain: null,
  backsoundGain: null,
  sfxGain: null,
  isPlayingBacksound: false,
  chordOscs: [],
  chimeInterval: null,
  noiseBuffer: null,

  init() {
    if (this.ctx) return;
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;
      this.ctx = new AudioCtxClass();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Backsound channel: clearly audible, rich ambient level (0.35)
      this.backsoundGain = this.ctx.createGain();
      this.backsoundGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.backsoundGain.connect(this.masterGain);

      // SFX channel: crisp, punchy, immediate level (0.75)
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Pre-create 1.5s white noise buffer for realistic whooshes, meteors & comets
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.5);
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } catch (e) {
      console.warn("Web Audio API not supported or blocked:", e);
    }
  },

  ensureReady() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return !!this.ctx;
  },

  // --- 1. Ambient Cosmic Backsound (Warm Pad & Celestial Chimes) ---
  startBacksound() {
    this.ensureReady();
    if (!this.ctx || this.isPlayingBacksound) return;
    this.isPlayingBacksound = true;

    const t = this.ctx.currentTime;

    // Chord: F# minor 9 ethereal celestial pad (F#2=92.5Hz, C#3=138.59Hz, A3=220Hz, E4=329.63Hz)
    const chordFreqs = [92.5, 138.59, 220.0, 329.63];
    this.chordOscs = [];

    chordFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + idx * 50, t);

      // Organic celestial breathing modulation
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.09 + idx * 0.02, t);
      lfoGain.gain.setValueAtTime(50, t);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(t);

      // Clear, rich audible volume
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 1.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.backsoundGain);

      osc.start(t);
      this.chordOscs.push({ osc, lfo });
    });

    // Periodic Starlight Chimes (pentatonic bells)
    const pentatonic = [554.37, 659.25, 830.61, 987.77, 1108.73, 1318.51, 1661.22];
    this.playStarlightBell(pentatonic[Math.floor(Math.random() * pentatonic.length)]);
    this.chimeInterval = setInterval(() => {
      if (!this.isPlayingBacksound) return;
      this.playStarlightBell(pentatonic[Math.floor(Math.random() * pentatonic.length)]);
    }, 3000);

    this.updateToggleButtonUI(true);
  },

  stopBacksound() {
    if (!this.isPlayingBacksound) return;
    this.isPlayingBacksound = false;

    if (this.chordOscs.length && this.ctx) {
      const t = this.ctx.currentTime;
      this.chordOscs.forEach(({ osc, lfo }) => {
        try {
          osc.stop(t + 0.8);
          lfo.stop(t + 0.8);
        } catch (e) {}
      });
      this.chordOscs = [];
    }
    if (this.chimeInterval) clearInterval(this.chimeInterval);
    this.updateToggleButtonUI(false);
  },

  toggleBacksound() {
    if (this.isPlayingBacksound) {
      this.stopBacksound();
      if (window.showToast) window.showToast("Audio Kosmik: Dimatikan");
    } else {
      this.startBacksound();
      if (window.showToast) window.showToast("Audio Kosmik: Mengudara");
    }
  },

  playStarlightBell(freq) {
    if (!this.ctx || !this.isPlayingBacksound) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    // Crystal starlight bell: clear initial transient with 2.5s tail
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);

    osc.connect(gain);
    gain.connect(this.backsoundGain);

    osc.start(t);
    osc.stop(t + 2.6);
  },

  updateToggleButtonUI(active) {
    const audioBtn = document.getElementById('audio-toggle');
    if (!audioBtn) return;
    audioBtn.classList.toggle('audio-playing', active);
    audioBtn.setAttribute('title', active ? 'Matikan Audio Kosmik' : 'Nyalakan Audio Kosmik');
  },

  // --- 2. SFX: Element Hover (Delicate Starlight Harmonic Ping) ---
  lastHoverTime: 0,
  playHover() {
    const now = performance.now();
    if (now - this.lastHoverTime < 55) return;
    this.lastHoverTime = now;

    if (!this.ensureReady()) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    const tones = [880, 1046.5, 1174.66, 1318.51, 1567.98, 1760];
    const freq = tones[Math.floor(Math.random() * tones.length)];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(550, t);

    gain.gain.setValueAtTime(0.24, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.10);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.11);
  },

  // --- 3. SFX: Click (Tactile Futuristic Cosmic Haptic Snap) ---
  playClick() {
    if (!this.ensureReady()) return;
    const t = this.ctx.currentTime;

    // 1. Primary cosmic pitch snap
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.08);

    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    // 2. Sub-click transient thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(180, t);
    subOsc.frequency.exponentialRampToValueAtTime(50, t + 0.06);
    subGain.gain.setValueAtTime(0.35, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);

    osc.start(t);
    subOsc.start(t);
    osc.stop(t + 0.10);
    subOsc.stop(t + 0.08);
  },

  // --- 4. SFX: Scroll (Space Gravity Resonance / Layer Shift) ---
  lastScrollTime: 0,
  playScroll() {
    const now = performance.now();
    if (now - this.lastScrollTime < 320) return;
    this.lastScrollTime = now;

    if (!this.ensureReady()) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(190, t + 0.10);
    osc.frequency.exponentialRampToValueAtTime(95, t + 0.25);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, t);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.27);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.28);
  },

  // --- 5. SFX: Zoom (Futuristic Space Telescope Glissando) ---
  lastZoomTime: 0,
  playZoom(isZoomIn) {
    const now = performance.now();
    if (now - this.lastZoomTime < 100) return;
    this.lastZoomTime = now;

    if (!this.ensureReady()) return;
    const t = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    const startF1 = isZoomIn ? 360 : 780;
    const endF1 = isZoomIn ? 780 : 360;
    const startF2 = isZoomIn ? 720 : 1560;
    const endF2 = isZoomIn ? 1560 : 720;

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(startF1, t);
    osc1.frequency.exponentialRampToValueAtTime(endF1, t + 0.16);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(startF2, t);
    osc2.frequency.exponentialRampToValueAtTime(endF2, t + 0.16);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isZoomIn ? 720 : 540, t);
    filter.Q.setValueAtTime(2.2, t);

    gain.gain.setValueAtTime(0.38, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.17);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.18);
    osc2.stop(t + 0.18);
  },

  // --- 6. SFX: Falling Star / Meteor (Sparkling High-Speed Streak) ---
  lastMeteorSoundTime: 0,
  playMeteor() {
    const now = performance.now();
    if (now - this.lastMeteorSoundTime < 900) return;
    this.lastMeteorSoundTime = now;

    if (!this.ensureReady()) return;
    const t = this.ctx.currentTime;

    // 1. Shimmer tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1580, t);
    osc.frequency.exponentialRampToValueAtTime(620, t + 0.38);

    oscGain.gain.setValueAtTime(0.30, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.40);

    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.42);

    // 2. Whoosh noise burst
    if (this.noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      const noiseGain = this.ctx.createGain();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, t);
      filter.frequency.exponentialRampToValueAtTime(800, t + 0.35);
      filter.Q.setValueAtTime(2.6, t);

      noiseGain.gain.setValueAtTime(0.32, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.39);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);

      noise.start(t);
      noise.stop(t + 0.40);
    }
  },

  // --- 7. SFX: Majestic Comet Passing (Deep Resonant Cosmic Sweep) ---
  lastCometSoundTime: 0,
  playComet() {
    const now = performance.now();
    if (now - this.lastCometSoundTime < 3000) return;
    this.lastCometSoundTime = now;

    if (!this.ensureReady()) return;
    const t = this.ctx.currentTime;

    // 1. Deep celestial rumble
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 1.1);

    oscGain.gain.setValueAtTime(0.01, t);
    oscGain.gain.linearRampToValueAtTime(0.38, t + 0.3);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 1.15);

    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 1.2);

    // 2. Ionized stardust trail
    if (this.noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      const noiseGain = this.ctx.createGain();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, t);
      filter.frequency.exponentialRampToValueAtTime(400, t + 1.0);
      filter.Q.setValueAtTime(2.0, t);

      noiseGain.gain.setValueAtTime(0.01, t);
      noiseGain.gain.linearRampToValueAtTime(0.35, t + 0.3);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 1.1);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);

      noise.start(t);
      noise.stop(t + 1.15);
    }
  }
};

/* ===================================================================
   1. THREE.JS 3D CELESTIAL SPACE ENGINE (REALISTIC STARS, METEORS & COMETS)
   =================================================================== */
function initThreeJSCosmos() {
  const canvas = document.getElementById('canvas-3d-bg');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2500);
  camera.position.z = 600;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // --- Texture Generators for Ultra-Realistic Celestial Bodies ---

  // 1. High-Precision 128x128 Diffraction Spike Star Texture (For Gem/Anchor Stars)
  function createDiffractionStarTexture() {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d');
    const center = 64;

    // Atmospheric Airy Halo
    const halo = ctx.createRadialGradient(center, center, 0, center, center, 56);
    halo.addColorStop(0, 'rgba(255, 255, 255, 1)');
    halo.addColorStop(0.12, 'rgba(255, 255, 255, 0.9)');
    halo.addColorStop(0.3, 'rgba(240, 248, 255, 0.45)');
    halo.addColorStop(0.65, 'rgba(224, 242, 254, 0.08)');
    halo.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 128, 128);

    // Primary Horizontal Glint Ray (Tapered optical diffraction)
    const hRay = ctx.createLinearGradient(0, center, 128, center);
    hRay.addColorStop(0, 'rgba(255, 255, 255, 0)');
    hRay.addColorStop(0.32, 'rgba(255, 255, 255, 0.6)');
    hRay.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
    hRay.addColorStop(0.68, 'rgba(255, 255, 255, 0.6)');
    hRay.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = hRay;
    ctx.fillRect(2, center - 1, 124, 2);

    // Primary Vertical Glint Ray
    const vRay = ctx.createLinearGradient(center, 0, center, 128);
    vRay.addColorStop(0, 'rgba(255, 255, 255, 0)');
    vRay.addColorStop(0.32, 'rgba(255, 255, 255, 0.6)');
    vRay.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
    vRay.addColorStop(0.68, 'rgba(255, 255, 255, 0.6)');
    vRay.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = vRay;
    ctx.fillRect(center - 1, 2, 2, 124);

    // Subtle 45-degree diagonal micro-glints
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(center - 18, center - 18);
    ctx.lineTo(center + 18, center + 18);
    ctx.moveTo(center - 18, center + 18);
    ctx.lineTo(center + 18, center - 18);
    ctx.stroke();

    // Intense incandescent nuclear core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(center, center, 4, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(c);
  }

  // 2. Glowing Orb Flare Texture (For Meteor Head and Sparks)
  function createGlowOrbTexture() {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d');
    const center = 32;

    const grad = ctx.createRadialGradient(center, center, 0, center, center, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(224, 242, 254, 0.95)');
    grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.45)');
    grad.addColorStop(0.85, 'rgba(14, 165, 233, 0.1)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(c);
  }

  // 3. Comet Coma & Nucleus Texture (Luminous celestial gas head)
  function createCometHeadTexture() {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d');
    const center = 64;

    const grad = ctx.createRadialGradient(center, center, 0, center, center, 60);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.1, 'rgba(255, 255, 255, 0.98)');
    grad.addColorStop(0.25, 'rgba(186, 230, 253, 0.85)');
    grad.addColorStop(0.45, 'rgba(56, 189, 248, 0.4)');
    grad.addColorStop(0.75, 'rgba(14, 165, 233, 0.12)');
    grad.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    // Bright nucleus pinhead
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(center, center, 5, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(c);
  }

  // 4. Stardust particle puff texture for Comet Tail
  function createDustPuffTexture() {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d');
    const center = 32;

    const grad = ctx.createRadialGradient(center, center, 0, center, center, 28);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.3, 'rgba(224, 242, 254, 0.55)');
    grad.addColorStop(0.7, 'rgba(56, 189, 248, 0.15)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(c);
  }

  const diffractionStarTex = createDiffractionStarTexture();
  const glowOrbTex = createGlowOrbTexture();
  const cometHeadTex = createCometHeadTexture();
  const dustPuffTex = createDustPuffTexture();

  // =================================================================
  // LAYER 1: 4,500 REALISTIC DEEP-FIELD STARS WITH INDIVIDUAL GLSL SCINTILLATION
  // =================================================================
  const fieldCount = 4500;
  const fieldGeo = new THREE.BufferGeometry();
  const fieldPos = new Float32Array(fieldCount * 3);
  const fieldColors = new Float32Array(fieldCount * 3);
  const fieldSizes = new Float32Array(fieldCount);
  const fieldPhases = new Float32Array(fieldCount);
  const fieldSpeeds = new Float32Array(fieldCount);
  const fieldBrightness = new Float32Array(fieldCount);

  // Stellar Spectral Temperature Palette (Realistic Astrophysical Distribution)
  const stellarSpectralColors = [
    new THREE.Color('#ffffff'), // Class A (Pure Diamond White - dominant)
    new THREE.Color('#ffffff'),
    new THREE.Color('#f8fafc'), // Class F (Crisp Silver White)
    new THREE.Color('#f0f9ff'), // Class B (High Temp Celestial Blue-White)
    new THREE.Color('#e0f2fe'), // Class O (Luminous Ice Cyan-White)
    new THREE.Color('#fffbeb'), // Class G (Warm Solar White)
    new THREE.Color('#fef3c7')  // Class K (Soft Golden Star)
  ];

  for (let i = 0; i < fieldCount; i++) {
    const i3 = i * 3;
    // Spherical shell distribution for natural astronomical depth
    const radius = 220 + Math.random() * 1250;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    fieldPos[i3] = radius * Math.sin(phi) * Math.cos(theta);
    fieldPos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    fieldPos[i3 + 2] = radius * Math.cos(phi);

    const col = stellarSpectralColors[Math.floor(Math.random() * stellarSpectralColors.length)];
    fieldColors[i3] = col.r;
    fieldColors[i3 + 1] = col.g;
    fieldColors[i3 + 2] = col.b;

    // Real magnitude distribution: Most stars are tiny (1.4 - 2.8px), few are medium (3.2 - 5.5px)
    const isMedium = Math.random() < 0.12;
    fieldSizes[i] = isMedium ? (3.2 + Math.random() * 2.8) : (1.4 + Math.random() * 1.6);
    fieldPhases[i] = Math.random() * Math.PI * 2;
    fieldSpeeds[i] = 1.0 + Math.random() * 3.5; // Unique twinkling frequency
    fieldBrightness[i] = 0.45 + Math.random() * 0.55;
  }

  fieldGeo.setAttribute('position', new THREE.BufferAttribute(fieldPos, 3));
  fieldGeo.setAttribute('aColor', new THREE.BufferAttribute(fieldColors, 3));
  fieldGeo.setAttribute('aSize', new THREE.BufferAttribute(fieldSizes, 1));
  fieldGeo.setAttribute('aPhase', new THREE.BufferAttribute(fieldPhases, 1));
  fieldGeo.setAttribute('aSpeed', new THREE.BufferAttribute(fieldSpeeds, 1));
  fieldGeo.setAttribute('aBrightness', new THREE.BufferAttribute(fieldBrightness, 1));

  // Custom GLSL Shader for mathematically sharp Airy discs and asynchronous per-star scintillation
  const starShaderMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
    },
    vertexShader: `
      attribute vec3 aColor;
      attribute float aSize;
      attribute float aPhase;
      attribute float aSpeed;
      attribute float aBrightness;

      varying vec3 vColor;
      varying float vAlpha;

      uniform float uTime;
      uniform float uPixelRatio;

      void main() {
        vColor = aColor;

        // Natural multi-harmonic atmospheric scintillation (individual per star)
        float twinkle = sin(uTime * aSpeed + aPhase) * 0.48 + sin(uTime * aSpeed * 2.13 + aPhase * 1.57) * 0.26;
        float currentSize = aSize * (1.0 + twinkle * 0.32);
        vAlpha = clamp(aBrightness * (0.68 + 0.38 * twinkle), 0.15, 1.0);

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = currentSize * uPixelRatio * (650.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        // Gaussian Airy Core & Soft Radiant Boundary
        float core = exp(-dist * 12.0);
        float halo = exp(-dist * 4.5) * 0.55;
        float airy = max(0.0, 1.0 - dist * 2.0) * 0.15;
        float intensity = core * 1.35 + halo + airy;

        gl_FragColor = vec4(vColor * (1.0 + core * 0.6), vAlpha * intensity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const starFieldPoints = new THREE.Points(fieldGeo, starShaderMat);
  scene.add(starFieldPoints);

  // =================================================================
  // LAYER 2: 350 BRILLIANT PROMINENT DIFFRACTION STARS (STELLAR JEWELS)
  // =================================================================
  const jewelCount = 350;
  const jewelGeo = new THREE.BufferGeometry();
  const jewelPos = new Float32Array(jewelCount * 3);
  const jewelCols = new Float32Array(jewelCount * 3);

  for (let i = 0; i < jewelCount; i++) {
    const i3 = i * 3;
    const r = 260 + Math.random() * 950;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    jewelPos[i3] = r * Math.sin(phi) * Math.cos(theta);
    jewelPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    jewelPos[i3 + 2] = r * Math.cos(phi);

    jewelCols[i3] = 1.0;
    jewelCols[i3 + 1] = 1.0;
    jewelCols[i3 + 2] = 1.0;
  }

  jewelGeo.setAttribute('position', new THREE.BufferAttribute(jewelPos, 3));
  jewelGeo.setAttribute('color', new THREE.BufferAttribute(jewelCols, 3));

  const jewelMat = new THREE.PointsMaterial({
    size: 13.5,
    vertexColors: true,
    map: diffractionStarTex,
    transparent: true,
    opacity: 0.98,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const jewelStars = new THREE.Points(jewelGeo, jewelMat);
  scene.add(jewelStars);

  // =================================================================
  // LAYER 3: REALISTIC FALLING STARS (METEORS / BOLIDES) WITH TAPERED RIBBONS
  // =================================================================
  const meteors = [];
  const meteorSparks = [];

  function createMeteor() {
    const group = new THREE.Group();
    const length = 150 + Math.random() * 90; // Natural astronomical streak length
    const headWidth = 2.0 + Math.random() * 1.2; // Delicate realistic needle-fine width

    // A tapered 3D ribbon mesh with gradient vertex colors and UV feathering
    const ribbonGeo = new THREE.BufferGeometry();
    const segments = 14;
    const positions = [];
    const colors = [];
    const uvs = [];

    // Direction vector of the meteor (realistic atmospheric entry angles)
    const isDownLeft = Math.random() > 0.35;
    const angle = isDownLeft
      ? (Math.PI * 0.68 + (Math.random() - 0.5) * 0.28)  // Down-left (~122 deg)
      : (Math.PI * 0.28 + (Math.random() - 0.5) * 0.22); // Down-right (~50 deg)
    const dirX = Math.cos(angle);
    const dirY = -Math.sin(angle);
    const normalX = -dirY;
    const normalY = dirX;

    for (let s = 0; s <= segments; s++) {
      const t = s / segments; // 0 = head, 1 = tail tip
      const dist = t * length;
      const w = headWidth * Math.pow(1.0 - t, 1.2);
      const posX = dist * (-dirX);
      const posY = dist * (-dirY);

      // Vertex 1: left edge (vUv.y = -1.0)
      positions.push(posX + normalX * w, posY + normalY * w, 0);
      uvs.push(t, -1.0);

      // Vertex 2: right edge (vUv.y = 1.0)
      positions.push(posX - normalX * w, posY - normalY * w, 0);
      uvs.push(t, 1.0);

      // Pure incandescent white at head blending into luminous starlight cyan in tail
      const r = Math.max(0.65, 1.0 - t * 0.35);
      const g = Math.max(0.88, 1.0 - t * 0.12);
      const b = 1.0;
      colors.push(r, g, b);
      colors.push(r, g, b);
    }

    const indices = [];
    for (let s = 0; s < segments; s++) {
      const p1 = s * 2;
      const p2 = p1 + 1;
      const p3 = (s + 1) * 2;
      const p4 = p3 + 1;
      indices.push(p1, p2, p3);
      indices.push(p2, p4, p3);
    }

    ribbonGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    ribbonGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    ribbonGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    ribbonGeo.setIndex(indices);

    // Custom Shader for silky smooth exponential length fade & lateral edge feathering
    const ribbonMat = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: { value: 0.98 }
      },
      vertexShader: `
        attribute vec3 color;
        varying vec2 vUv;
        varying vec3 vColor;
        void main() {
          vUv = uv;
          vColor = color;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec2 vUv;
        varying vec3 vColor;
        void main() {
          // Smooth exponential falloff to zero at tail tip
          float lengthFade = pow(1.0 - vUv.x, 2.2);
          // Soft lateral Gaussian edge feathering (no hard cutoff)
          float widthFade = clamp(1.0 - abs(vUv.y), 0.0, 1.0);
          float alpha = lengthFade * widthFade * uOpacity;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    group.add(ribbonMesh);

    // Glowing Incandescent Head Sprite
    const headSpriteMat = new THREE.SpriteMaterial({
      map: glowOrbTex,
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const headSprite = new THREE.Sprite(headSpriteMat);
    headSprite.scale.set(16, 16, 1);
    group.add(headSprite);

    // Start position in upper area of visible open cosmic sky
    const startX = (Math.random() - 0.6) * 900; // -540 to +360
    const startY = 220 + Math.random() * 200;   // +220 to +420
    const startZ = -30 + (Math.random() - 0.5) * 100;
    group.position.set(startX, startY, startZ);

    const speed = 14 + Math.random() * 7;
    group.userData = {
      vx: dirX * speed,
      vy: dirY * speed,
      life: 1.0,
      decay: 0.014 + Math.random() * 0.009,
      ribbonMat: ribbonMat,
      headSprite: headSprite,
      sparkTimer: 0
    };

    scene.add(group);
    meteors.push(group);
    if (typeof CosmicAudio !== 'undefined') CosmicAudio.playMeteor();
  }

  // Meteor Spark particles (stardust wake)
  function createMeteorSpark(x, y, z) {
    const sparkMat = new THREE.SpriteMaterial({
      map: glowOrbTex,
      color: 0xbae6fd,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const spark = new THREE.Sprite(sparkMat);
    spark.position.set(x, y, z);
    const size = 3 + Math.random() * 3.5;
    spark.scale.set(size, size, 1);
    spark.userData = {
      life: 1.0,
      decay: 0.038 + Math.random() * 0.045,
      vx: (Math.random() - 0.5) * 1.4,
      vy: (Math.random() - 0.5) * 1.4,
      material: sparkMat
    };
    scene.add(spark);
    meteorSparks.push(spark);
  }

  // Periodic meteor spawn timer
  let lastMeteorTime = 0;
  function updateMeteors(delta) {
    lastMeteorTime += delta;
    if (lastMeteorTime > 2.2 && meteors.length < 3) {
      createMeteor();
      lastMeteorTime = 0;
    }

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.position.x += m.userData.vx;
      m.position.y += m.userData.vy;
      m.userData.life -= m.userData.decay;

      // Spawn occasional spark along wake
      m.userData.sparkTimer++;
      if (m.userData.sparkTimer % 2 === 0 && m.userData.life > 0.2) {
        createMeteorSpark(m.position.x, m.position.y, m.position.z);
      }

      m.userData.ribbonMat.uniforms.uOpacity.value = Math.max(0, m.userData.life);
      m.userData.headSprite.material.opacity = Math.max(0, m.userData.life * 1.25);

      if (m.userData.life <= 0 || m.position.y < -700 || m.position.x < -1200 || m.position.x > 1200) {
        scene.remove(m);
        m.traverse(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
        meteors.splice(i, 1);
      }
    }

    // Update sparks
    for (let i = meteorSparks.length - 1; i >= 0; i--) {
      const s = meteorSparks[i];
      s.position.x += s.userData.vx;
      s.position.y += s.userData.vy;
      s.userData.life -= s.userData.decay;
      s.userData.material.opacity = Math.max(0, s.userData.life);
      s.scale.multiplyScalar(0.96);

      if (s.userData.life <= 0) {
        scene.remove(s);
        s.material.dispose();
        meteorSparks.splice(i, 1);
      }
    }
  }

  // =================================================================
  // LAYER 4: MAJESTIC CELESTIAL COMETS (KOMET JATUH) WITH FLOWING DUST TAIL
  // =================================================================
  const activeComets = [];
  const cometDustParticles = [];

  function createComet() {
    const cometGroup = new THREE.Group();

    // 1. Luminous Coma Nucleus (Sprite)
    const comaMat = new THREE.SpriteMaterial({
      map: cometHeadTex,
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const comaSprite = new THREE.Sprite(comaMat);
    comaSprite.scale.set(48, 48, 1);
    cometGroup.add(comaSprite);

    // 2. Ion Tail (Direct fluorescent gas beam with feather shader)
    const tailLength = 360;
    const tailWidth = 7.0;
    const tailSegments = 24;
    const tailPositions = [];
    const tailColors = [];
    const tailUvs = [];
    const tailIndices = [];

    for (let s = 0; s <= tailSegments; s++) {
      const t = s / tailSegments; // 0 = head, 1 = tip
      const dist = t * tailLength;
      const w = tailWidth * Math.pow(1.0 - t, 1.1);

      // Tail extends backward along positive X (since motion is down-left)
      tailPositions.push(dist, w, 0);
      tailUvs.push(t, 1.0);

      tailPositions.push(dist, -w, 0);
      tailUvs.push(t, -1.0);

      // Bright white/cyan at coma, deep celestial blue at tail tip
      const r = Math.max(0.6, 1.0 - t * 0.45);
      const g = Math.max(0.85, 1.0 - t * 0.18);
      const b = 1.0;
      tailColors.push(r, g, b);
      tailColors.push(r, g, b);
    }

    for (let s = 0; s < tailSegments; s++) {
      const p1 = s * 2;
      const p2 = p1 + 1;
      const p3 = (s + 1) * 2;
      const p4 = p3 + 1;
      tailIndices.push(p1, p2, p3);
      tailIndices.push(p2, p4, p3);
    }

    const tailGeo = new THREE.BufferGeometry();
    tailGeo.setAttribute('position', new THREE.Float32BufferAttribute(tailPositions, 3));
    tailGeo.setAttribute('color', new THREE.Float32BufferAttribute(tailColors, 3));
    tailGeo.setAttribute('uv', new THREE.Float32BufferAttribute(tailUvs, 2));
    tailGeo.setIndex(tailIndices);

    const tailMat = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: { value: 0.9 }
      },
      vertexShader: `
        attribute vec3 color;
        varying vec2 vUv;
        varying vec3 vColor;
        void main() {
          vUv = uv;
          vColor = color;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec2 vUv;
        varying vec3 vColor;
        void main() {
          float lengthFade = pow(1.0 - vUv.x, 2.0);
          float widthFade = clamp(1.0 - abs(vUv.y), 0.0, 1.0);
          float alpha = lengthFade * widthFade * uOpacity;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const tailMesh = new THREE.Mesh(tailGeo, tailMat);
    cometGroup.add(tailMesh);

    // Flight Path: Directly across the visible open cosmic sky
    const trajectoryType = Math.random();
    let startX, startY, vx, vy;

    if (trajectoryType < 0.6) {
      // Pattern A: Sweeping from upper center/right down towards lower-left across open sky
      startX = 100 + Math.random() * 180;
      startY = 350 + Math.random() * 70;
      vx = -(2.2 + Math.random() * 0.7);
      vy = -(1.8 + Math.random() * 0.6); // Strictly negative = downwards
    } else {
      // Pattern B: Sweeping from upper-left diagonally down towards center
      startX = -480 + Math.random() * 150;
      startY = 340 + Math.random() * 80;
      vx = +(2.4 + Math.random() * 0.7);
      vy = -(1.6 + Math.random() * 0.5); // Strictly negative = downwards
    }

    const startZ = 20 + Math.random() * 60;
    cometGroup.position.set(startX, startY, startZ);

    // Rotate tailMesh to align opposite to velocity
    tailMesh.rotation.z = Math.atan2(-vy, -vx);

    cometGroup.userData = {
      vx: vx,
      vy: vy,
      curve: (Math.random() - 0.5) * 0.002, // Subtle celestial orbital arc
      life: 1.0,
      opacity: 0.0, // Smooth fade-in
      maxLife: 600,
      currentFrame: 0,
      tailMesh: tailMesh,
      tailMat: tailMat,
      comaMat: comaMat
    };

    scene.add(cometGroup);
    activeComets.push(cometGroup);
    if (typeof CosmicAudio !== 'undefined') CosmicAudio.playComet();
  }

  // Dust Tail Particle puff (sublimating icy particles)
  function emitCometDust(x, y, z, vx, vy) {
    const puffMat = new THREE.SpriteMaterial({
      map: dustPuffTex,
      color: 0xbae6fd,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const puff = new THREE.Sprite(puffMat);
    puff.position.set(
      x + (Math.random() - 0.5) * 8,
      y + (Math.random() - 0.5) * 8,
      z + (Math.random() - 0.5) * 8
    );
    const initialSize = 12 + Math.random() * 10;
    puff.scale.set(initialSize, initialSize, 1);

    puff.userData = {
      life: 1.0,
      decay: 0.015 + Math.random() * 0.011, // Lasts ~1.6 - 2.2s
      vx: vx * 0.14 + (Math.random() - 0.5) * 0.4,
      vy: vy * 0.14 + (Math.random() - 0.5) * 0.4,
      growth: 0.52,
      material: puffMat
    };

    scene.add(puff);
    cometDustParticles.push(puff);
  }

  let cometSpawnTimer = 0;
  function updateComets() {
    cometSpawnTimer++;
    // Spawn comet smoothly: every ~380 frames (~6.3s) or if none active after ~60 frames (1s)
    if (cometSpawnTimer > 380 || (activeComets.length === 0 && cometSpawnTimer > 60)) {
      if (activeComets.length < 2) {
        createComet();
      }
      cometSpawnTimer = 0;
    }

    for (let i = activeComets.length - 1; i >= 0; i--) {
      const c = activeComets[i];
      const data = c.userData;
      data.currentFrame++;

      // Gentle orbital curve
      data.vx += -data.vy * data.curve;
      data.vy += data.vx * data.curve;

      c.position.x += data.vx;
      c.position.y += data.vy;

      // Update tail orientation to smoothly stream opposite to motion
      data.tailMesh.rotation.z = Math.atan2(-data.vy, -data.vx);

      // Smooth fade-in at birth, fade-out when exiting screen
      if (data.currentFrame < 50) {
        data.opacity = Math.min(1.0, data.currentFrame / 50);
      } else if (c.position.x < -950 || c.position.y < -650 || c.position.x > 950) {
        data.opacity = Math.max(0.0, data.opacity - 0.025);
      } else {
        data.opacity = 1.0;
      }

      data.comaMat.opacity = data.opacity;
      data.tailMat.uniforms.uOpacity.value = data.opacity * 0.9;

      // Continuously emit flowing dust particles along the wake
      if (data.opacity > 0.1) {
        emitCometDust(c.position.x, c.position.y, c.position.z, data.vx, data.vy);
        emitCometDust(c.position.x, c.position.y, c.position.z, data.vx, data.vy);
        if (Math.random() > 0.3) {
          emitCometDust(c.position.x, c.position.y, c.position.z, data.vx, data.vy);
        }
      }

      // Removal condition
      if (data.opacity <= 0 && data.currentFrame > 50) {
        scene.remove(c);
        c.traverse(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
        activeComets.splice(i, 1);
      }
    }

    // Update flowing dust particles
    for (let i = cometDustParticles.length - 1; i >= 0; i--) {
      const p = cometDustParticles[i];
      const pData = p.userData;
      p.position.x += pData.vx;
      p.position.y += pData.vy;
      pData.life -= pData.decay;

      // Expanding stardust plume
      p.scale.x += pData.growth;
      p.scale.y += pData.growth;
      pData.material.opacity = Math.max(0, Math.pow(pData.life, 1.4) * 0.7);

      if (pData.life <= 0) {
        scene.remove(p);
        p.material.dispose();
        cometDustParticles.splice(i, 1);
      }
    }
  }

  // Initial celestial events after page load
  setTimeout(() => { createMeteor(); }, 600);
  setTimeout(() => { createComet(); }, 1200);

  // --- Mouse Parallax & Dynamic Animation Loop ---
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX - window.innerWidth / 2) * 0.25;
    targetMouseY = (e.clientY - window.innerHeight / 2) * 0.25;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      targetMouseX = (e.touches[0].clientX - window.innerWidth / 2) * 0.2;
      targetMouseY = (e.touches[0].clientY - window.innerHeight / 2) * 0.2;
    }
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Pass time to starfield GLSL shader for independent asynchronous scintillation
    starShaderMat.uniforms.uTime.value = elapsedTime;

    currentMouseX += (targetMouseX - currentMouseX) * 0.05;
    currentMouseY += (targetMouseY - currentMouseY) * 0.05;
    camera.position.x = currentMouseX;
    camera.position.y = -currentMouseY;
    camera.lookAt(0, 0, 0);

    // Slow celestial rotation
    starFieldPoints.rotation.y = elapsedTime * 0.007;
    starFieldPoints.rotation.x = elapsedTime * 0.003;
    jewelStars.rotation.y = -elapsedTime * 0.005;

    // Gentle jewel star breathing
    jewelMat.opacity = 0.88 + Math.sin(elapsedTime * 2.4) * 0.12;

    // Update dynamic falling stars (meteors)
    updateMeteors(delta);

    // Update majestic comets & flowing dust tails
    updateComets();

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    const pr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pr);
    starShaderMat.uniforms.uPixelRatio.value = pr;
  });
}

/* ===================================================================
   1.1 REALISTIC 3D INTERACTIVE MOON ENGINE
   =================================================================== */
function initRealisticMoon() {
  const moonCanvas = document.getElementById('canvas-moon-3d');
  const stageContainer = document.getElementById('moon-stage-container');
  if (!moonCanvas || typeof THREE === 'undefined') return;

  const width = 2800;
  const height = 1600;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 3500);
  const minZoomInZ = 700;
  const maxZoomOutZ = 1040;
  let targetCameraZ = maxZoomOutZ; // Default composition: PALING ZOOM OUT
  camera.position.z = targetCameraZ;

  const renderer = new THREE.WebGLRenderer({
    canvas: moonCanvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // --- A. Textures: Ultra High-Res 4K NASA LROC Texture & Topography Bump ---
  const textureLoader = new THREE.TextureLoader();

  function createFallbackMoonTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#b0b8c2';
    ctx.fillRect(0, 0, 1024, 512);

    // Maria (Dark Basalt Plains)
    const maria = [
      { x: 380, y: 180, r: 120, a: 0.35 },
      { x: 520, y: 160, r: 90, a: 0.32 },
      { x: 440, y: 260, r: 110, a: 0.34 },
      { x: 620, y: 230, r: 100, a: 0.28 },
      { x: 280, y: 220, r: 80, a: 0.3 }
    ];
    maria.forEach(m => {
      const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
      grad.addColorStop(0, `rgba(40, 50, 65, ${m.a})`);
      grad.addColorStop(0.7, `rgba(60, 75, 95, ${m.a * 0.7})`);
      grad.addColorStop(1, 'rgba(100, 115, 130, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = Math.random() * 12 + 1.5;
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(30,35,45,0.25)';
      ctx.beginPath();
      ctx.arc(x - 1, y - 1, r * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(c);
  }

  let maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

  // Load 4K true color texture with fallback chain
  const moonTexture = textureLoader.load(
    'assets/moon_texture_4k.jpg',
    (tex) => {
      tex.anisotropy = maxAnisotropy;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      moonMat.map = tex;
      moonMat.needsUpdate = true;
    },
    undefined,
    () => {
      textureLoader.load('assets/moon_texture_2k.jpg', (tex2k) => {
        tex2k.anisotropy = maxAnisotropy;
        moonMat.map = tex2k;
        moonMat.needsUpdate = true;
      }, undefined, () => {
        moonMat.map = createFallbackMoonTexture();
        moonMat.needsUpdate = true;
      });
    }
  );

  // Load 4K high-relief bump map with fallback chain
  const moonBumpMap = textureLoader.load(
    'assets/moon_bump_4k.jpg',
    (bumpTex) => {
      bumpTex.anisotropy = maxAnisotropy;
      bumpTex.generateMipmaps = true;
      bumpTex.minFilter = THREE.LinearMipmapLinearFilter;
      bumpTex.magFilter = THREE.LinearFilter;
      moonMat.bumpMap = bumpTex;
      moonMat.needsUpdate = true;
    },
    undefined,
    () => {
      moonMat.bumpMap = textureLoader.load('assets/moon_bump_2k.jpg');
      moonMat.needsUpdate = true;
    }
  );

  // --- B. Colossal Supermoon 3D Mesh (Silky-Smooth 160-segment Geometry & Deep Craters) ---
  const moonRadius = 320;
  const moonGeo = new THREE.SphereGeometry(moonRadius, 160, 160);
  const moonMat = new THREE.MeshStandardMaterial({
    map: moonTexture,
    bumpMap: moonBumpMap,
    bumpScale: 0.13,
    roughness: 0.94,
    metalness: 0.0
  });

  const moonMesh = new THREE.Mesh(moonGeo, moonMat);
  moonMesh.rotation.y = 0.5;
  moonMesh.rotation.x = 0.1;
  scene.add(moonMesh);

  // Ethereal Subpixel Lunar Limb Halo - Perfectly feather-blends the silhouette into space (No harshness)
  const limbGeo = new THREE.SphereGeometry(moonRadius * 1.005, 160, 160);
  const limbMat = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0xf1f5f9) }
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
        gl_FragColor = vec4(glowColor, clamp(intensity * 0.45, 0.0, 0.45));
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
  });
  const limbMesh = new THREE.Mesh(limbGeo, limbMat);
  moonMesh.add(limbMesh);

  // --- C. Milestone Lunar Hotspots ---
  const hotspotsData = [
    {
      name: "Mare Tranquillitatis",
      title: "Pusat Rekayasa Fullstack & GIS",
      desc: "Platform MBG SPPG & Web GIS Leaflet berbasis data nutrisi AKG.",
      lat: 8.5,
      lon: 31.4,
      color: 0x38bdf8
    },
    {
      name: "Copernicus Crater",
      title: "Landmark 3 HKI Kemenkumham",
      desc: "Hak Cipta Resmi MBG, Kota Bersih AI & Web Desa Baran Klaten.",
      lat: 9.6,
      lon: -20.1,
      color: 0xf59e0b
    },
    {
      name: "Tycho Crater",
      title: "Landmark Silver Medalist",
      desc: "Pekan Inovasi Nasional Vol.3 2026 Universitas Mercu Buana.",
      lat: -43.3,
      lon: -11.2,
      color: 0x06b6d4
    },
    {
      name: "Oceanus Procellarum",
      title: "Pusat Riset AI & Kota Bersih",
      desc: "Smart Waste Management terintegrasi AI Assistant BRIDA Surakarta.",
      lat: 18.4,
      lon: -57.4,
      color: 0x6366f1
    }
  ];

  const hotspotGroup = new THREE.Group();
  const hotspotMeshes = [];

  function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }

  hotspotsData.forEach((spot, idx) => {
    const pos = latLonToVector3(spot.lat, spot.lon, moonRadius + 1.8);
    
    // Core beacon sphere
    const beaconGeo = new THREE.SphereGeometry(3.6, 14, 14);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: spot.color,
      blending: THREE.AdditiveBlending
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.copy(pos);

    // Pulsing outer ring
    const ringGeo = new THREE.RingGeometry(4.8, 6.8, 20);
    const ringMat = new THREE.MeshBasicMaterial({
      color: spot.color,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    ring.lookAt(0, 0, 0);

    beacon.userData = {
      ...spot,
      ring: ring,
      initialScale: 1
    };

    hotspotGroup.add(beacon);
    hotspotGroup.add(ring);
    hotspotMeshes.push(beacon);
  });

  moonMesh.add(hotspotGroup);

  // --- D. Realistic Lunar Lighting ---
  // 1. Directional Sun Light (Sculpting dramatic crater shadows without blowout)
  const sunLight = new THREE.DirectionalLight(0xfff7ea, 1.35);
  sunLight.position.set(260, 140, 260);
  scene.add(sunLight);

  // 2. Ambient Light (Rich cosmic shadow fill so craters have deep clarity)
  const ambientLight = new THREE.AmbientLight(0x1e293b, 0.28);
  scene.add(ambientLight);

  // 3. Crisp Silver Moon Limb Light
  const rimLight = new THREE.DirectionalLight(0xf1f5f9, 0.45);
  rimLight.position.set(-360, -60, -180);
  scene.add(rimLight);

  // --- E. User Interaction: 3D Drag & Momentum ---
  let isDragging = false;
  let prevPointerX = 0;
  let prevPointerY = 0;
  let velocityX = 0;
  let velocityY = 0;
  let autoRotate = true;

  const targetRotation = { x: 0.1, y: 0.5 };

  // Pointer drag events on canvas and stage (Desktop only: > 1024px)
  function onPointerDown(e) {
    if (window.innerWidth <= 1024) return; // Fixed non-interactive backdrop on mobile/tablets
    isDragging = true;
    prevPointerX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    prevPointerY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    velocityX = 0;
    velocityY = 0;
  }

  function onPointerMove(e) {
    if (window.innerWidth <= 1024) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    if (isDragging) {
      const deltaX = clientX - prevPointerX;
      const deltaY = clientY - prevPointerY;

      velocityX = deltaX * 0.005;
      velocityY = deltaY * 0.005;

      moonMesh.rotation.y += velocityX;
      moonMesh.rotation.x += velocityY;

      // Clamp X rotation to avoid flipping upside down
      moonMesh.rotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, moonMesh.rotation.x));

      prevPointerX = clientX;
      prevPointerY = clientY;
    } else {
      // Raycasting check for hotspots on hover
      checkHotspotIntersection(clientX, clientY);
    }
  }

  function onPointerUp() {
    isDragging = false;
  }

  moonCanvas.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  moonCanvas.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp, { passive: true });

  // Mouse Wheel Interactive Zoom (Desktop only: > 1024px)
  moonCanvas.addEventListener('wheel', (e) => {
    if (window.innerWidth <= 1024) return;
    e.preventDefault();
    targetCameraZ += e.deltaY * 0.4;
    targetCameraZ = Math.max(minZoomInZ, Math.min(maxZoomOutZ, targetCameraZ));
    if (typeof CosmicAudio !== 'undefined') CosmicAudio.playZoom(e.deltaY < 0);
  }, { passive: false });

  // Zoom In / Out Buttons
  const zoomInBtn = document.getElementById('moon-zoom-in');
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      targetCameraZ = Math.max(minZoomInZ, targetCameraZ - 70);
      if (typeof CosmicAudio !== 'undefined') CosmicAudio.playZoom(true);
      if (window.showToast) window.showToast("Bulan diperbesar (Zoom In)");
    });
  }

  const zoomOutBtn = document.getElementById('moon-zoom-out');
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      targetCameraZ = Math.min(maxZoomOutZ, targetCameraZ + 70);
      if (typeof CosmicAudio !== 'undefined') CosmicAudio.playZoom(false);
      if (window.showToast) window.showToast("Bulan diperkecil (Zoom Out)");
    });
  }

  // --- F. Raycasting & Tooltips for Lunar Hotspots ---
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const tooltip = document.getElementById('lunar-tooltip');
  const tooltipTitle = document.getElementById('tooltip-title');
  const tooltipDesc = document.getElementById('tooltip-desc');

  function checkHotspotIntersection(clientX, clientY) {
    if (window.innerWidth <= 1024) {
      if (tooltip) tooltip.classList.remove('show');
      return;
    }
    const rect = moonCanvas.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      if (tooltip) tooltip.classList.remove('show');
      return;
    }

    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(hotspotMeshes);

    if (intersects.length > 0) {
      const spot = intersects[0].object.userData;
      if (tooltip && tooltipTitle && tooltipDesc) {
        tooltipTitle.textContent = `${spot.name} — ${spot.title}`;
        tooltipDesc.textContent = spot.desc;
        tooltip.classList.add('show');
      }
    } else {
      if (tooltip) tooltip.classList.remove('show');
    }
  }

  // --- G. Interactive Controls: Rotate, Phase, Reset, View Toggle ---
  const rotateToggleBtn = document.getElementById('moon-rotate-toggle');
  if (rotateToggleBtn) {
    rotateToggleBtn.classList.add('active');
    rotateToggleBtn.addEventListener('click', () => {
      autoRotate = !autoRotate;
      rotateToggleBtn.classList.toggle('active', autoRotate);
      if (window.showToast) {
        window.showToast(autoRotate ? "Rotasi Bulan Otomatis: Aktif" : "Rotasi Bulan Otomatis: Dijeda");
      }
    });
  }

  // Lunar Phases Angles
  const phases = [
    { name: "Waxing Gibbous", pos: [260, 140, 260] },
    { name: "Full Moon (Bulan Purnama)", pos: [30, 60, 480] },
    { name: "Quarter Moon", pos: [450, 0, 70] },
    { name: "Dramatic Crescent", pos: [-420, 50, 120] },
    { name: "Solar Starlight Rim", pos: [0, 0, -450] }
  ];
  let phaseIndex = 0;
  const phaseToggleBtn = document.getElementById('moon-phase-toggle');
  if (phaseToggleBtn) {
    phaseToggleBtn.addEventListener('click', () => {
      phaseIndex = (phaseIndex + 1) % phases.length;
      const targetPhase = phases[phaseIndex];
      sunLight.position.set(targetPhase.pos[0], targetPhase.pos[1], targetPhase.pos[2]);
      if (window.showToast) {
        window.showToast(`Fase Cahaya: ${targetPhase.name}`);
      }
    });
  }

  // Reset Button
  const resetBtn = document.getElementById('moon-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      moonMesh.rotation.set(0.1, 0.5, 0);
      velocityX = 0;
      velocityY = 0;
      targetCameraZ = maxZoomOutZ;
      if (typeof CosmicAudio !== 'undefined') CosmicAudio.playZoom(false);
      if (window.showToast) window.showToast("Posisi & Zoom Bulan di-reset!");
    });
  }

  // Explore Full Moon View Toggle
  const viewToggleBtn = document.getElementById('moon-view-toggle');
  const toggleText = document.getElementById('toggle-view-text');
  const avatarCard = document.getElementById('hero-avatar-card');

  if (viewToggleBtn && stageContainer) {
    let isMoonFocused = false;

    function toggleViewMode(e) {
      if (e) e.stopPropagation();
      isMoonFocused = !isMoonFocused;
      stageContainer.classList.toggle('moon-focus', isMoonFocused);
      if (toggleText) {
        toggleText.textContent = isMoonFocused ? "Kembali ke Profil" : "Eksplorasi Bulan 3D";
      }
      if (window.showToast) {
        window.showToast(isMoonFocused ? "Mode Eksplorasi Bulan 3D Penuh Aktif!" : "Mode Tampilan Profil Aktif");
      }
    }

    viewToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleViewMode(e);
    });

    if (avatarCard) {
      avatarCard.addEventListener('click', (e) => {
        if (stageContainer.classList.contains('moon-focus')) {
          toggleViewMode(e);
        }
      });
    }
  }

  // --- H. Animation Loop ---
  const moonClock = new THREE.Clock();

  function animateMoon() {
    requestAnimationFrame(animateMoon);
    const delta = moonClock.getDelta();
    const elapsed = moonClock.getElapsedTime();

    // Auto-spin if enabled and not currently dragging
    if (autoRotate && !isDragging) {
      moonMesh.rotation.y += 0.0016;
    }

    // Apply inertia damping
    if (!isDragging) {
      moonMesh.rotation.y += velocityX;
      moonMesh.rotation.x += velocityY;
      velocityX *= 0.94;
      velocityY *= 0.94;
    }

    // Smooth camera zoom lerp
    camera.position.z += (targetCameraZ - camera.position.z) * 0.1;

    // Pulse beacon rings
    hotspotMeshes.forEach((beacon, i) => {
      const ring = beacon.userData.ring;
      if (ring) {
        const pulse = 1 + Math.sin(elapsed * 3 + i) * 0.25;
        ring.scale.set(pulse, pulse, 1);
        ring.material.opacity = 0.5 + Math.sin(elapsed * 3 + i) * 0.35;
      }
    });

    renderer.render(scene, camera);
  }

  animateMoon();
}

/* ===================================================================
   2. THEME ENGINE (DAYLIGHT CELESTIAL <-> DEEP COSMIC NIGHT)
   =================================================================== */
function initThemeEngine() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  // The website aesthetic is pure obsidian cosmic space; ensure default is dark
  let savedTheme = localStorage.getItem('celestial-theme');
  if (!savedTheme || savedTheme === 'light') {
    savedTheme = 'dark';
    localStorage.setItem('celestial-theme', 'dark');
  }
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('celestial-theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (!icon) return;
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-sun';
      themeToggle.setAttribute('title', 'Beralih ke Daylight Celestial');
    } else {
      icon.className = 'fa-solid fa-moon';
      themeToggle.setAttribute('title', 'Beralih ke Deep Cosmic Night');
    }
  }
}

/* ===================================================================
   3. COSMIC AUDIO INITIALIZER & GLOBAL EVENT BINDINGS
   =================================================================== */
function initCosmicAudio() {
  const audioBtn = document.getElementById('audio-toggle');

  // Universal user activation listener to unlock audio on first interaction
  const unlockAudio = () => {
    CosmicAudio.ensureReady();
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('mousedown', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });

  // On first user interaction, automatically start backsound smoothly
  let autoStarted = false;
  const onFirstInteraction = (e) => {
    if (autoStarted) return;
    if (e && e.target && e.target.closest('#audio-toggle')) return;
    autoStarted = true;
    unlockAudio();
    CosmicAudio.startBacksound();
    window.removeEventListener('click', onFirstInteraction);
    window.removeEventListener('touchstart', onFirstInteraction);
    window.removeEventListener('keydown', onFirstInteraction);
  };
  window.addEventListener('click', onFirstInteraction);
  window.addEventListener('touchstart', onFirstInteraction, { passive: true });
  window.addEventListener('keydown', onFirstInteraction, { passive: true });

  if (audioBtn) {
    audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      autoStarted = true;
      unlockAudio();
      CosmicAudio.toggleBacksound();
    });
  }

  // Interactive Elements Hover SFX (Starlight harmonic ping)
  const interactiveSelector = 'button, a, .project-card, .press-card, .avatar-card, .highlight-item, .contact-pill, .tab-btn, .press-tab-btn, .press-detail-btn, .press-source-link, .skill-pill, .badge-cosmic, .moon-ctrl-btn, .timeline-card, .nav-link, .float-tag, .cert-card, .nav-brand, .icon-btn, .btn';
  
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(interactiveSelector);
    if (target) {
      CosmicAudio.playHover();
    }
  }, { passive: true });

  // Interactive Elements Click SFX (Cosmic haptic snap)
  document.addEventListener('click', (e) => {
    const target = e.target.closest(interactiveSelector + ', #canvas-moon-3d');
    if (target) {
      CosmicAudio.playClick();
    }
  }, { passive: true });

  // Scroll SFX (Space gravity whoosh)
  window.addEventListener('scroll', () => {
    CosmicAudio.playScroll();
  }, { passive: true });
}

/* ===================================================================
   4. MULTILINGUAL ENGINE (INDONESIAN <-> ENGLISH)
   =================================================================== */
const translations = {
  id: {
    nav_profil: "Profil",
    nav_projek: "Proyek & Riset",
    nav_web_aktif: "Website Aktif",
    nav_karir: "Magang & Karir",
    nav_organisasi: "Organisasi",
    nav_narasumber: "Narasumber",
    nav_prestasi: "Prestasi & HKI",
    nav_media: "Media & Berita",
    nav_sertifikasi: "Sertifikasi",
    nav_skill: "Skill",
    nav_kontak: "Kontak",
    btn_explore: "Jelajahi Riset & Proyek",
    btn_cv_ats: "Lihat CV ATS",
    btn_contact_me: "Hubungi Saya",
    stat_hki: "3 HKI Resmi Kemenkumham",
    stat_silver: "Medali Silver Inovasi Nasional",
    stat_kai: "Magang SI PT KAI Daop 6",
    stat_himsi: "Ketua Umum HIMSI Solo",
    press_tag: "LIPUTAN MEDIA & REKAM JEJAK DIGITAL",
    press_title: "Publikasi Berita, Media Massa & Jejak Publik Terverifikasi",
    press_desc: "Hasil penelusuran digital komprehensif: seluruh artikel berita media pers nasional & regional, jurnal pengabdian masyarakat terakreditasi, rilis pers resmi universitas, serta catatan Hak Cipta resmi di Pangkalan Data Kekayaan Intelektual (PDKI) Kemenkumham RI atas nama Muhammad Fahrel Yuliyanto.",
    tag_live_websites: "LIVE WEBSITE PORTFOLIO & INTERVIEW SHOWCASE"
  },
  en: {
    nav_profil: "About",
    nav_projek: "Projects & Research",
    nav_web_aktif: "Live Websites",
    nav_karir: "Career & Internships",
    nav_organisasi: "Leadership",
    nav_narasumber: "Speaker & Events",
    nav_prestasi: "Awards & Patents",
    nav_media: "Press & Media",
    nav_sertifikasi: "Certifications",
    nav_skill: "Skills & Stack",
    nav_kontak: "Contact",
    btn_explore: "Explore Research & Projects",
    btn_cv_ats: "View ATS CV",
    btn_contact_me: "Contact Me",
    stat_hki: "3 Official Copyrights (HKI)",
    stat_silver: "National Silver Medalist",
    stat_kai: "PT KAI Daop 6 IT Intern",
    stat_himsi: "President of HIMSI UBSI",
    press_tag: "MEDIA COVERAGE & DIGITAL FOOTPRINT",
    press_title: "Verified News, Media Coverage & Public Records",
    press_desc: "Comprehensive digital footprint verification: national & regional press articles, peer-reviewed community service journals, official university press releases, and legal Copyright registrations at the Directorate General of Intellectual Property (PDKI) under the name Muhammad Fahrel Yuliyanto.",
    tag_live_websites: "LIVE WEB PORTFOLIO & INTERVIEW PROOF"
  }
};

function initLanguageEngine() {
  const langToggle = document.getElementById('lang-toggle');
  if (!langToggle) return;

  let currentLang = localStorage.getItem('celestial-lang') || 'id';
  applyLanguage(currentLang);

  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'id' ? 'en' : 'id';
    localStorage.setItem('celestial-lang', currentLang);
    applyLanguage(currentLang);
  });

  function applyLanguage(lang) {
    langToggle.innerHTML = lang === 'id' ? '🇬🇧 EN' : '🇮🇩 ID';
    langToggle.setAttribute('title', lang === 'id' ? 'Ganti ke Bahasa Inggris' : 'Switch to Indonesian');

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
  }
}

/* ===================================================================
   5. PROJECT FILTER ENGINE
   =================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ===================================================================
   5.1 PRESS & MEDIA COVERAGE FILTER ENGINE
   =================================================================== */
function initPressFilters() {
  const filterBtns = document.querySelectorAll('.press-tab-btn');
  const pressCards = document.querySelectorAll('.press-card');

  if (!filterBtns.length || !pressCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-press-filter');

      pressCards.forEach((card) => {
        const category = card.getAttribute('data-press-category') || '';
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ===================================================================
   6. INTERACTIVE MODAL VIEWER (HIGH-RES PREVIEWS & DETAILS)
   =================================================================== */
function initModalViewer() {
  const modalOverlay = document.getElementById('cosmic-modal');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalMeta = document.getElementById('modal-meta');
  const modalDesc = document.getElementById('modal-desc');
  const modalLink = document.getElementById('modal-link');

  if (!modalOverlay) return;

  document.querySelectorAll('[data-modal-target]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const title = trigger.getAttribute('data-title') || 'Detail Showcase';
      const meta = trigger.getAttribute('data-meta') || '';
      const desc = trigger.getAttribute('data-desc') || '';
      const imgSrc = trigger.getAttribute('data-img') || '';
      const url = trigger.getAttribute('data-url') || '';

      if (modalTitle) modalTitle.textContent = title;
      if (modalMeta) modalMeta.textContent = meta;
      if (modalDesc) modalDesc.innerHTML = desc;
      if (modalImg) {
        if (imgSrc) {
          modalImg.src = imgSrc;
          modalImg.style.display = 'block';
        } else {
          modalImg.style.display = 'none';
        }
      }
      if (modalLink) {
        if (url) {
          modalLink.href = url;
          modalLink.style.display = 'inline-flex';
        } else {
          modalLink.style.display = 'none';
        }
      }

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ===================================================================
   7. NAVBAR SCROLL & ACTIVE LINK SPY
   =================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.cosmic-navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle & drawer handler
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navBackdrop = document.getElementById('nav-backdrop');

  function closeMobileNav() {
    if (!navMenu) return;
    navMenu.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    if (mobileToggle) {
      const icon = mobileToggle.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    }
    document.body.style.overflow = '';
  }

  function openMobileNav() {
    if (!navMenu) return;
    navMenu.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
    if (mobileToggle) {
      const icon = mobileToggle.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-xmark';
    }
    document.body.style.overflow = 'hidden';
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('active')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMobileNav);
    }

    navLinks.forEach((l) => {
      l.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileNav();
      }
    });
  }
}

/* ===================================================================
   8. CONTACT ACTIONS & TOAST NOTIFICATION
   =================================================================== */
function initContactActions() {
  const toast = document.getElementById('cosmic-toast');

  window.showToast = function (msg) {
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          window.showToast(`Berhasil disalin: ${textToCopy}`);
        });
      }
    });
  });
}

/* ===================================================================
   7. LIVE WEBSITES FILTER & INTERACTIVE BROWSER MODAL ENGINE
   =================================================================== */
function initLiveWebFilter() {
  const filterBtns = document.querySelectorAll('.live-filter-btn');
  const cards = document.querySelectorAll('.live-web-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-live-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-live-category') || '';
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

function initLiveWebModal() {
  const modal = document.getElementById('live-web-modal');
  if (!modal) return;

  const closeBtn1 = document.getElementById('btnCloseLiveWeb');
  const closeBtn2 = document.getElementById('btnCloseLiveWebBtn');
  const urlText = document.getElementById('liveModalUrlText');
  const copyBtn = document.getElementById('btnCopyModalUrl');
  const externalBtn = document.getElementById('btnLiveModalExternal');
  const viewportFrame = document.getElementById('liveModalViewport');
  const iframe = document.getElementById('liveWebIframe');
  const fallbackOverlay = document.getElementById('liveIframeFallback');
  const fallbackImg = document.getElementById('liveFallbackImg');
  const fallbackTitle = document.getElementById('fallbackTitle');
  const fallbackExternal = document.getElementById('btnFallbackExternal');
  const dismissFallback = document.getElementById('btnDismissFallback');
  const talkingPointsContainer = document.getElementById('liveModalTalkingPoints');
  const deviceBtns = document.querySelectorAll('.device-btn');

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Reset iframe to stop any background video or audio
    setTimeout(() => {
      if (iframe) iframe.src = 'about:blank';
      if (fallbackOverlay) fallbackOverlay.classList.remove('show');
    }, 300);
  }

  if (closeBtn1) closeBtn1.addEventListener('click', closeModal);
  if (closeBtn2) closeBtn2.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Device viewport switcher
  deviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deviceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const vp = btn.getAttribute('data-viewport');
      if (viewportFrame) {
        viewportFrame.classList.remove('desktop-view', 'tablet-view', 'mobile-view');
        viewportFrame.classList.add(`${vp}-view`);
      }
    });
  });

  if (dismissFallback) {
    dismissFallback.addEventListener('click', () => {
      if (fallbackOverlay) fallbackOverlay.classList.remove('show');
    });
  }

  // Open Preview Modal
  document.querySelectorAll('.btn-open-live-preview').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = btn.getAttribute('data-url') || '#';
      const title = btn.getAttribute('data-title') || 'Website Showcase';
      const img = btn.getAttribute('data-img') || '';
      const talkingPoints = btn.getAttribute('data-talking-points') || '';

      if (urlText) urlText.textContent = url;
      if (externalBtn) externalBtn.href = url;
      if (fallbackExternal) fallbackExternal.href = url;
      if (fallbackTitle) fallbackTitle.textContent = title;
      if (fallbackImg) fallbackImg.src = img;

      // Populate Interview Talking Points
      if (talkingPointsContainer) {
        talkingPointsContainer.innerHTML = '';
        if (talkingPoints) {
          const points = talkingPoints.split('|');
          points.forEach(pt => {
            const chip = document.createElement('span');
            chip.className = 'interview-point-chip';
            chip.innerHTML = `<i class="fa-solid fa-check" style="color: #38bdf8; margin-right: 4px;"></i> ${pt.trim()}`;
            talkingPointsContainer.appendChild(chip);
          });
        }
      }

      // Handle iframe loading & security fallback
      if (iframe) {
        // Show fallback initially or on error
        if (fallbackOverlay) fallbackOverlay.classList.remove('show');

        // Check if external domain often blocks iframes
        const isExternalBlocked = url.includes('volutionapparelcatalog.com') || url.includes('wuaze.com') || url.includes('page.gd');
        
        if (isExternalBlocked) {
          // For known domains with restrictive CSP, show the high-res interactive snapshot overlay with one-click launch
          if (fallbackOverlay) fallbackOverlay.classList.add('show');
          iframe.src = url;
        } else {
          iframe.src = url;
        }
      }

      // Copy url button
      if (copyBtn) {
        copyBtn.onclick = () => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
              if (window.showToast) window.showToast(`URL berhasil disalin: ${url}`);
            });
          }
        };
      }

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Play celestial sound effect if available
      if (typeof CosmicAudio !== 'undefined' && CosmicAudio.playChime) {
        CosmicAudio.playChime();
      }
    });
  });
}

