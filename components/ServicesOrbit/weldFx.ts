import * as THREE from "three";

const BOLT_COUNT = 5;
const BOLT_SEGS = 9;

const COLORS = [
  0xffffff, 0x88ddff, 0x44aaff, 0x0066ff, 0x00ccff, 0xaaddff, 0x0044cc,
];

const GLOW_LAYERS = [
  { color: 0x0033cc, maxOpacity: 0.12 },
  { color: 0x3399ff, maxOpacity: 0.25 },
  { color: 0x99ddff, maxOpacity: 0.45 },
];

export type WeldFxOptions = {
  /** e.g. `/services-orbit/spark.mp3` — optional; sparks work without audio */
  sparkUrl?: string;
  isSoundEnabled: () => boolean;
  glowCanvas: HTMLCanvasElement | null;
};

type GlowLinePair = { line: THREE.Line; pts: Float32Array };

type Bolt = {
  line: THREE.Line;
  pts: Float32Array;
  glowLines: GlowLinePair[];
  travelLight: THREE.PointLight;
  life: number;
  maxLife: number;
  active: boolean;
};

function nearestPointOnLine(
  targetLine: THREE.Line,
  fromPt: THREE.Vector3,
): { x: number; y: number; z: number } | null {
  const pos = targetLine.geometry.attributes.position;
  if (!pos) return null;
  let minD = Infinity;
  let best: { x: number; y: number; z: number } | null = null;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const d = (x - fromPt.x) ** 2 + (y - fromPt.y) ** 2 + (z - fromPt.z) ** 2;
    if (d < minD) {
      minD = d;
      best = { x, y, z };
    }
  }
  return best;
}

function makeGlowLine(scene: THREE.Scene, color: number): GlowLinePair {
  const pts = new Float32Array((BOLT_SEGS + 1) * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
  geo.setDrawRange(0, BOLT_SEGS + 1);
  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0,
    depthTest: false,
    depthWrite: false,
  });
  const line = new THREE.Line(geo, mat);
  line.renderOrder = 998;
  scene.add(line);
  return { line, pts };
}

function makeBolt(scene: THREE.Scene): Bolt {
  const pts = new Float32Array((BOLT_SEGS + 1) * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
  geo.setDrawRange(0, BOLT_SEGS + 1);
  const mat = new THREE.LineBasicMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0,
    depthTest: false,
    depthWrite: false,
  });
  const line = new THREE.Line(geo, mat);
  line.renderOrder = 999;
  scene.add(line);

  const glowLines = GLOW_LAYERS.map((g) => makeGlowLine(scene, g.color));
  const travelLight = new THREE.PointLight(0xaaccff, 0, 14);
  scene.add(travelLight);

  return {
    line,
    pts,
    glowLines,
    travelLight,
    life: 0,
    maxLife: 0,
    active: false,
  };
}

function spawnBolt(
  bolt: Bolt,
  origin: THREE.Vector3,
  target: { x: number; y: number; z: number },
) {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  const dz = target.z - origin.z;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;

  bolt.pts[0] = origin.x;
  bolt.pts[1] = origin.y;
  bolt.pts[2] = origin.z;
  const perpX = -dy / dist;
  const perpY = dx / dist;
  const outDir = Math.random() > 0.5 ? 1 : -1;
  for (let i = 1; i <= BOLT_SEGS; i++) {
    const t = i / BOLT_SEGS;
    const jitterAmt = Math.min(dist * 0.65, 0.22) * Math.sin(t * Math.PI);
    const outAmt = Math.min(dist * 0.28, 0.1) * Math.sin(t * Math.PI) * outDir;
    bolt.pts[i * 3] =
      origin.x + dx * t + (Math.random() - 0.5) * jitterAmt + perpX * outAmt;
    bolt.pts[i * 3 + 1] =
      origin.y + dy * t + (Math.random() - 0.5) * jitterAmt + perpY * outAmt;
    bolt.pts[i * 3 + 2] =
      origin.z + dz * t + (Math.random() - 0.5) * jitterAmt * 0.3;
  }
  bolt.pts[BOLT_SEGS * 3] = target.x;
  bolt.pts[BOLT_SEGS * 3 + 1] = target.y;
  bolt.pts[BOLT_SEGS * 3 + 2] = target.z;

  const posAttr = bolt.line.geometry.attributes
    .position as THREE.BufferAttribute;
  posAttr.array.set(bolt.pts);
  posAttr.needsUpdate = true;
  (bolt.line.material as THREE.LineBasicMaterial).color.setHex(
    COLORS[Math.floor(Math.random() * COLORS.length)],
  );

  bolt.glowLines.forEach((g) => {
    const ga = g.line.geometry.attributes.position as THREE.BufferAttribute;
    ga.array.set(bolt.pts);
    ga.needsUpdate = true;
  });

  bolt.maxLife = 0.05 + Math.random() * 0.09;
  bolt.life = bolt.maxLife;
  bolt.active = true;
}

export type WeldFxHandle = {
  init: (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    orbitLines: THREE.Line[],
  ) => void;
  update: (
    visiblePts: number,
    rotT: number,
    mnx: number,
    mny: number,
    smoothDt: number,
  ) => void;
  triggerAt: (hitPoint: THREE.Vector3, nearWpts: THREE.Vector3[]) => void;
  resizeGlow: (width: number, height: number, dpr: number) => void;
  setGlowCanvas: (el: HTMLCanvasElement | null) => void;
  dispose: () => void;
};

export function createWeldFx(options: WeldFxOptions): WeldFxHandle {
  const { sparkUrl = "/services-orbit/spark.mp3", isSoundEnabled } = options;

  let sceneRef: THREE.Scene | null = null;
  let cameraRef: THREE.PerspectiveCamera | null = null;
  let orbitLinesRef: THREE.Line[] = [];
  const bolts: Bolt[] = [];
  let weldCooldown = 0;
  let weldRaycaster: THREE.Raycaster | null = null;

  let audioCtx: AudioContext | null = null;
  let sparkBuf: AudioBuffer | null = null;
  let gainNode: GainNode | null = null;
  let sndReady = false;
  let sndCooldown = 0;

  let glowCtx: CanvasRenderingContext2D | null = null;
  let glowW = 0;
  let glowH = 0;
  let glowCanvasEl: HTMLCanvasElement | null = options.glowCanvas;

  const primeAudioListeners: Array<() => void> = [];

  function initAudioCtx() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 1;
    gainNode.connect(audioCtx.destination);
    fetch(sparkUrl)
      .then((r) => r.arrayBuffer())
      .then((ab) => audioCtx!.decodeAudioData(ab))
      .then((buf) => {
        sparkBuf = buf;
        sndReady = true;
      })
      .catch((e) => console.warn("WeldFX:", e));
  }

  function playSparkSnd() {
    if (!sndReady || sndCooldown > 0 || !isSoundEnabled() || !audioCtx || !gainNode)
      return;
    if (audioCtx.state === "suspended") void audioCtx.resume();
    if (!sparkBuf) return;
    try {
      const src = audioCtx.createBufferSource();
      src.buffer = sparkBuf;
      src.playbackRate.value = 0.75 + Math.random() * 0.5;
      src.connect(gainNode);
      src.start(0);
      sndCooldown = 0.08 + Math.random() * 0.07;
    } catch {
      /* ignore */
    }
  }

  function initGlowCanvas() {
    const gc = glowCanvasEl;
    if (!gc) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    glowW = gc.width = Math.floor(window.innerWidth * dpr);
    glowH = gc.height = Math.floor(window.innerHeight * dpr);
    gc.style.width = `${window.innerWidth}px`;
    gc.style.height = `${window.innerHeight}px`;
    glowCtx = gc.getContext("2d");
  }

  function drawGlow(boltList: Bolt[], camera: THREE.PerspectiveCamera) {
    if (!glowCtx) return;
    glowCtx.clearRect(0, 0, glowW, glowH);

    boltList.forEach((b) => {
      if (!b.active || b.life <= 0) return;
      const fade = b.life / b.maxLife;
      const screenPts: { x: number; y: number }[] = [];
      for (let i = 0; i <= BOLT_SEGS; i++) {
        const wx = b.pts[i * 3];
        const wy = b.pts[i * 3 + 1];
        const wz = b.pts[i * 3 + 2];
        const v = new THREE.Vector3(wx, wy, wz).project(camera);
        screenPts.push({
          x: (v.x * 0.5 + 0.5) * glowW,
          y: (-v.y * 0.5 + 0.5) * glowH,
        });
      }
      if (screenPts.length < 2) return;

      glowCtx!.save();
      glowCtx!.filter = "blur(8px)";
      glowCtx!.strokeStyle = `rgba(40,120,255,${0.18 * fade})`;
      glowCtx!.lineWidth = 6;
      glowCtx!.beginPath();
      glowCtx!.moveTo(screenPts[0].x, screenPts[0].y);
      screenPts.slice(1).forEach((p) => glowCtx!.lineTo(p.x, p.y));
      glowCtx!.stroke();
      glowCtx!.restore();

      glowCtx!.save();
      glowCtx!.filter = "blur(4px)";
      glowCtx!.strokeStyle = `rgba(100,180,255,${0.3 * fade})`;
      glowCtx!.lineWidth = 3;
      glowCtx!.beginPath();
      glowCtx!.moveTo(screenPts[0].x, screenPts[0].y);
      screenPts.slice(1).forEach((p) => glowCtx!.lineTo(p.x, p.y));
      glowCtx!.stroke();
      glowCtx!.restore();

      glowCtx!.save();
      glowCtx!.filter = "blur(1.5px)";
      glowCtx!.strokeStyle = `rgba(200,230,255,${0.55 * fade})`;
      glowCtx!.lineWidth = 1.5;
      glowCtx!.beginPath();
      glowCtx!.moveTo(screenPts[0].x, screenPts[0].y);
      screenPts.slice(1).forEach((p) => glowCtx!.lineTo(p.x, p.y));
      glowCtx!.stroke();
      glowCtx!.restore();
    });
  }

  const onPrime = () => {
    initAudioCtx();
  };
  (["mousedown", "touchstart", "pointerdown", "mousemove"] as const).forEach(
    (ev) => {
      const h = () => {
        onPrime();
        document.removeEventListener(ev, h);
      };
      document.addEventListener(ev, h);
      primeAudioListeners.push(() => document.removeEventListener(ev, h));
    },
  );

  function init(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    orbitLines: THREE.Line[],
  ) {
    sceneRef = scene;
    cameraRef = camera;
    orbitLinesRef = orbitLines;
    for (let i = 0; i < BOLT_COUNT; i++) bolts.push(makeBolt(scene));
    weldRaycaster = new THREE.Raycaster();
    (weldRaycaster.params.Line as { threshold: number }).threshold = 1.2;
    initGlowCanvas();
  }

  function update(
    visiblePts: number,
    rotT: number,
    mnx: number,
    mny: number,
    smoothDt: number,
  ) {
    sndCooldown -= smoothDt;
    weldCooldown -= smoothDt;

    if (
      visiblePts > 10 &&
      rotT < 0.05 &&
      weldRaycaster &&
      cameraRef &&
      sceneRef
    ) {
      weldRaycaster.setFromCamera(new THREE.Vector2(mnx, -mny), cameraRef);
      const hits = weldRaycaster.intersectObjects(orbitLinesRef, false);
      if (hits.length > 0 && weldCooldown <= 0) {
        const origin = hits[0].point;
        const hitLine = hits[0].object as THREE.Line;
        const otherLines = orbitLinesRef.filter((l) => l !== hitLine);
        bolts.forEach((b) => {
          const tgt = otherLines[Math.floor(Math.random() * otherLines.length)];
          const near = nearestPointOnLine(tgt, origin);
          if (near) spawnBolt(b, origin, near);
        });
        playSparkSnd();
        weldCooldown = 0.04 + Math.random() * 0.06;
      }
    }

    bolts.forEach((b) => {
      if (!b.active) {
        (b.line.material as THREE.LineBasicMaterial).opacity = 0;
        b.glowLines.forEach((g) => {
          (g.line.material as THREE.LineBasicMaterial).opacity = 0;
        });
        b.travelLight.intensity = 0;
        return;
      }
      b.life -= smoothDt;
      if (b.life <= 0) {
        b.active = false;
        (b.line.material as THREE.LineBasicMaterial).opacity = 0;
        b.glowLines.forEach((g) => {
          (g.line.material as THREE.LineBasicMaterial).opacity = 0;
        });
        b.travelLight.intensity = 0;
        return;
      }
      const fade = b.life / b.maxLife;
      const flicker = 0.7 + Math.random() * 0.3;
      (b.line.material as THREE.LineBasicMaterial).opacity = fade * flicker;
      b.glowLines.forEach((g, gi) => {
        (g.line.material as THREE.LineBasicMaterial).opacity =
          GLOW_LAYERS[gi].maxOpacity * fade * flicker;
      });
      const tIdx = Math.floor((1 - fade) * BOLT_SEGS) * 3;
      b.travelLight.position.set(b.pts[tIdx], b.pts[tIdx + 1], b.pts[tIdx + 2]);
      b.travelLight.intensity = (8 + Math.random() * 6) * fade;
    });

    if (cameraRef) drawGlow(bolts, cameraRef);
  }

  function triggerAt(hitPoint: THREE.Vector3, nearWpts: THREE.Vector3[]) {
    if (weldCooldown > 0) return;
    if (!nearWpts.length) return;
    bolts.forEach((b) => {
      const tgt = nearWpts[Math.floor(Math.random() * nearWpts.length)];
      const outOffset = 0.06 + Math.random() * 0.08;
      const midTarget = {
        x: tgt.x + (Math.random() - 0.5) * 0.04,
        y: tgt.y + (Math.random() - 0.5) * 0.04,
        z: tgt.z + outOffset,
      };
      spawnBolt(b, hitPoint, midTarget);
    });
    playSparkSnd();
    weldCooldown = 0.04 + Math.random() * 0.06;
  }

  function resizeGlow(width: number, height: number, dpr: number) {
    const gc = glowCanvasEl;
    if (!gc) return;
    glowW = gc.width = Math.floor(width * dpr);
    glowH = gc.height = Math.floor(height * dpr);
    gc.style.width = `${width}px`;
    gc.style.height = `${height}px`;
    if (!glowCtx) glowCtx = gc.getContext("2d");
  }

  function setGlowCanvas(el: HTMLCanvasElement | null) {
    glowCanvasEl = el;
    glowCtx = el?.getContext("2d") ?? null;
    if (el && typeof window !== "undefined") initGlowCanvas();
  }

  setGlowCanvas(options.glowCanvas);

  function dispose() {
    primeAudioListeners.forEach((fn) => fn());
    if (audioCtx) {
      void audioCtx.close();
      audioCtx = null;
    }
    if (!sceneRef) return;
    const scene = sceneRef;
    bolts.forEach((b) => {
      scene.remove(b.line);
      b.line.geometry.dispose();
      (b.line.material as THREE.Material).dispose();
      b.glowLines.forEach((g) => {
        scene.remove(g.line);
        g.line.geometry.dispose();
        (g.line.material as THREE.Material).dispose();
      });
      scene.remove(b.travelLight);
    });
    bolts.length = 0;
    sceneRef = null;
    cameraRef = null;
    orbitLinesRef = [];
    weldRaycaster = null;
  }

  return {
    init,
    update,
    triggerAt,
    resizeGlow,
    setGlowCanvas,
    dispose,
  };
}
