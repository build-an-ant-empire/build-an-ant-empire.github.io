/** Slot markup only; the shared client runtime owns all third-party loading. */
export function adsterraSlotHtml(kind: "banner" | "native") {
  return `<aside class="adsterra-slot adsterra-${kind}" data-adsterra-slot="${kind}" aria-label="Advertisement"><span class="adsterra-label">Advertisement</span><div class="adsterra-host"></div></aside>`;
}

/** Insert after a complete existing element, preserving its contents and order. */
function insertAfter(html: string, tag: string, className: string, slot: string) {
  const start = html.search(new RegExp(`<${tag} class="${className}"(?:\\s[^>]*)?>`));
  if (start < 0) throw new Error(`Missing advertising placement: ${className}`);
  const tags = new RegExp(`<(/?)${tag}\\b[^>]*>`, "g");
  tags.lastIndex = start;
  let depth = 0;
  for (let match = tags.exec(html); match; match = tags.exec(html)) {
    depth += match[1] ? -1 : 1;
    if (depth === 0) return html.slice(0, tags.lastIndex) + slot + html.slice(tags.lastIndex);
  }
  throw new Error(`Unclosed advertising placement: ${className}`);
}

/** Placements verified against this site's active editorial DOM, not other skins. */
export function editorialAdSlots(html: string, page: "home" | "inner") {
  const banner = adsterraSlotHtml("banner");
  const native = adsterraSlotHtml("native");
  return page === "home"
    ? insertAfter(insertAfter(html, "section", "leadgrid", banner), "div", "table-scroll", native)
    : insertAfter(insertAfter(html, "div", "article-head", banner), "div", "quick-answer", native);
}
