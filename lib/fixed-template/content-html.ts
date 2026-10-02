import type { DataTable, FaqItem, PageSection } from "@/config/types";
import { esc } from "./render";
import { routePath } from "@/lib/urls";

function paragraphs(values: string[] = []) {
  return values.map((value) => `<p>${esc(value)}</p>`).join("");
}
function dataTable(table?: DataTable) {
  if (!table) return "";
  return `<div class="table-scroll" role="region" aria-label="${esc(table.caption)}" tabindex="0"><table><caption>${esc(table.caption)}</caption><thead><tr>${table.columns.map((col) => `<th scope="col">${esc(col)}</th>`).join("")}</tr></thead><tbody>${table.rows.map((row) => `<tr>${row.map((cell, index) => index === 0 ? `<th scope="row">${esc(cell)}</th>` : `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
export function sectionHtml(section: PageSection) {
  const children = (section.subsections ?? []).map((sub) => `<div class="subsection"><h3>${esc(sub.heading)}</h3>${paragraphs(sub.paragraphs)}${sub.bullets?.length ? `<ul>${sub.bullets.map((value) => `<li>${esc(value)}</li>`).join("")}</ul>` : ""}${dataTable(sub.table)}</div>`).join("");
  const steps = section.steps?.length ? `<ol class="guide-steps">${section.steps.map((step) => `<li><h3>${esc(step.heading)}</h3><p>${esc(step.description)}</p></li>`).join("")}</ol>` : "";
  const links = (section.links ?? []).map((link) => `<p class="context-link"><a href="${esc(routePath(link.slug))}">${esc(link.label)}</a>${link.description ? ` — ${esc(link.description)}` : ""}</p>`).join("");
  return `<section id="${esc(section.id)}"><h2>${esc(section.heading)}</h2>${section.intro ? paragraphs([section.intro]) : ""}${dataTable(section.table)}${paragraphs(section.paragraphs)}${children}${steps}${links}</section>`;
}
export function faqHtml(items: FaqItem[], heading = "Frequently Asked Questions") {
  return items.length ? `<section id="faq"><h2>${esc(heading)}</h2>${items.map((item) => `<div class="faq-item"><h3>${esc(item.question)}</h3><p>${esc(item.answer)}</p></div>`).join("")}</section>` : "";
}
