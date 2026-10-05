"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { assetPath } from "@/lib/urls";

const SOCIAL_ID = "adsterra-social-bar";
const SOCIAL_SRC = "https://pl31660179.profitableratecpmnetwork.com/b8/9d/69/b89d6993413e0e1eb8ff04e63e148974.js";
const NO_FILL_TIMEOUT = 20_000;

function mountSlot(slot: HTMLElement, mobile: boolean) {
  const kind = slot.dataset.adsterraSlot;
  const host = slot.querySelector<HTMLElement>(".adsterra-host");
  if (!host || host.childElementCount) return () => {};

  // A real same-origin document lets the unmodified GET CODE use document.write
  // and isolates provider globals and late callbacks from subsequent SPA pages.
  const frame = document.createElement("iframe");
  const file = kind === "native" ? "native" : mobile ? "mobile" : "desktop";
  frame.title = kind === "native" ? "Native advertisement" : "Banner advertisement";
  frame.dataset.adsterraFrame = file;
  frame.width = kind === "native" ? "100%" : mobile ? "320" : "728";
  frame.height = kind === "native" ? "1" : mobile ? "50" : "90";
  frame.src = assetPath(`/ads/${file}.html`);
  let disposed = false;

  const collapse = () => {
    slot.dataset.adState = "empty";
  };
  const timer = window.setTimeout(collapse, NO_FILL_TIMEOUT);
  const receive = (event: MessageEvent) => {
    if (disposed || event.origin !== window.location.origin || event.source !== frame.contentWindow) return;
    const message = event.data;
    if (!message || message.type !== "adsterra-slot-status") return;
    if (message.state === "rendered" && Number.isFinite(message.height) && message.height > 0) {
      window.clearTimeout(timer);
      const height = String(Math.ceil(message.height));
      if (kind === "native" && frame.height !== height) frame.height = height;
      slot.dataset.adState = "rendered";
    } else if (message.state === "error" || message.state === "empty") {
      window.clearTimeout(timer);
      collapse();
    }
  };
  window.addEventListener("message", receive);
  frame.onerror = collapse;
  slot.dataset.adState = "loading";
  host.appendChild(frame);

  return () => {
    disposed = true;
    window.clearTimeout(timer);
    window.removeEventListener("message", receive);
    frame.remove();
  };
}

/** Root-level lifetime: Social Bar persists; content slots renew once per route. */
export function Adsterra() {
  const pathname = usePathname();

  useEffect(() => {
    // Cancel the first Strict Mode effect before it can initialize a provider.
    const timer = window.setTimeout(() => {
      if (document.getElementById(SOCIAL_ID)) return;
      const script = document.createElement("script");
      script.id = SOCIAL_ID;
      script.src = SOCIAL_SRC;
      document.body.appendChild(script);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let cleanups: Array<() => void> = [];
    const timer = window.setTimeout(() => {
      const mobile = !window.matchMedia("(min-width: 768px)").matches;
      // One visit selects one size; viewport resizing never executes a second key.
      const seen = new Set<string>();
      document.querySelectorAll<HTMLElement>("#main-content [data-adsterra-slot]").forEach((slot) => {
        const kind = slot.dataset.adsterraSlot ?? "";
        if (seen.has(kind)) return;
        seen.add(kind);
        cleanups.push(mountSlot(slot, mobile));
      });
    }, 0);
    return () => {
      window.clearTimeout(timer);
      cleanups.forEach((cleanup) => cleanup());
      cleanups = [];
    };
  }, [pathname]);

  return null;
}
