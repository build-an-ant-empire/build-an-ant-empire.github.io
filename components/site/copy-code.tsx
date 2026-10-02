"use client";
import type { MouseEvent } from "react";

/** Static article HTML stays visible before JavaScript enables the copy action. */
export function CopyableContent({ html }: { html: string }) {
  async function copy(event: MouseEvent<HTMLDivElement>) {
    const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>("button[data-copy-code]") : null;
    if (!target) return;
    const status = target.parentElement?.querySelector('[role="status"]');
    try {
      await navigator.clipboard.writeText(target.dataset.copyCode ?? "");
      if (status) status.textContent = "Copied!";
    } catch {
      if (status) status.textContent = "Select the code and copy it manually.";
    }
  }
  return <div onClick={copy} dangerouslySetInnerHTML={{ __html: html }} />;
}
