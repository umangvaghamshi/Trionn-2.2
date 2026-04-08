"use client";

import { useEffect, useRef } from "react";

const VERT_SHADER = `attribute vec2 p; void main(){ gl_Position=vec4(p,0.,1.); }`;

const FRAG_SHADER = `
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

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("[fog]", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

interface FogOptions {
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
  smokeState: React.MutableRefObject<{ pulse: number; x: number }>;
}

export function useFogEffect(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  { analyserRef, smokeState }: FogOptions
) {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", handleResize);

    // Build program
    const vs = createShader(gl, gl.VERTEX_SHADER, VERT_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAG_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Fullscreen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
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
    let freqData: Uint8Array | null = null;
    const t0 = performance.now();

    function tick() {
      const now = performance.now();
      const dt = Math.min((now - lastMs) / 1000, 0.05);
      lastMs = now;
      const T = (now - t0) * 0.001;

      // Read audio energy from analyser
      const analyser = analyserRef.current;
      if (analyser) {
        if (!freqData) freqData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(freqData);
        let sum = 0;
        const mid = Math.floor(freqData.length * 0.5);
        for (let i = 2; i < mid; i++) sum += freqData[i];
        const raw = sum / (mid * 255);
        const lerpRate = raw > freqEnergy ? 0.3 : 0.03;
        freqEnergy += (raw - freqEnergy) * lerpRate;
      }

      // Morph offset
      const hoverBoost = Math.min(smokeState.current.pulse, 1.0);
      smokeState.current.pulse *= 0.9;
      hoverEnergy +=
        (hoverBoost - hoverEnergy) *
        (hoverBoost > hoverEnergy ? 0.25 : 0.04);
      morphOffset += (4.0 + freqEnergy * 16.0 + hoverBoost * 4.0) * dt;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uT, T);
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uM, morphOffset);
      gl.uniform1f(uH, Math.min(hoverEnergy, 1.0));
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef, analyserRef, smokeState]);
}
