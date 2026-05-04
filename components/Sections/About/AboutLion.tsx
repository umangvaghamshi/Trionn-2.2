"use client";

import { useEffect, useRef } from "react";
import { getCanvasManager } from "@/lib/canvasManager";
import { useSiteSound } from "@/components/SiteSoundContext";
import { useTransitionReady } from "@/components/Transition";

const MOBILE_BREAKPOINT = 768;
const STRIP_HEIGHT = 28;
const STRIP_GAP = 7;
const STEP = STRIP_HEIGHT + STRIP_GAP;
const SEGS = 32;
const SIGMA = 0.18;
const SIGMA_INV = 1 / (2 * SIGMA * SIGMA);
const STRIP_FILL = "#FFF7D8";
const STRIP_CLEAR = "rgba(255,247,216,0)";
const STRIP_BORDER = "rgba(255,247,216,0.5)";

const ASSETS_BY_MODE = {
  desktop: {
    image: "/images/about/lion.png",
    depth: "/images/about/lion-depth.png",
  },
  mobile: {
    image: "/images/about/lion-mobile.png",
    depth: "/images/about/lion-mobile-depth.png",
  },
} as const;

const VERTEX_SRC = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT_SRC = `
precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform sampler2D uImage;
uniform sampler2D uDepth;
uniform vec2 uImageScale;
uniform vec2 uMouseEase;
uniform float uTime;
uniform float uHover;

vec2 containUv(vec2 uv, vec2 viewport, vec2 image) {
  float vr = viewport.x / viewport.y;
  float ir = image.x / image.y;
  vec2 scale = vec2(1.0);
  if (vr > ir) scale.x = ir / vr; else scale.y = vr / ir;
  return (uv - 0.5) / scale + 0.5;
}

void main() {
  vec2 contained = containUv(vUv, uResolution, uImageScale);
  bool outside = contained.x < 0.0 || contained.x > 1.0 || contained.y < 0.0 || contained.y > 1.0;
  vec3 bg = vec3(1.0);
  if (outside) { gl_FragColor = vec4(bg, 1.0); return; }
  vec2 mouse = (uMouseEase - 0.5) * vec2(2.0, -2.0);
  float depth = texture2D(uDepth, contained).r;
  float breathing = sin(uTime * 0.0012) * 0.5 + 0.5;
  float amount = (0.03 + 0.012 * breathing) * uHover;
  vec2 disp = mouse * depth * amount;
  vec2 uv = contained - disp;
  float r = texture2D(uImage, uv + disp * 0.16).r;
  float g = texture2D(uImage, uv).g;
  float b = texture2D(uImage, uv - disp * 0.16).b;
  float a = texture2D(uImage, uv).a;
  vec3 color = mix(bg, vec3(r,g,b), a);
  gl_FragColor = vec4(color, 1.0);
}`;

type Mode = keyof typeof ASSETS_BY_MODE;

interface AboutLionProps {
  className?: string;
  onLoad?: () => void;
  children?: React.ReactNode;
}

/**
 * Renders the fake-3D lion hero: a WebGL depth-displaced portrait with
 * interactive, draggable horizontal strips overlaid on top.
 *
 * Ported from the standalone About-Lion-TOP-Section prototype.
 */
export default function AboutLion({
  className = "",
  onLoad,
  children,
}: AboutLionProps) {
  const { soundEnabled } = useSiteSound();
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const sceneRef = useRef<HTMLDivElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const stripContainerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);
  const transitionReady = useTransitionReady();

  useEffect(() => {
    if (!transitionReady) return;
    const scene = sceneRef.current;
    const canvas = glCanvasRef.current;
    const stripContainer = stripContainerRef.current;
    if (!scene || !canvas || !stripContainer) return;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: false,
      premultipliedAlpha: false,
    });
    if (!gl) {
      console.warn("WebGL not supported; lion animation disabled.");
      return;
    }

    let disposed = false;

    // --------------- Audio ---------------
    const audioCtx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    let curtainBuffer: AudioBuffer | null = null;
    let lionGrowlBuffer: AudioBuffer | null = null;
    let dragSource: AudioBufferSourceNode | null = null;
    let dragGain: GainNode | null = null;
    let growlSource: AudioBufferSourceNode | null = null;
    let growlGain: GainNode | null = null;
    let dragSpeed = 0;
    let lastPointerY = 0;
    let dragStartTime = 0;

    fetch("/audio/curtain.mp3")
      .then((r) => r.arrayBuffer())
      .then((ab) => audioCtx.decodeAudioData(ab))
      .then((buf) => {
        curtainBuffer = buf;
      })
      .catch((e) => console.warn("Failed to load curtain audio", e));

    fetch("/audio/lion-growl.mp3")
      .then((r) => r.arrayBuffer())
      .then((ab) => audioCtx.decodeAudioData(ab))
      .then((buf) => {
        lionGrowlBuffer = buf;
      })
      .catch((e) => console.warn("Failed to load lion growl audio", e));

    const playDragSound = () => {
      if (!soundEnabledRef.current) return;
      if (audioCtx.state === "suspended") audioCtx.resume();

      dragStartTime = audioCtx.currentTime;

      if (curtainBuffer) {
        if (dragSource) {
          try {
            dragSource.stop();
          } catch (e) {}
        }

        const duration = curtainBuffer.duration;
        const dragStart = Math.min(0.1, duration * 0.1);
        const dragEnd = Math.min(1.5, duration * 0.5);

        dragSource = audioCtx.createBufferSource();
        dragSource.buffer = curtainBuffer;
        dragSource.loop = true;
        dragSource.loopStart = dragStart;
        dragSource.loopEnd = dragEnd;

        dragGain = audioCtx.createGain();
        dragGain.gain.value = 0;

        dragSource.connect(dragGain);
        dragGain.connect(audioCtx.destination);

        dragSource.start(0, dragStart);
      }

      if (lionGrowlBuffer) {
        if (growlSource) {
          try {
            growlSource.stop();
          } catch (e) {}
        }

        const duration = lionGrowlBuffer.duration;
        // The audio is about 3 seconds long. Pick a random starting point.
        // Leave at least 0.8 seconds of audio to play so it doesn't cut off instantly.
        const maxStart = Math.max(0, duration - 1.7);
        const randomStart = Math.random() * maxStart;

        growlSource = audioCtx.createBufferSource();
        growlSource.buffer = lionGrowlBuffer;
        growlSource.loop = false; // Do not loop

        growlGain = audioCtx.createGain();
        growlGain.gain.value = 0;

        growlSource.connect(growlGain);
        growlGain.connect(audioCtx.destination);

        growlSource.start(0, randomStart);
      }
    };

    const stopDragAndPlayRelease = () => {
      if (!soundEnabledRef.current) return;

      if (dragGain && dragSource) {
        dragGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.02);
        const src = dragSource;
        setTimeout(() => {
          try {
            src.stop();
          } catch (e) {}
        }, 50);
      }
      dragSource = null;
      dragGain = null;

      if (growlGain && growlSource) {
        growlGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
        const gSrc = growlSource;
        setTimeout(() => {
          try {
            gSrc.stop();
          } catch (e) {}
        }, 300);
      }
      growlSource = null;
      growlGain = null;

      if (audioCtx.state === "suspended") audioCtx.resume();

      if (curtainBuffer) {
        const duration = curtainBuffer.duration;
        // Start the release sound further into the clip and make it shorter
        const releaseStart = Math.min(1.8, duration * 0.6);

        const relSource = audioCtx.createBufferSource();
        relSource.buffer = curtainBuffer;

        const relGain = audioCtx.createGain();
        // Make release sound softer than the drag sound
        relGain.gain.value = 0.4;
        relGain.gain.setTargetAtTime(0, audioCtx.currentTime + 0.2, 0.1); // faster fade out

        relSource.connect(relGain);
        relGain.connect(audioCtx.destination);

        relSource.start(0, releaseStart);
      }
    };

    // --------------- Strips (draggable interactive overlay) ---------------
    let stripCanvas: HTMLCanvasElement | null = null;
    let sctx: CanvasRenderingContext2D | null = null;
    let containerW = 1;
    let containerH = 1;
    let stripCount = 0;
    let segW = 1;
    let offY: Float32Array | null = null;
    let velY: Float32Array | null = null;
    let topYBuffer: Float32Array | null = null;
    let dragging = false;
    let dragStrip = -1;
    let dragSeg = -1;
    let stripActive = true;
    const dragEnvelope = new Float32Array(SEGS + 1);

    const updateDragEnvelope = () => {
      const clickSeg = dragSeg >= 0 ? dragSeg : SEGS / 2;
      const clickX = clickSeg / SEGS;
      for (let s = 0; s <= SEGS; s++) {
        const t = s / SEGS;
        const dx = t - clickX;
        dragEnvelope[s] = Math.exp(-(dx * dx) * SIGMA_INV);
      }
    };
    updateDragEnvelope();

    const markStripsDirty = () => {
      stripActive = true;
    };

    const onStripMouseDown = (e: MouseEvent) => {
      if (!stripCanvas) return;
      const r = stripCanvas.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const si = Math.floor(my / STEP);
      if (si < 0 || si >= stripCount) return;
      dragging = true;
      dragStrip = si;
      dragSeg = Math.round((mx / containerW) * SEGS);

      lastPointerY = my;
      dragSpeed = 0;

      updateDragEnvelope();
      markStripsDirty();
      e.preventDefault();

      playDragSound();
    };

    const onStripTouchStart = (e: TouchEvent) => {
      if (!stripCanvas || !e.touches.length) return;
      const r = stripCanvas.getBoundingClientRect();
      const t0 = e.touches[0];
      const mx = t0.clientX - r.left;
      const my = t0.clientY - r.top;
      const si = Math.floor(my / STEP);
      if (si < 0 || si >= stripCount) return;
      dragging = true;
      dragStrip = si;
      dragSeg = Math.round((mx / containerW) * SEGS);

      lastPointerY = my;
      dragSpeed = 0;

      updateDragEnvelope();
      markStripsDirty();

      playDragSound();
    };

    const onWindowMouseMove = (e: MouseEvent) => {
      if (!dragging || !stripCanvas || !offY) return;
      const r = stripCanvas.getBoundingClientRect();
      const pointerY = e.clientY - r.top;

      dragSpeed += Math.abs(pointerY - lastPointerY);
      lastPointerY = pointerY;

      const restY = dragStrip * STEP;
      offY[dragStrip] = pointerY - restY - STRIP_HEIGHT / 2;
      markStripsDirty();
    };

    const onWindowTouchMove = (e: TouchEvent) => {
      if (!dragging || !stripCanvas || !offY || !e.touches.length) return;
      const r = stripCanvas.getBoundingClientRect();
      const pointerY = e.touches[0].clientY - r.top;

      dragSpeed += Math.abs(pointerY - lastPointerY);
      lastPointerY = pointerY;

      const restY = dragStrip * STEP;
      offY[dragStrip] = pointerY - restY - STRIP_HEIGHT / 2;
      markStripsDirty();
    };

    const onWindowPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      markStripsDirty();

      stopDragAndPlayRelease();
    };

    const buildStrips = (w: number, h: number) => {
      containerW = w;
      containerH = h;
      segW = containerW / SEGS;

      if (!stripCanvas) {
        stripCanvas = document.createElement("canvas");
        stripCanvas.style.cssText =
          "position:absolute;inset:0;display:block;cursor:ns-resize;touch-action:none;z-index:2;pointer-events:auto;";
        stripContainer.appendChild(stripCanvas);
        stripCanvas.addEventListener("mousedown", onStripMouseDown);
        stripCanvas.addEventListener("touchstart", onStripTouchStart, {
          passive: true,
        });
      }

      stripCanvas.width = Math.round(w);
      stripCanvas.height = Math.round(h);
      stripCanvas.style.width = `${w}px`;
      stripCanvas.style.height = `${h}px`;
      sctx = stripCanvas.getContext("2d");

      stripCount = Math.ceil(h / STEP) + 2;
      offY = new Float32Array(stripCount);
      velY = new Float32Array(stripCount);
      topYBuffer = new Float32Array(stripCount);
      stripActive = true;
      updateDragEnvelope();
    };

    const traceStripShape = (
      restY: number,
      displacement: number,
      stripH: number,
    ) => {
      if (!sctx) return;
      for (let s = 0; s <= SEGS; s++) {
        const x = s * segW;
        const py = restY + displacement * dragEnvelope[s];
        if (s === 0) sctx.moveTo(x, py);
        else sctx.lineTo(x, py);
      }
      for (let s = SEGS; s >= 0; s--) {
        const x = s * segW;
        const py = restY + displacement * dragEnvelope[s] + stripH;
        sctx.lineTo(x, py);
      }
      sctx.closePath();
    };

    const traceStripTop = (restY: number, displacement: number) => {
      if (!sctx) return;
      for (let s = 0; s <= SEGS; s++) {
        const x = s * segW;
        const py = restY + displacement * dragEnvelope[s];
        if (s === 0) sctx.moveTo(x, py);
        else sctx.lineTo(x, py);
      }
    };

    const drawStrip = (i: number, topY: number, stripH: number) => {
      if (!sctx) return;
      if (stripH < 0.5) return;

      const restY = i * STEP;
      const displacement = topY - restY;

      sctx.beginPath();
      traceStripShape(restY, displacement, stripH);
      const grad = sctx.createLinearGradient(0, topY, 0, topY + stripH * 2.0);
      grad.addColorStop(0, STRIP_CLEAR);
      grad.addColorStop(1, STRIP_FILL);
      sctx.fillStyle = grad;
      sctx.fill();

      if (displacement < 0) {
        const strength = Math.min(1, Math.abs(displacement) / 30);
        sctx.beginPath();
        traceStripShape(restY, displacement, stripH);
        const gradUp = sctx.createLinearGradient(0, topY + stripH, 0, topY);
        gradUp.addColorStop(0, STRIP_CLEAR);
        gradUp.addColorStop(1, `rgba(255,247,216,${strength.toFixed(3)})`);
        sctx.fillStyle = gradUp;
        sctx.fill();
      }

      sctx.beginPath();
      traceStripTop(restY, displacement);
      sctx.strokeStyle = STRIP_BORDER;
      sctx.lineWidth = 1;
      sctx.stroke();
    };

    const physicsStep = (): boolean => {
      if (!offY || !velY) return false;
      let active = false;

      for (let i = 0; i < stripCount; i++) {
        if (dragging && i === dragStrip) {
          active = true;
          continue;
        }

        if (dragging && dragStrip >= 0) {
          const dy = offY[dragStrip];
          if (dy > 0 && i < dragStrip) {
            if (offY[i] !== 0 || velY[i] !== 0) active = true;
            offY[i] = 0;
            velY[i] = 0;
            continue;
          }
          if (dy < 0 && i > dragStrip) {
            if (offY[i] !== 0 || velY[i] !== 0) active = true;
            offY[i] = 0;
            velY[i] = 0;
            continue;
          }
        }

        const sp = -offY[i] * 0.12;
        velY[i] = (velY[i] + sp) * 0.65;
        offY[i] += velY[i];

        if (Math.abs(offY[i]) < 0.01 && Math.abs(velY[i]) < 0.01) {
          offY[i] = 0;
          velY[i] = 0;
        } else {
          active = true;
        }
      }

      if (!dragging || dragStrip < 0) return active;

      const dy = offY[dragStrip];
      if (dy === 0) return true;

      const maxVel = 18;

      if (dy > 0) {
        for (let ii = 1; ii < stripCount; ii++) {
          const ni = dragStrip + ii;
          const ai = dragStrip + ii - 1;
          if (ni >= stripCount) break;

          const aboveTop = ai * STEP + offY[ai];
          const aboveBot = aboveTop + STRIP_HEIGHT;
          const thisRest = ni * STEP;
          const overlap = aboveBot - thisRest;
          if (overlap <= 0) break;

          const tgt = overlap;
          const sp = (tgt - offY[ni]) * 0.22;
          velY[ni] = (velY[ni] + sp) * 0.62;
          velY[ni] = Math.max(-maxVel, Math.min(maxVel, velY[ni]));
          offY[ni] += velY[ni];
          if (offY[ni] > offY[dragStrip]) {
            offY[ni] = offY[dragStrip];
            velY[ni] = 0;
          }
          active = true;
        }
      } else {
        for (let ii = 1; ii < stripCount; ii++) {
          const ni = dragStrip - ii;
          const ai = dragStrip - ii + 1;
          if (ni < 0) break;

          const belowTop = ai * STEP + offY[ai];
          const thisRest = ni * STEP;
          const thisBotRest = thisRest + STRIP_HEIGHT;
          const overlap = thisBotRest - belowTop;
          if (overlap <= 0) break;

          const tgt2 = -overlap;
          const sp2 = (tgt2 - offY[ni]) * 0.22;
          velY[ni] = (velY[ni] + sp2) * 0.62;
          velY[ni] = Math.max(-maxVel, Math.min(maxVel, velY[ni]));
          offY[ni] += velY[ni];
          active = true;
        }
      }

      return active;
    };

    const renderStrips = () => {
      if (!sctx || !stripActive || !offY || !topYBuffer) return;

      sctx.clearRect(0, 0, containerW, containerH);
      const stillActive = physicsStep();

      for (let i = 0; i < stripCount; i++) {
        topYBuffer[i] = i * STEP + offY[i];
      }

      for (let i = 0; i < stripCount; i++) {
        const nextTop =
          i + 1 < stripCount ? topYBuffer[i + 1] : topYBuffer[i] + STEP;
        const spaceDown = nextTop - topYBuffer[i];
        const thinDown = Math.max(0, STEP - spaceDown);

        const prevTop = i > 0 ? topYBuffer[i - 1] : topYBuffer[i] - STEP;
        const spaceUp = topYBuffer[i] - prevTop;
        const thinUp = Math.max(0, STEP - spaceUp);

        const thinning = Math.max(thinDown, thinUp);
        const h = Math.max(1, STRIP_HEIGHT - thinning * 0.9);

        drawStrip(i, topYBuffer[i], h);
      }

      stripActive = stillActive;
    };

    // --------------- WebGL program ---------------
    const createShader = (type: number, src: string): WebGLShader => {
      const s = gl.createShader(type);
      if (!s) throw new Error("Failed to create shader");
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(s);
        gl.deleteShader(s);
        throw new Error(info ?? "Shader compile error");
      }
      return s;
    };

    const createProgram = (vs: string, fs: string): WebGLProgram => {
      const p = gl.createProgram();
      if (!p) throw new Error("Failed to create program");
      gl.attachShader(p, createShader(gl.VERTEX_SHADER, vs));
      gl.attachShader(p, createShader(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(p);
        gl.deleteProgram(p);
        throw new Error(info ?? "Program link error");
      }
      return p;
    };

    const createTexture = (img: HTMLImageElement): WebGLTexture => {
      const t = gl.createTexture();
      if (!t) throw new Error("Failed to create texture");
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.bindTexture(gl.TEXTURE_2D, null);
      return t;
    };

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = src;
      });

    const prog = createProgram(VERTEX_SRC, FRAGMENT_SRC);
    gl.useProgram(prog);

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPosLoc = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      resolution: gl.getUniformLocation(prog, "uResolution"),
      image: gl.getUniformLocation(prog, "uImage"),
      depth: gl.getUniformLocation(prog, "uDepth"),
      imageScale: gl.getUniformLocation(prog, "uImageScale"),
      mouseEase: gl.getUniformLocation(prog, "uMouseEase"),
      time: gl.getUniformLocation(prog, "uTime"),
      hover: gl.getUniformLocation(prog, "uHover"),
    };

    const state = {
      mouse: { x: 0.5, y: 0.5 },
      eased: { x: 0.5, y: 0.5 },
      hover: 1,
      width: 1,
      height: 1,
      imageWidth: 1,
      imageHeight: 1,
      mode: null as Mode | null,
    };

    let resizeRaf = 0;
    let textures: WebGLTexture[] = [];

    const getMode = (): Mode =>
      window.innerWidth <= MOBILE_BREAKPOINT ? "mobile" : "desktop";

    const applyCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const vw = Math.max(window.innerWidth, 1);
      // Lion canvas is capped at the image's natural width so it never gets
      // stretched/blurred, but the scene (and strip overlay) span full viewport
      // width so the strips always reach the edges of the screen.
      const cw = Math.min(state.imageWidth, vw);
      const ch = Math.max(
        1,
        Math.round(state.imageHeight * (cw / state.imageWidth)),
      );

      // Use px (not rem) — this app uses a fluid root font-size
      // (`calc(1000vw / var(--size))`), so 1rem is not 16px. Using rem here
      // would desync the CSS height of the scene from the strip canvas height,
      // leaving the bottom of the lion without strip coverage on big screens.
      scene.style.width = `${vw}px`;
      scene.style.height = `${ch}px`;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      canvas.width = Math.max(1, Math.round(cw * dpr));
      canvas.height = Math.max(1, Math.round(ch * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      state.width = canvas.width;
      state.height = canvas.height;
      buildStrips(vw, ch);
    };

    const updatePointer = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      state.mouse.x = Math.max(0, Math.min(1, (cx - r.left) / r.width));
      state.mouse.y = Math.max(0, Math.min(1, (cy - r.top) / r.height));
      state.hover = 1;
    };

    const loadMode = async (mode: Mode) => {
      const a = ASSETS_BY_MODE[mode];
      const [image, depth] = await Promise.all([
        loadImage(a.image),
        loadImage(a.depth),
      ]);
      if (disposed) return;
      state.imageWidth = image.naturalWidth || image.width;
      state.imageHeight = image.naturalHeight || image.height;
      const it = createTexture(image);
      const dt = createTexture(depth);
      textures.push(it, dt);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, it);
      gl.uniform1i(uniforms.image, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, dt);
      gl.uniform1i(uniforms.depth, 1);
      gl.uniform2f(uniforms.imageScale, state.imageWidth, state.imageHeight);
      state.mode = mode;
      applyCanvasSize();

      if (onLoad && !loadedRef.current) {
        loadedRef.current = true;
        onLoad();
      }
    };

    const ensureMode = async () => {
      const next = getMode();
      if (next === state.mode) {
        applyCanvasSize();
        return;
      }
      await loadMode(next);
    };

    const scheduleResize = () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        ensureMode().catch(handleLoadError);
      });
    };

    const handleLoadError = (err: unknown) => {
      console.error("AboutLion: failed to load assets", err);
    };

    const onResize = () => scheduleResize();
    const onMouseMove = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);
    const onMouseLeave = () => {
      state.mouse.x = 0.5;
      state.mouse.y = 0.5;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length)
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length)
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("mousemove", onWindowMouseMove);
    window.addEventListener("touchmove", onWindowTouchMove, { passive: true });
    window.addEventListener("mouseup", onWindowPointerUp);
    window.addEventListener("touchend", onWindowPointerUp);

    const render = (time: number) => {
      state.eased.x += (state.mouse.x - state.eased.x) * 0.07;
      state.eased.y += (state.mouse.y - state.eased.y) * 0.07;
      gl.uniform2f(uniforms.resolution, state.width, state.height);
      gl.uniform2f(uniforms.mouseEase, state.eased.x, state.eased.y);
      gl.uniform1f(uniforms.time, time);
      gl.uniform1f(uniforms.hover, state.hover);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      renderStrips();

      // Audio sync with drag
      if (dragging && soundEnabledRef.current) {
        let targetVolume = 0;
        let growlVolume = 0;

        // As long as there is some drag movement, provide a strong base volume (0.6)
        // so it's clearly audible even at 40-50% system volume.
        // It ramps up to 1.0 for faster dragging.
        if (dragSpeed > 0.5) {
          targetVolume = Math.min(1.0, 0.6 + dragSpeed * 0.02);
        }

        // Delay the growl sound slightly (0.4s) so the initial curtain sound plays first.
        // The growl will continue playing as long as you hold the curtain, even if you stop moving your mouse.
        const dragDuration = audioCtx.currentTime - dragStartTime;
        if (dragDuration > 0.4) {
          // Smoothly fade in the growl
          const growlFade = Math.min(1.0, (dragDuration - 0.4) * 2.0);
          // Base growl volume is 0.4 (audible while holding still), increases slightly if you move the mouse
          growlVolume = Math.min(0.6, 0.4 + dragSpeed * 0.01) * growlFade;
        }

        if (dragGain) {
          // Faster volume response so it syncs perfectly with starts/stops
          dragGain.gain.setTargetAtTime(
            targetVolume,
            audioCtx.currentTime,
            0.03,
          );
        }

        if (growlGain) {
          growlGain.gain.setTargetAtTime(
            growlVolume,
            audioCtx.currentTime,
            0.05,
          );
        }

        // Decay drag speed so the sound stops quickly when the user stops moving their mouse
        dragSpeed *= 0.7;
      }
    };

    const manager = getCanvasManager();
    const loopId = manager.register(render, false);

    const io = new IntersectionObserver(
      ([entry]) => manager.setActive(loopId, entry.isIntersecting),
      { root: null, threshold: 0, rootMargin: "64px 0px" },
    );
    io.observe(scene);

    ensureMode().catch(handleLoadError);

    return () => {
      disposed = true;
      manager.unregister(loopId);
      io.disconnect();

      if (dragSource) {
        try {
          dragSource.stop();
        } catch (e) {}
      }
      if (growlSource) {
        try {
          growlSource.stop();
        } catch (e) {}
      }
      if (audioCtx && audioCtx.state !== "closed") {
        audioCtx.close().catch(() => {});
      }

      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("mousemove", onWindowMouseMove);
      window.removeEventListener("touchmove", onWindowTouchMove);
      window.removeEventListener("mouseup", onWindowPointerUp);
      window.removeEventListener("touchend", onWindowPointerUp);

      if (stripCanvas) {
        stripCanvas.removeEventListener("mousedown", onStripMouseDown);
        stripCanvas.removeEventListener("touchstart", onStripTouchStart);
        stripCanvas.remove();
        stripCanvas = null;
      }

      if (resizeRaf) cancelAnimationFrame(resizeRaf);

      textures.forEach((t) => gl.deleteTexture(t));
      textures = [];
      gl.deleteBuffer(posBuf);
      gl.deleteProgram(prog);
    };
  }, [transitionReady,onLoad]);

  return (
    <div
      ref={sceneRef}
      // Reserve space up-front using CSS (aspect-ratio + max-height) so the
      // layout doesn't collapse before the WebGL canvas loads. JS still takes
      // over with precise px dimensions once the image is ready.
      className={`relative leading-0 mx-auto w-screen aspect-[660/1434] max-h-[1434px] md:aspect-[2048/1200] md:max-h-[1200px] ${className}`}
    >
      <canvas
        ref={glCanvasRef}
        className="block mx-auto touch-none h-full aspect-[660/1434] md:aspect-[2048/1200]"
      />
      {children}
      <div
        ref={stripContainerRef}
        className="absolute inset-0 z-2 pointer-events-none overflow-hidden w-full h-full"
        style={{
          mixBlendMode: "luminosity",
          opacity: 0.9,
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskComposite: "destination-in",
          maskComposite: "intersect",
        }}
      />
    </div>
  );
}
