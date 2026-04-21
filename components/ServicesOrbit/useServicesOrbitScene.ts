"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import gsap from "gsap";
import { createWeldFx } from "./weldFx";

const ORBIT_TOTAL_PTS = 361;
const SPARK_LEN = 12;
const SPARK_SPEED = 280;
const ORBIT_INTRO_START = 0.3;
const ORBIT_INTRO_DUR = 3.2;
const ORBIT_TARGET_OP = 0.28;
/* Ring line color */
const ORBIT_LINE_COLOR_HEX = 0x3a4658;
const LERP_SPEED = 0.045;
const POS_LERP = 0.055;
const TARGET_HEIGHT = 4.8;
const SYM_MOBILE_SCALE = 0.3;
const SYM_MOBILE_ORBIT_SCALE = 0.3;
const GRID_GAP_PX = 16;

const SVG_FILES = [
  "/services-orbit/vector-shape.svg",
  "/services-orbit/2.svg",
  "/services-orbit/3.svg",
  "/services-orbit/4.svg",
  "/services-orbit/5.svg",
  "/services-orbit/6.svg",
];

const SPINS = [
  { x: 0.12, y: 0.19, z: 0.07 },
  { x: 0.16, y: -0.12, z: 0.09 },
  { x: -0.1, y: 0.15, z: 0.12 },
  { x: 0.14, y: -0.17, z: -0.08 },
  { x: -0.15, y: 0.11, z: 0.14 },
  { x: 0.13, y: -0.16, z: -0.1 },
];

const extCfg = {
  depth: 0.55,
  bevelEnabled: true,
  bevelThickness: 0.008,
  bevelSize: 0.006,
  bevelSegments: 1,
};

function smoothstep(a: number, b: number, t: number): number {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
}

/**
 * Orbit / rotT / woosh: 0 at page top → 1 when scroll reaches #sec4 top (CTA).
 * Uses invariant doc Y = rect.top + scroll so extra DOM below sec4 does not stretch the curve.
 */
function computePhaseScrollUntilSec4Top(
  scroll: number,
  sec4: HTMLElement | null,
): number | null {
  if (!sec4) return null;
  const rect = sec4.getBoundingClientRect();
  const yDocTop = rect.top + scroll;
  const denom = Math.max(yDocTop, 1e-6);
  return Math.min(Math.max(scroll / denom, 0), 1);
}

function tiltPoint(
  x: number,
  y: number,
  z: number,
  incX: number,
  incZ: number,
) {
  const cosX = Math.cos(incX);
  const sinX = Math.sin(incX);
  const y1 = y * cosX - z * sinX;
  const z1 = y * sinX + z * cosX;
  y = y1;
  z = z1;
  const cosZ = Math.cos(incZ);
  const sinZ = Math.sin(incZ);
  return { x: x * cosZ - y * sinZ, y: x * sinZ + y * cosZ, z };
}

function wavyEllipse(a: number, rx: number, ry: number) {
  return { x: Math.cos(a) * rx, y: Math.sin(a) * ry };
}

function applyMatrixToShape(shape: THREE.Shape | THREE.Path, matrix: THREE.Matrix3) {
  const next = shape.clone() as THREE.Shape;
  next.curves.forEach((curve) => {
    const c = curve as unknown as {
      v0?: THREE.Vector2;
      v1?: THREE.Vector2;
      v2?: THREE.Vector2;
      v3?: THREE.Vector2;
      aX?: number;
      aY?: number;
      xRadius?: number;
      yRadius?: number;
    };
    if (c.v0) c.v0.applyMatrix3(matrix);
    if (c.v1) c.v1.applyMatrix3(matrix);
    if (c.v2) c.v2.applyMatrix3(matrix);
    if (c.v3) c.v3.applyMatrix3(matrix);
    if (c.aX !== undefined || c.aY !== undefined) {
      const p = new THREE.Vector3(c.aX || 0, c.aY || 0, 1).applyMatrix3(
        matrix,
      );
      c.aX = p.x;
      c.aY = p.y;
      if (c.xRadius !== undefined)
        c.xRadius *= Math.abs(matrix.elements[0]);
      if (c.yRadius !== undefined)
        c.yRadius *= Math.abs(matrix.elements[4]);
    }
  });
  if (next.currentPoint) next.currentPoint.applyMatrix3(matrix);
  if (next.holes?.length)
    next.holes = next.holes.map((h) =>
      applyMatrixToShape(h as THREE.Path, matrix),
    ) as THREE.Path[];
  return next;
}

type SparkLayerLine = THREE.Line & { _maxOp: number; _lenMult: number };

type SparkSet = {
  layers: SparkLayerLine[];
  refLine: THREE.Line | null;
  progress: number;
  active: boolean;
  timer: number;
  startPt: number;
};

type NodeState = {
  group: THREE.Group;
  phase: number;
  spin: { x: number; y: number; z: number };
  spinBoost: number;
  accRot: { x: number; y: number; z: number };
  rotOffset: { x: number; y: number; z: number };
  ready: boolean;
  isHovered: boolean;
  returning: boolean;
  lerpT: number;
  introPos: THREE.Vector3;
  introDelay: number;
  introDone: boolean;
  parkSide: number;
  parkSideSet: boolean;
  parkSlot: number;
  parkOrbitX: number;
  parkOrbitY: number;
  parkOrbitZ: number;
};

function randomOffscreen(): THREE.Vector3 {
  const side = Math.floor(Math.random() * 4);
  const far = 28;
  if (side === 0)
    return new THREE.Vector3(
      (Math.random() - 0.5) * 30,
      far,
      (Math.random() - 0.5) * 10,
    );
  if (side === 1)
    return new THREE.Vector3(
      (Math.random() - 0.5) * 30,
      -far,
      (Math.random() - 0.5) * 10,
    );
  if (side === 2)
    return new THREE.Vector3(
      far,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10,
    );
  return new THREE.Vector3(
    -far,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 10,
  );
}

export type ServicesOrbitSceneOptions = {
  /** Pixel scroll (Lenis or native) — for canvas unpin math on Firefox */
  getSmoothScroll: () => number;
  /**
   * Normalized scroll 0–1. Must match Lenis (`scroll/limit` or `progress`).
   * Using DOM scrollHeight/innerHeight with Lenis skews phase and makes section-3 grid timing late.
   */
  getScrollProgress?: () => number;
  soundEnabledRef: React.MutableRefObject<boolean>;
  canvasWrapRef: React.RefObject<HTMLDivElement | null>;
  /** CTA — top Y anchors global `phase` (rotT, phaseB, phaseC, woosh) so footer height does not affect it */
  sec4Ref: React.RefObject<HTMLElement | null>;
  servicesListRef: React.RefObject<HTMLUListElement | null>;
};

/** scene.js: sound toggle calls `initWoosh()` on click (user gesture). Wire these from the same handler. */
export type ServicesOrbitAudioApi = {
  primeWoosh: () => void;
  muteWoosh: () => void;
};

export function useServicesOrbitScene(
  mainCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  glowCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: ServicesOrbitSceneOptions,
): React.MutableRefObject<ServicesOrbitAudioApi> {
  const {
    getSmoothScroll,
    getScrollProgress,
    soundEnabledRef,
    canvasWrapRef,
    sec4Ref,
    servicesListRef,
  } = options;

  const orbitAudioRef = useRef<ServicesOrbitAudioApi>({
    primeWoosh: () => {},
    muteWoosh: () => {},
  });

  useEffect(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const isFirefox = /firefox/i.test(navigator.userAgent);

    let W = window.innerWidth;
    let H = window.innerHeight;
    let isMobile = W <= 768 || W < H;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "low-power",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.innerWidth < 768 ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x0a0a0a, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 40, 80);

    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 200);
    camera.position.set(0, 0, isMobile ? 18 : 28);

    scene.add(new THREE.AmbientLight(0x2a3040, 1.8));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(4, 5, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x8899aa, 0.6);
    fill.position.set(-4, 1, -2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xccddee, 0.9);
    rim.position.set(0, -3, -5);
    scene.add(rim);
    const rim2 = new THREE.DirectionalLight(0x8899aa, 0.6);
    rim2.position.set(-3, 2, 6);
    scene.add(rim2);
    const topL = new THREE.DirectionalLight(0xaabbcc, 0.6);
    topL.position.set(0, 8, 2);
    scene.add(topL);
    const c1 = new THREE.DirectionalLight(0x6677aa, 0.7);
    c1.position.set(0, 0, -8);
    scene.add(c1);
    const c2 = new THREE.DirectionalLight(0x6677aa, 0.6);
    c2.position.set(-8, 0, 0);
    scene.add(c2);
    const c3 = new THREE.DirectionalLight(0x6677aa, 0.6);
    c3.position.set(8, 0, 0);
    scene.add(c3);
    const c4 = new THREE.DirectionalLight(0x6677aa, 0.6);
    c4.position.set(0, -8, 0);
    scene.add(c4);
    const p1 = new THREE.PointLight(0xff3300, 4.0, 55);
    scene.add(p1);
    const p2 = new THREE.PointLight(0xff2200, 3.0, 50);
    scene.add(p2);
    const p3 = new THREE.PointLight(0xff5500, 2.0, 40);
    scene.add(p3);

    const cubeRT = new THREE.WebGLCubeRenderTarget(128, {
      format: THREE.RGBFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    });
    const cubeCamera = new THREE.CubeCamera(0.1, 200, cubeRT);
    scene.add(cubeCamera);

    function makeMat(color: number) {
      return new THREE.MeshPhysicalMaterial({
        color,
        emissive: 0x0a0c10,
        emissiveIntensity: 0.08,
        metalness: 1.0,
        roughness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06,
        envMap: cubeRT.texture,
        envMapIntensity: 1.8,
        side: THREE.DoubleSide,
      });
    }
    const MATS = [makeMat(0x3a3d42), makeMat(0x2e3136), makeMat(0x44474c)];

    function applyLightingTier() {
      if (isMobile) {
        scene.children.forEach((c) => {
          if ((c as THREE.AmbientLight).isAmbientLight)
            (c as THREE.AmbientLight).intensity = 5.0;
        });
        key.intensity = 3.5;
        MATS.forEach((m) => {
          m.emissiveIntensity = 0.6;
          m.roughness = 0.06;
          m.envMapIntensity = 4.5;
        });
      } else if (W <= 1440) {
        scene.children.forEach((c) => {
          if ((c as THREE.AmbientLight).isAmbientLight)
            (c as THREE.AmbientLight).intensity = 3.5;
        });
        key.intensity = 2.6;
        MATS.forEach((m) => {
          m.emissiveIntensity = 0.32;
          m.envMapIntensity = 3.2;
        });
      } else {
        scene.children.forEach((c) => {
          if ((c as THREE.AmbientLight).isAmbientLight)
            (c as THREE.AmbientLight).intensity = 3.0;
        });
        key.intensity = 2.2;
        MATS.forEach((m) => {
          m.emissiveIntensity = 0.25;
          m.envMapIntensity = 2.8;
        });
      }
    }
    applyLightingTier();

    const MAT_HOVER = new THREE.MeshPhysicalMaterial({
      color: 0x7a6055,
      emissive: 0x0a0c10,
      emissiveIntensity: 0.08,
      metalness: 1.0,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMap: cubeRT.texture,
      envMapIntensity: 2.4,
      side: THREE.DoubleSide,
    });

    const edgeBright = new THREE.LineBasicMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.1,
    });
    const edgeRimMat = new THREE.LineBasicMaterial({
      color: 0x555555,
      transparent: true,
      opacity: 0.06,
    });

    let ORBIT = {
      rx: isMobile ? 4.0 : W <= 1440 ? 13.0 : 19.0,
      ry: isMobile ? 1.4 : W <= 1440 ? 4.5 : 6.5,
      incX: -0.18,
      incZ: 0.0,
      speed: -0.25,
    };
    const ORBIT_INC = { incX: -0.18, incZ: 0.0, speed: -0.25 };

    let ORBIT_Y_OFFSET = isMobile ? 0.45 : 1.3;

    let layout = {
      halfH_world: Math.tan((42 * Math.PI) / 180 / 2) * 28,
      halfW_world: 0,
      WU_PX: 0,
      SYM_W: TARGET_HEIGHT,
      SIDE_STEP: 0,
      GRID_GAP: 0,
      GRID_STEP: 0,
      ROW_TOP_Y: 0,
      ROW_BOTTOM_Y: 0,
      PARK_LEFT: 0,
      PARK_RIGHT: 0,
    };

    function recomputeLayout() {
      ORBIT = {
        rx: isMobile ? 4.0 : W <= 1440 ? 13.0 : 19.0,
        ry: isMobile ? 1.4 : W <= 1440 ? 4.5 : 6.5,
        ...ORBIT_INC,
      };
      ORBIT_Y_OFFSET = isMobile ? 0.45 : 1.3;
      const halfH_world = Math.tan((42 * Math.PI) / 180 / 2) * 28;
      const halfW_world = halfH_world * (W / H);
      const WU_PX = halfH_world / (H / 2);
      const SYM_W = TARGET_HEIGHT;
      const SIDE_STEP = isMobile ? SYM_W * 0.38 : SYM_W * 1.1;
      const GRID_GAP = isMobile
        ? GRID_GAP_PX * WU_PX
        : W <= 1440
          ? SYM_W * 0.12
          : SYM_W * 0.35;
      const GRID_STEP = isMobile
        ? SYM_W * SYM_MOBILE_SCALE + GRID_GAP
        : SYM_W + GRID_GAP;
      const ROW_TOP_Y = isMobile
        ? SYM_W * SYM_MOBILE_SCALE * 0.55
        : SYM_W * 0.8;
      const ROW_BOTTOM_Y = isMobile
        ? -SYM_W * SYM_MOBILE_SCALE * 0.55
        : -SYM_W * 0.8;
      const PARK_LEFT = isMobile
        ? -(halfW_world * 0.55)
        : -(halfW_world - SYM_W * 0.85);
      const PARK_RIGHT = isMobile
        ? halfW_world * 0.55
        : halfW_world - SYM_W * 0.85;
      layout = {
        halfH_world,
        halfW_world,
        WU_PX,
        SYM_W,
        SIDE_STEP,
        GRID_GAP,
        GRID_STEP,
        ROW_TOP_Y,
        ROW_BOTTOM_Y,
        PARK_LEFT,
        PARK_RIGHT,
      };
    }
    recomputeLayout();

    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    function makeOrbitLine(yOffset: number, reverse: boolean) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < ORBIT_TOTAL_PTS; i++) {
        const a =
          Math.PI +
          (reverse ? -1 : 1) * ((i / (ORBIT_TOTAL_PTS - 1)) * Math.PI * 2);
        const se = wavyEllipse(a, ORBIT.rx, ORBIT.ry);
        const p = tiltPoint(
          se.x,
          se.y + yOffset,
          0,
          ORBIT.incX,
          ORBIT.incZ,
        );
        pts.push(new THREE.Vector3(p.x, p.y, p.z));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      geo.setDrawRange(0, 0);
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({
          color: ORBIT_LINE_COLOR_HEX,
          transparent: true,
          opacity: 0.0,
        }),
      );
      orbitGroup.add(line);
      return line;
    }

    function makeSparkSet(yOffset: number, reverse: boolean): SparkLayerLine[] {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < ORBIT_TOTAL_PTS; i++) {
        const a =
          Math.PI +
          (reverse ? -1 : 1) * ((i / (ORBIT_TOTAL_PTS - 1)) * Math.PI * 2);
        const se = wavyEllipse(a, ORBIT.rx, ORBIT.ry);
        const p = tiltPoint(
          se.x,
          se.y + yOffset,
          0,
          ORBIT.incX,
          ORBIT.incZ,
        );
        pts.push(new THREE.Vector3(p.x, p.y, p.z));
      }
      const layerDefs = [
        { color: 0x1133cc, opacity: 0.55, lenMult: 1.0 },
        { color: 0xcc3300, opacity: 0.75, lenMult: 0.65 },
        { color: 0xff7722, opacity: 0.9, lenMult: 0.3 },
      ];
      return layerDefs.map((l) => {
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        geo.setDrawRange(0, 0);
        const line = new THREE.Line(
          geo,
          new THREE.LineBasicMaterial({
            color: l.color,
            transparent: true,
            opacity: 0.0,
          }),
        );
        const sl = line as unknown as SparkLayerLine;
        sl._maxOp = l.opacity;
        sl._lenMult = l.lenMult;
        return sl;
      });
    }

    let orbitLineTop = makeOrbitLine(ORBIT_Y_OFFSET, false);
    let orbitLineBottom = makeOrbitLine(-ORBIT_Y_OFFSET, true);
    let orbitLineMid = makeOrbitLine(0, false);

    const sparkSets: SparkSet[] = [
      {
        layers: makeSparkSet(ORBIT_Y_OFFSET, false),
        refLine: null,
        progress: 0,
        active: false,
        timer: Math.random() * 4,
        startPt: 0,
      },
      {
        layers: makeSparkSet(-ORBIT_Y_OFFSET, true),
        refLine: null,
        progress: 0,
        active: false,
        timer: Math.random() * 4 + 1.5,
        startPt: 0,
      },
      {
        layers: makeSparkSet(0, false),
        refLine: null,
        progress: 0,
        active: false,
        timer: Math.random() * 4 + 0.8,
        startPt: 0,
      },
    ];

    sparkSets.forEach((ss, si) => {
      ss.refLine = [orbitLineTop, orbitLineBottom, orbitLineMid][si];
      ss.layers.forEach((l) => orbitGroup.add(l));
    });

    const nodes: NodeState[] = SVG_FILES.map((_, i) => {
      const group = new THREE.Group();
      group.visible = false;
      orbitGroup.add(group);
      return {
        group,
        phase: (i / 6) * Math.PI * 2,
        spin: SPINS[i],
        spinBoost: 1.0,
        accRot: { x: 0, y: 0, z: 0 },
        rotOffset: {
          x: Math.random() * Math.PI * 2,
          y: Math.random() * Math.PI * 2,
          z: Math.random() * Math.PI * 2,
        },
        ready: false,
        isHovered: false,
        returning: false,
        lerpT: 1.0,
        introPos: randomOffscreen(),
        introDelay: i * 0.28,
        introDone: false,
        parkSide: 0,
        parkSideSet: false,
        parkSlot: 0,
        parkOrbitX: 0,
        parkOrbitY: 0,
        parkOrbitZ: 0,
      };
    });

    const svgLoader = new SVGLoader();
    SVG_FILES.forEach((url, idx) => {
      fetch(url)
        .then((r) => r.text())
        .then((svgText) => {
          const svgData = svgLoader.parse(svgText);
          const rawShapes: THREE.Shape[] = [];
          svgData.paths.forEach((path) => {
            rawShapes.push(...(SVGLoader.createShapes(path) || []));
          });
          if (!rawShapes.length) return;

          let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;
          rawShapes.forEach((s) =>
            s.getPoints(40).forEach((p) => {
              minX = Math.min(minX, p.x);
              minY = Math.min(minY, p.y);
              maxX = Math.max(maxX, p.x);
              maxY = Math.max(maxY, p.y);
            }),
          );
          const h = maxY - minY || 1;
          const cx = (minX + maxX) / 2;
          const cy = (minY + maxY) / 2;
          const scale = TARGET_HEIGHT / h;
          const matrix = new THREE.Matrix3().set(
            scale,
            0,
            -cx * scale,
            0,
            -scale,
            cy * scale,
            0,
            0,
            1,
          );

          const node = nodes[idx];
          const mat = MATS[idx % MATS.length];
          rawShapes.forEach((shape) => {
            const transformed = applyMatrixToShape(shape, matrix);
            const geo = new THREE.ExtrudeGeometry(transformed, extCfg);
            geo.computeBoundingBox();
            const posArr = geo.attributes.position.array as Float32Array;
            const normArr = geo.attributes.normal.array as Float32Array;
            const totalTris = posArr.length / 9;
            const panelMap: Record<string, { tris: number[] }> = {};
            for (let i = 0; i < totalTris; i++) {
              const ni = i * 9;
              const key = `${Math.round(normArr[ni] * 10) / 10},${Math.round(normArr[ni + 1] * 10) / 10},${Math.round(normArr[ni + 2] * 10) / 10}`;
              if (!panelMap[key]) panelMap[key] = { tris: [] };
              panelMap[key].tris.push(i);
            }
            Object.values(panelMap).forEach((panel) => {
              if (!panel.tris.length) return;
              const verts: number[] = [];
              const norms: number[] = [];
              panel.tris.forEach((ti) => {
                const bi = ti * 9;
                for (let j = 0; j < 9; j++) {
                  verts.push(posArr[bi + j]);
                  norms.push(normArr[bi + j]);
                }
              });
              const pg = new THREE.BufferGeometry();
              pg.setAttribute(
                "position",
                new THREE.BufferAttribute(new Float32Array(verts), 3),
              );
              pg.setAttribute(
                "normal",
                new THREE.BufferAttribute(new Float32Array(norms), 3),
              );
              node.group.add(new THREE.Mesh(pg, mat));
            });
            const edges = new THREE.EdgesGeometry(geo, 8);
            node.group.add(new THREE.LineSegments(edges, edgeBright));
            const r2 = new THREE.LineSegments(edges, edgeRimMat);
            r2.scale.set(1.004, 1.004, 1.004);
            node.group.add(r2);
          });
          node.ready = true;
        })
        .catch((e) => console.warn("SVG fail", url, e));
    });

    const clock = new THREE.Clock();
    const raycaster = new THREE.Raycaster();

    function setNodeMaterial(node: NodeState, mat: THREE.MeshPhysicalMaterial) {
      node.group.traverse((o) => {
        if ((o as THREE.Mesh).isMesh)
          ((o as THREE.Mesh).material as THREE.Material) = mat;
      });
    }

    let isDragging = false;
    let dragNodeIdx = -1;

    function findNodeAtMouse(cx: number, cy: number) {
      raycaster.setFromCamera(
        new THREE.Vector2((cx / W) * 2 - 1, -((cy / H) * 2 - 1)),
        camera,
      );
      const allMeshes: { obj: THREE.Mesh; idx: number }[] = [];
      nodes.forEach((n, ni) =>
        n.group.traverse((o) => {
          if ((o as THREE.Mesh).isMesh)
            allMeshes.push({ obj: o as THREE.Mesh, idx: ni });
        }),
      );
      const hits = raycaster.intersectObjects(
        allMeshes.map((m) => m.obj),
        false,
      );
      if (hits.length) {
        const hit = allMeshes.find((m) => m.obj === hits[0].object);
        return hit ? hit.idx : -1;
      }
      return -1;
    }

    const onMouseDown = (e: MouseEvent) => {
      const idx = findNodeAtMouse(e.clientX, e.clientY);
      if (idx >= 0) {
        isDragging = true;
        dragNodeIdx = idx;
        nodes[idx].spinBoost = 12.0;
      }
    };
    const onMouseMoveDrag = (e: MouseEvent) => {
      if (isDragging && dragNodeIdx >= 0) nodes[dragNodeIdx].spinBoost = 12.0;
      _mnx = (e.clientX / W - 0.5) * 2;
      _mny = (e.clientY / H - 0.5) * 2;
      _mouseScreenX = e.clientX;
      _mouseScreenY = e.clientY;
    };
    const onMouseUp = () => {
      isDragging = false;
      dragNodeIdx = -1;
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMoveDrag);
    document.addEventListener("mouseup", onMouseUp);

    const listListeners: Array<{ el: Element; enter: () => void; leave: () => void }> =
      [];
    function bindServiceList() {
      listListeners.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
      listListeners.length = 0;
      const lis = servicesListRef.current?.querySelectorAll("li");
      lis?.forEach((li, i) => {
        const enter = () => {
          if (!nodes[i]?.ready) return;
          const n = nodes[i];
          n.isHovered = true;
          n.returning = false;
          n.spinBoost = 8.0;
          gsap.killTweensOf(n.group.position);
          gsap.killTweensOf(n.group.scale);
          gsap.to(n.group.position, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.7,
            ease: "power3.out",
          });
          gsap.to(n.group.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            duration: 0.7,
            ease: "power3.out",
          });
          setNodeMaterial(n, MAT_HOVER);
        };
        const leave = () => {
          if (!nodes[i]?.ready) return;
          const n = nodes[i];
          n.isHovered = false;
          n.returning = true;
          n.lerpT = 0;
          gsap.killTweensOf(n.group.scale);
          gsap.to(n.group.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.5,
            ease: "power3.out",
          });
          setNodeMaterial(n, MATS[i % MATS.length]);
        };
        li.addEventListener("mouseenter", enter);
        li.addEventListener("mouseleave", leave);
        listListeners.push({ el: li, enter, leave });
      });
    }
    bindServiceList();

    const weldFx = createWeldFx({
      glowCanvas: glowCanvasRef.current,
      isSoundEnabled: () => soundEnabledRef.current,
      sparkUrl: "/services-orbit/spark.mp3",
    });
    weldFx.setGlowCanvas(glowCanvasRef.current);
    weldFx.init(scene, camera, [orbitLineTop, orbitLineBottom, orbitLineMid]);

    let sec4Top = 0;
    let canvasPinned = false;
    const canvasWrap = canvasWrapRef.current;
    const sec4 = sec4Ref.current;

    const onSec4Intersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (!canvasWrap) return;
        const smooth = getSmoothScroll();
        if (entry.isIntersecting && !canvasPinned) {
          sec4Top = Math.round(smooth);
          canvasPinned = true;
          if (isFirefox) {
            canvasWrap.style.position = "fixed";
            canvasWrap.style.top = "0";
          } else {
            canvasWrap.style.position = "absolute";
            canvasWrap.style.top = `${sec4Top}px`;
          }
        } else if (!entry.isIntersecting && canvasPinned) {
          canvasPinned = false;
          if (isFirefox) {
            canvasWrap.style.transform = "";
          } else {
            canvasWrap.style.position = "fixed";
            canvasWrap.style.top = "0";
          }
        }
      });
    };

    let observer: IntersectionObserver | null = null;
    if (sec4 && canvasWrap) {
      observer = new IntersectionObserver(onSec4Intersect, { threshold: 0 });
      observer.observe(sec4);
      if (isFirefox) {
        canvasWrap.style.position = "fixed";
        canvasWrap.style.top = "0";
      }
    }

    let wooshCtx: AudioContext | null = null;
    let wooshBuf: AudioBuffer | null = null;
    let wooshSrc: AudioBufferSourceNode | null = null;
    let wooshGain: GainNode | null = null;
    let wooshReady = false;
    let wooshPlaying = false;

    function initWoosh() {
      if (wooshCtx) return;
      wooshCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      wooshGain = wooshCtx.createGain();
      wooshGain.gain.value = 0;
      wooshGain.connect(wooshCtx.destination);
      fetch("/services-orbit/woosh.mp3")
        .then((r) => r.arrayBuffer())
        .then((ab) => wooshCtx!.decodeAudioData(ab))
        .then((buf) => {
          wooshBuf = buf;
          wooshReady = true;
          if (soundEnabledRef.current) startWoosh();
        })
        .catch((e) => console.warn("woosh:", e));
    }

    function startWoosh() {
      if (!soundEnabledRef.current) return;
      if (!wooshReady || wooshPlaying || !wooshCtx || !wooshGain || !wooshBuf)
        return;
      if (wooshCtx.state === "suspended") void wooshCtx.resume();
      wooshSrc = wooshCtx.createBufferSource();
      wooshSrc.buffer = wooshBuf;
      wooshSrc.loop = true;
      wooshSrc.connect(wooshGain);
      wooshSrc.start(0);
      wooshPlaying = true;
    }

    function muteWoosh() {
      if (wooshGain && wooshCtx) {
        wooshGain.gain.setTargetAtTime(0, wooshCtx.currentTime, 0.2);
      }
    }

    orbitAudioRef.current = {
      primeWoosh: () => {
        initWoosh();
        if (
          wooshCtx &&
          wooshReady &&
          soundEnabledRef.current &&
          !wooshPlaying
        ) {
          startWoosh();
        }
      },
      muteWoosh,
    };

    const wooshGestureHandlers: Array<{ ev: string; fn: () => void }> = [];
    (["mousedown", "touchstart", "pointerdown"] as const).forEach((ev) => {
      const h = () => {
        if (soundEnabledRef.current) initWoosh();
        document.removeEventListener(ev, h);
      };
      document.addEventListener(ev, h);
      wooshGestureHandlers.push({ ev, fn: h });
    });

    setTimeout(() => {
      nodes.forEach((n) => {
        n.group.visible = false;
      });
      cubeCamera.update(renderer, scene);
      nodes.forEach((n) => {
        n.group.visible = true;
      });
    }, 500);

    let _mnx = 0;
    let _mny = 0;
    let _tiltX = 0;
    let _tiltY = 0;
    let _mouseScreenX = -9999;
    let _mouseScreenY = -9999;

    let _weldCooldown2d = 0;

    let lastTime = 0;
    let smoothDt = 0.016;

    function orbitLineScreenPts(
      line: THREE.Line,
      cam: THREE.PerspectiveCamera,
      count: number,
    ) {
      const pos = line.geometry.attributes.position;
      if (!pos) return [];
      const total = line.geometry.drawRange.count;
      if (total < 2) return [];
      const step = Math.max(1, Math.floor(total / count));
      const pts: {
        sx: number;
        sy: number;
        wx: number;
        wy: number;
        wz: number;
        t: number;
      }[] = [];
      const _v = new THREE.Vector3();
      for (let i = 0; i < total; i += step) {
        _v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
        _v.applyMatrix4(line.matrixWorld);
        const proj = _v.clone().project(cam);
        pts.push({
          sx: (proj.x * 0.5 + 0.5) * W,
          sy: (-proj.y * 0.5 + 0.5) * H,
          wx: _v.x,
          wy: _v.y,
          wz: _v.z,
          t: i / (total - 1),
        });
      }
      return pts;
    }

    function mouseNearScreenPts(
      pts: ReturnType<typeof orbitLineScreenPts>,
      threshPx: number,
    ) {
      const thSq = threshPx * threshPx;
      let best: {
        sx: number;
        sy: number;
        wx: number;
        wy: number;
        wz: number;
      } | null = null;
      let bestD = Infinity;
      for (let i = 0; i < pts.length - 1; i++) {
        const ax = pts[i].sx;
        const ay = pts[i].sy;
        const bx = pts[i + 1].sx;
        const by = pts[i + 1].sy;
        const dx = bx - ax;
        const dy = by - ay;
        const lenSq = dx * dx + dy * dy;
        if (lenSq < 0.001) continue;
        const t = Math.max(
          0,
          Math.min(
            1,
            ((_mouseScreenX - ax) * dx + (_mouseScreenY - ay) * dy) / lenSq,
          ),
        );
        const cx = ax + t * dx - _mouseScreenX;
        const cy = ay + t * dy - _mouseScreenY;
        const d = cx * cx + cy * cy;
        if (d < thSq && d < bestD) {
          bestD = d;
          const wa = pts[i];
          const wb = pts[i + 1];
          best = {
            sx: ax + t * dx,
            sy: ay + t * dy,
            wx: wa.wx + t * (wb.wx - wa.wx),
            wy: wa.wy + t * (wb.wy - wa.wy),
            wz: wa.wz + t * (wb.wz - wa.wz),
          };
        }
      }
      return best;
    }

    let rafId = 0;
    let prevPhase = 0;

    function animate() {
      rafId = requestAnimationFrame(animate);

      const _smoothScroll = getSmoothScroll();

      const t = clock.getElapsedTime();
      const raw = t - lastTime;
      lastTime = t;
      smoothDt += (Math.min(raw, 0.033) - smoothDt) * 0.1;

      function scrollPhaseFromDom() {
        const totalH = document.documentElement.scrollHeight - H;
        return totalH > 0 ? Math.min(_smoothScroll / totalH, 1) : 0;
      }

      /* Orbit / park / grid share one phase. Prefer #sec4 anchor so extra DOM below CTA does not stretch curves (scene.js uses full scrollHeight). */
      const phaseAnchored = computePhaseScrollUntilSec4Top(
        _smoothScroll,
        sec4Ref.current,
      );
      const phase =
        phaseAnchored !== null
          ? phaseAnchored
          : getScrollProgress
            ? Math.min(Math.max(getScrollProgress(), 0), 1)
            : scrollPhaseFromDom();

      /* scene.js — same bands on `phase` */
      const phaseB = smoothstep(0.1, 0.22, phase);
      const phaseC = smoothstep(0.5, 0.62, phase);
      const scrollingUp = phase < prevPhase;
      prevPhase = phase;

      const orbitElapsed = t - ORBIT_INTRO_START;
      const orbitIntroT = Math.max(
        0,
        Math.min(orbitElapsed / ORBIT_INTRO_DUR, 1),
      );
      const orbitIntroEase = orbitIntroT * orbitIntroT * (3 - 2 * orbitIntroT);

      const rotT = smoothstep(0.1, 0.23, phase);
      const rotAngle = rotT * Math.PI * 0.55;
      const shrinkScale = 1.0 - rotT * 0.6;

      const drawnPts = Math.ceil(orbitIntroEase * ORBIT_TOTAL_PTS);
      const erasedPts = Math.ceil(rotT * ORBIT_TOTAL_PTS);
      const visiblePts = Math.max(0, drawnPts - erasedPts);

      orbitLineTop.geometry.setDrawRange(0, visiblePts);
      orbitLineBottom.geometry.setDrawRange(0, visiblePts);
      orbitLineMid.geometry.setDrawRange(0, visiblePts);

      orbitLineTop.rotation.z = rotAngle;
      orbitLineBottom.rotation.z = -rotAngle;
      orbitLineMid.rotation.z = rotAngle * 0.5;

      const outerScale = shrinkScale * 0.97;
      orbitLineTop.scale.set(outerScale, outerScale, outerScale);
      orbitLineBottom.scale.set(outerScale, outerScale, outerScale);
      orbitLineMid.scale.set(shrinkScale, shrinkScale, shrinkScale);
      (orbitLineTop.material as THREE.LineBasicMaterial).opacity =
        ORBIT_TARGET_OP;
      (orbitLineBottom.material as THREE.LineBasicMaterial).opacity =
        ORBIT_TARGET_OP;
      (orbitLineMid.material as THREE.LineBasicMaterial).opacity =
        ORBIT_TARGET_OP;

      if (visiblePts > 10 && rotT < 0.05) {
        sparkSets.forEach((ss) => {
          ss.timer -= smoothDt;
          if (!ss.active && ss.timer <= 0) {
            ss.active = true;
            ss.progress = 0;
            ss.startPt = Math.floor(
              Math.random() * Math.max(1, visiblePts - SPARK_LEN),
            );
          }
          if (ss.active && ss.refLine) {
            const refLn = ss.refLine;
            ss.progress += SPARK_SPEED * smoothDt;
            const flicker = 0.85 + Math.random() * 0.15;
            ss.layers.forEach((l) => {
              const segLen = Math.ceil(SPARK_LEN * l._lenMult);
              const start =
                ss.startPt +
                Math.floor(ss.progress) +
                Math.floor(SPARK_LEN * (1 - l._lenMult) * 0.5);
              const end = Math.min(start + segLen, visiblePts);
              l.geometry.setDrawRange(start, Math.max(0, end - start));
              (l.material as THREE.LineBasicMaterial).opacity =
                l._maxOp * flicker;
              l.rotation.copy(refLn.rotation);
              l.scale.copy(refLn.scale);
            });
            const done =
              ss.startPt + Math.floor(ss.progress) + SPARK_LEN >= visiblePts;
            if (done || ss.progress > ORBIT_TOTAL_PTS) {
              ss.active = false;
              ss.layers.forEach((l) => {
                (l.material as THREE.LineBasicMaterial).opacity = 0;
                l.geometry.setDrawRange(0, 0);
              });
              ss.timer = 2 + Math.random() * 5;
            }
          } else {
            ss.layers.forEach((l) => {
              (l.material as THREE.LineBasicMaterial).opacity = 0;
              l.geometry.setDrawRange(0, 0);
            });
          }
        });
      } else {
        sparkSets.forEach((ss) => {
          ss.layers.forEach((l) => {
            (l.material as THREE.LineBasicMaterial).opacity = 0;
            l.geometry.setDrawRange(0, 0);
          });
        });
      }

      const sideSlotCount: Record<string, number> = { "-1": 0, "1": 0 };

      const {
        SIDE_STEP,
        GRID_STEP,
        ROW_TOP_Y,
        ROW_BOTTOM_Y,
        PARK_LEFT,
        PARK_RIGHT,
      } = layout;

      function topRowTarget(j: number) {
        return { x: (j - 1) * GRID_STEP, y: ROW_TOP_Y, z: 0 };
      }
      function bottomRowTarget(j: number) {
        return { x: (j - 1) * GRID_STEP, y: ROW_BOTTOM_Y, z: 0 };
      }

      nodes.forEach((n) => {
        const angle = t * ORBIT.speed + n.phase;
        const orbitPos = tiltPoint(
          Math.cos(angle) * ORBIT.rx,
          Math.sin(angle) * ORBIT.ry,
          0,
          ORBIT.incX,
          ORBIT.incZ,
        );

        if (phaseB > 0 && !n.parkSideSet) {
          n.parkSide = orbitPos.x >= 0 ? 1 : -1;
          const rawSlot = sideSlotCount[String(n.parkSide)] || 0;
          n.parkSlot = rawSlot;
          sideSlotCount[String(n.parkSide)] = rawSlot + 1;
          n.parkOrbitX = orbitPos.x;
          n.parkOrbitY = orbitPos.y;
          n.parkOrbitZ = orbitPos.z;
          n.parkSideSet = true;
        } else if (n.parkSideSet) {
          sideSlotCount[String(n.parkSide)] = Math.max(
            sideSlotCount[String(n.parkSide)] || 0,
            n.parkSlot + 1,
          );
        }
        if (phaseB === 0 && n.parkSideSet) {
          n.parkSideSet = false;
          n.parkSlot = 0;
        }

        const parkX = n.parkSide >= 0 ? PARK_RIGHT : PARK_LEFT;
        const parkY = (n.parkSlot - 1) * SIDE_STEP;

        const gridRow = n.parkSide >= 0 ? "bottom" : "top";
        const gridCol = n.parkSide < 0 ? 2 - n.parkSlot : n.parkSlot;

        let tx: number,
          ty: number,
          tz = 0;

        if (phaseC > 0) {
          const tgt =
            gridRow === "top"
              ? topRowTarget(gridCol)
              : bottomRowTarget(gridCol);
          const slotDelay = n.parkSlot * 0.28;
          const slotWindow = 1.0 - slotDelay;
          const pC =
            slotWindow > 0
              ? Math.max(0, Math.min(1, (phaseC - slotDelay) / slotWindow))
              : 0;
          const pCe = pC * pC * (3 - 2 * pC);
          tx = parkX + (tgt.x - parkX) * pCe;
          ty = parkY + (tgt.y - parkY) * pCe;
          tz = 0;
        } else if (phaseB > 0) {
          let effectivePhaseB = phaseB;
          if (scrollingUp) {
            const retDelay = (2 - n.parkSlot) * 0.28;
            const retWindow = 1.0 - retDelay;
            effectivePhaseB =
              retWindow > 0
                ? Math.max(
                    0,
                    Math.min(
                      1,
                      (phaseB - (1 - phaseB) * retDelay) / retWindow,
                    ),
                  )
                : phaseB;
            effectivePhaseB = effectivePhaseB * effectivePhaseB * (3 - 2 * effectivePhaseB);
          }
          n.parkOrbitX += (orbitPos.x - n.parkOrbitX) * 0.008;
          n.parkOrbitY += (orbitPos.y - n.parkOrbitY) * 0.008;
          n.parkOrbitZ += (orbitPos.z - n.parkOrbitZ) * 0.008;
          tx = n.parkOrbitX + (parkX - n.parkOrbitX) * effectivePhaseB;
          ty = n.parkOrbitY + (parkY - n.parkOrbitY) * effectivePhaseB;
          tz = n.parkOrbitZ * (1 - effectivePhaseB);
        } else {
          tx = orbitPos.x;
          ty = orbitPos.y;
          tz = orbitPos.z;
        }

        const scrollTarget = new THREE.Vector3(tx, ty, tz);

        if (!n.introDone) {
          const elapsed = t - n.introDelay;
          if (elapsed < 0) {
            n.group.visible = false;
          } else {
            n.group.visible = true;
            const r = Math.min(elapsed / 1.4, 1);
            const ease = r * r * (3 - 2 * r);
            n.group.position.lerpVectors(n.introPos, scrollTarget, ease);
            if (r >= 1) n.introDone = true;
          }
        } else if (n.isHovered) {
          /* gsap */
        } else if (n.returning) {
          n.lerpT = Math.min(n.lerpT + LERP_SPEED, 1);
          const ease = n.lerpT * n.lerpT * (3 - 2 * n.lerpT);
          n.group.position.x +=
            (scrollTarget.x - n.group.position.x) * ease * 0.12;
          n.group.position.y +=
            (scrollTarget.y - n.group.position.y) * ease * 0.12;
          n.group.position.z +=
            (scrollTarget.z - n.group.position.z) * ease * 0.12;
          if (
            (n.group.position.x - scrollTarget.x) ** 2 +
              (n.group.position.y - scrollTarget.y) ** 2 <
            0.01
          ) {
            n.returning = false;
            n.group.position.copy(scrollTarget);
          }
        } else {
          n.group.position.x +=
            (scrollTarget.x - n.group.position.x) * POS_LERP;
          n.group.position.y +=
            (scrollTarget.y - n.group.position.y) * POS_LERP;
          n.group.position.z +=
            (scrollTarget.z - n.group.position.z) * POS_LERP;
        }

        if (n.spinBoost > 1.0) {
          n.spinBoost += (1.0 - n.spinBoost) * 0.018;
          if (n.spinBoost < 1.01) n.spinBoost = 1.0;
        }

        n.accRot.x += n.spin.x * n.spinBoost * smoothDt;
        n.accRot.y += n.spin.y * n.spinBoost * smoothDt;
        n.accRot.z += n.spin.z * n.spinBoost * smoothDt;
        n.group.rotation.x = n.rotOffset.x + n.accRot.x;
        n.group.rotation.y = n.rotOffset.y + n.accRot.y;
        n.group.rotation.z = n.rotOffset.z + n.accRot.z;

        const sinAngle = Math.sin(angle);
        const depthT = (sinAngle + 1) * 0.5;
        const depthScale = 1.0 - depthT * 0.22;

        let targetScale: number;
        if (isMobile) {
          targetScale =
            (SYM_MOBILE_ORBIT_SCALE +
              phaseC * (SYM_MOBILE_SCALE - SYM_MOBILE_ORBIT_SCALE)) *
            (phaseC > 0 ? 1 : depthScale);
        } else {
          const baseScale = W <= 1440 ? 0.82 : 1.0;
          targetScale =
            (baseScale + phaseC * 0.15) * (phaseC > 0 ? 1 : depthScale);
        }
        if (!n.isHovered) {
          n.group.scale.x += (targetScale - n.group.scale.x) * 0.06;
          n.group.scale.y += (targetScale - n.group.scale.y) * 0.06;
          n.group.scale.z += (targetScale - n.group.scale.z) * 0.06;
        }
      });

      p1.position.set(
        Math.sin(t * 0.08) * 18,
        Math.cos(t * 0.06) * 10,
        Math.cos(t * 0.05) * 12 + 4,
      );
      p2.position.set(
        Math.cos(t * 0.07) * 18,
        Math.sin(t * 0.09) * 10,
        Math.sin(t * 0.04) * 12 - 3,
      );
      p3.position.set(
        Math.sin(t * 0.05) * 14,
        Math.cos(t * 0.07) * 12,
        Math.sin(t * 0.06) * 10 + 2,
      );

      if (!isMobile) {
        const tiltStrength = 1.0 - phaseB;
        _tiltX += (_mnx * 0.08 * tiltStrength - _tiltX) * 0.05;
        _tiltY += (_mny * 0.28 * tiltStrength - _tiltY) * 0.05;
        orbitGroup.rotation.z = _tiltX;
        orbitGroup.rotation.x = _tiltY;
        orbitGroup.rotation.y = _mnx * 0.025 * tiltStrength;
        camera.position.x +=
          (_mnx * -0.25 * tiltStrength - camera.position.x) * 0.04;
        camera.position.y +=
          (_mny * 1.2 * tiltStrength - camera.position.y) * 0.04;
      }

      const mouseMag = Math.sqrt(_tiltX * _tiltX + _tiltY * _tiltY);
      const squeeze = Math.min(mouseMag * 2.8, 1.0);

      [orbitLineTop, orbitLineBottom].forEach((ln, idx) => {
        const yOff = idx === 0 ? ORBIT_Y_OFFSET : -ORBIT_Y_OFFSET;
        const reverse = idx === 1;
        const pos = ln.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < ORBIT_TOTAL_PTS; i++) {
          const a =
            Math.PI +
            (reverse ? -1 : 1) *
              ((i / (ORBIT_TOTAL_PTS - 1)) * Math.PI * 2);
          const pinch = Math.cos(a) * Math.cos(a);
          const effectiveYOff = yOff * (1 - pinch * squeeze);
          const se = wavyEllipse(a, ORBIT.rx, ORBIT.ry);
          const p = tiltPoint(
            se.x,
            se.y + effectiveYOff,
            0,
            ORBIT.incX,
            ORBIT.incZ,
          );
          pos.setXYZ(i, p.x, p.y, p.z);
        }
        pos.needsUpdate = true;
        ln.position.y = 0;
      });
      orbitLineMid.position.y = 0;

      if (
        soundEnabledRef.current &&
        wooshPlaying &&
        wooshGain &&
        wooshCtx
      ) {
        const wooshVol =
          Math.max(0, 1 - smoothstep(0.05, 0.2, phase)) * 0.18;
        wooshGain.gain.setTargetAtTime(wooshVol, wooshCtx.currentTime, 0.3);
      }

      weldFx.update(0, 1, 0, 0, smoothDt);
      _weldCooldown2d -= smoothDt;
      if (visiblePts > 10 && rotT < 0.05 && _weldCooldown2d <= 0) {
        const SAMPLE = 80;
        const allLinePts = [
          orbitLineScreenPts(orbitLineTop, camera, SAMPLE),
          orbitLineScreenPts(orbitLineBottom, camera, SAMPLE),
          orbitLineScreenPts(orbitLineMid, camera, SAMPLE),
        ];
        let hitResult: ReturnType<typeof mouseNearScreenPts> = null;
        let hitLineIdx = -1;
        for (let li = 0; li < allLinePts.length; li++) {
          const h = mouseNearScreenPts(allLinePts[li], 14);
          if (h) {
            hitResult = h;
            hitLineIdx = li;
            break;
          }
        }
        if (hitResult) {
          const hitWP = new THREE.Vector3(
            hitResult.wx,
            hitResult.wy,
            hitResult.wz,
          );
          const otherIdxs = [0, 1, 2].filter((i) => i !== hitLineIdx);
          const count = Math.random() > 0.5 ? 1 : 2;
          const targetIdxs = otherIdxs
            .sort(() => Math.random() - 0.5)
            .slice(0, count);
          const nearWpts: THREE.Vector3[] = [];
          targetIdxs.forEach((li) => {
            const pts = allLinePts[li];
            let bestD = Infinity;
            let bestPt: (typeof pts)[0] | null = null;
            for (let i = 0; i < pts.length; i++) {
              const ddx = pts[i].sx - hitResult.sx;
              const ddy = pts[i].sy - hitResult.sy;
              const dd = ddx * ddx + ddy * ddy;
              if (dd < bestD) {
                bestD = dd;
                bestPt = pts[i];
              }
            }
            if (bestPt)
              nearWpts.push(
                new THREE.Vector3(bestPt.wx, bestPt.wy, bestPt.wz),
              );
          });
          if (nearWpts.length > 0) {
            weldFx.triggerAt(hitWP, nearWpts);
            _weldCooldown2d = 0.05 + Math.random() * 0.08;
          }
        }
      }

      orbitGroup.updateMatrixWorld(true);
      orbitLineTop.updateMatrixWorld(true);
      orbitLineBottom.updateMatrixWorld(true);
      orbitLineMid.updateMatrixWorld(true);

      renderer.render(scene, camera);

      if (isFirefox && canvasPinned && canvasWrap) {
        const offset = sec4Top - _smoothScroll;
        canvasWrap.style.transform = `translateY(${offset}px)`;
      }
    }

    function rebuildOrbitGeometry() {
      orbitGroup.remove(orbitLineTop);
      orbitGroup.remove(orbitLineBottom);
      orbitGroup.remove(orbitLineMid);
      orbitLineTop.geometry.dispose();
      (orbitLineTop.material as THREE.Material).dispose();
      orbitLineBottom.geometry.dispose();
      (orbitLineBottom.material as THREE.Material).dispose();
      orbitLineMid.geometry.dispose();
      (orbitLineMid.material as THREE.Material).dispose();

      sparkSets.forEach((ss) => {
        ss.layers.forEach((l) => {
          orbitGroup.remove(l);
          l.geometry.dispose();
          (l.material as THREE.Material).dispose();
        });
      });

      orbitLineTop = makeOrbitLine(ORBIT_Y_OFFSET, false);
      orbitLineBottom = makeOrbitLine(-ORBIT_Y_OFFSET, true);
      orbitLineMid = makeOrbitLine(0, false);

      sparkSets[0].layers = makeSparkSet(ORBIT_Y_OFFSET, false);
      sparkSets[1].layers = makeSparkSet(-ORBIT_Y_OFFSET, true);
      sparkSets[2].layers = makeSparkSet(0, false);
      sparkSets.forEach((ss, si) => {
        ss.refLine = [orbitLineTop, orbitLineBottom, orbitLineMid][si];
        ss.layers.forEach((l) => orbitGroup.add(l));
      });

      weldFx.init(scene, camera, [orbitLineTop, orbitLineBottom, orbitLineMid]);
    }

    const syncGlowCanvasSize = () => {
      const dpr = window.innerWidth < 768 ? 1 : Math.min(window.devicePixelRatio, 1.5);
      weldFx.resizeGlow(W, H, dpr);
    };

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      const nextMobile = W <= 768 || W < H;
      const breakpointCrossed = nextMobile !== isMobile;
      isMobile = nextMobile;
      camera.position.z = isMobile ? 18 : 28;
      applyLightingTier();
      recomputeLayout();
      renderer.setPixelRatio(window.innerWidth < 768 ? 1 : Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      syncGlowCanvasSize();
      if (breakpointCrossed) {
        rebuildOrbitGeometry();
      }
      bindServiceList();
    };
    window.addEventListener("resize", onResize);
    syncGlowCanvasSize();

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMoveDrag);
      document.removeEventListener("mouseup", onMouseUp);
      listListeners.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
      wooshGestureHandlers.forEach(({ ev, fn }) =>
        document.removeEventListener(ev, fn),
      );
      observer?.disconnect();
      weldFx.dispose();

      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
          const m = mesh.material;
          if (Array.isArray(m)) m.forEach((mat) => mat.dispose());
          else m?.dispose();
        }
        const line = obj as THREE.Line;
        if (line.isLine) {
          line.geometry?.dispose();
          (line.material as THREE.Material | undefined)?.dispose?.();
        }
        const ls = obj as THREE.LineSegments;
        if (ls.isLineSegments) {
          ls.geometry?.dispose();
          (ls.material as THREE.Material | undefined)?.dispose?.();
        }
      });

      cubeRT.dispose();
      renderer.dispose();

      orbitAudioRef.current = {
        primeWoosh: () => {},
        muteWoosh: () => {},
      };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return orbitAudioRef;
}
