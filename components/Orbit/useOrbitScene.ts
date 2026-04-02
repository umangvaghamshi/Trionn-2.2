"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import type { OrbitLabel } from "./types";

/* ── Constants ── */
const IMG_RATIO = 812 / 568;

/* ── Hook Config ── */
interface UseOrbitSceneConfig {
  labels: OrbitLabel[];
  images: string[];
  backgroundColor: string;
  autoRotateSpeed: number;
  orbitRadius: number;
  fontFamily: string;
  heroTitle: string;
  heroSubtitle: string;
}

/* ── Card Data ── */
interface CardData {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  em: THREE.LineBasicMaterial;
  idx: number;
}

export function useOrbitScene(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  trailCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  config: UseOrbitSceneConfig,
) {
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    const canvas = canvasRef.current;
    const trailCanvas = trailCanvasRef.current;
    if (!canvas || !trailCanvas) return;

    const {
      labels,
      images,
      backgroundColor,
      autoRotateSpeed,
      orbitRadius: R,
      fontFamily,
      heroTitle,
      heroSubtitle,
    } = configRef.current;
    const N = labels.length;

    /* ── Helpers ── */
    const isMobile = (): boolean =>
      window.innerWidth <= 1023 || window.innerHeight > window.innerWidth;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(parseInt(backgroundColor.replace("#", ""), 16), 0);
    renderer.sortObjects = true;
    /* Match original Three.js r128 behavior — no tone mapping */
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;

    /* ── Trail Canvas (Motion Blur) ── */
    const trailCtx = trailCanvas.getContext("2d")!;
    const resizeTrail = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      trailCanvas.width = window.innerWidth * dpr;
      trailCanvas.height = window.innerHeight * dpr;
      trailCanvas.style.width = `${window.innerWidth}px`;
      trailCanvas.style.height = `${window.innerHeight}px`;
    };
    resizeTrail();

    /* ── Scene & Camera ── */
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      200,
    );
    cam.position.set(0, 0, 9);

    /* ── Texture Loader ── */
    const textures: THREE.Texture[] = [];
    const loadTex = (src: string): THREE.Texture => {
      const tex = new THREE.Texture();
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      /* Mark as sRGB so modern Three.js doesn't double-gamma-correct */
      tex.encoding = THREE.sRGBEncoding;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        tex.image = img;
        tex.needsUpdate = true;
      };
      img.src = src;
      textures.push(tex);
      return tex;
    };

    /* ── Card Dimensions ── */
    const CW = window.innerWidth <= 1680 ? 1.55 : 1.95;
    const CH = CW / IMG_RATIO;

    /* ── Orbit Rings ── */
    let orbitRings: THREE.Line[] = [];
    const buildRings = () => {
      orbitRings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.LineBasicMaterial).dispose();
        scene.remove(r);
      });
      orbitRings = [];
      const SEG = 128;
      const mobile = isMobile();
      const OFFSETS = [CH / 1.7, 0, -CH / 1.7];
      OFFSETS.forEach((off, ri) => {
        const mat = new THREE.LineBasicMaterial({
          color: 0x555555,
          transparent: true,
          opacity: 0.45,
        });
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= SEG; i++) {
          const a = (i / SEG) * Math.PI * 2;
          if (mobile) {
            const Mr = R * 0.68;
            const mOff = off * 0.68;
            pts.push(
              new THREE.Vector3(mOff, Math.sin(a) * Mr, Math.cos(a) * Mr),
            );
          } else {
            pts.push(new THREE.Vector3(Math.sin(a) * R, off, Math.cos(a) * R));
          }
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const ring = new THREE.Line(geo, mat);
        ring.renderOrder = 1;
        ring.position.y = mobile ? 0 : 22;
        if (!mobile) {
          gsap.to(ring.position, {
            y: 0,
            duration: 1.6,
            delay: 0.3 + ri * 0.12,
            ease: "expo.out",
          });
        }
        scene.add(ring);
        orbitRings.push(ring);
      });
    };
    buildRings();

    /* ── Cards ── */
    const cards: CardData[] = [];
    labels.forEach((_, i) => {
      const geo = new THREE.PlaneGeometry(CW, CH);
      const mat = new THREE.MeshBasicMaterial({
        map: loadTex(images[i]),
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const em = new THREE.LineBasicMaterial({
        color: 0x999999,
        transparent: true,
        opacity: 0.06,
      });
      mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), em));
      mesh.position.set(0, 18 + i * 0.6, 0);
      mesh.scale.set(0.01, 0.01, 0.01);
      scene.add(mesh);
      cards.push({ mesh, mat, em, idx: i });
    });

    /* ── Text Planes ── */
    let labelMesh: THREE.Mesh | null = null;
    let motionMesh: THREE.Mesh | null = null;

    const makeCanvasTex = (
      draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
      w: number,
      h: number,
    ): THREE.CanvasTexture => {
      const oc = document.createElement("canvas");
      oc.width = w;
      oc.height = h;
      const cx = oc.getContext("2d")!;
      cx.clearRect(0, 0, w, h);
      draw(cx, w, h);
      const t = new THREE.CanvasTexture(oc);
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      return t;
    };

    document.fonts.ready.then(() => {
      /* "DESIGN IN" label */
      const texLabel = makeCanvasTex(
        (cx, w, h) => {
          cx.textAlign = "center";
          cx.textBaseline = "middle";
          cx.font = `400 60px ${fontFamily}`;
          cx.fillStyle = "#434343";
          (cx as any).letterSpacing = "18px";
          cx.fillText(heroTitle, w / 2, h / 2);
        },
        1400,
        160,
      );

      labelMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(7.5, 7.5 * (160 / 1400)),
        new THREE.MeshBasicMaterial({
          map: texLabel,
          transparent: true,
          depthTest: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      );
      labelMesh.position.set(0, 0.62, 0);
      labelMesh.renderOrder = 1;
      scene.add(labelMesh);

      /* "MOTION" subtitle */
      const motionTex = makeCanvasTex(
        (cx, w, h) => {
          cx.textAlign = "center";
          cx.textBaseline = "middle";
          cx.font = `800 380px ${fontFamily}`;
          cx.fillStyle = "#313131";
          (cx as any).letterSpacing = "40px";
          cx.fillText(heroSubtitle, w / 2, h / 2);
        },
        2600,
        440,
      );

      const mobile = isMobile();
      const motionW = mobile ? 3.8 : 6.48;
      const motionH = motionW * (440 / 2600);
      motionMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(motionW, motionH),
        new THREE.MeshBasicMaterial({
          map: motionTex,
          transparent: true,
          depthTest: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      );
      motionMesh.position.set(0, -0.45, 0);
      motionMesh.renderOrder = 1;

      if (mobile) {
        labelMesh.position.set(0, 0.35, 0);
        motionMesh.position.set(0, -0.22, 0);
        labelMesh.scale.set(0.55, 0.55, 1);
      }
      scene.add(motionMesh);
    });

    /* ── UI Update ── */
    const setActive = (idx: number) => {
      // counterEl.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;
      cards.forEach((c) => {
        const a = c.idx === idx;
        gsap.to(c.em, { opacity: a ? 0.25 : 0.06, duration: 0.5 });
        gsap.to(c.mesh.scale, {
          x: a ? 1.06 : 1,
          y: a ? 1.06 : 1,
          duration: 0.5,
          ease: "power2.out",
        });
      });
    };

    /* ── Interaction State ── */
    let scrollRot = 0,
      scrollVel = 0;
    let mnx = 0,
      mny = 0,
      camX = 0,
      camY = 0,
      tiltX = 0,
      tiltY = 0;
    let touchY0 = 0,
      touchX0 = 0,
      touchActive = false;

    /* ── Event Handlers ── */
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(mny) > 0.25 || Math.abs(mnx) > 0.6) return;
      scrollRot -= e.deltaY * 0.0008;
      scrollVel += e.deltaY * 0.6;
    };
    const handleTouchStart = (e: TouchEvent) => {
      const yP = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      const xP = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
      touchActive = Math.abs(yP) < 0.5 && Math.abs(xP) < 0.5;
      touchY0 = e.touches[0].clientY;
      touchX0 = e.touches[0].clientX;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchActive) return;
      const dy = e.touches[0].clientY - touchY0;
      const dx = e.touches[0].clientX - touchX0;
      touchY0 = e.touches[0].clientY;
      touchX0 = e.touches[0].clientX;
      const delta = isMobile() ? dy : dx;
      scrollRot += delta * 0.003;
      scrollVel -= delta * 0.8;
    };
    const handleMouseMove = (e: MouseEvent) => {
      mnx = (e.clientX / window.innerWidth - 0.5) * 6;
      mny = (e.clientY / window.innerHeight - 0.5) * 6;
    };
    const handleResize = () => {
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      resizeTrail();
      buildRings();
      const m = isMobile();
      if (motionMesh) {
        const mw = m ? 3.8 : 6.48;
        const mh = mw * (440 / 2600);
        motionMesh.scale.set(1, 1, 1);
        motionMesh.geometry.dispose();
        motionMesh.geometry = new THREE.PlaneGeometry(mw, mh);
      }
      if (labelMesh) labelMesh.scale.set(m ? 0.55 : 1, m ? 0.55 : 1, 1);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    /* ── Intro ── */
    const introProgress = Array(N).fill(0) as number[];
    cards.forEach((c, i) => {
      const delay = 0.35 + i * 0.09;
      gsap.to(introProgress, {
        [i]: 1,
        duration: 1.4,
        delay,
        ease: "expo.out",
      });
      gsap.to(c.mesh.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.2,
        delay,
        ease: "expo.out",
      });
    });

    /* ── Orbit Position ── */
    const orbitPos = (i: number, rot: number, tx: number, ty: number) => {
      const a = (i / N) * Math.PI * 2 + rot;
      if (isMobile()) {
        const Mr = R * 0.68;
        return { x: 0, y: Math.sin(a) * Mr, z: Math.cos(a) * Mr };
      }
      const bx = Math.sin(a) * R,
        bz = Math.cos(a) * R;
      return {
        x: bx * Math.cos(tx),
        y: bx * Math.sin(tx) - bz * Math.sin(ty),
        z: bz * Math.cos(ty),
      };
    };

    /* ── Animation Loop ── */
    let curRot = 0,
      tgtRot = Math.PI * 0.25,
      activeIdx = 0,
      lastTs = 0;
    let lastFrame: HTMLCanvasElement | null = null;
    let rafId: number;

    const loop = (ts: number) => {
      const dt = Math.min(ts - lastTs, 50);
      lastTs = ts;
      const mobile = isMobile();

      tgtRot -= autoRotateSpeed * dt;
      tgtRot += scrollRot;
      scrollRot *= 0.88;
      curRot += (tgtRot - curRot) * 0.055;

      if (!mobile) {
        tiltX += (mnx * 0.3 - tiltX) * 0.04;
        tiltY += (mny * 0.14 - tiltY) * 0.04;
      } else {
        tiltX += (0 - tiltX) * 0.1;
        tiltY += (0 - tiltY) * 0.1;
      }

      orbitRings.forEach((r) => {
        if (!mobile) {
          r.rotation.z = tiltX;
          r.rotation.x = tiltY;
        } else {
          r.rotation.z = 0;
          r.rotation.x = 0;
        }
      });

      const cardScale = mobile ? 0.85 : 1;
      cards.forEach((c, i) => {
        const op = introProgress[i];
        const orb = orbitPos(i, curRot, tiltX, tiltY);
        if (op < 1) {
          const startY = 18 + i * 0.6;
          c.mesh.position.set(
            orb.x * op,
            startY + (orb.y - startY) * op,
            orb.z * op,
          );
        } else {
          c.mesh.position.set(orb.x, orb.y, orb.z);
        }
        const s = introProgress[i] * cardScale;
        c.mesh.scale.set(s, s, s);
        c.mesh.lookAt(cam.position.x, cam.position.y, cam.position.z);
        c.mesh.renderOrder = orb.z < 0 ? 2 : 0;
      });

      let minZ = Infinity,
        ni = 0;
      cards.forEach((c) => {
        if (c.mesh.position.z < minZ) {
          minZ = c.mesh.position.z;
          ni = c.idx;
        }
      });
      if (ni !== activeIdx) {
        activeIdx = ni;
        setActive(activeIdx);
      }

      // const p = ((-curRot % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) / (Math.PI * 2);
      // progressEl.style.width = `${p * 100}%`;

      if (!mobile) {
        camX += (mnx * 0.35 - camX) * 0.05;
        camY += (-mny * 0.25 - camY) * 0.05;
      } else {
        camX += (0 - camX) * 0.1;
        camY += (0 - camY) * 0.1;
      }
      cam.position.x = camX;
      cam.position.y = camY;
      cam.position.z = mobile ? 11 : 9;
      scrollVel *= 0.88;

      /* Motion blur */
      const rotSpeed = Math.abs(tgtRot - curRot);
      const blurAmt = Math.min(0.82, rotSpeed * 18);
      const trailAlpha = 0.12 + blurAmt * 0.7;
      trailCtx.fillStyle = backgroundColor;
      trailCtx.fillRect(0, 0, trailCanvas.width, trailCanvas.height);
      if (lastFrame) {
        trailCtx.globalAlpha = trailAlpha;
        trailCtx.drawImage(
          lastFrame,
          0,
          0,
          trailCanvas.width,
          trailCanvas.height,
        );
        trailCtx.globalAlpha = 1;
      }

      renderer.render(scene, cam);
      lastFrame = renderer.domElement;
      rafId = requestAnimationFrame(loop);
    };

    /* ── Start ── */
    gsap.fromTo(
      cam.position,
      { z: 14 },
      { z: 9, duration: 2.0, ease: "expo.out", delay: 0.1 },
    );
    setActive(0);
    rafId = requestAnimationFrame(loop);

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      cards.forEach((c) => {
        c.mesh.geometry.dispose();
        c.mat.dispose();
        c.em.dispose();
      });
      orbitRings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.LineBasicMaterial).dispose();
      });
      [labelMesh, motionMesh].forEach((m) => {
        if (!m) return;
        m.geometry.dispose();
        const mt = m.material as THREE.MeshBasicMaterial;
        mt.map?.dispose();
        mt.dispose();
      });
      textures.forEach((t) => t.dispose());
      scene.clear();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
