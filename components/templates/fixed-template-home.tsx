import { editorialAdSlots } from "@/lib/adsterra-slots";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { HomePageDefinition } from "@/config/types";
import { visibleCorePages } from "@/content/registry";
import { esc, renderFixedDocument } from "@/lib/fixed-template/render";
import { faqHtml, sectionHtml } from "@/lib/fixed-template/content-html";
import { homeSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";

export function FixedTemplateHome({ home }: { home: HomePageDefinition }) {
  const pages = visibleCorePages.filter((page) => page.slug);
  const entries = pages.map((page) => ({ href: routePath(page.slug), title: page.slug === "pets" ? "Pets & Dungeon" : page.navLabel, text: page.entryDescription ?? page.hero.lead }));
  const hero = `<article class="lead-card"><div class="kicker">${esc(home.hero.eyebrow)}</div><p>${esc(home.hero.lead)}</p><p class="core-loop">${esc(home.hero.supportingText)}</p><div class="hero-actions"><a class="guide-button" href="${esc(siteConfig.game.officialUrl ?? "")}" target="_blank" rel="noopener noreferrer">Play on Roblox</a><a class="guide-button secondary" href="${esc(routePath("beginner-guide"))}">Start the Beginner Guide</a></div><div class="quick-links"><a href="${routePath("codes")}">Codes</a><a href="${routePath("items")}">Items</a><a href="${routePath("upgrades")}">Upgrades</a></div></article><div class="cover-card"><img src="${esc(assetPath(siteConfig.assets.cover))}" alt="Build an Ant Empire game cover" width="640" height="360"><p>Roblox · Insect Kingdom studio</p></div>`;
  const rendered = renderFixedDocument({ skin: siteSkin(), page: "home", accentColorId: siteConfig.theme.accentColorId, gameName: siteConfig.game.name, nav: pages.map((page) => ({ slug: page.slug, label: page.navLabel, href: routePath(page.slug) })), homeHref: routePath(""), heading: home.hero.heading, heroHtml: hero, entries, supplementHtml: `<div class="guide-content">${home.sections.map(sectionHtml).join("")}${faqHtml(home.faq, "Build an Ant Empire FAQ")}</div>` });
  return <><JsonLd data={homeSchemas(home)} /><div dangerouslySetInnerHTML={{ __html: editorialAdSlots(rendered.rest, "home") }} /></>;
}
