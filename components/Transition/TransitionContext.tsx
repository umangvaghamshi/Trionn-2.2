"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* ──────────────────────────────────────────────────────────────────────────
   Events dispatched on `window` so any component can listen:
     • "trionn-loader:complete"      — initial page loader finished
     • "trionn-transition:complete"   — between-page transition finished
     • "trionn-transition:belts-closed" — belts fully cover the screen (safe to swap page)
   ────────────────────────────────────────────────────────────────────────── */

export type TransitionPhase =
  | "idle"
  | "loader"           // initial site loader playing
  | "sweep-in"         // belts closing for page transition
  | "label-show"       // page label visible while belts are closed
  | "sweep-out";       // belts opening to reveal new page

type TransitionContextValue = {
  /** Has the initial page loader finished? */
  isLoaderComplete: boolean;
  /** Mark the initial loader as finished */
  markLoaderComplete: () => void;

  /** Current phase of the transition system */
  phase: TransitionPhase;
  setPhase: (p: TransitionPhase) => void;

  /** Label to show during page transition (e.g. "About") */
  transitionLabel: string;
  setTransitionLabel: (label: string) => void;

  /** Promise that resolves when belts are fully closed */
  beltsClosed: () => Promise<void>;
  /** Notify that belts are fully closed */
  notifyBeltsClosed: () => void;

  /** Is page content allowed to be visible? */
  isContentVisible: boolean;
  setContentVisible: (v: boolean) => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isLoaderComplete, setIsLoaderComplete] = useState(false);
  const [phase, setPhase] = useState<TransitionPhase>("loader");
  const [transitionLabel, setTransitionLabel] = useState("");
  const [isContentVisible, setContentVisible] = useState(false);

  // Promise resolver for belts-closed sync
  const beltsClosedResolveRef = useRef<(() => void) | null>(null);

  const markLoaderComplete = useCallback(() => {
    setIsLoaderComplete(true);
    setContentVisible(true);
    setPhase("idle");
    document.documentElement.dataset.trionnReady = "true";
    window.dispatchEvent(new CustomEvent("trionn-loader:complete"));
  }, []);

  const beltsClosed = useCallback(() => {
    return new Promise<void>((resolve) => {
      beltsClosedResolveRef.current = resolve;
    });
  }, []);

  const notifyBeltsClosed = useCallback(() => {
    window.dispatchEvent(new CustomEvent("trionn-transition:belts-closed"));
    beltsClosedResolveRef.current?.();
    beltsClosedResolveRef.current = null;
  }, []);

  const value = useMemo(
    () => ({
      isLoaderComplete,
      markLoaderComplete,
      phase,
      setPhase,
      transitionLabel,
      setTransitionLabel,
      isContentVisible,
      setContentVisible,
      beltsClosed,
      notifyBeltsClosed,
    }),
    [
      isLoaderComplete,
      markLoaderComplete,
      phase,
      transitionLabel,
      isContentVisible,
      beltsClosed,
      notifyBeltsClosed,
    ],
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error("useTransition must be used within TransitionProvider");
  }
  return ctx;
}
