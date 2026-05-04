/**
 * PerfMonitor — drop-in performance overlay for Three.js + GSAP + Lenis scenes.
 * Works in Next.js (App Router or Pages), plain browser, or any TypeScript project.
 *
 * Drop into:  src/lib/perf-monitor.ts
 *
 * Usage:
 *   import { createPerfMonitor } from '@/lib/perf-monitor'
 *
 *   // Create once — e.g. inside useEffect or an init function
 *   const monitor = createPerfMonitor({
 *     renderer: threeRenderer,
 *     label:    'Hero Canvas',
 *     enabled:  process.env.NODE_ENV !== 'production',
 *   })
 *
 *   // Call every RAF frame
 *   monitor.tick(dt, { sleeping: !animating, lenis, gsap })
 *
 *   // Cleanup on unmount
 *   return () => monitor.destroy()
 */

import type { WebGLRenderer } from 'three'

// ── Lenis type shims ────────────────────────────────────────────────────────
// Covers both Lenis v1 (.velocity) and v2 (.scroll.velocity).
// If you have @types/lenis installed, replace these with the real types.
interface LenisV1Like {
  velocity: number
}
interface LenisV2Like {
  scroll: { velocity: number }
}
type LenisInstance = LenisV1Like | LenisV2Like | object

// ── GSAP type shim ──────────────────────────────────────────────────────────
interface GSAPInstance {
  globalTimeline?: {
    getChildren(nested: boolean, tweens: boolean, timelines: boolean): unknown[]
  }
}

// ── Public types ─────────────────────────────────────────────────────────────
export type PerfMonitorPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
export type PerfMonitorTheme    = 'dark' | 'light'

export interface PerfMonitorOptions {
  /** THREE.WebGLRenderer — required for draw call / triangle counts */
  renderer?: WebGLRenderer | null
  /** Label shown in the panel header. Useful when you have multiple canvases. */
  label?: string
  /** Set false to return a zero-overhead no-op. Default: true */
  enabled?: boolean
  /** Panel corner. Default: 'top-right' */
  position?: PerfMonitorPosition
  /** Frames kept in the frame-time graph. Default: 90 */
  historyLen?: number
  /** 'dark' (default) or 'light' */
  theme?: PerfMonitorTheme
  /** Keyboard key that toggles the panel visibility. Default: 'p'. Set null to disable. */
  toggleKey?: string | null

  // Per-scene threshold overrides — leave undefined to use the built-in defaults
  warnDrawCalls?:  number
  badDrawCalls?:   number
  warnTris?:       number
  badTris?:        number
  warnMs?:         number
  badMs?:          number
  warnFps?:        number
  badFps?:         number
  warnMem?:        number  // MB
  badMem?:         number  // MB
  warnGsapTweens?: number
}

export interface PerfMonitorTickExtras {
  /** Pass true when your RAF loop is sleeping / not scheduled */
  sleeping?: boolean
  /** Your Lenis instance — shows scroll velocity */
  lenis?: LenisInstance
  /** Your gsap object — shows active tween count */
  gsap?: GSAPInstance
}

export interface PerfMonitor {
  /** Call every RAF frame with delta-time in seconds */
  tick(dt: number, extras?: PerfMonitorTickExtras): void
  /** Remove the overlay from the DOM */
  destroy(): void
  show(): void
  hide(): void
  /** Detected hardware profile — available immediately after creation */
  readonly deviceProfile: DeviceProfile
}

// ── Low-end device detection ──────────────────────────────────────────────────
export type DeviceTier = 'low' | 'mid' | 'high'

export interface DeviceProfile {
  /** Overall tier classification */
  tier: DeviceTier
  /** true when the device is likely low-end */
  isLowEnd: boolean
  /** Logical CPU cores (navigator.hardwareConcurrency) */
  cpuCores: number
  /** Reported device RAM in GB (navigator.deviceMemory) — undefined if not supported */
  ramGB: number | undefined
  /** GPU renderer string extracted from WebGL — undefined if WebGL unavailable */
  gpu: string | undefined
  /** true when the GPU string matches known low-end / integrated patterns */
  isLowEndGPU: boolean
  /** Network effective type: '4g' | '3g' | '2g' | 'slow-2g' | undefined */
  connection: string | undefined
  /** true when on a slow connection (2g / slow-2g) */
  isSlowNetwork: boolean
  /** true when prefers-reduced-motion is set */
  prefersReducedMotion: boolean
}

const LOW_END_GPU_PATTERNS = [
  /intel\s+(hd|uhd)\s+graphics\s+[0-9]{3}[^0-9]/i,  // HD 520, UHD 620 etc (not 4-digit)
  /intel\s+(hd|uhd)\s+graphics$/i,
  /intel\s+graphics/i,
  /mali-[gt][0-9]+[^0-9]/i,          // Mali-G52, Mali-T830 etc
  /adreno\s*(3[0-9]{2}|[12][0-9]{2})/i,  // Adreno 3xx and below
  /powervr/i,
  /videocore/i,                       // Raspberry Pi
]

export function detectLowEndDevice(): DeviceProfile {
  if (typeof window === 'undefined') {
    return {
      tier: 'mid', isLowEnd: false, cpuCores: 4, ramGB: undefined,
      gpu: undefined, isLowEndGPU: false, connection: undefined,
      isSlowNetwork: false, prefersReducedMotion: false,
    }
  }

  const cpuCores  = navigator.hardwareConcurrency ?? 4
  const ramGB     = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  const nav       = navigator as Navigator & { connection?: { effectiveType?: string } }
  const connection = nav.connection?.effectiveType
  const isSlowNetwork = connection === '2g' || connection === 'slow-2g'
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // GPU via WebGL
  let gpu: string | undefined
  let isLowEndGPU = false
  try {
    const canvas  = document.createElement('canvas')
    const gl      = canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl') as WebGLRenderingContext | null
    if (gl) {
      const dbgInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (dbgInfo) {
        gpu = gl.getParameter(dbgInfo.UNMASKED_RENDERER_WEBGL) as string
        isLowEndGPU = LOW_END_GPU_PATTERNS.some(p => p.test(gpu!))
      }
    }
  } catch { /* sandboxed / blocked */ }

  // Score: each signal adds weight
  let score = 0
  if (cpuCores  <= 2)               score += 3
  else if (cpuCores <= 4)           score += 1
  if (ramGB !== undefined) {
    if (ramGB   <= 2)               score += 3
    else if (ramGB <= 4)            score += 1
  }
  if (isLowEndGPU)                  score += 2
  if (isSlowNetwork)                score += 1
  if (prefersReducedMotion)         score += 1

  const tier: DeviceTier = score >= 4 ? 'low' : score >= 2 ? 'mid' : 'high'

  return {
    tier,
    isLowEnd: tier === 'low',
    cpuCores,
    ramGB,
    gpu,
    isLowEndGPU,
    connection,
    isSlowNetwork,
    prefersReducedMotion,
  }
}

// ── Colour palette type ───────────────────────────────────────────────────────
interface Palette {
  bg: string; border: string; text: string; heading: string
  good: string; warn: string; bad: string; dim: string
  guide: string; graphBg: string; labelCol: string
}

// ── Chrome-only performance.memory extension ─────────────────────────────────
interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize:  number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
}

// ── Factory ───────────────────────────────────────────────────────────────────
export function createPerfMonitor(options: PerfMonitorOptions = {}): PerfMonitor {
  const opts = {
    renderer:        null as WebGLRenderer | null,
    label:           'Scene',
    enabled:         true,
    position:        'top-right' as PerfMonitorPosition,
    historyLen:      90,
    theme:           'dark' as PerfMonitorTheme,
    toggleKey:       'p' as string | null,
    warnDrawCalls:   80,
    badDrawCalls:    150,
    warnTris:        200_000,
    badTris:         500_000,
    warnMs:          33.3,
    badMs:           50,
    warnFps:         45,
    badFps:          30,
    warnMem:         150,
    badMem:          300,
    warnGsapTweens:  50,
    ...options,
  }

  // Detect hardware tier once — available on both the no-op and live monitor
  const deviceProfile = detectLowEndDevice()

  // Zero-overhead no-op when disabled (production builds)
  if (!opts.enabled) {
    return { tick: () => {}, destroy: () => {}, show: () => {}, hide: () => {}, deviceProfile }
  }

  // ── Thresholds ──────────────────────────────────────────────────────────────
  const T = {
    drawCallsWarn:  opts.warnDrawCalls,
    drawCallsBad:   opts.badDrawCalls,
    trisWarn:       opts.warnTris,
    trisBad:        opts.badTris,
    msWarn:         opts.warnMs,
    msBad:          opts.badMs,
    fpsWarn:        opts.warnFps,
    fpsBad:         opts.badFps,
    memWarn:        opts.warnMem,
    memBad:         opts.badMem,
    gsapTweensWarn: opts.warnGsapTweens,
  }

  // ── Palette ─────────────────────────────────────────────────────────────────
  const isDark = opts.theme !== 'light'
  const C: Palette = isDark
    ? {
        bg:       'rgba(10,12,16,0.88)',
        border:   'rgba(255,255,255,0.07)',
        text:     '#8a9bb0',
        heading:  '#dce4ee',
        good:     '#00e676',
        warn:     '#ffca28',
        bad:      '#ff5252',
        dim:      '#2a3040',
        guide:    'rgba(255,255,255,0.07)',
        graphBg:  'rgba(255,255,255,0.03)',
        labelCol: '#445566',
      }
    : {
        bg:       'rgba(250,251,253,0.94)',
        border:   'rgba(0,0,0,0.10)',
        text:     '#445566',
        heading:  '#1a2030',
        good:     '#00a152',
        warn:     '#f57c00',
        bad:      '#d32f2f',
        dim:      '#dde3ea',
        guide:    'rgba(0,0,0,0.08)',
        graphBg:  'rgba(0,0,0,0.03)',
        labelCol: '#99aabb',
      }

  // ── Position map ─────────────────────────────────────────────────────────────
  const posMap: Record<PerfMonitorPosition, Partial<CSSStyleDeclaration>> = {
    'top-right':    { top: '12px',    right:  '12px', bottom: 'auto', left: 'auto' },
    'top-left':     { top: '12px',    left:   '12px', bottom: 'auto', right: 'auto' },
    'bottom-right': { bottom: '12px', right:  '12px', top:   'auto',  left: 'auto' },
    'bottom-left':  { bottom: '12px', left:   '12px', top:   'auto',  right: 'auto' },
  }

  // ── DOM ──────────────────────────────────────────────────────────────────────
  const root = document.createElement('div')
  Object.assign(root.style, {
    position:       'fixed',
    zIndex:         '99999',
    fontFamily:     '"JetBrains Mono","Fira Mono","Consolas",monospace',
    fontSize:       '11px',
    lineHeight:     '1.0',
    padding:        '10px 14px 10px',
    borderRadius:   '8px',
    pointerEvents:  'none',
    minWidth:       '210px',
    background:     C.bg,
    border:         `1px solid ${C.border}`,
    backdropFilter: 'blur(8px)',
    boxShadow:      isDark ? '0 4px 24px rgba(0,0,0,0.6)' : '0 4px 24px rgba(0,0,0,0.12)',
    userSelect:     'none',
    ...posMap[opts.position],
  } satisfies Partial<CSSStyleDeclaration>)

  // Frame-time graph
  const GRAPH_W = 182, GRAPH_H = 36
  const graph = document.createElement('canvas')
  graph.width  = GRAPH_W
  graph.height = GRAPH_H
  Object.assign(graph.style, {
    display:      'block',
    marginTop:    '8px',
    borderRadius: '3px',
    background:   C.graphBg,
  })
  const gctx = graph.getContext('2d')!

  const textDiv = document.createElement('div')
  root.appendChild(textDiv)
  root.appendChild(graph)
  document.body.appendChild(root)

  /**
   * Cap per-frame time used for ms / graph / spike hints. Long gaps (tab in background,
   * app switch, first paint after navigation) should not flood history with 1000ms+ bars
   * or trip red thresholds for one garbage sample.
   */
  const MAX_DT_STATS_MS = 32

  // ── State ─────────────────────────────────────────────────────────────────────
  const history: number[] = []
  let _lastUpdate    = performance.now()
  let _frameCount    = 0
  /** Shown FPS; kept stable across thin first windows after tab resume. */
  let _fps           = 60
  let _ms            = 0
  let _worstMs       = 0
  let _avgMs         = 0
  let _peakDrawCalls = 0
  let _peakTris      = 0
  /** After tab resume / bfcache: suppress FPS + spike hints that use bogus first samples. */
  let _resumeGraceUntil = 0

  function resetTimingAfterLongPause(resumed: boolean): void {
    history.length = 0
    _lastUpdate = performance.now()
    _frameCount = 0
    _worstMs = 0
    _avgMs = 0
    if (resumed) _resumeGraceUntil = performance.now() + 1400
  }

  function onVisibilityChange(): void {
    if (document.visibilityState === 'hidden') {
      history.length = 0
      _frameCount = 0
      _lastUpdate = performance.now()
      return
    }
    resetTimingAfterLongPause(true)
  }

  function onPageShow(ev: Event): void {
    if ((ev as PageTransitionEvent).persisted) resetTimingAfterLongPause(true)
  }

  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('pageshow', onPageShow as EventListener)

  // ── Helpers ───────────────────────────────────────────────────────────────────
  function clr(val: number, warn: number, bad: number): string {
    return val >= bad ? C.bad : val >= warn ? C.warn : C.good
  }

  function fpsClr(fps: number): string {
    return fps <= T.fpsBad ? C.bad : fps <= T.fpsWarn ? C.warn : C.good
  }

  function row(label: string, value: string, color?: string, hint?: string): string {
    const c = color ?? C.text
    const h = hint ? ` <span style="color:${C.warn};font-size:9px">${hint}</span>` : ''
    return (
      `<tr>` +
        `<td style="color:${C.labelCol};padding-right:12px;padding-bottom:3px;white-space:nowrap">${label}</td>` +
        `<td style="color:${c};font-weight:600;padding-bottom:3px">${value}${h}</td>` +
      `</tr>`
    )
  }

  function drawGraph(): void {
    gctx.clearRect(0, 0, GRAPH_W, GRAPH_H)
    // Guide lines: 60 fps = 16.7 ms, 30 fps = 33.3 ms
    for (const ms of [16.7, 33.3]) {
      const y = GRAPH_H - (ms / 80) * GRAPH_H
      gctx.strokeStyle = C.guide
      gctx.lineWidth   = 1
      gctx.beginPath()
      gctx.moveTo(0, y)
      gctx.lineTo(GRAPH_W, y)
      gctx.stroke()
    }
    const barW = GRAPH_W / opts.historyLen
    history.forEach((ms, i) => {
      const h = Math.min(GRAPH_H, (ms / 80) * GRAPH_H)
      gctx.fillStyle = ms >= T.msBad ? C.bad : ms >= T.msWarn ? C.warn : C.good
      gctx.fillRect(i * barW, GRAPH_H - h, Math.max(1, barW - 0.5), h)
    })
  }

  // ── tick ──────────────────────────────────────────────────────────────────────
  function tick(dt: number, extras: PerfMonitorTickExtras = {}): void {
    _frameCount++
    const rawMs = Math.max(0, dt) * 1000
    _ms = Math.min(rawMs, MAX_DT_STATS_MS)
    history.push(_ms)
    if (history.length > opts.historyLen) history.shift()

    const recent = history.slice(-60)
    _worstMs = Math.max(...recent)
    _avgMs   = recent.reduce((a, b) => a + b, 0) / recent.length

    const now = performance.now()
    if (now - _lastUpdate < 250) return  // redraw at ~4 Hz
    const elapsed = Math.max(1, now - _lastUpdate)
    const fpsRaw = Math.round((_frameCount * 1000) / elapsed)
    // After wake, Chrome may deliver very few RAFs in the first 250ms → bogus ~4 fps and red hints.
    const thinWindow = _frameCount < 4 && elapsed < 320
    if (!thinWindow) _fps = fpsRaw
    _frameCount = 0
    _lastUpdate = now

    const resumeGrace = now < _resumeGraceUntil
    // Three.js renderer stats
    let drawCalls = 0, tris = 0, geomCount = 0, texCount = 0
    if (opts.renderer?.info) {
      const { info } = opts.renderer
      drawCalls  = info.render.calls
      tris       = info.render.triangles
      geomCount  = info.memory?.geometries ?? 0
      texCount   = info.memory?.textures   ?? 0
      _peakDrawCalls = Math.max(_peakDrawCalls, drawCalls)
      _peakTris      = Math.max(_peakTris,      tris)
    }

    // JS heap — Chrome only
    const perf = performance as PerformanceWithMemory
    let memMB: string | null = null
    let memColor = C.text
    if (perf.memory) {
      memMB    = (perf.memory.usedJSHeapSize / 1_048_576).toFixed(1)
      memColor = clr(parseFloat(memMB), T.memWarn, T.memBad)
    }

    // GSAP active tween count
    let gsapTweens: number | null = null
    let gsapColor = C.text
    if (extras.gsap?.globalTimeline) {
      gsapTweens = extras.gsap.globalTimeline.getChildren(true, true, true).length
      gsapColor  = clr(gsapTweens, T.gsapTweensWarn, T.gsapTweensWarn * 2)
    }

    // Lenis scroll velocity (v1: .velocity, v2: .scroll.velocity)
    let lenisVel: number | null = null
    if (extras.lenis) {
      const l = extras.lenis as Record<string, unknown>
      if (typeof l['velocity'] === 'number') {
        lenisVel = l['velocity'] as number
      } else if (l['scroll'] && typeof (l['scroll'] as Record<string, unknown>)['velocity'] === 'number') {
        lenisVel = (l['scroll'] as Record<string, unknown>)['velocity'] as number
      }
    }

    // Pixel ratio
    const dpr = (opts.renderer?.getPixelRatio() ?? window.devicePixelRatio ?? 1).toFixed(1)

    // ── Optimization hints (skip right after tab resume — samples are misleading) ──
    const hints: string[] = []
    if (!resumeGrace && drawCalls > T.drawCallsWarn)
      hints.push(`draw calls ${drawCalls} — merge geometries (BufferGeometryUtils.mergeGeometries)`)
    if (!resumeGrace && tris > T.trisWarn)
      hints.push(`triangles ${(tris / 1000).toFixed(0)}k — simplify geometry or use LOD`)
    if (!resumeGrace && _worstMs > T.msBad)
      hints.push(`spike ${_worstMs.toFixed(0)} ms — check: cubeCamera.update(), GC pause, transmission pass`)
    if (!resumeGrace && _fps < T.fpsBad && drawCalls > 50)
      hints.push(`low FPS + high draw calls → GPU bottleneck, not CPU`)
    if (!resumeGrace && _fps < T.fpsBad && drawCalls <= 50)
      hints.push(`low FPS + low draw calls → heavy shader (transmission / clearcoat) or CPU-bound JS`)
    if (!resumeGrace && gsapTweens !== null && gsapTweens > T.gsapTweensWarn)
      hints.push(`${gsapTweens} active GSAP tweens — kill completed timelines`)
    if (!resumeGrace && parseFloat(dpr) > 1.5)
      hints.push(`pixel ratio ${dpr}× — cap with renderer.setPixelRatio(Math.min(dpr, 1.5))`)

    drawGraph()

    // ── HTML ──────────────────────────────────────────────────────────────────
    const sleeping    = !!extras.sleeping
    const sleepLabel  = sleeping
      ? `<span style="color:${C.good}">💤 idle</span>`
      : `<span style="color:${C.warn}">▶ active</span>`

    const fpsColor =
      resumeGrace && _fps < T.fpsWarn ? C.text : fpsClr(_fps)

    textDiv.innerHTML =
      `<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:7px">` +
        `<span style="color:${C.heading};font-size:12px;font-weight:700">${opts.label}</span>` +
        `<span style="font-size:10px">${sleepLabel}</span>` +
      `</div>` +

      `<div style="font-size:22px;font-weight:800;color:${fpsColor};letter-spacing:-0.5px;margin-bottom:6px">` +
        `${_fps} <span style="font-size:11px;font-weight:400;color:${C.text}">fps</span>` +
      `</div>` +

      `<table style="border-collapse:collapse;width:100%">` +
        row('frame ms',  `${_ms.toFixed(1)}`,      clr(_ms,      T.msWarn, T.msBad)) +
        row('avg ms',    `${_avgMs.toFixed(1)}`,   clr(_avgMs,   T.msWarn, T.msBad)) +
        row('worst ms',  `${_worstMs.toFixed(1)}`, clr(_worstMs, T.msWarn, T.msBad),
            _worstMs > T.msBad ? '← jerk source' : '') +

        (opts.renderer
          ? row('draw calls', `${drawCalls}`, clr(drawCalls, T.drawCallsWarn, T.drawCallsBad),
                drawCalls >= _peakDrawCalls && drawCalls > T.drawCallsWarn ? 'peak' : '') +
            row('triangles',  `${(tris / 1000).toFixed(1)}k`, clr(tris, T.trisWarn, T.trisBad)) +
            row('geometries', `${geomCount}`, C.text) +
            row('textures',   `${texCount}`,  C.text)
          : '') +

        row('pixel ratio', `${dpr}×`, parseFloat(dpr) > 1.5 ? C.warn : C.text) +

        (memMB !== null ? row('JS heap', `${memMB} MB`, memColor) : '') +
        (gsapTweens !== null ? row('gsap tweens', `${gsapTweens}`, gsapColor) : '') +
        (lenisVel !== null
          ? row('lenis vel', `${lenisVel.toFixed(1)} px/s`,
                Math.abs(lenisVel) > 2000 ? C.warn : C.text)
          : '') +

        row('device',
          deviceProfile.tier.toUpperCase(),
          deviceProfile.tier === 'low' ? C.bad : deviceProfile.tier === 'mid' ? C.warn : C.good,
          deviceProfile.isLowEndGPU ? 'low-end GPU' : '') +

        (deviceProfile.ramGB !== undefined
          ? row('RAM', `${deviceProfile.ramGB} GB`,
              deviceProfile.ramGB <= 2 ? C.bad : deviceProfile.ramGB <= 4 ? C.warn : C.text)
          : '') +

        row('CPU cores', `${deviceProfile.cpuCores}`,
          deviceProfile.cpuCores <= 2 ? C.bad : deviceProfile.cpuCores <= 4 ? C.warn : C.text) +

      `</table>` +

      (hints.length
        ? `<div style="margin-top:8px;padding-top:7px;border-top:1px solid ${C.dim}">` +
            hints.map(h => `<div style="color:${C.bad};font-size:9.5px;line-height:1.5;margin-bottom:2px">⚠ ${h}</div>`).join('') +
          `</div>`
        : '') +

      `<div style="display:flex;justify-content:space-between;color:${C.labelCol};font-size:9px;margin-top:5px">` +
        `<span>0 ms</span><span>── 60fps ── 30fps</span><span>80 ms</span>` +
      `</div>`
  }

  // ── Keyboard toggle ───────────────────────────────────────────────────────────
  let _visible = true
  function onKey(e: KeyboardEvent): void {
    if (opts.toggleKey && e.key.toLowerCase() === opts.toggleKey.toLowerCase()) {
      _visible ? hide() : show()
    }
  }
  if (opts.toggleKey) window.addEventListener('keydown', onKey)

  // ── Public API ────────────────────────────────────────────────────────────────
  function destroy(): void {
    root.parentNode?.removeChild(root)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    window.removeEventListener('pageshow', onPageShow as EventListener)
    if (opts.toggleKey) window.removeEventListener('keydown', onKey)
  }

  function show(): void { root.style.display = 'block'; _visible = true  }
  function hide(): void { root.style.display = 'none';  _visible = false }

  return { tick, destroy, show, hide, deviceProfile }
}
