/**
 * Global canvas animation manager.
 *
 * One master requestAnimationFrame drives all registered loops.
 * Each registration gets pause/resume control so:
 *  - off-screen canvases are paused via IntersectionObserver
 *  - background tabs pause via visibilitychange
 *  - low-power/mobile preferences are respected
 *
 * Usage (handled automatically by useCanvasLoop):
 *   const id = canvasManager.register(updateFn);
 *   canvasManager.setActive(id, true/false);
 *   canvasManager.unregister(id);
 */

type LoopFn = (timestamp: number) => void;

interface Registration {
  fn: LoopFn;
  active: boolean;
}

class CanvasManager {
  private entries = new Map<number, Registration>();
  private nextId = 1;
  private rafId = 0;
  private tabHidden = false;

  constructor() {
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        this.tabHidden = document.hidden;
        if (!this.tabHidden) this.ensureRunning();
      });
    }
  }

  register(fn: LoopFn, active = true): number {
    const id = this.nextId++;
    this.entries.set(id, { fn, active });
    if (active) this.ensureRunning();
    return id;
  }

  unregister(id: number) {
    this.entries.delete(id);
  }

  setActive(id: number, active: boolean) {
    const entry = this.entries.get(id);
    if (!entry) return;
    entry.active = active;
    if (active) this.ensureRunning();
  }

  private ensureRunning() {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(this.tick);
  }

  private tick = (ts: number) => {
    this.rafId = 0;

    if (this.tabHidden) return;

    let hasActive = false;
    for (const entry of this.entries.values()) {
      if (!entry.active) continue;
      hasActive = true;
      entry.fn(ts);
    }

    if (hasActive) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  };
}

// Singleton — safe in SSR because class body runs lazily.
let _manager: CanvasManager | null = null;
export function getCanvasManager(): CanvasManager {
  if (!_manager) _manager = new CanvasManager();
  return _manager;
}
