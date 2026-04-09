"use client";

import { useEffect, useRef } from "react";
import { useFooterAtmosphere } from "./FooterAtmosphere";

/**
 * Internal canvas resolution multiplier (fog is soft; shader cost scales with pixels).
 * Lower = faster; 0.65–0.8 is usually visually fine on retina.
 */
const FOG_CANVAS_MAX_DPR = 0.72;
/** Cap animation rate to reduce GPU + main-thread load when footer is visible. */
const FOG_MIN_FRAME_MS = 1000 / 30;

/** WebGL smoke/fog — ported from trionn-logo-footer/fog.js, scoped to container. */
export default function FooterFog() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { smokePulseRef, getSmokeAnalyser, audioContextRef } = useFooterAtmosphere();
  const rafRef = useRef<number>(0);
  const glRef = useRef<WebGLRenderingContext | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    /** Pause WebGL loop when footer is off-screen — avoids fighting other canvases (Three.js). */
    let footerVisible = false;
    let rafId = 0;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) return;
    glRef.current = gl;

    const vert = `attribute vec2 p; void main(){ gl_Position=vec4(p,0.,1.); }`;

    const frag = `
    precision highp float;
    uniform float T;
    uniform float M;
    uniform float H;
    uniform vec2  R;

    float hash(vec2 p){
      p = fract(p * vec2(127.34, 311.7));
      p += dot(p, p + 19.19);
      return fract(p.x * p.y);
    }
    float vnoise(vec2 p){
      vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
      return mix(
        mix(hash(i),           hash(i+vec2(1,0)), u.x),
        mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
    }
    float fbm(vec2 p){
      float v=0., a=.5;
      for(int i=0;i<3;i++){
        v += a * vnoise(p);
        p  = p * 2.1 + vec2(3.7, 8.3);
        a *= 0.5;
      }
      return v;
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / R;
      float y = uv.y;
      float aspect = R.x / R.y;

      float vMask = 1.0 - smoothstep(0.0, 1.0, y);
      vMask = pow(vMask, 0.22);
      vMask *= 1.0 - smoothstep(0.95, 1.0, y);
      if(vMask < 0.002){ gl_FragColor = vec4(0.); return; }

      float rise  = T * 0.07;

      float LOOP  = 32.0;
      float mA    = mod(M, LOOP);
      float mB    = mod(M + LOOP * 0.5, LOOP);
      float blend = abs(mod(M, LOOP) / LOOP - 0.5) * 2.0;

      vec2 q   = vec2(uv.x * aspect * 3.0, (1.0 - y) * 4.5 + rise);
      vec2 q2  = vec2(uv.x * aspect * 2.6, (1.0 - y) * 3.8 + rise * 0.6);

      vec2 w1a = vec2(fbm(q2 + vec2(0.0, mA*0.15)), fbm(q2 + vec2(4.3, 2.7+mA*0.10)));
      float fA = fbm(q + 1.4*w1a + vec2(0.0, mA*0.06));

      vec2 w1b = vec2(fbm(q2 + vec2(7.3, mB*0.15)), fbm(q2 + vec2(1.8, 5.4+mB*0.10)));
      float fB = fbm(q + 1.4*w1b + vec2(3.7, mB*0.06));

      float f = mix(fA, fB, blend);

      f = max(0.0, f - 0.36);
      f = smoothstep(0.0, 0.36, f);
      f = pow(f, 0.85);

      float hoverGlow = H * 0.35;
      f = clamp(f + H * 0.20, 0.0, 1.0);

      float baseFog = smoothstep(0.35, 0.0, y) * 0.22
                    + smoothstep(0.18, 0.0, y) * 0.18;

      float alpha = (f + baseFog + hoverGlow * vMask) * vMask * 1.08;
      alpha = clamp(alpha, 0.0, 0.96);

      vec3 charcoal = vec3(0.02, 0.03, 0.05);
      vec3 ashGrey  = vec3(0.12, 0.14, 0.18);
      vec3 lightGrey= vec3(0.28, 0.31, 0.36);
      vec3 hoverTint = vec3(0.35, 0.38, 0.44);
      vec3 col = mix(charcoal, ashGrey,   pow(f, 1.0));
          col  = mix(col,      lightGrey, pow(f, 2.2));
          col  = mix(col,      hoverTint, H * 0.4 * f);

      gl_FragColor = vec4(col * alpha, alpha);
    }
  `;

    function mkShader(
      g: WebGLRenderingContext,
      type: number,
      src: string,
    ): WebGLShader {
      const s = g.createShader(type)!;
      g.shaderSource(s, src);
      g.compileShader(s);
      if (!g.getShaderParameter(s, g.COMPILE_STATUS)) {
        console.error("[FooterFog]", g.getShaderInfoLog(s));
      }
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, mkShader(gl, gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, mkShader(gl, gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const ap = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(ap);
    gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);

    const uT = gl.getUniformLocation(prog, "T");
    const uR = gl.getUniformLocation(prog, "R");
    const uM = gl.getUniformLocation(prog, "M");
    const uH = gl.getUniformLocation(prog, "H");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    let freqEnergy = 0;
    let morphOffset = 0;
    let hoverEnergy = 0;
    let lastMs = performance.now();
    let lastDrawMs = lastMs;
    let analyser: AnalyserNode | null = null;
    let freqData: Uint8Array | null = null;

    const t0 = performance.now();
    let running = true;
    let tabVisible = !document.hidden;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      const el = containerRef.current;
      const cv = canvasRef.current;
      if (!el || !cv) return;
      const cssW = Math.max(1, el.clientWidth);
      const cssH = Math.max(1, el.clientHeight);
      const dpr = Math.min(
        typeof window !== "undefined" ? window.devicePixelRatio : 1,
        FOG_CANVAS_MAX_DPR,
      );
      const w = Math.max(1, Math.floor(cssW * dpr));
      const h = Math.max(1, Math.floor(cssH * dpr));
      cv.width = w;
      cv.height = h;
      if (glRef.current) glRef.current.viewport(0, 0, w, h);
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);
    resize();

    function syncFooterVisibility() {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      footerVisible =
        r.bottom > 0 && r.top < window.innerHeight;
    }
    syncFooterVisibility();

    /** One static frame — used for reduced motion (accessibility + lighter GPU). */
    function drawStaticFrame() {
      const cv = canvasRef.current;
      const gl = glRef.current;
      if (!cv || !gl) return;
      gl.viewport(0, 0, cv.width, cv.height);
      gl.useProgram(prog);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uT, 0);
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform1f(uM, 0);
      gl.uniform1f(uH, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    if (prefersReducedMotion) {
      drawStaticFrame();
      return () => {
        running = false;
        ro.disconnect();
        gl.deleteProgram(prog);
        gl.deleteBuffer(buf);
        glRef.current = null;
      };
    }

    function onVisibilityChange() {
      tabVisible = !document.hidden;
      if (tabVisible && footerVisible && running && !rafId) {
        rafId = requestAnimationFrame(tick);
      }
      if (!tabVisible && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    function tick() {
      if (!running || !glRef.current) return;
      if (!footerVisible || !tabVisible) {
        rafId = 0;
        return;
      }
      const cv = canvasRef.current;
      if (!cv) return;
      const gl = glRef.current;
      const now = performance.now();
      if (now - lastDrawMs < FOG_MIN_FRAME_MS) {
        rafId = requestAnimationFrame(tick);
        rafRef.current = rafId;
        return;
      }
      lastDrawMs = now;
      const dt = Math.min((now - lastMs) / 1000, 0.05);
      lastMs = now;
      const T = (now - t0) * 0.001;

      const ctx = audioContextRef.current;

      if (ctx && !analyser) {
        analyser = getSmokeAnalyser(ctx);
        if (analyser) {
          freqData = new Uint8Array(analyser.frequencyBinCount);
        }
      }

      if (analyser && freqData) {
        analyser.getByteFrequencyData(
          freqData as unknown as Uint8Array<ArrayBuffer>,
        );
        let sum = 0;
        const mid = Math.floor(freqData.length * 0.5);
        for (let i = 2; i < mid; i++) sum += freqData[i];
        const raw = sum / (mid * 255);
        const lerpRate = raw > freqEnergy ? 0.3 : 0.03;
        freqEnergy += (raw - freqEnergy) * lerpRate;
      }

      let pulse = smokePulseRef.current;
      const hoverBoost = Math.min(pulse, 1.0);
      if (pulse > 0) smokePulseRef.current *= 0.9;
      hoverEnergy += (hoverBoost - hoverEnergy) * (hoverBoost > hoverEnergy ? 0.25 : 0.04);

      morphOffset += (4.0 + freqEnergy * 16.0 + hoverBoost * 4.0) * dt;

      gl.viewport(0, 0, cv.width, cv.height);
      gl.useProgram(prog);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uT, T);
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform1f(uM, morphOffset);
      gl.uniform1f(uH, Math.min(hoverEnergy, 1.0));
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      rafId = requestAnimationFrame(tick);
      rafRef.current = rafId;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        footerVisible = entry?.isIntersecting ?? false;
        if (footerVisible && running && tabVisible && !rafId) {
          lastDrawMs = 0;
          rafId = requestAnimationFrame(tick);
        }
        if (!footerVisible && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      /* No early margin — start WebGL only when footer actually enters view (less scroll jank). */
      { root: null, threshold: 0, rootMargin: "0px" },
    );
    io.observe(container);

    if (footerVisible && tabVisible) {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      running = false;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      io.disconnect();
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
      glRef.current = null;
    };
  }, [getSmokeAnalyser, smokePulseRef, audioContextRef]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden [contain:paint]"
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
