"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Register immediately after the client mounts.
    // Waiting for `window.load` can miss the event in some Next.js navigation contexts.
    const tryRegister = async () => {
      try {
        const existing = await navigator.serviceWorker.getRegistrations();
        const alreadyRegistered = existing.some(
          (r) => r.scope === `${window.location.origin}/`
        );

        if (!alreadyRegistered) {
          const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          });
          console.log("SW registered:", registration.scope);
        } else {
          console.log("SW already registered for /");
        }
      } catch (err) {
        console.error("SW registration failed:", err);
      }
    };

    void tryRegister();

    // In some production hydration timing cases, a second attempt can help.
    const t = window.setTimeout(() => void tryRegister(), 1200);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}

