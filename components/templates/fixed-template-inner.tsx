import { editorialAdSlots } from "@/lib/adsterra-slots";
import { CopyableContent } from "@/components/site/copy-code";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { SeoPageDefinition } from "@/config/types";
import { getRelatedPages, visibleCorePages } from "@/content/registry";
import { esc, renderFixedDocument } from "@/lib/fixed-template/render";
import { faqHtml, sectionHtml } from "@/lib/fixed-template/content-html";
import { pageSchemas } from "@/lib/schema";
import { routePath } from "@/lib/urls";

export function FixedTemplateInner({ page }: { page: SeoPageDefinition }) {
  const related = getRelatedPages(page);
  const relatedHtml = related.length ? `<section id="related"><h2>Related Guides</h2><ul>${related.map((item) => `<li><a href="${esc(routePath(item.slug))}">${esc(item.navLabel)}</a> — ${esc(item.entryDescription ?? item.hero.lead)}</li>`).join("")}</ul></section>` : "";
  const sources = page.sourceLinks?.length ? `<section id="references"><h2>References</h2>${page.sourceLinks.map((source) => `<p><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a></p>`).join("")}</section>` : "";
  const mobileToc = `<details class="mobile-toc"><summary>On this page</summary><nav aria-label="Article contents">${page.sections.map((section) => `<a href="#${esc(section.id)}">${esc(section.heading)}</a>`).join("")}${page.faq?.length ? '<a href="#faq">Frequently Asked Questions</a>' : ""}</nav></details>`;
  const articleHtml = `<div class="quick-answer"><p>${esc(page.hero.lead)}</p>${page.slug === "codes" ? '<div class="code-copy"><code>9hcb2s</code><button type="button" data-copy-code="9hcb2s" aria-label="Copy code 9hcb2s">Copy code</button><span role="status"></span></div>' : ""}</div>${page.pageType === "legal" ? "" : '<p class="checked-date">Reference date: October 1, 2026</p>'}${mobileToc}${page.sections.map(sectionHtml).join("")}${faqHtml(page.faq ?? [])}${relatedHtml}${sources}`;
  const rendered = renderFixedDocument({ skin: siteSkin(), page: "inner", accentColorId: siteConfig.theme.accentColorId, gameName: siteConfig.game.name, nav: visibleCorePages.map((item) => ({ slug: item.slug, label: item.navLabel, href: routePath(item.slug) })), currentSlug: page.slug, homeHref: routePath(""), heading: page.hero.heading, lead: page.hero.lead, articleHtml });
  const html = editorialAdSlots(rendered.rest, "inner");
  return <><JsonLd data={pageSchemas(page)} />{page.slug === "codes" ? <CopyableContent html={html} /> : <div dangerouslySetInnerHTML={{ __html: html }} />}</>;
}
