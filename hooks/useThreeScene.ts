"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useAudio } from "./useAudio";
import { getCanvasManager } from "@/lib/canvasManager";
import { getCappedDPR } from "./useCanvasLoop";

interface Particle {
  mesh: THREE.Mesh | THREE.LineSegments;
  explodeDir: THREE.Vector3;
  spinAxis: THREE.Vector3;
  spinSpeed: number;
  delay: number;
  shapeIdx: number;
  isEdge?: boolean;
}

export function useThreeScene(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const audio = useAudio();
  const audioRef = useRef(audio);
  audioRef.current = audio;

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;
    const wrap = containerRef.current;

    // Audio init
    audioRef.current.initHoverBeep();



    let width = window.innerWidth;
    let height = window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(getCappedDPR());
    renderer.setClearColor(0x0c0c0c, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c0c);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
    const getZoom = () =>
      window.innerWidth < 768 ? 9 : window.innerWidth < 1024 ? 7.5 : 6;
    camera.position.set(0, 0, getZoom());

    // Lights
    scene.add(new THREE.AmbientLight(0x2a3040, 2.8));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(4, 5, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x8899aa, 0.8);
    fill.position.set(-4, 1, -2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xccddee, 1.5);
    rim.position.set(0, -3, -5);
    scene.add(rim);
    const rim2 = new THREE.DirectionalLight(0x8899aa, 1.0);
    rim2.position.set(-3, 2, 6);
    scene.add(rim2);
    const top = new THREE.DirectionalLight(0xaabbcc, 1.0);
    top.position.set(0, 8, 2);
    scene.add(top);
    const c1 = new THREE.DirectionalLight(0x6677aa, 1.2);
    c1.position.set(0, 0, -8);
    scene.add(c1);
    const c2 = new THREE.DirectionalLight(0x6677aa, 1.0);
    c2.position.set(-8, 0, 0);
    scene.add(c2);
    const c3 = new THREE.DirectionalLight(0x6677aa, 1.0);
    c3.position.set(8, 0, 0);
    scene.add(c3);
    const c4 = new THREE.DirectionalLight(0x6677aa, 1.0);
    c4.position.set(0, -8, 0);
    scene.add(c4);
    const p1 = new THREE.PointLight(0xff3300, 12.0, 22);
    p1.position.set(3, -1, 3);
    scene.add(p1);
    const p2 = new THREE.PointLight(0xff2200, 9.0, 20);
    p2.position.set(-3, 2, -2);
    scene.add(p2);
    const p3 = new THREE.PointLight(0xff5500, 6.0, 14);
    p3.position.set(0, 4, 3);
    scene.add(p3);

    // BG particles
    const pGeo = new THREE.BufferGeometry();
    const pArr = new Float32Array(200 * 3);
    for (let i = 0; i < 600; i++) pArr[i] = (Math.random() - 0.5) * 20;
    pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3));
    scene.add(
      new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({
          color: 0xff3300,
          size: 0.022,
          transparent: true,
          opacity: 0.35,
        }),
      ),
    );

    // Env map
    const cubeRT = new THREE.WebGLCubeRenderTarget(256, {
      format: THREE.RGBFormat as THREE.PixelFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    });
    const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRT);
    scene.add(cubeCamera);

    const metalMat = new THREE.MeshPhysicalMaterial({
      color: 0x3a3d42,
      emissive: 0x1a2030,
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

    const extCfg = {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.006,
      bevelSegments: 1,
    };
    const SC = 1.55;
    const sv = (v: number) => v * SC;
    const mk = (fn: (sh: THREE.Shape) => void) => {
      const sh = new THREE.Shape();
      fn(sh);
      return sh;
    };

    const shape1 = mk((sh) => {
      sh.moveTo(sv(-0.09044), sv(-0.14447));
      sh.bezierCurveTo(
        sv(-0.08141),
        sv(-0.14447),
        sv(-0.07306),
        sv(-0.13959),
        sv(-0.06864),
        sv(-0.1317),
      );
      sh.lineTo(sv(-0.00853), sv(-0.02454));
      sh.bezierCurveTo(
        sv(0.00082),
        sv(-0.00787),
        sv(-0.01123),
        sv(0.01269),
        sv(-0.03034),
        sv(0.01269),
      );
      sh.lineTo(sv(-0.27743), sv(0.01269));
      sh.bezierCurveTo(
        sv(-0.29667),
        sv(0.01269),
        sv(-0.3087),
        sv(0.03353),
        sv(-0.29907),
        sv(0.0502),
      );
      sh.lineTo(sv(0.06923), sv(0.68746));
      sh.bezierCurveTo(
        sv(0.07362),
        sv(0.69507),
        sv(0.0737),
        sv(0.70443),
        sv(0.06943),
        sv(0.71211),
      );
      sh.lineTo(sv(0.00872), sv(0.82143));
      sh.bezierCurveTo(
        sv(-0.00072),
        sv(0.83841),
        sv(-0.02507),
        sv(0.83862),
        sv(-0.03478),
        sv(0.82179),
      );
      sh.lineTo(sv(-0.49507), sv(0.02518));
      sh.bezierCurveTo(
        sv(-0.49954),
        sv(0.01745),
        sv(-0.5078),
        sv(0.01269),
        sv(-0.51673),
        sv(0.01269),
      );
      sh.lineTo(sv(-0.79147), sv(0.01269));
      sh.bezierCurveTo(
        sv(-0.80025),
        sv(0.01269),
        sv(-0.80839),
        sv(0.00809),
        sv(-0.81291),
        sv(0.00056),
      );
      sh.lineTo(sv(-0.87726), sv(-0.1066));
      sh.bezierCurveTo(
        sv(-0.88726),
        sv(-0.12326),
        sv(-0.87526),
        sv(-0.14447),
        sv(-0.85583),
        sv(-0.14447),
      );
      sh.lineTo(sv(-0.09044), sv(-0.14447));
      sh.closePath();
    });
    const shape2 = mk((sh) => {
      sh.moveTo(sv(0.4227), sv(0.36965));
      sh.bezierCurveTo(
        sv(0.41824),
        sv(0.37736),
        sv(0.41822),
        sv(0.38685),
        sv(0.42265),
        sv(0.39458),
      );
      sh.lineTo(sv(0.56835), sv(0.64898));
      sh.bezierCurveTo(
        sv(0.5727),
        sv(0.65657),
        sv(0.57276),
        sv(0.66589),
        sv(0.56851),
        sv(0.67354),
      );
      sh.lineTo(sv(0.50776), sv(0.78292));
      sh.bezierCurveTo(
        sv(0.49832),
        sv(0.7999),
        sv(0.47397),
        sv(0.80011),
        sv(0.46425),
        sv(0.78329),
      );
      sh.lineTo(sv(0.08438), sv(0.12619));
      sh.bezierCurveTo(
        sv(0.07992),
        sv(0.11848),
        sv(0.0799),
        sv(0.10897),
        sv(0.08435),
        sv(0.10124),
      );
      sh.lineTo(sv(0.14777), sv(-0.00924));
      sh.bezierCurveTo(
        sv(0.15738),
        sv(-0.02599),
        sv(0.18156),
        sv(-0.02598),
        sv(0.19115),
        sv(-0.00921),
      );
      sh.lineTo(sv(0.30324), sv(0.18663));
      sh.bezierCurveTo(
        sv(0.31283),
        sv(0.20338),
        sv(0.33698),
        sv(0.20341),
        sv(0.34661),
        sv(0.18667),
      );
      sh.lineTo(sv(0.71438), sv(-0.45247));
      sh.bezierCurveTo(
        sv(0.71885),
        sv(-0.46022),
        sv(0.72711),
        sv(-0.465),
        sv(0.73605),
        sv(-0.465),
      );
      sh.lineTo(sv(0.86168), sv(-0.46501));
      sh.bezierCurveTo(
        sv(0.88092),
        sv(-0.46502),
        sv(0.89296),
        sv(-0.44417),
        sv(0.88332),
        sv(-0.4275),
      );
      sh.lineTo(sv(0.4227), sv(0.36965));
      sh.closePath();
    });
    const shape3 = mk((sh) => {
      sh.moveTo(sv(0.18231), sv(-0.38702));
      sh.bezierCurveTo(
        sv(0.19185),
        sv(-0.40368),
        sv(0.17981),
        sv(-0.42443),
        sv(0.16061),
        sv(-0.42443),
      );
      sh.lineTo(sv(-0.58076), sv(-0.42443));
      sh.bezierCurveTo(
        sv(-0.58953),
        sv(-0.42443),
        sv(-0.59767),
        sv(-0.42904),
        sv(-0.60219),
        sv(-0.43656),
      );
      sh.lineTo(sv(-0.66654), sv(-0.54373));
      sh.bezierCurveTo(
        sv(-0.67655),
        sv(-0.56039),
        sv(-0.66454),
        sv(-0.58159),
        sv(-0.64511),
        sv(-0.58159),
      );
      sh.lineTo(sv(0.27978), sv(-0.58159));
      sh.bezierCurveTo(
        sv(0.28875),
        sv(-0.58159),
        sv(0.29704),
        sv(-0.5864),
        sv(0.30149),
        sv(-0.5942),
      );
      sh.lineTo(sv(0.44612), sv(-0.8474));
      sh.bezierCurveTo(
        sv(0.45057),
        sv(-0.85519),
        sv(0.45885),
        sv(-0.86),
        sv(0.46783),
        sv(-0.86),
      );
      sh.lineTo(sv(0.59353), sv(-0.86));
      sh.bezierCurveTo(
        sv(0.61275),
        sv(-0.86),
        sv(0.62478),
        sv(-0.83921),
        sv(0.61521),
        sv(-0.82255),
      );
      sh.lineTo(sv(0.23322), sv(-0.15755));
      sh.bezierCurveTo(
        sv(0.22875),
        sv(-0.14978),
        sv(0.22049),
        sv(-0.145),
        sv(0.21154),
        sv(-0.145),
      );
      sh.lineTo(sv(0.08701), sv(-0.145));
      sh.bezierCurveTo(
        sv(0.06781),
        sv(-0.145),
        sv(0.05577),
        sv(-0.16575),
        sv(0.06531),
        sv(-0.18241),
      );
      sh.lineTo(sv(0.18231), sv(-0.38702));
      sh.closePath();
    });

    const group = new THREE.Group();
    group.position.z = -extCfg.depth / 2;
    const edgeBright = new THREE.LineBasicMaterial({
      color: 0x555555,
      transparent: true,
      opacity: 0.08,
    });
    const edgeRimMat = new THREE.LineBasicMaterial({
      color: 0x666666,
      transparent: true,
      opacity: 0.05,
    });

    const particles: Particle[] = [];
    let currentShapeIdx = 0;

    function buildParticles(shape: THREE.Shape) {
      const geo = new THREE.ExtrudeGeometry(shape, extCfg);
      geo.computeBoundingBox();
      const center = new THREE.Vector3();
      geo.boundingBox!.getCenter(center);
      const posArr = geo.attributes.position.array as Float32Array;
      const normArr = geo.attributes.normal.array as Float32Array;
      const totalTris = posArr.length / 9;
      const panelMap: Record<
        string,
        { tris: number[]; nx: number; ny: number; nz: number }
      > = {};
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
        const verts: number[] = [],
          norms: number[] = [];
        let cx = 0,
          cy = 0,
          cz = 0;
        panel.tris.forEach((ti) => {
          const bi = ti * 9;
          for (let j = 0; j < 9; j++) {
            verts.push(posArr[bi + j]);
            norms.push(normArr[bi + j]);
          }
          cx += posArr[bi] + posArr[bi + 3] + posArr[bi + 6];
          cy += posArr[bi + 1] + posArr[bi + 4] + posArr[bi + 7];
          cz += posArr[bi + 2] + posArr[bi + 5] + posArr[bi + 8];
        });
        const cnt = panel.tris.length * 3;
        cx /= cnt;
        cy /= cnt;
        cz /= cnt;
        const pg = new THREE.BufferGeometry();
        pg.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(verts), 3),
        );
        pg.setAttribute(
          "normal",
          new THREE.BufferAttribute(new Float32Array(norms), 3),
        );
        const mesh = new THREE.Mesh(pg, metalMat.clone());
        const dx = cx - center.x,
          dy = cy - center.y,
          dz = cz - center.z;
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        const explodeDir = new THREE.Vector3(
          (dx / len) * 0.6 + panel.nx * 0.4,
          (dy / len) * 0.6 + panel.ny * 0.4,
          (dz / len) * 0.6 + panel.nz * 0.4,
        ).normalize();
        const spinAxis = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5,
        ).normalize();
        const spinSpeed = (Math.random() - 0.5) * 0.8;
        const delay = Math.random() * 0.25;
        group.add(mesh);
        particles.push({
          mesh,
          explodeDir,
          spinAxis,
          spinSpeed,
          delay,
          shapeIdx: currentShapeIdx,
        });
      });
      const edges = new THREE.EdgesGeometry(geo, 8);
      const el1 = new THREE.LineSegments(edges, edgeBright);
      group.add(el1);
      particles.push({
        mesh: el1,
        explodeDir: new THREE.Vector3(0, 0, 0),
        spinAxis: new THREE.Vector3(0, 1, 0),
        spinSpeed: 0,
        delay: 0,
        shapeIdx: currentShapeIdx,
        isEdge: true,
      });
      const r2 = new THREE.LineSegments(edges, edgeRimMat);
      r2.scale.set(1.004, 1.004, 1.004);
      group.add(r2);
      particles.push({
        mesh: r2,
        explodeDir: new THREE.Vector3(0, 0, 0),
        spinAxis: new THREE.Vector3(0, 1, 0),
        spinSpeed: 0,
        delay: 0,
        shapeIdx: currentShapeIdx,
        isEdge: true,
      });
    }

    [shape1, shape2, shape3].forEach((shape, i) => {
      currentShapeIdx = i;
      buildParticles(shape);
    });
    scene.add(group);

    // Scroll state
    let scrollProgress = 0,
      targetScrollProgress = 0;
    let s4Amt = 0,
      targetS4Amt = 0;
    let introAmt = 1.0;
    const s4El = document.getElementById("s4-text") as HTMLElement | null;
    let lastNorm = 0;



    // Interaction
    let rotX = 0.3,
      rotY = 0.4;
    let dragging = false,
      px = 0,
      py = 0;
    let hoverAmt = 0;
    let clickBurst = 0;
    let vibrateAmt = 0,
      vibratePhase = 0;
    let holding = false,
      holdTime = 0;
    let joinPlayed = false;

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let hoveredMesh: THREE.Object3D | null = null;

    const vibrateEls = [
      "nav",
      "s1-headline",
      "s1-sub",
      "s1-stats",
      "s1-body",
      "s1-cta",
      "s2-text",
      "s3-text",
    ]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      if (dragging) {
        rotY += (e.clientX - px) * 0.025;
        rotX += (e.clientY - py) * 0.025;
        rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX));
        px = e.clientX;
        py = e.clientY;
      }
    };
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      dragging = true;
      px = e.clientX;
      py = e.clientY;
    };
    const onMouseUp = () => {
      dragging = false;
    };
    const onWindowMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "A" || target.closest("a")) return;
      if (target.id === "sound-toggle" || target.closest("#sound-toggle"))
        return;
      if (scrollProgress < 0.15) {
        holding = true;
        holdTime = 0;
        vibrateAmt = 1.0;
        vibratePhase = 0;
        clickBurst = 0;
        joinPlayed = false;
        audioRef.current.startVibrateSound();
      }
    };
    const onWindowMouseUp = () => {
      holding = false;
      vibrateAmt = 0;
      vibrateEls.forEach((el) => {
        el.style.transition =
          "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)";
        el.style.transform = "translate(0px,0px) rotate(0deg)";
      });
      audioRef.current.stopVibrateSound();
      audioRef.current.stopWooshSound();
      audioRef.current.stopExplodeSound();
      if (clickBurst >= 0.98 && !joinPlayed) {
        joinPlayed = true;
        audioRef.current.playJoinSound();
      }
    };

    // Scope interaction events to #hero-section so sounds/effects never
    // fire when the cursor is over sections below (e.g. KeyFacts)
    const heroSection = document.getElementById("hero-section");
    const interactionTarget = heroSection ?? wrap;

    interactionTarget.addEventListener("mousemove", onMouseMove);
    interactionTarget.addEventListener("mousedown", onWindowMouseDown);
    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("contextmenu", (e) =>
      e.preventDefault(),
    );
    // mouseup stays on window so drag & vibrate release are always caught
    // even if the cursor leaves the hero section mid-drag
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseup", onWindowMouseUp);

    // Animate
    const clock = new THREE.Clock();
    let envReady = false;

    function animate() {
      const scroll = window.scrollY;
      const norm = scroll / window.innerHeight;
      const prevTarget = targetScrollProgress;
      if (norm <= 0.1) targetScrollProgress = 0;
      else if (norm <= 1.0)
        targetScrollProgress = Math.max(0, (norm - 0.1) * (1 / 0.9));
      else if (norm <= 1.2) targetScrollProgress = 1;
      else if (norm <= 1.8)
        targetScrollProgress = Math.max(0, (1.8 - norm) / 0.6);
      else targetScrollProgress = 0;

      const s4Start = 2.0;
      const s4SlideProgress = Math.max(0, Math.min(1, (norm - s4Start) / 0.8));
      const ty = (1 - s4SlideProgress) * 100;
      if (s4El) s4El.style.transform = `translateY(${ty}vh)`;
      (window as Window & { _s4ty?: number })._s4ty = ty;

      if (norm > 0.1 && lastNorm <= 0.1 && norm > lastNorm)
        audioRef.current.startWooshSound();
      if (targetScrollProgress > 0.05 && prevTarget <= 0.05 && norm < lastNorm)
        audioRef.current.startWooshSound();
      if (targetScrollProgress < 0.05 && prevTarget >= 0.05)
        audioRef.current.stopWooshSound();
      lastNorm = norm;

      const t = clock.getElapsedTime();

      scrollProgress += (targetScrollProgress - scrollProgress) * 0.06;
      s4Amt += (targetS4Amt - s4Amt) * 0.05;
      targetS4Amt = 0;
      if (introAmt > 0.001) introAmt *= 0.975;
      else introAmt = 0;

      if (!dragging) {
        rotY += 0.005;
        rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX));
        const targetTiltX = mouse.y * 0.22;
        const targetTiltY = mouse.x * 0.22;
        group.rotation.x += (rotX + targetTiltX - group.rotation.x) * 0.06;
        group.rotation.y += (rotY + targetTiltY - group.rotation.y) * 0.06;
      } else {
        group.rotation.x = rotX;
        group.rotation.y = rotY;
      }

      const nowHit = scrollProgress < 0.15 ? (() => {
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(
          particles.filter((p) => !p.isEdge).map((p) => p.mesh),
          false,
        );
        return hits.length > 0 ? hits[0].object : null;
      })() : null;
      if (nowHit !== hoveredMesh) {
        if (nowHit) {
          (nowHit as THREE.Mesh & { _flash?: number })._flash = 1.0;
          if (scrollProgress < 0.05 && clickBurst < 0.05)
            audioRef.current.playHoverBeep();
        }
        hoveredMesh = nowHit;
      }

      particles.forEach((p) => {
        const mat = (p.mesh as THREE.Mesh)
          .material as THREE.MeshPhysicalMaterial;
        if (p.isEdge) return;
        const m = p.mesh as THREE.Mesh & { _flash?: number };
        if (m._flash === undefined) m._flash = 0;
        m._flash! *= 0.94;
        if (m._flash! < 0.002) m._flash = 0;
        const f = m._flash!;
        mat.envMapIntensity = 3.0 + f * 2.0;
        mat.roughness = 0.08 - f * 0.08;
        mat.clearcoatRoughness = 0.05 - f * 0.05;
        mat.emissiveIntensity = 0.15 + f * 0.15;
        mat.transmission = 0.35 + f * 0.5;
        mat.opacity = 0.88 - f * 0.25;
      });

      const symCenter = new THREE.Vector3(0, 0, 0);
      const projected = symCenter.clone().project(camera);
      const dd = Math.sqrt(
        (mouse.x - projected.x) ** 2 + (mouse.y - projected.y) ** 2,
      );
      const isHovered = dd < 0.0 && scrollProgress < 0.05;
      hoverAmt += ((isHovered ? 1 : 0) - hoverAmt) * (isHovered ? 0.07 : 0.05);

      vibratePhase += 1.1;
      if (vibrateAmt > 0.01) {
        const sx = Math.sin(vibratePhase) * vibrateAmt * 2.5;
        const sy = Math.cos(vibratePhase * 1.3) * vibrateAmt * 1.5;
        if (holding && holdTime < 0.7) {
          vibrateEls.forEach((el) => {
            el.style.transition = "none";
            el.style.transform = `translate(${sx}px,${sy}px)`;
          });
        }
      }

      if (clickBurst > 0.01 && holdTime >= 0.7) {
        const orbitT = t * 0.8;
        vibrateEls.forEach((el, i) => {
          const phase = i * ((Math.PI * 2) / vibrateEls.length);
          const rx = Math.sin(orbitT + phase) * clickBurst * 25;
          const ry = Math.cos(orbitT * 0.7 + phase) * clickBurst * 20;
          const rz = Math.sin(orbitT * 0.5 + phase * 1.3) * clickBurst * 15;
          const tx = Math.sin(orbitT + phase) * clickBurst * 30;
          const ty2 = Math.cos(orbitT * 0.6 + phase) * clickBurst * 20;
          el.style.transition = "none";
          el.style.transform = `perspective(600px) translate(${tx}px,${ty2}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
        });
      } else if (!holding && clickBurst <= 0.01) {
        vibrateEls.forEach((el) => {
          el.style.transition =
            "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)";
          el.style.transform =
            "perspective(600px) translate(0px,0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)";
        });
      }

      if (holding) {
        holdTime += 1 / 60;
        vibrateAmt = 1.0;
        if (holdTime < 0.5) {
          clickBurst = 0;
        } else {
          if (clickBurst === 0) {
            audioRef.current.stopVibrateSound();
            audioRef.current.playExplodeSound();
            audioRef.current.startWooshSound();
          }
          vibrateAmt *= 0.88;
          clickBurst = Math.min(1.0, clickBurst + 0.02);
        }
      } else {
        vibrateAmt = Math.max(0, vibrateAmt - 0.08);
        clickBurst = Math.max(0, clickBurst - 0.025);
      }

      const explodeAmt = Math.max(
        scrollProgress,
        hoverAmt,
        clickBurst,
        introAmt,
      );

      particles.forEach((p) => {
        const amt = Math.max(0, explodeAmt - p.delay);
        const burst = amt * 5.5;
        const phase = p.shapeIdx * ((Math.PI * 2) / 3);
        const armDriftX = Math.sin(t * 0.4 + phase) * 0.012 * (1 - explodeAmt);
        const armDriftY = Math.cos(t * 0.35 + phase) * 0.008 * (1 - explodeAmt);
        const armDriftZ =
          Math.sin(t * 0.3 + phase * 1.5) * 0.006 * (1 - explodeAmt);
        const mouseOffX = mouse.y * 0.008 * Math.cos(phase);
        const mouseOffY = mouse.x * 0.008 * Math.sin(phase);
        const s4Dirs = [
          [-6.0, 3.0, 0.0],
          [6.0, 3.0, 0.0],
          [0.0, -6.0, 0.0],
        ];
        const sd = s4Dirs[p.shapeIdx] || [0, 0, 0];
        const s4x = sd[0] * s4Amt,
          s4y = sd[1] * s4Amt,
          s4z = sd[2] * s4Amt;
        const vAmp = vibrateAmt * 0.018 * (1 - clickBurst);
        const vOff = Math.sin(vibratePhase + p.delay * 20) * vAmp;
        const vOffY = Math.cos(vibratePhase * 1.3 + p.shapeIdx * 2) * vAmp;
        p.mesh.position.set(
          p.explodeDir.x * burst * (1 - s4Amt) +
            armDriftX * (1 - s4Amt) +
            mouseOffX +
            s4x +
            vOff,
          p.explodeDir.y * burst * (1 - s4Amt) +
            armDriftY * (1 - s4Amt) +
            mouseOffY +
            s4y +
            vOffY,
          p.explodeDir.z * burst * (1 - s4Amt) + armDriftZ * (1 - s4Amt) + s4z,
        );
        p.mesh.rotation.x = p.spinAxis.x * p.spinSpeed * amt * Math.PI;
        p.mesh.rotation.y = p.spinAxis.y * p.spinSpeed * amt * Math.PI;
        p.mesh.rotation.z = p.spinAxis.z * p.spinSpeed * amt * Math.PI;
      });

      p1.position.x = Math.sin(t * 0.6) * 4;
      p1.position.y = Math.cos(t * 0.4) * 2;
      p1.position.z = Math.cos(t * 0.5) * 3 + 2;
      p2.position.x = Math.cos(t * 0.5) * 4;
      p2.position.y = Math.sin(t * 0.7) * 2;
      p2.position.z = Math.sin(t * 0.3) * 3 - 1;

      group.visible = false;
      if (!envReady) {
        cubeCamera.update(renderer, scene);
        envReady = true;
      }
      if (Math.floor(t * 2) % 3 === 0) cubeCamera.update(renderer, scene);
      group.visible = true;
      renderer.render(scene, camera);
    }
    // Register with canvas manager — starts active, pauses when off-screen / tab hidden
    const manager = getCanvasManager();
    const loopId = manager.register(animate, true);

    const heroIo = new IntersectionObserver(
      ([entry]) => manager.setActive(loopId, entry.isIntersecting),
      { root: null, threshold: 0, rootMargin: "64px 0px" },
    );
    heroIo.observe(wrap);

    // Marquee
    const track = document.getElementById("marquee-track");
    let marqueeRafId = 0;
    if (track) {
      track.innerHTML += track.innerHTML;
      let x = 0;
      const speed = 0.6;
      const marqueeLoop = () => {
        x -= speed;
        const halfW = track.scrollWidth / 2;
        if (Math.abs(x) >= halfW) x = 0;
        track.style.transform = `translateX(${x}px)`;
        marqueeRafId = requestAnimationFrame(marqueeLoop);
      };
      marqueeRafId = requestAnimationFrame(marqueeLoop);
    }

    // Resize
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(getCappedDPR());
      renderer.setSize(width, height);
      camera.position.z = width < 768 ? 9 : width < 1024 ? 7.5 : 6;
    };
    window.addEventListener("resize", onResize);

    return () => {
      manager.unregister(loopId);
      heroIo.disconnect();
      cancelAnimationFrame(marqueeRafId);
      interactionTarget.removeEventListener("mousemove", onMouseMove);
      interactionTarget.removeEventListener("mousedown", onWindowMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseup", onWindowMouseUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (wrap.contains(renderer.domElement))
        wrap.removeChild(renderer.domElement);
    };
  }, [containerRef]);

  return audio;
}
