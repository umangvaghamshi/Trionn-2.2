"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "./TransitionContext";
import { type ComponentProps, useCallback } from "react";

type LinkProps = ComponentProps<typeof Link>;

interface TransitionLinkProps extends Omit<LinkProps, "onNavigate"> {
  /** Label shown during belt transition, e.g. "About" */
  transitionLabel?: string;
}

/**
 * Drop-in replacement for `next/link` that triggers the belt
 * page-transition before navigating. Uses Next.js 16's `onNavigate`
 * callback to intercept client-side navigation.
 */
export default function TransitionLink({
  transitionLabel = "",
  href,
  children,
  ...rest
}: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { phase, setPhase, setTransitionLabel, beltsClosed } = useTransition();

  const handleNavigate = useCallback(
    (e: { preventDefault: () => void }) => {
      // Resolve href to string
      const target = typeof href === "string" ? href : href.pathname ?? "/";

      // Skip if already on this page or transition in progress
      if (target === pathname || phase !== "idle") return;

      // Prevent Next.js default navigation
      e.preventDefault();

      // Set label and start transition
      setTransitionLabel(transitionLabel || target.replace(/^\//, "").replace(/-/g, " ") || "Home");
      setPhase("sweep-in");

      // Wait for belts to fully close, then navigate
      beltsClosed().then(() => {
        router.push(target);
      });
    },
    [href, pathname, phase, setPhase, setTransitionLabel, beltsClosed, router, transitionLabel],
  );

  return (
    <Link href={href} onNavigate={handleNavigate} {...rest}>
      {children}
    </Link>
  );
}
