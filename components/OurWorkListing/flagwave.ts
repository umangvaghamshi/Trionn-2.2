import * as THREE from 'three';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const VS = `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;
const FS = `
  uniform sampler2D map;
  uniform float alpha;
  varying vec2 vUv;
  void main(){
    vec4 c = texture2D(map, vUv);
    gl_FragColor = vec4(c.rgb, c.a * alpha);
  }`;

const WAVE_DUR = 3000;
const W_SEGS = 32;
const H_SEGS = 24;
const DPR_CAP = 1.5;

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type Stage = {
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  resize: () => void;
};

function createSharedStage(): Stage {
  const canvas = document.createElement('canvas');
  canvas.id = 'shared-card-wave-canvas';
  document.body.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
  renderer.setClearColor(0x000000, 0);
  renderer.info.autoReset = true;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 20000);
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const fov = THREE.MathUtils.degToRad(camera.fov);
    camera.aspect = w / h;
    camera.position.set(0, 0, (h * 0.5) / Math.tan(fov * 0.5));
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();
  return { canvas, renderer, scene, camera, resize };
}

class CardWave {
  cardEl: HTMLElement;
  stage: Stage;
  thumb: HTMLElement | null;
  img: HTMLImageElement | null;
  mesh: THREE.Mesh | null = null;
  restX: Float32Array | null = null;
  restY: Float32Array | null = null;
  running = false;
  hover = false;
  pointerInside = false;
  hoverQueued = false;
  startTime = 0;
  settleFrom = 0;
  settleT = 0;
  settleStart = 0;
  settling = false;
  curWAmt = 0;
  curWaveT = 0;
  texReady = false;
  pendingIntro = false;
  visible = false;
  lastW = 0;
  lastH = 0;
  _onEnter: () => void;
  _onLeave: () => void;
  markActive: () => void;
  loader: THREE.TextureLoader;

  constructor(cardEl: HTMLElement, stage: Stage, loader: THREE.TextureLoader, markActive: () => void) {
    this.cardEl = cardEl;
    this.stage = stage;
    this.loader = loader;
    this.markActive = markActive;
    this.thumb = cardEl.querySelector<HTMLElement>('.card-thumb');
    this.img = this.thumb ? this.thumb.querySelector<HTMLImageElement>('img') : null;
    if (this.img) this.img.style.visibility = 'hidden';
    this._onEnter = () => this.startHover();
    this._onLeave = () => this.stopHover();
    this.build();
    this.bindHover();
  }
  build() {
    if (!this.thumb || !this.img) return;
    const rect = this.thumb.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w < 2 || h < 2) return;
    this.lastW = w;
    this.lastH = h;
    if (this.mesh) {
      this.stage.scene.remove(this.mesh);
      const oldTex = (this.mesh.material as THREE.ShaderMaterial)?.uniforms?.map?.value as THREE.Texture | undefined;
      this.mesh.geometry.dispose();
      (this.mesh.material as THREE.Material).dispose();
      if (oldTex && (oldTex as any).dispose) (oldTex as any).dispose();
      this.mesh = null;
    }
    const geo = new THREE.PlaneGeometry(w, h, W_SEGS, H_SEGS);
    const pos = geo.attributes.position;
    this.restX = new Float32Array(pos.count);
    this.restY = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      this.restX[i] = pos.getX(i);
      this.restY[i] = pos.getY(i);
    }
    const tex = this.loader.load(this.img.currentSrc || this.img.src, () => {
      this.texReady = true;
      this.applyWave(0, 0);
      this.updatePosition();
      this.render();
      if (this.pendingIntro) {
        this.pendingIntro = false;
        this.runIntro();
      }
    });
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    const mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: tex }, alpha: { value: 0 } },
      vertexShader: VS,
      fragmentShader: FS,
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.stage.scene.add(this.mesh);
    this.updatePosition();
  }
  bindHover() {
    this.cardEl.addEventListener('mouseenter', this._onEnter);
    this.cardEl.addEventListener('mouseleave', this._onLeave);
  }
  unbindHover() {
    this.cardEl.removeEventListener('mouseenter', this._onEnter);
    this.cardEl.removeEventListener('mouseleave', this._onLeave);
  }
  updatePosition() {
    if (!this.mesh || !this.thumb) return false;
    const r = this.thumb.getBoundingClientRect();
    this.mesh.position.x = r.left + r.width * 0.5 - window.innerWidth * 0.5;
    this.mesh.position.y = window.innerHeight * 0.5 - (r.top + r.height * 0.5);
    this.mesh.visible = r.bottom > -160 && r.top < window.innerHeight + 160;
    const cardOpacity = parseFloat(
      this.cardEl.style.opacity || getComputedStyle(this.cardEl).opacity || '0'
    );
    (this.mesh.material as THREE.ShaderMaterial).uniforms.alpha.value = clamp01(cardOpacity);
    return this.mesh.visible;
  }
  applyWave(wAmt: number, t: number) {
    if (!this.mesh || !this.restX || !this.restY) return;
    const pos = this.mesh.geometry.attributes.position as THREE.BufferAttribute;
    const ph = this.lastH;
    const fw = this.lastW;
    for (let i = 0; i < pos.count; i++) {
      const rx = this.restX[i];
      const ry = this.restY[i];
      const nd = 1.0 - (ry / ph + 0.5);
      const z = wAmt * nd * Math.sin(nd * Math.PI * 1.2 - t * 1.8) * fw * 0.04;
      pos.setXYZ(i, rx, ry, z);
    }
    pos.needsUpdate = true;
  }
  runIntro() {
    if (!this.texReady) {
      this.pendingIntro = true;
      return;
    }
    this.hover = false;
    this.settling = false;
    this.running = true;
    this.startTime = performance.now();
    this.markActive();
  }
  startHover() {
    this.pointerInside = true;
    if (!this.texReady) return;
    if (this.running && !this.hover) {
      this.hoverQueued = true;
      this.markActive();
      return;
    }
    this.hoverQueued = false;
    this.hover = true;
    this.settling = false;
    this.running = true;
    this.startTime = performance.now();
    this.markActive();
  }
  stopHover() {
    this.pointerInside = false;
    this.hoverQueued = false;
    if (!this.mesh || !this.texReady) return;
    if (this.running && !this.hover) {
      this.markActive();
      return;
    }
    this.hover = false;
    this.running = false;
    this.settling = true;
    this.settleFrom = this.curWAmt;
    this.settleT = this.curWaveT;
    this.settleStart = performance.now();
    this.markActive();
  }
  tick(now: number) {
    this.updatePosition();
    if (!this.mesh || !this.texReady) return false;
    if (this.running) {
      const elapsed = now - this.startTime;
      let wAmt: number, waveT: number;
      if (this.hover) {
        const loopP = (elapsed % WAVE_DUR) / WAVE_DUR;
        const env = Math.sin(Math.PI * loopP);
        wAmt = 0.18 * env;
        waveT = loopP * Math.PI * 2.0;
      } else {
        const p = Math.min(elapsed / WAVE_DUR, 1);
        const env = Math.sin(Math.PI * p);
        wAmt = easeInOut(env);
        waveT = p * Math.PI * 2.2;
        if (elapsed >= WAVE_DUR) {
          this.applyWave(0, 0);
          this.curWAmt = 0;
          this.curWaveT = 0;
          if (this.hoverQueued && this.pointerInside) {
            this.hoverQueued = false;
            this.hover = true;
            this.running = true;
            this.settling = false;
            this.startTime = now;
          } else {
            this.hoverQueued = false;
            this.running = false;
            this.settling = true;
            this.settleFrom = 0;
            this.settleT = 0;
            this.settleStart = now;
          }
        }
      }
      this.curWAmt = wAmt;
      this.curWaveT = waveT;
      this.applyWave(wAmt, waveT);
      return true;
    }
    if (this.settling) {
      const dur = this.hover ? 500 : 300;
      const p = Math.min((now - this.settleStart) / dur, 1);
      const sw = this.settleFrom * (1 - easeInOut(p));
      this.curWAmt = sw;
      this.applyWave(sw, this.settleT);
      if (p >= 1) {
        this.settling = false;
        this.curWAmt = 0;
        this.applyWave(0, 0);
      }
      return this.settling;
    }
    return false;
  }
  render() {
    this.stage.renderer.render(this.stage.scene, this.stage.camera);
  }
}

export type FlagwaveHandle = { dispose: () => void };

export function initFlagwave(root: HTMLElement | Document = document): FlagwaveHandle {
  const cardEls = Array.from(root.querySelectorAll<HTMLElement>('.project-card'));
  if (!cardEls.length) return { dispose: () => {} };

  const stage = createSharedStage();
  const loader = new THREE.TextureLoader();
  let rafId: number | null = null;
  let renderPending = false;
  let opacityTimer: ReturnType<typeof setInterval> | null = null;
  let wavedCount = 0;
  let pageHidden = document.hidden;
  let resizeRaf: number | null = null;
  let resizeTimer: ReturnType<typeof setTimeout> | null = null;

  function markActive() {
    if (pageHidden) return;
    if (!rafId) rafId = requestAnimationFrame(loop);
  }
  function loop(now: number) {
    rafId = null;
    if (pageHidden || !stage) return;
    let keepRunning = false;
    let shouldRender = false;
    cards.forEach(card => {
      if (card.tick(now)) keepRunning = true;
      if (card.mesh && card.mesh.visible) shouldRender = true;
    });
    if (shouldRender) stage.renderer.render(stage.scene, stage.camera);
    if (keepRunning) rafId = requestAnimationFrame(loop);
  }
  function renderOnce() {
    if (!stage || pageHidden) return;
    let shouldRender = false;
    cards.forEach(card => {
      if (card.updatePosition()) shouldRender = true;
    });
    if (shouldRender) stage.renderer.render(stage.scene, stage.camera);
  }
  function scheduleRender() {
    if (renderPending) return;
    renderPending = true;
    requestAnimationFrame(() => {
      renderPending = false;
      renderOnce();
    });
  }

  const cards: CardWave[] = cardEls.map(el => new CardWave(el, stage, loader, markActive));

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const card = cards.find(item => item.cardEl === entry.target);
        if (!card) return;
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('card-revealed');
          card.updatePosition();
          scheduleRender();
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -5% 0px' }
  );
  cardEls.forEach(el => io.observe(el));

  const onResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null;
        stage.resize();
        cards.forEach(card => {
          const r = card.thumb && card.thumb.getBoundingClientRect();
          if (!r) return;
          if (Math.abs(r.width - card.lastW) > 2 || Math.abs(r.height - card.lastH) > 2) card.build();
          else card.updatePosition();
        });
        scheduleRender();
      });
    }, 180);
  };
  const onScroll = () => scheduleRender();
  const onWheel = () => scheduleRender();
  const onVis = () => {
    pageHidden = document.hidden;
    if (pageHidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else {
      scheduleRender();
    }
  };

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('wheel', onWheel, { passive: true });
  document.addEventListener('visibilitychange', onVis);

  function startOpacityWatch() {
    if (opacityTimer) clearInterval(opacityTimer);
    opacityTimer = setInterval(() => {
      let remaining = 0;
      cards.forEach(card => {
        if (card.visible) return;
        remaining++;
        const op = parseFloat(
          card.cardEl.style.opacity || getComputedStyle(card.cardEl).opacity || '0'
        );
        if (op > 0.01) {
          card.visible = true;
          wavedCount++;
          card.runIntro();
        }
      });
      if (remaining === 0 || wavedCount >= cards.length) {
        if (opacityTimer) clearInterval(opacityTimer);
        opacityTimer = null;
      }
    }, 80);
  }
  startOpacityWatch();
  scheduleRender();

  return {
    dispose() {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      document.removeEventListener('visibilitychange', onVis);
      io.disconnect();
      if (opacityTimer) clearInterval(opacityTimer);
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      if (resizeTimer) clearTimeout(resizeTimer);
      cards.forEach(card => {
        card.unbindHover();
        if (!card.mesh) return;
        const tex = (card.mesh.material as THREE.ShaderMaterial)?.uniforms?.map?.value as THREE.Texture | undefined;
        card.stage.scene.remove(card.mesh);
        card.mesh.geometry.dispose();
        (card.mesh.material as THREE.Material).dispose();
        if (tex && (tex as any).dispose) (tex as any).dispose();
        card.mesh = null;
      });
      stage.renderer.dispose();
      if (stage.canvas.parentNode) stage.canvas.parentNode.removeChild(stage.canvas);
    },
  };
}
