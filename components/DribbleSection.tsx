"use client";

import { useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { getCanvasManager } from "@/lib/canvasManager";

gsap.registerPlugin(ScrollTrigger);

export default function DribbleSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const canvas = canvasRef.current!;
      const section = sectionRef.current!;
      const centerEl = centerRef.current!;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();

      const isMobile = () => window.innerWidth < 768;
      const isTablet = () =>
        window.innerWidth >= 768 && window.innerWidth < 1200;
      const getGridCols = () => (isMobile() ? 2 : 3);
      const getCamZ = () => (isMobile() ? 28 : isTablet() ? 24 : 22);
      const getCamFov = () => (isMobile() ? 58 : isTablet() ? 54 : 52);
      const CARD_RATIO = 568 / 812;

      function getFlatW() {
        const fov = (getCamFov() * Math.PI) / 180;
        const camZ = getCamZ();
        const vhalf = Math.tan(fov / 2) * camZ;
        const whalf = vhalf * (window.innerWidth / window.innerHeight);
        const cols = getGridCols(),
          rows = isMobile() ? 3 : 2;
        const lg = window.innerWidth >= 1440;
        const gapX = isMobile() ? 0.18 : isTablet() ? 0.28 : lg ? 0.5 : 0.38;
        const gapY = isMobile() ? 0.22 : isTablet() ? 0.36 : lg ? 0.7 : 0.55;
        const mX = isMobile() ? 0.88 : isTablet() ? 0.84 : lg ? 0.78 : 0.8;
        const mY = isMobile() ? 0.82 : isTablet() ? 0.82 : lg ? 0.78 : 0.8;
        const wFromW = (whalf * 2 * mX - (cols - 1) * gapX) / cols;
        const wFromH = (vhalf * 2 * mY - (rows - 1) * gapY) / rows / CARD_RATIO;
        return Math.min(
          wFromW,
          wFromH,
          isMobile() ? 99 : isTablet() ? 8.5 : 9.2,
        );
      }

      function getGridPos(idx: number) {
        const FW = getFlatW(),
          FH = FW * CARD_RATIO;
        const cols = getGridCols(),
          rows = isMobile() ? 3 : 2;
        const gapX = isMobile() ? 0.18 : isTablet() ? 0.28 : 0.38;
        const gapY = isMobile() ? 0.22 : isTablet() ? 0.36 : 0.55;
        const col = idx % cols,
          row = Math.floor(idx / cols);
        const tW = cols * FW + (cols - 1) * gapX;
        const tH = rows * FH + (rows - 1) * gapY;
        return new THREE.Vector3(
          -tW * 0.5 + FW * 0.5 + col * (FW + gapX),
          tH * 0.5 - FH * 0.5 - row * (FH + gapY),
          0,
        );
      }

      const cam = new THREE.PerspectiveCamera(
        getCamFov(),
        window.innerWidth / window.innerHeight,
        0.1,
        500,
      );
      cam.position.set(0, 0, getCamZ());
      cam.lookAt(0, 0, 0);

      /* video texture */
      const videoEl = Object.assign(document.createElement("video"), {
        src: "/images/orbit-video.mp4",
        loop: true,
        muted: true,
        playsInline: true,
        autoplay: true,
        crossOrigin: "anonymous",
      });
      videoEl.style.display = "none";
      document.body.appendChild(videoEl);
      videoEl.play().catch(() => {});
      const videoTex = Object.assign(new THREE.VideoTexture(videoEl), {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
      });

      /* textures: 6 placed + 9 ribbon (slot 5 = video) */
      const SRCS: (string | null)[] = [
        "/images/orbit-01.jpg",
        "/images/orbit-02.jpg",
        "/images/orbit-03.jpg",
        "/images/orbit-04.jpg",
        "/images/orbit-05.jpg",
        null,
        "/images/orbit-07.jpg",
        "/images/orbit-08.jpg",
        "/images/orbit-09.jpg",
      ];
      const loader = new THREE.TextureLoader();
      const mkTex = (src: string | null) =>
        src
          ? Object.assign(loader.load(src), {
              minFilter: THREE.LinearFilter,
              magFilter: THREE.LinearFilter,
              generateMipmaps: false,
            })
          : videoTex;
      const ribbonTextures = SRCS.map(mkTex);
      const placeTextures = SRCS.slice(0, 6).map(mkTex);
      const NP = 6;

      /* placed cards — rebuilt on resize */
      let placedCards: THREE.Mesh[] = [];
      function buildPlacedCards() {
        placedCards.forEach((m) => scene.remove(m));
        placedCards = [];
        const FW = getFlatW(),
          FH = FW * CARD_RATIO;
        const VS = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
        const FS = `uniform sampler2D map; varying vec2 vUv; void main(){ gl_FragColor=texture2D(map,vUv); }`;
        placeTextures.forEach((tex) => {
          const geo = new THREE.PlaneGeometry(FW, FH, 20, 12);
          const mesh = new THREE.Mesh(
            geo,
            new THREE.ShaderMaterial({
              uniforms: { map: { value: tex } },
              vertexShader: VS,
              fragmentShader: FS,
              side: THREE.DoubleSide,
            }),
          );
          mesh.visible = false;
          mesh.renderOrder = 3;
          mesh.frustumCulled = false;
          const arr = geo.attributes.position.array as Float32Array;
          const n = arr.length / 3;
          const rX = new Float32Array(n),
            rY = new Float32Array(n);
          for (let i = 0; i < n; i++) {
            rX[i] = arr[i * 3];
            rY[i] = arr[i * 3 + 1];
          }
          mesh.userData = { restX: rX, restY: rY, wave: 1.0, waveT: 0.0 };
          scene.add(mesh);
          placedCards.push(mesh);
        });
      }

      function applyWave(mesh: THREE.Mesh, wAmt: number, t: number, k: number) {
        const pos = mesh.geometry.attributes.position as THREE.BufferAttribute;
        const { restX: rX, restY: rY } = mesh.userData;
        const FW = getFlatW(),
          FH = FW * CARD_RATIO;
        const cols = getGridCols(),
          col = k % cols,
          row = Math.floor(k / cols);
        const isCenter = col > 0 && col < cols - 1;
        for (let i = 0; i < pos.count; i++) {
          const rx = rX[i],
            ry = rY[i];
          let nd: number;
          if (isCenter) {
            nd = 1.0 - (ry / FH + 0.5);
          } else {
            const nx = rx / FW + 0.5,
              ny = 1.0 - (ry / FH + 0.5);
            nd =
              col === 0
                ? (row === 0 ? nx + ny : nx + 1 - ny) * 0.5
                : (row === 0 ? 1 - nx + ny : 1 - nx + 1 - ny) * 0.5;
          }
          pos.setXYZ(
            i,
            rx,
            ry,
            wAmt * nd * Math.sin(nd * Math.PI * 0.9 - t * 2) * FW * 0.12,
          );
        }
        pos.needsUpdate = true;
      }

      const handleResize = () => {
        cam.fov = getCamFov();
        cam.aspect = window.innerWidth / window.innerHeight;
        cam.position.set(0, 0, getCamZ());
        cam.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        buildPlacedCards();
      };
      window.addEventListener("resize", handleResize);

      /* helix */
      const TURNS = 2.0,
        R = 12.0,
        RISE = 28.0,
        Y_START = -16.0;
      const CARD_W = 5.8,
        CARD_H = CARD_W * CARD_RATIO,
        W_SEGS = 116;
      const pitchPerRad = RISE / (TURNS * Math.PI * 2);
      const dsPerRad = Math.sqrt(R * R + pitchPerRad * pitchPerRad);
      const totalArc = TURNS * Math.PI * 2 * dsPerRad;
      const MID = TURNS * Math.PI,
        DIP_A = 2.5,
        DIP_S = 2.0;

      const dip = (a: number) => {
        const d = (a - MID) / DIP_S;
        return DIP_A * Math.exp(-d * d);
      };
      const hPos = (a: number) =>
        new THREE.Vector3(
          R * Math.cos(a),
          Y_START + a * pitchPerRad - dip(a),
          R * Math.sin(a),
        );
      const hTan = (a: number) => {
        const d = (a - MID) / DIP_S,
          dd = ((-2 * d) / DIP_S) * DIP_A * Math.exp(-d * d);
        return new THREE.Vector3(
          -R * Math.sin(a),
          pitchPerRad - dd,
          R * Math.cos(a),
        ).normalize();
      };

      /* spring line */
      {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 400; i++)
          pts.push(hPos((i / 400) * TURNS * Math.PI * 2));
        scene.add(
          new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(pts),
            new THREE.LineBasicMaterial({
              color: 0x666666,
              transparent: true,
              opacity: 0, // line opacity
            }),
          ),
        );
      }

      /* ribbon cards */
      const VS_R = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
      const FS_R = `uniform sampler2D map; varying vec2 vUv; void main(){ vec2 uv=vUv; if(gl_FrontFacing) uv.x=1.0-uv.x; gl_FragColor=texture2D(map,uv); }`;
      const cards = ribbonTextures.map((tex) => {
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(1, 1, W_SEGS, 1),
          new THREE.ShaderMaterial({
            uniforms: { map: { value: tex } },
            vertexShader: VS_R,
            fragmentShader: FS_R,
            side: THREE.DoubleSide,
          }),
        );
        mesh.visible = false;
        mesh.renderOrder = 1;
        mesh.frustumCulled = false;
        scene.add(mesh);
        return mesh;
      });

      function wrapCardOnHelix(
        mesh: THREE.Mesh,
        arcStart: number,
        arcWidth: number,
      ) {
        const pos = mesh.geometry.attributes.position as THREE.BufferAttribute;
        const uv = mesh.geometry.attributes.uv as THREE.BufferAttribute;
        const C = W_SEGS + 1;
        for (let row = 0; row < 2; row++) {
          const ny = row === 0 ? -0.5 : 0.5;
          for (let col = 0; col < C; col++) {
            const nx = col / W_SEGS,
              angle = (arcStart + nx * arcWidth) / dsPerRad;
            const cp = hPos(angle),
              up = new THREE.Vector3()
                .crossVectors(
                  hTan(angle),
                  new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)),
                )
                .normalize();
            up.y += 0.6;
            up.normalize();
            const i = row * C + col;
            pos.setXYZ(
              i,
              cp.x + up.x * ny * CARD_H,
              cp.y + up.y * ny * CARD_H,
              cp.z + up.z * ny * CARD_H,
            );
            uv.setXY(i, nx, row);
          }
        }
        pos.needsUpdate = true;
        uv.needsUpdate = true;
        mesh.position.set(0, 0, 0);
        mesh.rotation.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);
      }

      buildPlacedCards();

      const N = SRCS.length;
      const slotArc = CARD_W;
      const totArcN = (N - 1) * slotArc + CARD_W;
      const GRID_START =
        ((totalArc * 0.5 + totArcN + 10.0) / (totalArc + totArcN)) *
        (400 / 600);

      /* ScrollTrigger pin — replaces Lenis + driver div */
      let prog = 0;
      /* Extra 100vh for the footer-shutter reveal after animations finish */
      const totalScroll = window.innerHeight * 6; // 500% for animation + 100% for shutter
      const animationEnd = (window.innerHeight * 5) / totalScroll; // animation occupies first 5/6

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${totalScroll}`,
        pin: true,
        scrub: true,
        onUpdate(self) {
          prog = Math.min(self.progress / animationEnd, 1);
        },
      });

      /* Ensure the pin-spacer has a low z-index so the footer can cover it */
      ScrollTrigger.refresh();
      const pinSpacer = section.parentElement;
      if (pinSpacer && pinSpacer.classList.contains("pin-spacer")) {
        pinSpacer.style.zIndex = "1";
        pinSpacer.style.position = "relative";
      }

      /* render loop via canvasManager */
      const renderFrame = () => {
        const rProg = Math.min(1, prog / (400 / 600));
        const offset = rProg * (totalArc + totArcN) - totArcN + 25.0;
        for (let k = 0; k < N; k++) {
          const s = offset + k * slotArc,
            on = rProg < 1 && s > 0 && s < totalArc;
          cards[k].visible = on;
          if (on)
            wrapCardOnHelix(cards[k], Math.min(s, totalArc - 0.001), CARD_W);
        }

        const gProg = Math.max(
          0,
          Math.min(1, (prog - GRID_START) / (1 - GRID_START)),
        );
        const tFade = Math.max(0, 1 - gProg * 4);
        centerEl.style.opacity = String(tFade);
        // centerEl.style.transform = `translate(-50%,calc(-50% - ${gProg * 20}px))`;

        const fov = (getCamFov() * Math.PI) / 180;
        const hH = Math.tan(fov / 2) * cam.position.z;
        const hW = hH * cam.aspect;
        const FW = getFlatW(),
          FH = FW * CARD_RATIO;
        const cols = getGridCols();

        for (let k = 0; k < NP; k++) {
          const mesh = placedCards[k];
          if (!mesh) continue;
          const dp = Math.max(0, Math.min(1, (gProg - k * 0.08) / 0.4));
          if (dp <= 0 && !mesh.userData.wave) {
            mesh.visible = false;
            continue;
          }
          mesh.visible = true;
          const ease = 1 - Math.pow(1 - dp, 3),
            to = getGridPos(k);
          const col = k % cols,
            fromTop = k < cols;
          const sY = fromTop ? hH + FH * 2 : -hH - FH * 2;
          const sX =
            col === 0 ? -hW - FW * 2 : col === cols - 1 ? hW + FW * 2 : to.x;
          mesh.position.set(
            sX + (to.x - sX) * ease,
            sY + (to.y - sY) * ease,
            0,
          );
          mesh.userData.waveT += 0.018;
          mesh.userData.wave =
            dp < 1
              ? Math.min(1, mesh.userData.wave + 0.03)
              : Math.max(0, mesh.userData.wave - 0.012);
          applyWave(mesh, mesh.userData.wave, mesh.userData.waveT, k);
        }

        renderer.render(scene, cam);
      };

      const manager = getCanvasManager();
      const loopId = manager.register(renderFrame, false);

      /* IntersectionObserver — activate/deactivate render loop */
      const io = new IntersectionObserver(
        ([entry]) => manager.setActive(loopId, entry.isIntersecting),
        { root: null, threshold: 0, rootMargin: "64px 0px" },
      );
      io.observe(section);

      /* cleanup */
      return () => {
        window.removeEventListener("resize", handleResize);
        manager.unregister(loopId);
        io.disconnect();
        st.kill();
        videoEl.pause();
        videoEl.remove();
        renderer.dispose();
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            if (obj.material instanceof THREE.Material) obj.material.dispose();
          }
        });
      };
    },
    { scope: sectionRef },
  );

  return (
    <>
      <div ref={sectionRef} className="relative z-1 h-screen bg-[linear-gradient(0deg,#C3C3C3_0%,#FFFFFF_100%)]">
        <div className="w-full h-full overflow-hidden flex items-center flex-col justify-center">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full  pointer-events-none"
          />
          {/* Center text */}
          <div
            ref={centerRef}
            className="text-center pointer-events-none select-none"
          >
            <h1 className="text-[clamp(48px,7vw,96px)] font-light text-[#3a3a3a] tracking-[-0.02em] leading-[1.05] mb-4.5 md:max-lg:text-[clamp(32px,5vw,72px)] max-md:text-[clamp(26px,8vw,48px)] max-[399px]:text-[clamp(22px,7.5vw,36px)]">
              Design in motion
            </h1>
            <p className="text-[clamp(13px,1.1vw,16px)] font-light text-[#555] leading-[1.7] md:max-lg:text-[clamp(12px,1.4vw,16px)] max-md:text-[clamp(10px,3vw,13px)] max-[399px]:text-[10px]">
              Exploring ideas through
              <br />
              daily design practice.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
