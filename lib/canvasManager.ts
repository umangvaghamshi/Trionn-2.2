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
 *   canvasManager.suspend(id | name, "reason");
 *   canvasManager.resume(id | name, "reason");
 *   canvasManager.unregister(id);
 */

import gsap from "gsap";

type LoopFn = (timestamp: number) => void;

interface Registration {
  fn: LoopFn;
  active: boolean;
  name?: string;
  suspendReasons: Set<string>;
}

class CanvasManager {
  private entries = new Map<number, Registration>();
  private namesToId = new Map<string, number>();
  private nextId = 1;
  private isRunning = false;
  private tabHidden = false;

  constructor() {
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        this.tabHidden = document.hidden;
        if (!this.tabHidden) this.ensureRunning();
      });
    }
  }

  register(fn: LoopFn, active = true, name?: string): number {
    const id = this.nextId++;
    this.entries.set(id, { fn, active, name, suspendReasons: new Set() });
    if (name) this.namesToId.set(name, id);
    if (active) this.ensureRunning();
    return id;
  }

  unregister(id: number) {
    const entry = this.entries.get(id);
    if (entry?.name) this.namesToId.delete(entry.name);
    this.entries.delete(id);
  }

  setActive(id: number, active: boolean) {
    const entry = this.entries.get(id);
    if (!entry) return;
    entry.active = active;
    if (this.isEffectivelyActive(entry)) this.ensureRunning();
  }

  /**
   * Suspend a loop for a named reason. Multiple independent reasons can
   * suspend the same loop; the loop only resumes when all reasons are cleared.
   */
  suspend(target: number | string, reason: string) {
    const entry = this.resolve(target);
    if (!entry) return;
    entry.suspendReasons.add(reason);
  }

  resume(target: number | string, reason: string) {
    const entry = this.resolve(target);
    if (!entry) return;
    entry.suspendReasons.delete(reason);
    if (this.isEffectivelyActive(entry)) this.ensureRunning();
  }

  private resolve(target: number | string): Registration | undefined {
    if (typeof target === "number") return this.entries.get(target);
    const id = this.namesToId.get(target);
    return id !== undefined ? this.entries.get(id) : undefined;
  }

  private isEffectivelyActive(entry: Registration): boolean {
    return entry.active && entry.suspendReasons.size === 0;
  }

  private ensureRunning() {
    if (this.isRunning) return;
    this.isRunning = true;
    gsap.ticker.add(this.tick);
  }

  private tick = (time: number) => {
    // gsap passes time in seconds, we multiply by 1000 for standard RAF timestamp
    const ts = time * 1000;

    if (this.tabHidden) return;

    let hasActive = false;
    for (const entry of this.entries.values()) {
      if (!this.isEffectivelyActive(entry)) continue;
      hasActive = true;
      entry.fn(ts);
    }

    if (!hasActive) {
      gsap.ticker.remove(this.tick);
      this.isRunning = false;
    }
  };
}

// Singleton — safe in SSR because class body runs lazily.
let _manager: CanvasManager | null = null;
export function getCanvasManager(): CanvasManager {
  if (!_manager) _manager = new CanvasManager();
  return _manager;
}
