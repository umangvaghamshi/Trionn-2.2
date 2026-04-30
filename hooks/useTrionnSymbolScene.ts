"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useTrionnSymbolAudio } from "./useTrionnSymbolAudio";
import { getCanvasManager } from "@/lib/canvasManager";
import { useTransitionReady } from "@/components/Transition";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Particle {
  mesh: THREE.Mesh | THREE.LineSegments;
  explodeDir: THREE.Vector3;
  spinAxis: THREE.Vector3;
  spinSpeed: number;
  delay: number;
  shapeIdx: number;
  isEdge?: boolean;
}

interface Pulse {
  line: number;
  phase: number;
  speed: number;
  len: number;
  active: boolean;
  rest: number;
  dir: number;
}

interface LinePt {
  x: number;
  y: number;
  t: number;
}

interface LineState {
  prog: number;
}

interface Bolt {
  line: THREE.Line;
  pts: Float32Array;
  glowLines: { line: THREE.Line; pts: Float32Array }[];
  travelLight: THREE.PointLight;
  life: number;
  maxLife: number;
  active: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const BOLT_COUNT = 5;
const BOLT_SEGS = 9;
const LINE_SEGS = 80;
const GLOW_COLORS = [0xffffff, 0x88ddff, 0x44aaff, 0x0066ff, 0x00ccff, 0xaaddff, 0x0044cc];
const GLOW_LAYERS = [
  { color: 0x0033cc, maxOpacity: 0.12 },
  { color: 0x3399ff, maxOpacity: 0.25 },
  { color: 0x99ddff, maxOpacity: 0.45 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Shape coordinate helpers
// ─────────────────────────────────────────────────────────────────────────────

const SC = 1.55;
const s = (v: number) => v * SC;

function makeShape(fn: (sh: THREE.Shape) => void): THREE.Shape {
  const sh = new THREE.Shape();
  fn(sh);
  return sh;
}

function buildShapes(): THREE.Shape[] {
  const shape1 = makeShape((sh) => {
    sh.moveTo(s(-0.09044), s(-0.14447));
    sh.bezierCurveTo(s(-0.08141), s(-0.14447), s(-0.07306), s(-0.13959), s(-0.06864), s(-0.1317));
    sh.lineTo(s(-0.00853), s(-0.02454));
    sh.bezierCurveTo(s(0.00082), s(-0.00787), s(-0.01123), s(0.01269), s(-0.03034), s(0.01269));
    sh.lineTo(s(-0.27743), s(0.01269));
    sh.bezierCurveTo(s(-0.29667), s(0.01269), s(-0.3087), s(0.03353), s(-0.29907), s(0.0502));
    sh.lineTo(s(0.06923), s(0.68746));
    sh.bezierCurveTo(s(0.07362), s(0.69507), s(0.0737), s(0.70443), s(0.06943), s(0.71211));
    sh.lineTo(s(0.00872), s(0.82143));
    sh.bezierCurveTo(s(-0.00072), s(0.83841), s(-0.02507), s(0.83862), s(-0.03478), s(0.82179));
    sh.lineTo(s(-0.49507), s(0.02518));
    sh.bezierCurveTo(s(-0.49954), s(0.01745), s(-0.5078), s(0.01269), s(-0.51673), s(0.01269));
    sh.lineTo(s(-0.79147), s(0.01269));
    sh.bezierCurveTo(s(-0.80025), s(0.01269), s(-0.80839), s(0.00809), s(-0.81291), s(0.00056));
    sh.lineTo(s(-0.87726), s(-0.1066));
    sh.bezierCurveTo(s(-0.88726), s(-0.12326), s(-0.87526), s(-0.14447), s(-0.85583), s(-0.14447));
    sh.lineTo(s(-0.09044), s(-0.14447));
    sh.closePath();
  });

  const shape2 = makeShape((sh) => {
    sh.moveTo(s(0.4227), s(0.36965));
    sh.bezierCurveTo(s(0.41824), s(0.37736), s(0.41822), s(0.38685), s(0.42265), s(0.39458));
    sh.lineTo(s(0.56835), s(0.64898));
    sh.bezierCurveTo(s(0.5727), s(0.65657), s(0.57276), s(0.66589), s(0.56851), s(0.67354));
    sh.lineTo(s(0.50776), s(0.78292));
    sh.bezierCurveTo(s(0.49832), s(0.7999), s(0.47397), s(0.80011), s(0.46425), s(0.78329));
    sh.lineTo(s(0.08438), s(0.12619));
    sh.bezierCurveTo(s(0.07992), s(0.11848), s(0.0799), s(0.10897), s(0.08435), s(0.10124));
    sh.lineTo(s(0.14777), s(-0.00924));
    sh.bezierCurveTo(s(0.15738), s(-0.02599), s(0.18156), s(-0.02598), s(0.19115), s(-0.00921));
    sh.lineTo(s(0.30324), s(0.18663));
    sh.bezierCurveTo(s(0.31283), s(0.20338), s(0.33698), s(0.20341), s(0.34661), s(0.18667));
    sh.lineTo(s(0.71438), s(-0.45247));
    sh.bezierCurveTo(s(0.71885), s(-0.46022), s(0.72711), s(-0.465), s(0.73605), s(-0.465));
    sh.lineTo(s(0.86168), s(-0.46501));
    sh.bezierCurveTo(s(0.88092), s(-0.46502), s(0.89296), s(-0.44417), s(0.88332), s(-0.4275));
    sh.lineTo(s(0.4227), s(0.36965));
    sh.closePath();
  });

  const shape3 = makeShape((sh) => {
    sh.moveTo(s(0.18231), s(-0.38702));
    sh.bezierCurveTo(s(0.19185), s(-0.40368), s(0.17981), s(-0.42443), s(0.16061), s(-0.42443));
    sh.lineTo(s(-0.58076), s(-0.42443));
    sh.bezierCurveTo(s(-0.58953), s(-0.42443), s(-0.59767), s(-0.42904), s(-0.60219), s(-0.43656));
    sh.lineTo(s(-0.66654), s(-0.54373));
    sh.bezierCurveTo(s(-0.67655), s(-0.56039), s(-0.66454), s(-0.58159), s(-0.64511), s(-0.58159));
    sh.lineTo(s(0.27978), s(-0.58159));
    sh.bezierCurveTo(s(0.28875), s(-0.58159), s(0.29704), s(-0.5864), s(0.30149), s(-0.5942));
    sh.lineTo(s(0.44612), s(-0.8474));
    sh.bezierCurveTo(s(0.45057), s(-0.85519), s(0.45885), s(-0.86), s(0.46783), s(-0.86));
    sh.lineTo(s(0.59353), s(-0.86));
    sh.bezierCurveTo(s(0.61275), s(-0.86), s(0.62478), s(-0.83921), s(0.61521), s(-0.82255));
    sh.lineTo(s(0.23322), s(-0.15755));
    sh.bezierCurveTo(s(0.22875), s(-0.14978), s(0.22049), s(-0.145), s(0.21154), s(-0.145));
    sh.lineTo(s(0.08701), s(-0.145));
    sh.bezierCurveTo(s(0.06781), s(-0.145), s(0.05577), s(-0.16575), s(0.06531), s(-0.18241));
    sh.lineTo(s(0.18231), s(-0.38702));
    sh.closePath();
  });

  return [shape1, shape2, shape3];
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useTrionnSymbolScene(
  canvasWrapRef: React.RefObject<HTMLDivElement | null>,
  glowCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  s4ElRef: React.RefObject<HTMLDivElement | null>,
  scrollHintRef: React.RefObject<HTMLDivElement | null>,
  vibrateElsRef: React.RefObject<(HTMLElement | null)[]>
) {
  const audio = useTrionnSymbolAudio();

  const stateRef = useRef({
    scrollProgress: 0,
    targetScrollProgress: 0,
    s4Amt: 0,
    targetS4Amt: 0,
    introAmt: 1.0,
    lastScroll: 0,
    lastNorm: 0,
    s4ty: 100,
    rotX: 0.3,
    rotY: 0.4,
    dragging: false,
    px: 0,
    py: 0,
    isHovered: false,
    hoverAmt: 0,
    clickBurst: 0,
    vibrateAmt: 0,
    vibratePhase: 0,
    holding: false,
    holdTime: 0,
    joinPlayed: false,
    mouseX: 0,
    mouseY: 0,
    mouseScreenX: -999,
    mouseScreenY: -999,
    lineTime: 0,
    weldCooldown: 0,
    touchY: 0,
    scene: null as THREE.Scene | null,
    camera: null as THREE.PerspectiveCamera | null,
    renderer: null as THREE.WebGLRenderer | null,
    group: null as THREE.Group | null,
    cubeCamera: null as THREE.CubeCamera | null,
    cubeRT: null as THREE.WebGLCubeRenderTarget | null,
    particles: [] as Particle[],
    p1: null as THREE.PointLight | null,
    p2: null as THREE.PointLight | null,
    bolts: [] as Bolt[],
    lineCanvas: null as HTMLCanvasElement | null,
    lctx: null as CanvasRenderingContext2D | null,
    glowCtx: null as CanvasRenderingContext2D | null,
    lineState: [{ prog: 0 }, { prog: 0 }, { prog: 0 }] as LineState[],
    pulses: [
      { line: 0, phase: 0, speed: 1.4, len: 0.03, active: false, rest: 0.5, dir: 1 },
      { line: 1, phase: 0, speed: 1.3, len: 0.03, active: false, rest: 2.2, dir: 1 },
      { line: 2, phase: 0, speed: 1.35, len: 0.03, active: false, rest: 4.1, dir: 1 },
    ] as Pulse[],
    envReady: false,
    clock: null as THREE.Clock | null,
    hoveredMesh: null as THREE.Object3D | null,
  });

  const transitionReady = useTransitionReady();

  useEffect(() => {
    if (!transitionReady) return;
    const st = stateRef.current;
    const wrap = canvasWrapRef.current;
    const glowCanvas = glowCanvasRef.current as HTMLCanvasElement;
    if (!wrap || !glowCanvas) return;

    // ── Viewport variables ────────────────────────────────────────────────────
    let viewportW = window.innerWidth;
    let viewportH = window.innerHeight;

    function getRenderPixelRatio() {
      const isMobile = viewportW < 768;
      return Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.2);
    }

    // ── Glow canvas ──────────────────────────────────────────────────────────
    glowCanvas.width = viewportW;
    glowCanvas.height = viewportH;
    st.glowCtx = glowCanvas.getContext('2d');

    // ── Line overlay canvas ──────────────────────────────────────────────────
    const lineCanvas = document.createElement('canvas');
    lineCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2;';
    lineCanvas.width = viewportW;
    lineCanvas.height = viewportH;
    wrap.appendChild(lineCanvas);
    st.lineCanvas = lineCanvas;
    st.lctx = lineCanvas.getContext('2d');

    // ── Three.js renderer ────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(viewportW, viewportH);
    renderer.setPixelRatio(getRenderPixelRatio());
    renderer.setClearColor(0x0c0c0c, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    wrap.appendChild(renderer.domElement);
    st.renderer = renderer;

    // ── Scene + Camera ───────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c0c);
    st.scene = scene;

    const getZoom = () => viewportW < 768 ? 9 : viewportW < 1024 ? 7.5 : 6;
    const camera = new THREE.PerspectiveCamera(42, viewportW / viewportH, 0.1, 200);
    camera.position.set(0, 0, getZoom());
    st.camera = camera;

    // ── Lights ───────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x2a3040, 2.8));
    const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(4, 5, 4); scene.add(key);
    const fill = new THREE.DirectionalLight(0x8899aa, 0.8); fill.position.set(-4, 1, -2); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xccddee, 1.5); rim.position.set(0, -3, -5); scene.add(rim);
    const rim2 = new THREE.DirectionalLight(0x8899aa, 1.0); rim2.position.set(-3, 2, 6); scene.add(rim2);
    const top = new THREE.DirectionalLight(0xaabbcc, 1.0); top.position.set(0, 8, 2); scene.add(top);
    const c1 = new THREE.DirectionalLight(0x6677aa, 1.2); c1.position.set(0, 0, -8); scene.add(c1);
    const c2 = new THREE.DirectionalLight(0x6677aa, 1.0); c2.position.set(-8, 0, 0); scene.add(c2);
    const c3 = new THREE.DirectionalLight(0x6677aa, 1.0); c3.position.set(8, 0, 0); scene.add(c3);
    const c4 = new THREE.DirectionalLight(0x6677aa, 1.0); c4.position.set(0, -8, 0); scene.add(c4);
    const p1 = new THREE.PointLight(0xff3300, 12.0, 22); p1.position.set(3, -1, 3); scene.add(p1);
    const p2 = new THREE.PointLight(0xff2200, 9.0, 20); p2.position.set(-3, 2, -2); scene.add(p2);
    const p3 = new THREE.PointLight(0xff5500, 6.0, 14); p3.position.set(0, 4, 3); scene.add(p3);
    st.p1 = p1; st.p2 = p2;

    // ── Background particles ─────────────────────────────────────────────────
    const pGeo = new THREE.BufferGeometry();
    const pArr = new Float32Array(200 * 3);
    for (let i = 0; i < 600; i++) pArr[i] = (Math.random() - 0.5) * 20;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xff3300, size: 0.022, transparent: true, opacity: 0.35 })));

    // ── Env map ──────────────────────────────────────────────────────────────
    const cubeRT = new THREE.WebGLCubeRenderTarget(256, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
    const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRT);
    scene.add(cubeCamera);
    st.cubeCamera = cubeCamera;
    st.cubeRT = cubeRT;

    // ── Material ─────────────────────────────────────────────────────────────
    const metalMat = new THREE.MeshPhysicalMaterial({
      color: 0x3a3d42,
      emissive: new THREE.Color(0x1a2030),
      emissiveIntensity: 0.15,
      metalness: 1.0,
      roughness: 0.08,
      transmission: 0.35,
      ior: 2.4,
      transparent: true,
      opacity: 0.88,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMap: cubeRT.texture,
      envMapIntensity: 3.0,
      side: THREE.DoubleSide,
    });

    // ── Symbol geometry ──────────────────────────────────────────────────────
    const extCfg: THREE.ExtrudeGeometryOptions = {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.006,
      bevelSegments: 1,
    };
    const edgeBright = new THREE.LineBasicMaterial({ color: 0x555555, transparent: true, opacity: 0.08 });
    const edgeRimMat = new THREE.LineBasicMaterial({ color: 0x666666, transparent: true, opacity: 0.05 });

    const group = new THREE.Group();
    group.position.z = -extCfg.depth! / 2;
    st.group = group;

    const particles: Particle[] = [];

    function buildParticles(shape: THREE.Shape, shapeIdx: number) {
      const geo = new THREE.ExtrudeGeometry(shape, extCfg);
      geo.computeBoundingBox();
      const center = new THREE.Vector3();
      geo.boundingBox!.getCenter(center);
      const posArr = geo.attributes.position.array as Float32Array;
      const normArr = geo.attributes.normal.array as Float32Array;
      const totalTris = posArr.length / 9;
      const panelMap: Record<string, { tris: number[]; nx: number; ny: number; nz: number }> = {};
      for (let i = 0; i < totalTris; i++) {
        const ni = i * 9;
        const nx = Math.round(normArr[ni] * 10) / 10;
        const ny = Math.round(normArr[ni + 1] * 10) / 10;
        const nz = Math.round(normArr[ni + 2] * 10) / 10;
        const key = `${nx},${ny},${nz}`;
        if (!panelMap[key]) panelMap[key] = { tris: [], nx, ny, nz };
        panelMap[key].tris.push(i);
      }
      Object.values(panelMap).forEach((panel) => {
        if (!panel.tris.length) return;
        const verts: number[] = [], norms: number[] = [];
        let cx = 0, cy = 0, cz = 0;
        panel.tris.forEach((ti) => {
          const bi = ti * 9;
          for (let j = 0; j < 9; j++) { verts.push(posArr[bi + j]); norms.push(normArr[bi + j]); }
          cx += posArr[bi] + posArr[bi + 3] + posArr[bi + 6];
          cy += posArr[bi + 1] + posArr[bi + 4] + posArr[bi + 7];
          cz += posArr[bi + 2] + posArr[bi + 5] + posArr[bi + 8];
        });
        const cnt = panel.tris.length * 3;
        cx /= cnt; cy /= cnt; cz /= cnt;
        const pg = new THREE.BufferGeometry();
        pg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
        pg.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(norms), 3));
        const mesh = new THREE.Mesh(pg, metalMat.clone());
        const dx = cx - center.x, dy = cy - center.y, dz = cz - center.z;
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        const explodeDir = new THREE.Vector3(
          dx / len * 0.6 + panel.nx * 0.4,
          dy / len * 0.6 + panel.ny * 0.4,
          dz / len * 0.6 + panel.nz * 0.4
        ).normalize();
        const spinAxis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        const spinSpeed = (Math.random() - 0.5) * 0.8;
        const delay = Math.random() * 0.25;
        group.add(mesh);
        particles.push({ mesh, explodeDir, spinAxis, spinSpeed, delay, shapeIdx });
      });
      const edges = new THREE.EdgesGeometry(geo, 8);
      const el1 = new THREE.LineSegments(edges, edgeBright);
      group.add(el1);
      particles.push({ mesh: el1, explodeDir: new THREE.Vector3(0, 0, 0), spinAxis: new THREE.Vector3(0, 1, 0), spinSpeed: 0, delay: 0, shapeIdx, isEdge: true });
      const r2 = new THREE.LineSegments(edges, edgeRimMat);
      r2.scale.set(1.004, 1.004, 1.004);
      group.add(r2);
      particles.push({ mesh: r2, explodeDir: new THREE.Vector3(0, 0, 0), spinAxis: new THREE.Vector3(0, 1, 0), spinSpeed: 0, delay: 0, shapeIdx, isEdge: true });
    }

    buildShapes().forEach((shape, i) => buildParticles(shape, i));
    st.particles = particles;
    scene.add(group);

    // ── WeldFX bolts ─────────────────────────────────────────────────────────
    function makeGlowLine(color: number): { line: THREE.Line; pts: Float32Array } {
      const pts = new Float32Array((BOLT_SEGS + 1) * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
      geo.setDrawRange(0, BOLT_SEGS + 1);
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0, depthTest: false, depthWrite: false });
      const line = new THREE.Line(geo, mat);
      line.renderOrder = 998;
      scene.add(line);
      return { line, pts };
    }

    function makeBolt(): Bolt {
      const pts = new Float32Array((BOLT_SEGS + 1) * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
      geo.setDrawRange(0, BOLT_SEGS + 1);
      const mat = new THREE.LineBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0, depthTest: false, depthWrite: false });
      const line = new THREE.Line(geo, mat);
      line.renderOrder = 999;
      scene.add(line);
      const glowLines = GLOW_LAYERS.map((g) => makeGlowLine(g.color));
      const travelLight = new THREE.PointLight(0xaaccff, 0, 14);
      scene.add(travelLight);
      return { line, pts, glowLines, travelLight, life: 0, maxLife: 0, active: false };
    }

    for (let i = 0; i < BOLT_COUNT; i++) st.bolts.push(makeBolt());

    // ── Spark & hover beep audio ─────────────────────────────────────────────
    audio.initSparkAudio();
    audio.initHoverAudio();

    // ── Attachment points for 2D lines ───────────────────────────────────────
    const attachLeft = new THREE.Vector3(-0.59, 0.10, 0.21);
    const attachBottom = new THREE.Vector3(0.28, -0.85, 0.21);
    const attachRight = new THREE.Vector3(0.54, 0.48, 0.21);

    const _tv = new THREE.Vector3();
    function projectToScreen(localPt: THREE.Vector3): { x: number; y: number; worldZ: number } {
      _tv.copy(localPt).applyMatrix4(group.matrixWorld);
      const worldZ = _tv.z;
      _tv.project(camera);
      return {
        x: (_tv.x + 1) / 2 * lineCanvas.width,
        y: (-_tv.y + 1) / 2 * lineCanvas.height,
        worldZ,
      };
    }

    // ── Bolt spawn ───────────────────────────────────────────────────────────
    function spawnBolt(bolt: Bolt, origin: THREE.Vector3Like, target: THREE.Vector3Like) {
      const dx = target.x - origin.x, dy = target.y - origin.y, dz = target.z - origin.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;
      bolt.pts[0] = origin.x; bolt.pts[1] = origin.y; bolt.pts[2] = origin.z;
      const perpX = -dy / dist, perpY = dx / dist;
      const outDir = Math.random() > 0.5 ? 1 : -1;
      for (let i = 1; i <= BOLT_SEGS; i++) {
        const t = i / BOLT_SEGS;
        const jAmt = Math.min(dist * 0.40, 0.12) * Math.sin(t * Math.PI);
        const outAmt = Math.min(dist * 0.18, 0.06) * Math.sin(t * Math.PI) * outDir;
        bolt.pts[i * 3] = origin.x + dx * t + (Math.random() - 0.5) * jAmt + perpX * outAmt;
        bolt.pts[i * 3 + 1] = origin.y + dy * t + (Math.random() - 0.5) * jAmt + perpY * outAmt;
        bolt.pts[i * 3 + 2] = origin.z + dz * t + (Math.random() - 0.5) * jAmt * 0.3;
      }
      bolt.pts[BOLT_SEGS * 3] = target.x;
      bolt.pts[BOLT_SEGS * 3 + 1] = target.y;
      bolt.pts[BOLT_SEGS * 3 + 2] = target.z;
      bolt.line.geometry.attributes.position.array.set(bolt.pts);
      bolt.line.geometry.attributes.position.needsUpdate = true;
      (bolt.line.material as THREE.LineBasicMaterial).color.setHex(GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)]);
      bolt.glowLines.forEach((g) => {
        g.line.geometry.attributes.position.array.set(bolt.pts);
        g.line.geometry.attributes.position.needsUpdate = true;
      });
      bolt.maxLife = 0.05 + Math.random() * 0.09;
      bolt.life = bolt.maxLife;
      bolt.active = true;
    }

    // ── 2D glow draw ─────────────────────────────────────────────────────────
    function drawGlow() {
      const gCtx = st.glowCtx;
      if (!gCtx) return;
      const gW = glowCanvas.width, gH = glowCanvas.height;
      gCtx.clearRect(0, 0, gW, gH);
      st.bolts.forEach((b) => {
        if (!b.active || b.life <= 0) return;
        const fade = b.life / b.maxLife;
        const screenPts: { x: number; y: number }[] = [];
        for (let i = 0; i <= BOLT_SEGS; i++) {
          const v = new THREE.Vector3(b.pts[i * 3], b.pts[i * 3 + 1], b.pts[i * 3 + 2]).project(camera);
          screenPts.push({ x: (v.x * 0.5 + 0.5) * gW, y: (-v.y * 0.5 + 0.5) * gH });
        }
        if (screenPts.length < 2) return;
        const layers = [
          { blur: '8px', color: `rgba(40,120,255,${0.18 * fade})`, lw: 6 },
          { blur: '4px', color: `rgba(100,180,255,${0.30 * fade})`, lw: 3 },
          { blur: '1.5px', color: `rgba(200,230,255,${0.55 * fade})`, lw: 1.5 },
        ];
        layers.forEach(({ blur, color, lw }) => {
          gCtx.save();
          gCtx.filter = `blur(${blur})`;
          gCtx.strokeStyle = color;
          gCtx.lineWidth = lw;
          gCtx.beginPath();
          gCtx.moveTo(screenPts[0].x, screenPts[0].y);
          screenPts.slice(1).forEach((p) => gCtx.lineTo(p.x, p.y));
          gCtx.stroke();
          gCtx.restore();
        });
      });
    }

    // ── Mouse near line helper ────────────────────────────────────────────────
    function mouseNearLine(pts: LinePt[], threshPx: number): { x: number; y: number } | null {
      const mx = st.mouseScreenX, my = st.mouseScreenY;
      for (let i = 0; i < pts.length - 1; i++) {
        const ax = pts[i].x, ay = pts[i].y, bx = pts[i + 1].x, by = pts[i + 1].y;
        const dx = bx - ax, dy = by - ay;
        const lenSq = dx * dx + dy * dy;
        if (lenSq < 0.001) continue;
        const t = Math.max(0, Math.min(1, ((mx - ax) * dx + (my - ay) * dy) / lenSq));
        const nx = ax + t * dx - mx, ny = ay + t * dy - my;
        if (nx * nx + ny * ny < threshPx * threshPx) return { x: ax + t * dx, y: ay + t * dy };
      }
      return null;
    }

    // ── Build wobbly bezier line points ──────────────────────────────────────
    function buildTwoSegPts(x1: number, y1: number, mx: number, my: number, x3: number, y3: number, seed: number): LinePt[] {
      const cx = 2 * mx - 0.5 * x1 - 0.5 * x3;
      const cy = 2 * my - 0.5 * y1 - 0.5 * y3;
      const SEGS = LINE_SEGS * 2;
      const pts: LinePt[] = [];
      const totalLen = Math.sqrt((x3 - x1) ** 2 + (y3 - y1) ** 2) || 1;
      for (let i = 0; i <= SEGS; i++) {
        const t = i / SEGS;
        const mt = 1 - t;
        const bx = mt * mt * x1 + 2 * mt * t * cx + t * t * x3;
        const by = mt * mt * y1 + 2 * mt * t * cy + t * t * y3;
        const tx2 = 2 * (1 - t) * (cx - x1) + 2 * t * (x3 - cx);
        const ty2 = 2 * (1 - t) * (cy - y1) + 2 * t * (y3 - cy);
        const tlen = Math.sqrt(tx2 * tx2 + ty2 * ty2) || 1;
        const nx = -ty2 / tlen, ny = tx2 / tlen;
        const wave = Math.sin(st.lineTime * 0.38 + seed * 2.1 + t * Math.PI * 1.1) * 0.75
          + Math.sin(st.lineTime * 0.19 + seed * 0.9 + t * Math.PI * 1.9) * 0.25;
        const env = Math.sin(t * Math.PI);
        const jitter = wave * env * (totalLen * 0.010);
        pts.push({ x: bx + nx * jitter, y: by + ny * jitter, t });
      }
      return pts;
    }

    // ── Draw a single animated line ───────────────────────────────────────────
    function drawLine(
      ctx: CanvasRenderingContext2D,
      pts: LinePt[],
      baseAlpha: number,
      vis: number,
      drawProg: number,
      undrawProg: number,
      symCx: number,
      symCy: number,
      symR: number
    ) {
      if (pts.length < 2) return;
      const n = pts.length;
      const mid = Math.floor(n / 2);
      const half = Math.round(drawProg * (n / 2));
      const undrawnH = Math.round(undrawProg * (n / 2));
      const leftStart = Math.max(0, mid - half + undrawnH);
      const leftEnd = mid;
      const rightStart = mid;
      const rightEnd = Math.min(n - 1, mid + half - undrawnH);

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 0.85;
      ctx.strokeStyle = 'rgba(58,70,88,1)';

      function drawSegs(indices: number[]) {
        for (let s2 = 0; s2 < indices.length - 1; s2++) {
          const p = pts[indices[s2]];
          const dx = p.x - symCx, dy = p.y - symCy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const overlap = Math.max(0, 1 - dist / symR);
          ctx.globalAlpha = baseAlpha * (1 - overlap * 0.65) * vis;
          ctx.beginPath();
          ctx.moveTo(pts[indices[s2]].x, pts[indices[s2]].y);
          ctx.lineTo(pts[indices[s2 + 1]].x, pts[indices[s2 + 1]].y);
          ctx.stroke();
        }
      }

      if (leftStart < leftEnd) {
        const idx: number[] = [];
        for (let i = leftEnd; i >= leftStart; i--) idx.push(i);
        drawSegs(idx);
      }
      if (rightStart < rightEnd) {
        const idx: number[] = [];
        for (let i = rightStart; i <= rightEnd; i++) idx.push(i);
        drawSegs(idx);
      }
      ctx.restore();
    }

    // ── Draw electric pulse ───────────────────────────────────────────────────
    function drawPulse(ctx: CanvasRenderingContext2D, pts: LinePt[], phase: number, pulseLen: number, vis: number) {
      if (pts.length < 2) return;
      const TOTAL = pulseLen * 1.4;
      const allPts: { p: LinePt; tRatio: number }[] = [];
      for (let i = 0; i < pts.length; i++) {
        const dist = phase - pts[i].t;
        if (dist >= 0 && dist < TOTAL) allPts.push({ p: pts[i], tRatio: dist / TOTAL });
      }
      if (allPts.length < 2) return;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let i = 0; i < allPts.length - 1; i++) {
        const t = allPts[i].tRatio;
        const env = Math.pow(1 - t, 0.5);
        let r: number, g: number, b: number;
        if (t < 0.45) {
          const f = t / 0.45;
          r = 255; g = Math.round(130 * (1 - f * 0.7)); b = 0;
        } else {
          const f = Math.min(1, (t - 0.45) / 0.55);
          r = Math.round(140 * (1 - f)); g = Math.round(150 + 50 * (1 - f)); b = 255;
        }
        ctx.beginPath();
        ctx.moveTo(allPts[i].p.x, allPts[i].p.y);
        ctx.lineTo(allPts[i + 1].p.x, allPts[i + 1].p.y);
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = `rgb(${r},${g},${b})`;
        ctx.globalAlpha = env * 0.95 * vis;
        ctx.stroke();
      }
      ctx.restore();
    }

    // ── Draw all 2D overlay lines ─────────────────────────────────────────────
    function drawLines() {
      const lctx = st.lctx;
      if (!lctx || !lineCanvas) return;
      lctx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
      st.lineTime += 0.016;

      const lineNorm = st.lastScroll / viewportH;
      const undrawAmt = Math.max(0, Math.min(1, (lineNorm - 0.08) / 0.20));
      if (undrawAmt >= 1.0) return;

      const dotsVis = undrawAmt < 0.95 ? 1.0 : Math.max(0, 1 - (undrawAmt - 0.95) / 0.05);
      const inS1 = lineNorm < 0.08;

      st.lineState.forEach((s2) => {
        if (undrawAmt >= 1.0) {
          s2.prog = 0;
        } else if (s2.prog < 1 && undrawAmt < 0.1 && st.introAmt < 0.25) {
          s2.prog = Math.min(1, s2.prog + 0.014);
        }
      });

      const al = projectToScreen(attachLeft);
      const ab = projectToScreen(attachBottom);
      const ar = projectToScreen(attachRight);
      const CW = lineCanvas.width, CH = lineCanvas.height;
      const symCenter2 = projectToScreen(new THREE.Vector3(0, 0, 0));
      const symScreenR = CW * 0.13;
      const originL = { x: 0, y: CH * 1.0 };

      const ptsL = buildTwoSegPts(originL.x, originL.y - CH * 0.150, al.x, al.y, CW, CH * 0.20, 1.0);
      const ptsR = buildTwoSegPts(originL.x, originL.y + CH * 0.130, ar.x, ar.y, CW, CH * 0.10, 3.0);
      const ptsB = buildTwoSegPts(originL.x, originL.y - CH * 0.070, ab.x, ab.y, CW, -CH * 0.065, 2.0);

      // Weld FX proximity trigger (only after connector lines finish intro draw)
      st.weldCooldown -= 0.016;
      const linesFullyDrawn =
        st.lineState[0].prog >= 1 && st.lineState[1].prog >= 1 && st.lineState[2].prog >= 1;
      if (inS1 && st.weldCooldown <= 0 && linesFullyDrawn) {
        const allLinePts = [ptsL, ptsR, ptsB];
        let hitResult: { x: number; y: number } | null = null;
        let hitLineIdx = -1;
        for (let li = 0; li < allLinePts.length; li++) {
          const h = mouseNearLine(allLinePts[li], 14);
          if (h) { hitResult = h; hitLineIdx = li; break; }
        }
        if (hitResult !== null) {
          function unproj2(sx: number, sy: number): THREE.Vector3 {
            const nx = (sx / CW) * 2 - 1, ny = -(sy / CH) * 2 + 1;
            const v = new THREE.Vector3(nx, ny, 0.5).unproject(camera);
            const d = v.sub(camera.position).normalize();
            return camera.position.clone().add(d.multiplyScalar(-camera.position.z / d.z));
          }
          const wp = unproj2(hitResult.x, hitResult.y);
          const otherIdxs = [0, 1, 2].filter((i) => i !== hitLineIdx);
          const count = Math.random() > 0.5 ? 1 : 2;
          const targetIdxs = otherIdxs.sort(() => Math.random() - 0.5).slice(0, count);
          const nearWpts: THREE.Vector3[] = [];
          targetIdxs.forEach((li) => {
            const pts = allLinePts[li];
            let bestD = Infinity, bestPt: LinePt | null = null;
            for (let i = 0; i < pts.length; i++) {
              const ddx = pts[i].x - hitResult!.x, ddy = pts[i].y - hitResult!.y;
              const dd = ddx * ddx + ddy * ddy;
              if (dd < bestD) { bestD = dd; bestPt = pts[i]; }
            }
            if (bestPt) nearWpts.push(unproj2(bestPt.x, bestPt.y));
          });
          if (nearWpts.length > 0) {
            triggerWeld(wp, nearWpts);
            st.weldCooldown = 0.05 + Math.random() * 0.08;
          }
        }
      }

      drawLine(lctx, ptsL, 0.40, 1, st.lineState[0].prog, undrawAmt, symCenter2.x, symCenter2.y, symScreenR);
      drawLine(lctx, ptsR, 0.40, 1, st.lineState[1].prog, undrawAmt, symCenter2.x, symCenter2.y, symScreenR);
      drawLine(lctx, ptsB, 0.40, 1, st.lineState[2].prog, undrawAmt, symCenter2.x, symCenter2.y, symScreenR);

      const lineMap = [ptsL, ptsR, ptsB];
      st.pulses.forEach((pulse, idx) => {
        if (!pulse.active) {
          pulse.rest -= 0.016;
          if (pulse.rest <= 0) {
            pulse.active = true;
            pulse.dir = Math.random() > 0.5 ? 1 : -1;
            pulse.phase = pulse.dir === 1 ? -pulse.len : 1.0 + pulse.len;
          }
        } else {
          pulse.phase += pulse.dir * pulse.speed * 0.016;
          if (pulse.dir === 1) pulse.phase = Math.min(pulse.phase, 0.5 + pulse.len);
          if (pulse.dir === -1) pulse.phase = Math.max(pulse.phase, 0.5 - pulse.len);
          const reachedMid = pulse.dir === 1 ? pulse.phase >= 0.5 + pulse.len : pulse.phase <= 0.5 - pulse.len;
          if (reachedMid) {
            pulse.active = false;
            pulse.rest = 1.5 + Math.abs(Math.sin(st.lineTime * 7.3 + idx * 3.1)) * 2.5;
          }
          const pts = lineMap[pulse.line];
          if (pulse.dir === -1) {
            const mirroredPhase = 1.0 - pulse.phase;
            const reversedPts = [...pts].reverse().map((p, i2) => ({ ...p, t: i2 / (pts.length - 1) }));
            drawPulse(lctx, reversedPts, mirroredPhase, pulse.len, 1);
          } else {
            drawPulse(lctx, pts, pulse.phase, pulse.len, 1);
          }
        }
      });

      if (dotsVis > 0.01) {
        const now = performance.now() / 1000;
        function pulseArrivalGlow(lineIdx: number): number {
          const p = st.pulses[lineIdx];
          if (!p.active) return 0;
          const dist = p.dir === 1 ? Math.max(0, 0.5 - (p.phase - p.len)) : Math.max(0, (p.phase + p.len) - 0.5);
          return Math.max(0, 1 - dist / 0.18);
        }
        const midL = ptsL[Math.floor(ptsL.length / 2)];
        const midR = ptsR[Math.floor(ptsR.length / 2)];
        const midB = ptsB[Math.floor(ptsB.length / 2)];
        [
          { p: midL, seed: 1.0, li: 0, ap: al },
          { p: midR, seed: 2.3, li: 1, ap: ar },
          { p: midB, seed: 3.7, li: 2, ap: ab },
        ].forEach(({ p, seed, li, ap }) => {
          const arrival = pulseArrivalGlow(li);
          const slowPulse = (Math.sin(now * 1.8 + seed * 2.1) + 1) / 2;
          const depthFade = Math.max(0.15, Math.min(1, ap.worldZ * 1.5 + 0.6));
          const dv = dotsVis * depthFade;

          lctx.save();
          lctx.globalAlpha = (0.65 + arrival * 0.25) * dv;
          lctx.fillStyle = arrival > 0.3 ? 'rgba(210,200,190,1)' : 'rgba(170,170,170,1)';
          lctx.beginPath();
          lctx.arc(p.x, p.y, 1.8 + arrival * 0.6, 0, Math.PI * 2);
          lctx.fill();
          lctx.restore();

          const ringBase = 4 + slowPulse * 3;
          const ringBoost = arrival * 10;
          const ringR = ringBase + ringBoost;
          const ringA = arrival > 0.05 ? (0.12 + arrival * 0.25) * dv : (1 - slowPulse) * 0.18 * dv;

          lctx.save();
          lctx.globalAlpha = ringA * 0.18 * dv;
          lctx.strokeStyle = 'rgba(180,190,200,1)';
          lctx.lineWidth = 1.5;
          lctx.beginPath();
          lctx.arc(p.x, p.y, ringR + 1, 0, Math.PI * 2);
          lctx.stroke();
          lctx.globalAlpha = ringA * 0.6 * dv;
          lctx.strokeStyle = 'rgba(170,170,170,1)';
          lctx.lineWidth = 0.6;
          lctx.beginPath();
          lctx.arc(p.x, p.y, ringR, 0, Math.PI * 2);
          lctx.stroke();
          lctx.restore();
        });
      }
    }

    // ── Weld trigger ──────────────────────────────────────────────────────────
    function triggerWeld(hitPoint: THREE.Vector3, nearWpts: THREE.Vector3[]) {
      if (st.weldCooldown > 0) return;
      st.bolts.forEach((b) => {
        const tgt = nearWpts[Math.floor(Math.random() * nearWpts.length)];
        const midTarget = {
          x: tgt.x + (Math.random() - 0.5) * 0.04,
          y: tgt.y + (Math.random() - 0.5) * 0.04,
          z: tgt.z + 0.06 + Math.random() * 0.08,
        };
        spawnBolt(b, hitPoint, midTarget);
      });
      audio.playSparkSound();
    }

    // ── Update bolt lifetimes ─────────────────────────────────────────────────
    function updateBolts(smoothDt: number) {
      audio.sparkCooldownRef.current -= smoothDt;
      st.bolts.forEach((b) => {
        if (!b.active) {
          (b.line.material as THREE.LineBasicMaterial).opacity = 0;
          b.glowLines.forEach((g) => { (g.line.material as THREE.LineBasicMaterial).opacity = 0; });
          b.travelLight.intensity = 0;
          return;
        }
        b.life -= smoothDt;
        if (b.life <= 0) {
          b.active = false;
          (b.line.material as THREE.LineBasicMaterial).opacity = 0;
          b.glowLines.forEach((g) => { (g.line.material as THREE.LineBasicMaterial).opacity = 0; });
          b.travelLight.intensity = 0;
          return;
        }
        const fade = b.life / b.maxLife;
        const flicker = 0.7 + Math.random() * 0.3;
        (b.line.material as THREE.LineBasicMaterial).opacity = fade * flicker;
        b.glowLines.forEach((g, gi) => {
          (g.line.material as THREE.LineBasicMaterial).opacity = GLOW_LAYERS[gi].maxOpacity * fade * flicker;
        });
        const tIdx = Math.floor((1 - fade) * BOLT_SEGS) * 3;
        b.travelLight.position.set(b.pts[tIdx], b.pts[tIdx + 1], b.pts[tIdx + 2]);
        b.travelLight.intensity = (8.0 + Math.random() * 6.0) * fade;
      });
      drawGlow();
    }

    // ── Raycaster ────────────────────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const symCenter3D = new THREE.Vector3(0, 0, 0);
    const clock = new THREE.Clock();
    st.clock = clock;
    let frameCount = 0; // used to throttle cubeCamera updates

    // ── Animation loop ────────────────────────────────────────────────────────
    function animate(_ts?: number) {

      const t = clock.getElapsedTime();

      // Smooth scroll state — read smoothed scroll to stay in sync with ScrollSmoother
      const scroll = ScrollSmoother.get()?.scrollTop() ?? window.scrollY;
      st.lastScroll = scroll;
      const norm = scroll / viewportH;
      st.lastNorm = norm;

      if (norm <= 0.10) st.targetScrollProgress = 0;
      else if (norm <= 1.0) st.targetScrollProgress = Math.max(0, (norm - 0.10) * (1 / 0.90));
      else if (norm <= 1.2) st.targetScrollProgress = 1;
      else if (norm <= 1.8) st.targetScrollProgress = Math.max(0, (1.8 - norm) / 0.6);
      else st.targetScrollProgress = 0;

      const s4SlideProgress = Math.max(0, Math.min(1, (norm - 2.0) / 0.8));
      const ty = (1 - s4SlideProgress) * 100;
      if (s4ElRef.current) s4ElRef.current.style.transform = `translateY(${ty}vh)`;
      st.s4ty = ty;

      st.scrollProgress += (st.targetScrollProgress - st.scrollProgress) * 0.06;
      st.s4Amt += (st.targetS4Amt - st.s4Amt) * 0.05;
      st.targetS4Amt = 0;

      if (st.introAmt > 0.001) st.introAmt *= 0.975; else st.introAmt = 0;

      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = norm > 0.05 ? '0' : '1';
      }

      // Auto-rotate
      mouse.x = st.mouseX;
      mouse.y = st.mouseY;
      if (!st.dragging) {
        st.rotY += 0.005;
        st.rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, st.rotX));
        group.rotation.x += (st.rotX + mouse.y * 0.22 - group.rotation.x) * 0.06;
        group.rotation.y += (st.rotY + mouse.x * 0.22 - group.rotation.y) * 0.06;
      } else {
        group.rotation.x = st.rotX;
        group.rotation.y = st.rotY;
      }

      // Hover flash via raycast — only when symbol is near assembled
      if (st.scrollProgress < 0.08 && st.clickBurst < 0.05 && st.introAmt < 0.08) {
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(particles.filter((p) => !p.isEdge).map((p) => p.mesh as THREE.Mesh), false);
        const nowHit = hits.length > 0 ? hits[0].object : null;
        if (nowHit !== st.hoveredMesh) {
          if (nowHit) {
            (nowHit as THREE.Mesh & { _flash?: number })._flash = 1.0;
            audio.playHoverBeep();
          }
          st.hoveredMesh = nowHit;
        }
      } else {
        st.hoveredMesh = null;
      }
      particles.forEach((p) => {
        if (p.isEdge) return;
        const mat = (p.mesh as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
        const m = p.mesh as THREE.Mesh & { _flash?: number };
        if (m._flash === undefined) m._flash = 0;
        m._flash! *= 0.94;
        if (m._flash! < 0.002) m._flash = 0;
        const f = m._flash!;
        mat.envMapIntensity = 3.0 + f * 2.0;
        mat.roughness = 0.08 - f * 0.08;
        mat.clearcoatRoughness = 0.05 - f * 0.05;
        mat.emissiveIntensity = 0.15 + f * 0.15;
        mat.transmission = 0.35 + f * 0.50;
        mat.opacity = 0.88 - f * 0.25;
      });

      // Proximity hover
      const projected = symCenter3D.clone().project(camera);
      const dd = Math.sqrt((mouse.x - projected.x) ** 2 + (mouse.y - projected.y) ** 2);
      st.isHovered = dd < 0.0 && st.scrollProgress < 0.05;
      st.hoverAmt += ((st.isHovered ? 1 : 0) - st.hoverAmt) * (st.isHovered ? 0.07 : 0.05);

      // Vibrate
      const vibrateEls = (vibrateElsRef.current ?? []).filter(Boolean) as HTMLElement[];
      st.vibratePhase += 1.1;
      if (st.vibrateAmt > 0.01) {
        const sx = Math.sin(st.vibratePhase) * st.vibrateAmt * 2.5;
        const sy = Math.cos(st.vibratePhase * 1.3) * st.vibrateAmt * 1.5;
        if (st.holding && st.holdTime < 0.7) {
          vibrateEls.forEach((el) => {
            el.style.transition = 'none';
            el.style.transform = `translate(${sx}px,${sy}px)`;
          });
        }
      }

      // Orbit
      if (st.clickBurst > 0.01 && st.holdTime >= 0.7) {
        const orbitT = t * 0.8;
        vibrateEls.forEach((el, i) => {
          const phase = i * (Math.PI * 2 / vibrateEls.length);
          const rx = Math.sin(orbitT + phase) * st.clickBurst * 25;
          const ry = Math.cos(orbitT * 0.7 + phase) * st.clickBurst * 20;
          const rz = Math.sin(orbitT * 0.5 + phase * 1.3) * st.clickBurst * 15;
          const tx2 = Math.sin(orbitT + phase) * st.clickBurst * 30;
          const ty2 = Math.cos(orbitT * 0.6 + phase) * st.clickBurst * 20;
          el.style.transition = 'none';
          el.style.transform = `perspective(600px) translate(${tx2}px,${ty2}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
        });
      } else if (!st.holding && st.clickBurst <= 0.01) {
        vibrateEls.forEach((el) => {
          el.style.transition = 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)';
          el.style.transform = 'perspective(600px) translate(0px,0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
        });
      }

      // Hold logic
      if (st.holding) {
        st.holdTime += 1 / 60;
        st.vibrateAmt = 1.0;
        if (st.holdTime < 0.5) {
          st.clickBurst = 0;
        } else {
          if (st.clickBurst === 0) { audio.stopVibrateSound(); audio.playExplodeSound(); audio.startWooshSound(); }
          st.vibrateAmt *= 0.88;
          st.clickBurst = Math.min(1.0, st.clickBurst + 0.02);
        }
      } else {
        st.vibrateAmt = Math.max(0, st.vibrateAmt - 0.08);
        st.clickBurst = Math.max(0, st.clickBurst - 0.025);
      }

      const explodeAmt = Math.max(st.scrollProgress, st.hoverAmt, st.clickBurst, st.introAmt);

      // Particle positions
      particles.forEach((p) => {
        const amt = Math.max(0, explodeAmt - p.delay);
        const burst = amt * 5.5;
        const phase = p.shapeIdx * (Math.PI * 2 / 3);
        const armDriftX = Math.sin(t * 0.4 + phase) * 0.012 * (1 - explodeAmt);
        const armDriftY = Math.cos(t * 0.35 + phase) * 0.008 * (1 - explodeAmt);
        const armDriftZ = Math.sin(t * 0.3 + phase * 1.5) * 0.006 * (1 - explodeAmt);
        const mouseOffX = mouse.y * 0.008 * Math.cos(phase);
        const mouseOffY = mouse.x * 0.008 * Math.sin(phase);
        const s4Dirs: [number, number, number][] = [[-6, 3, 0], [6, 3, 0], [0, -6, 0]];
        const sd = s4Dirs[p.shapeIdx] || [0, 0, 0];
        const vAmp = st.vibrateAmt * 0.018 * (1 - st.clickBurst);
        const vOff = Math.sin(st.vibratePhase + p.delay * 20) * vAmp;
        const vOffY = Math.cos(st.vibratePhase * 1.3 + p.shapeIdx * 2) * vAmp;
        p.mesh.position.set(
          p.explodeDir.x * burst * (1 - st.s4Amt) + armDriftX * (1 - st.s4Amt) + mouseOffX + sd[0] * st.s4Amt + vOff,
          p.explodeDir.y * burst * (1 - st.s4Amt) + armDriftY * (1 - st.s4Amt) + mouseOffY + sd[1] * st.s4Amt + vOffY,
          p.explodeDir.z * burst * (1 - st.s4Amt) + armDriftZ * (1 - st.s4Amt) + sd[2] * st.s4Amt
        );
        p.mesh.rotation.x = p.spinAxis.x * p.spinSpeed * amt * Math.PI;
        p.mesh.rotation.y = p.spinAxis.y * p.spinSpeed * amt * Math.PI;
        p.mesh.rotation.z = p.spinAxis.z * p.spinSpeed * amt * Math.PI;
      });

      // Orbiting lights
      if (st.p1) {
        st.p1.position.x = Math.sin(t * 0.6) * 4;
        st.p1.position.y = Math.cos(t * 0.4) * 2;
        st.p1.position.z = Math.cos(t * 0.5) * 3 + 2;
      }
      if (st.p2) {
        st.p2.position.x = Math.cos(t * 0.5) * 4;
        st.p2.position.y = Math.sin(t * 0.7) * 2;
        st.p2.position.z = Math.sin(t * 0.3) * 3 - 1;
      }

      // Env map update — throttled to every 6 frames, only when something is moving
      group.visible = false;
      if (!st.envReady) { cubeCamera.update(renderer, scene); st.envReady = true; }
      else if ((frameCount++ % 6) === 0 && (st.introAmt > 0.01 || st.clickBurst > 0.01 || st.scrollProgress > 0.01 || st.dragging)) {
        cubeCamera.update(renderer, scene);
      }
      group.visible = true;

      renderer.render(scene, camera);
      drawLines();
      updateBolts(0.016);

      // Woosh volume
      if (audio.soundEnabledRef.current && audio.audioCtxRef.current) {
        const s4Prog = st.s4ty < 80 ? Math.max(0, Math.min(1, (80 - st.s4ty) / 80)) : 0;
        const targetVol = s4Prog > 0 ? 0.07 * (1 - s4Prog) : 0.07 + 0.93 * Math.max(st.scrollProgress, st.clickBurst);
        if (!audio.wooshGainRef.current || !audio.wooshNodeRef.current) {
          if (targetVol > 0.01 && audio.wooshAutoStartedRef.current) audio.autoStartWoosh();
        } else {
          const curVol = audio.wooshGainRef.current.gain.value;
          const smoothed = curVol + (targetVol - curVol) * 0.05;
          audio.wooshGainRef.current.gain.setValueAtTime(smoothed, audio.audioCtxRef.current.currentTime);
        }
      }
    }

    // Register with global canvas manager. The hero canvas is always in view on
    // load; the manager handles tab-visibility pausing automatically.
    const manager = getCanvasManager();
    const loopId = manager.register(animate, true);

    // Pause when the hero section scrolls entirely out of view.
    const heroIo = new IntersectionObserver(
      ([entry]) => manager.setActive(loopId, entry.isIntersecting),
      { root: null, threshold: 0, rootMargin: "0px" },
    );
    heroIo.observe(wrap);

    // ── Event listeners ───────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      st.mouseX = (e.clientX / viewportW) * 2 - 1;
      st.mouseY = -(e.clientY / viewportH) * 2 + 1;
      st.mouseScreenX = e.clientX;
      st.mouseScreenY = e.clientY;
      if (st.dragging) {
        st.rotY += (e.clientX - st.px) * 0.025;
        st.rotX += (e.clientY - st.py) * 0.025;
        st.rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, st.rotX));
        st.px = e.clientX; st.py = e.clientY;
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    const onCanvasMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      st.dragging = true; st.px = e.clientX; st.py = e.clientY;
    };
    renderer.domElement.addEventListener('mousedown', onCanvasMouseDown);
    renderer.domElement.addEventListener('contextmenu', (e: Event) => e.preventDefault());

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;

      const isInHero = !!target.closest('#hero-section');
      const isInKeyFacts = !!target.closest('#keyfacts-section');
      const isSoundToggle = !!(target.id === 'sound-toggle' || target.closest('#sound-toggle'));
      const isLink = !!(target.tagName === 'A' || target.closest('a'));
      const isButton = !!(target.tagName === 'BUTTON' || target.closest('button'));

      // Boundary Check: Only allow interaction if clicked within Hero AND NOT in KeyFacts or UI elements.
      if (!isInHero || isInKeyFacts || isSoundToggle || isLink || isButton) return;

      if (st.scrollProgress < 0.15) {
        st.holding = true; st.holdTime = 0; st.vibrateAmt = 1.0;
        st.vibratePhase = 0; st.clickBurst = 0; st.joinPlayed = false;
        audio.startVibrateSound();
      }
    };
    window.addEventListener('mousedown', onMouseDown);

    const onMouseUp = () => {
      st.dragging = false;
      st.holding = false;
      st.vibrateAmt = 0;
      const vibrateEls = (vibrateElsRef.current ?? []).filter(Boolean) as HTMLElement[];
      vibrateEls.forEach((el) => {
        el.style.transition = 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
        el.style.transform = 'translate(0px,0px) rotate(0deg)';
      });
      audio.stopVibrateSound();
      audio.stopExplodeSound();
      if (st.clickBurst >= 0.98 && !st.joinPlayed) { st.joinPlayed = true; audio.playJoinSound(); }
    };
    window.addEventListener('mouseup', onMouseUp);

    const firstInteraction = () => {
      if (audio.soundEnabledRef.current) audio.autoStartWoosh();
    };
    ['mousedown', 'touchstart', 'mousemove', 'scroll'].forEach((ev) => {
      document.addEventListener(ev, firstInteraction, { once: true });
    });

    const onResize = () => {
      viewportW = window.innerWidth;
      viewportH = window.innerHeight;
      camera.aspect = viewportW / viewportH;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(getRenderPixelRatio());
      renderer.setSize(viewportW, viewportH);
      lineCanvas.width = viewportW; lineCanvas.height = viewportH;
      glowCanvas.width = viewportW; glowCanvas.height = viewportH;
      camera.position.z = getZoom();
    };
    window.addEventListener('resize', onResize);

    return () => {
      manager.unregister(loopId);
      heroIo.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (wrap.contains(renderer.domElement)) wrap.removeChild(renderer.domElement);
      if (wrap.contains(lineCanvas)) wrap.removeChild(lineCanvas);
      particles.forEach((p) => {
        p.mesh.geometry.dispose();
        if (Array.isArray(p.mesh.material)) p.mesh.material.forEach((m) => m.dispose());
        else p.mesh.material.dispose();
      });
      audio.stopAllSounds();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transitionReady]);

  return { audio, stateRef };
}
