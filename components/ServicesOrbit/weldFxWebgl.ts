/**
 * WebGL-only weld / lightning FX (ported from prototype `weld.js`).
 * Renders bolts + glow tubes in the main Three.js scene — no separate 2D glow canvas.
 */
import * as THREE from "three";

const SPARK_SOUND_DEFAULT = "/services-orbit/spark.mp3";
const BOLT_COUNT = 5;
const BOLT_SEGS = 9;

const COLORS = [
  0xffffff, 0x88ddff, 0x44aaff, 0x0066ff, 0x00ccff, 0xaaddff, 0x0044cc,
];

const GLOW_LAYERS = [
  { color: 0x0033cc, maxOpacity: 0.07 },
  { color: 0x3399ff, maxOpacity: 0.15 },
  { color: 0x99ddff, maxOpacity: 0.27 },
];

const TUBE_LAYERS = [
  { color: 0x000d33, radius: 0.55, maxOpacity: 0.025 },
  { color: 0x001a66, radius: 0.36, maxOpacity: 0.05 },
  { color: 0x0033aa, radius: 0.22, maxOpacity: 0.08 },
  { color: 0x0055ee, radius: 0.12, maxOpacity: 0.13 },
  { color: 0x44aaff, radius: 0.055, maxOpacity: 0.24 },
  { color: 0xbbddff, radius: 0.02, maxOpacity: 0.35 },
];

type GlowLinePair = { line: THREE.Line; pts: Float32Array };

type GlowTube = {
  group: THREE.Group;
  segments: THREE.Mesh[];
  material: THREE.MeshBasicMaterial;
  layer: (typeof TUBE_LAYERS)[number];
};

type Bolt = {
  line: THREE.Line;
  pts: Float32Array;
  glowLines: GlowLinePair[];
  glowTubes: GlowTube[];
  travelLight: THREE.PointLight;
  life: number;
  maxLife: number;
  active: boolean;
};

const _segStart = new THREE.Vector3();
const _segEnd = new THREE.Vector3();
const _segMid = new THREE.Vector3();
const _segDir = new THREE.Vector3();
const _segQuat = new THREE.Quaternion();
const _yAxis = new THREE.Vector3(0, 1, 0);

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
    blending: THREE.AdditiveBlending,
  });
  const line = new THREE.Line(geo, mat);
  line.renderOrder = 998;
  scene.add(line);
  return { line, pts };
}

function updateGlowTubeGeometry(tube: GlowTube, pts: Float32Array) {
  tube.group.visible = true;
  tube.material.opacity = 0;
  for (let i = 0; i < BOLT_SEGS; i++) {
    _segStart.set(pts[i * 3], pts[i * 3 + 1], pts[i * 3 + 2]);
    _segEnd.set(pts[(i + 1) * 3], pts[(i + 1) * 3 + 1], pts[(i + 1) * 3 + 2]);
    const len = _segStart.distanceTo(_segEnd);
    const mesh = tube.segments[i];
    if (len < 0.0001) {
      mesh.visible = false;
      continue;
    }
    _segMid.copy(_segStart).lerp(_segEnd, 0.5);
    _segDir.copy(_segEnd).sub(_segStart).normalize();
    _segQuat.setFromUnitVectors(_yAxis, _segDir);
    mesh.position.copy(_segMid);
    mesh.quaternion.copy(_segQuat);
    mesh.scale.set(1, len, 1);
    mesh.visible = true;
  }
}

function makeGlowTube(scene: THREE.Scene, layer: (typeof TUBE_LAYERS)[number]): GlowTube {
  const mat = new THREE.MeshBasicMaterial({
    color: layer.color,
    transparent: true,
    opacity: 0,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const geo = new THREE.CylinderGeometry(layer.radius, layer.radius, 1, 8, 1, true);
  const group = new THREE.Group();
  group.renderOrder = 996;
  group.visible = false;
  const segments: THREE.Mesh[] = [];
  for (let i = 0; i < BOLT_SEGS; i++) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = 996;
    mesh.visible = false;
    group.add(mesh);
    segments.push(mesh);
  }
  scene.add(group);
  return { group, segments, material: mat, layer };
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
    blending: THREE.AdditiveBlending,
  });
  const line = new THREE.Line(geo, mat);
  line.renderOrder = 999;
  scene.add(line);

  const glowLines = GLOW_LAYERS.map((g) => makeGlowLine(scene, g.color));
  const glowTubes = TUBE_LAYERS.map((layer) => makeGlowTube(scene, layer));
  const travelLight = new THREE.PointLight(0xaaccff, 0, 14);
  scene.add(travelLight);

  return {
    line,
    pts,
    glowLines,
    glowTubes,
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

  const posAttr = bolt.line.geometry.attributes.position as THREE.BufferAttribute;
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
  bolt.glowTubes.forEach((tube) => updateGlowTubeGeometry(tube, bolt.pts));

  bolt.maxLife = 0.05 + Math.random() * 0.09;
  bolt.life = bolt.maxLife;
  bolt.active = true;
}

export type WeldFxWebglOptions = {
  sparkUrl?: string;
  isSoundEnabled: () => boolean;
};

export type WeldFxWebglHandle = {
  init: (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    orbitLines: THREE.Line[],
  ) => void;
  update: (smoothDt: number) => void;
  triggerAt: (
    hitPoint: THREE.Vector3,
    nearWpts: THREE.Vector3[],
    playSound?: boolean,
  ) => boolean;
  stopAll: () => void;
  primeAudio: () => void;
  dispose: () => void;
};

export function createWeldFxWebgl(
  options: WeldFxWebglOptions,
): WeldFxWebglHandle {
  const sparkUrl = options.sparkUrl ?? SPARK_SOUND_DEFAULT;
  const { isSoundEnabled } = options;

  let sceneRef: THREE.Scene | null = null;
  const bolts: Bolt[] = [];
  let weldCooldown = 0;

  let audioCtx: AudioContext | null = null;
  let sparkBuf: AudioBuffer | null = null;
  let gainNode: GainNode | null = null;
  let sndReady = false;
  let sndCooldown = 0;
  let currentSparkSrc: AudioBufferSourceNode | null = null;
  let soundKeepAliveUntil = 0;

  const primeAudioListeners: Array<() => void> = [];

  function initAudioCtx() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.12;
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

  function stopSparkSnd(force = false) {
    if (!force && performance.now() < soundKeepAliveUntil) return;
    if (currentSparkSrc) {
      try {
        currentSparkSrc.stop(0);
      } catch {
        /* ignore */
      }
      try {
        currentSparkSrc.disconnect();
      } catch {
        /* ignore */
      }
      currentSparkSrc = null;
    }
  }

  function canStartSparkSnd(force = false) {
    if (!audioCtx) initAudioCtx();
    if (!isSoundEnabled()) return false;
    if (!sndReady || !sparkBuf || !gainNode) return false;
    if (!force && sndCooldown > 0) return false;
    return true;
  }

  function playSparkSnd(force = false) {
    if (!canStartSparkSnd(force)) return false;
    if (audioCtx!.state === "suspended") {
      void audioCtx!.resume().catch(() => {});
      return false;
    }
    try {
      stopSparkSnd(true);
      const src = audioCtx!.createBufferSource();
      src.buffer = sparkBuf!;
      src.playbackRate.value = 0.75 + Math.random() * 0.5;
      src.connect(gainNode!);
      src.onended = () => {
        if (currentSparkSrc === src) currentSparkSrc = null;
      };
      currentSparkSrc = src;
      src.start(0);
      sndCooldown = 0.25;
      soundKeepAliveUntil = performance.now() + 360;
      return true;
    } catch {
      currentSparkSrc = null;
      return false;
    }
  }

  function primeAudio() {
    initAudioCtx();
    if (audioCtx?.state === "suspended") void audioCtx.resume().catch(() => {});
  }

  (["mousedown", "touchstart", "pointerdown", "mousemove"] as const).forEach(
    (ev) => {
      const h = () => {
        initAudioCtx();
        document.removeEventListener(ev, h);
      };
      document.addEventListener(ev, h);
      primeAudioListeners.push(() => document.removeEventListener(ev, h));
    },
  );

  function init(
    scene: THREE.Scene,
    _camera: THREE.PerspectiveCamera,
    _orbitLines: THREE.Line[],
  ) {
    sceneRef = scene;
    for (let i = 0; i < BOLT_COUNT; i++) bolts.push(makeBolt(scene));
  }

  function stopAll() {
    stopSparkSnd(true);
    bolts.forEach((b) => {
      b.active = false;
      b.life = 0;
      (b.line.material as THREE.LineBasicMaterial).opacity = 0;
      b.glowLines.forEach((g) => {
        (g.line.material as THREE.LineBasicMaterial).opacity = 0;
      });
      b.glowTubes.forEach((t) => {
        t.group.visible = false;
        t.material.opacity = 0;
      });
      b.travelLight.intensity = 0;
    });
    weldCooldown = 0;
  }

  function update(smoothDt: number) {
    sndCooldown -= smoothDt;
    weldCooldown -= smoothDt;

    bolts.forEach((b) => {
      if (!b.active) {
        (b.line.material as THREE.LineBasicMaterial).opacity = 0;
        b.glowLines.forEach((g) => {
          (g.line.material as THREE.LineBasicMaterial).opacity = 0;
        });
        b.glowTubes.forEach((t) => {
          t.group.visible = false;
          t.material.opacity = 0;
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
        b.glowTubes.forEach((t) => {
          t.group.visible = false;
          t.material.opacity = 0;
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
      b.glowTubes.forEach((t) => {
        t.group.visible = true;
        const pulse = 0.9 + Math.random() * 0.1;
        t.material.opacity = t.layer.maxOpacity * fade * flicker * pulse;
      });
      const tIdx = Math.floor((1 - fade) * BOLT_SEGS) * 3;
      b.travelLight.position.set(b.pts[tIdx], b.pts[tIdx + 1], b.pts[tIdx + 2]);
      b.travelLight.intensity = (12 + Math.random() * 8) * fade;
    });

    if (!bolts.some((b) => b.active)) stopSparkSnd();
  }

  function triggerAt(
    hitPoint: THREE.Vector3,
    nearWpts: THREE.Vector3[],
    playSound = true,
  ) {
    if (weldCooldown > 0) return false;
    if (!nearWpts.length) return false;

    const mustStartSoundNow = !!(playSound && isSoundEnabled());
    if (mustStartSoundNow && !canStartSparkSnd(true)) return false;

    bolts.forEach((b) => {
      const tgt = nearWpts[Math.floor(Math.random() * nearWpts.length)]!;
      const outOffset = 0.06 + Math.random() * 0.08;
      const midTarget = {
        x: tgt.x + (Math.random() - 0.5) * 0.04,
        y: tgt.y + (Math.random() - 0.5) * 0.04,
        z: tgt.z + outOffset,
      };
      spawnBolt(b, hitPoint, midTarget);
    });
    const soundPlayed = playSound ? playSparkSnd(true) : false;
    weldCooldown = 0.04 + Math.random() * 0.06;

    return playSound ? soundPlayed || !isSoundEnabled() : true;
  }

  function dispose() {
    primeAudioListeners.forEach((fn) => fn());
    stopSparkSnd(true);
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
      b.glowTubes.forEach((t) => {
        scene.remove(t.group);
        const first = t.segments[0];
        if (first) {
          first.geometry.dispose();
          (first.material as THREE.Material).dispose();
        }
      });
      scene.remove(b.travelLight);
    });
    bolts.length = 0;
    sceneRef = null;
  }

  return {
    init,
    update,
    triggerAt,
    stopAll,
    primeAudio: primeAudio,
    dispose,
  };
}
