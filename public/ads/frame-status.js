// Observe only the surrounding document; never change the provider's GET CODE.
(() => {
  const report = (state, height = 0) => parent.postMessage({ type: "adsterra-slot-status", state, height }, location.origin);
  let rendered = false;
  let scheduled = false;
  const measure = () => {
    scheduled = false;
    const native = document.body.dataset.adsterraKind === "native";
    const container = native ? document.getElementById("container-5a0838153820d1a735ca0602627b61fd") : document.body;
    if (!container) return;
    const creatives = container.querySelectorAll("iframe, img, a");
    const visible = [...creatives].some((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
    });
    if (visible) {
      rendered = true;
      report("rendered", native ? container.getBoundingClientRect().height : document.body.getBoundingClientRect().height);
    } else if (rendered) {
      rendered = false;
      report("empty");
    }
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(measure);
  };
  window.addEventListener("error", (event) => {
    if (event.target instanceof HTMLScriptElement && event.target.src.startsWith("https://")) report("error");
  }, true);
  document.addEventListener("DOMContentLoaded", () => {
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, attributes: true });
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    const container = document.getElementById("container-5a0838153820d1a735ca0602627b61fd");
    if (container) resize.observe(container);
    schedule();
  });
  window.addEventListener("load", schedule);
})();
