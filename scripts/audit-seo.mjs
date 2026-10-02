import { readFileSync, existsSync, writeFileSync, readdirSync } from 'node:fs';
import { expected } from './seo-expectations.mjs';
import { site, pages, forbidden, check } from './validate.mjs';
const root = site.hosting.siteUrl;
const text = html => html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&(?:#\d+|\w+);/g, ' ').replace(/\s+/g, ' ').trim();
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");
const attr = (tag, name) => decode(tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? '');
const meta = (html, name) => attr([...html.matchAll(/<meta\b[^>]*>/g)].map(m => m[0]).find(tag => attr(tag, 'name') === name || attr(tag, 'property') === name) ?? '', 'content');
const results = [];
const sitemap = readFileSync('out/sitemap.xml','utf8');
const robots = readFileSync('out/robots.txt','utf8');
check(site.readyForLaunch ? /Allow: \/(?:\s|$)/.test(robots) && !/Disallow: \/(?:\s|$)/.test(robots) : /Disallow: \/(?:\s|$)/.test(robots), 'Incorrect robots launch state');
check(robots.includes(`${root}/sitemap.xml`), 'Wrong sitemap URL in robots');
check([...sitemap.matchAll(/<loc>/g)].length === 8, 'Sitemap must contain exactly eight core routes');
check(existsSync('out/.nojekyll') && !existsSync('out/CNAME') && !existsSync('out/wiki/index.html'), 'Incorrect static export files');
for (const [slug, target] of Object.entries(expected)) {
  const route = slug ? `/${slug}/` : '/';
  const html = readFileSync(`out${route}index.html`, 'utf8');
  const titles = [...html.matchAll(/<title>(.*?)<\/title>/g)];
  check(titles.length === 1 && decode(titles[0][1]) === target.title, `Incorrect HTML title: ${route}`);
  check(meta(html,'description') === target.description, `Incorrect description: ${route}`);
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
  check(h1s.length === 1 && text(h1s[0][1]) === target.h1, `Incorrect H1: ${route}`);
  const canonical = attr([...html.matchAll(/<link\b[^>]*>/g)].map(m => m[0]).find(tag => attr(tag,'rel') === 'canonical') ?? '', 'href');
  check(canonical === root + route && sitemap.includes(`<loc>${canonical}</loc>`), `Wrong canonical/sitemap: ${route}`);
  check(meta(html,'robots') === (site.readyForLaunch ? 'index, follow' : 'noindex, nofollow'), `Incorrect index state: ${route}`);
  check(meta(html,'og:title') === target.title && meta(html,'og:description') === target.description && meta(html,'og:url') === canonical, `Incorrect OpenGraph: ${route}`);
  check(meta(html,'twitter:title') === target.title && meta(html,'twitter:description') === target.description, `Incorrect Twitter metadata: ${route}`);
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  check(main, `Missing main article: ${route}`);
  const visible = text(main.replace(/<aside\b[\s\S]*?<\/aside>/g, "").replace(/<details class="mobile-toc">[\s\S]*?<\/details>/g, ""));
  check(!forbidden.test(visible), `Public copy leak: ${route}`);
  const count = visible.match(/[a-z0-9]+(?:['’-][a-z0-9]+)*/gi)?.length ?? 0;
  check(count >= (slug ? 850 : 1200), `Insufficient visible copy: ${route} (${count})`);
  const nav = html.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
  const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)?.[1] ?? '';
  for (const page of pages) for (const [area, content] of [['navigation',nav],['footer',footer]]) check(content.includes(`href="/${page.slug}/"`), `Missing ${area} link to ${page.slug} on ${route}`);
  if (slug) {
    check(html.includes('href="/"'), `Missing home link: ${route}`);
    check([...main.matchAll(/class="context-link"/g)].length >= 2, `Missing contextual links: ${route}`);
  }
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  for (const tag of [...html.matchAll(/<(?:a|img|link)\b[^>]*>/g)].map(m=>m[0])) {
    const href = attr(tag, tag.startsWith('<img') ? 'src' : 'href');
    if (href.startsWith('#')) check(ids.has(href.slice(1)), `Broken anchor ${href} on ${route}`);
    else if (href.startsWith('/') && !href.startsWith('//')) {
      const local = href.split(/[?#]/)[0];
      check(existsSync(`out${local.endsWith('/') ? local + 'index.html' : local}`), `Broken link/asset ${href} on ${route}`);
    }
  }
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m => { const value=JSON.parse(m[1]);return Array.isArray(value)?value:[value]; });
  check(schemas.length, `Missing JSON-LD: ${route}`);
  for (const schema of schemas) {
    if (schema['@type'] === 'FAQPage') check(schema.mainEntity.length > 0, `Empty FAQ schema: ${route}`);
    check(!/aggregateRating|"Review"|"offers"/.test(JSON.stringify(schema)), `Unsupported schema: ${route}`);
  }
  if (slug) check(schemas.some(s=>s['@type']==='BreadcrumbList'), `Missing breadcrumb schema: ${route}`);
  results.push({route,titleChars:target.title.length,descriptionChars:target.description.length,visibleWords:count,h1:1,canonical,robots:meta(html,'robots')});
}
for (const file of ['llms.txt','llms-full.txt']) check(!forbidden.test(readFileSync(`out/${file}`,'utf8')), `Copy leak in ${file}`);
for (const slug of ['about','privacy','terms','copyright']) check(meta(readFileSync(`out/${slug}/index.html`,'utf8'),'robots') === 'noindex, follow', `Legal index state: ${slug}`);
check(!existsSync('out/contact/index.html'), 'Contact page should be disabled');
check(meta(readFileSync('out/404.html','utf8'),'robots').includes('noindex'), '404 must be noindex');
const manifest=JSON.parse(readFileSync('out/manifest.webmanifest','utf8'));check(manifest.icons[0].type==='image/webp','Wrong icon MIME');
// Verify the actual exported tags, including legal pages and the 404 page.
const integrationSettings = JSON.parse(readFileSync('content/generated/integrations.json', 'utf8'));
const measurementId = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || integrationSettings.gaMeasurementId || '').toUpperCase();
function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = `${directory}/${entry.name}`;
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith('.html') ? [path] : [];
  });
}
if (/^G-[A-Z0-9]+$/.test(measurementId)) {
  const exportedHtml = htmlFiles('out');
  for (const file of exportedHtml) {
    const html = readFileSync(file, 'utf8');
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/)?.[1] ?? '';
    const scripts = [...html.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(match => match[0]);
    const loaders = scripts.filter(tag => attr(tag, 'src').startsWith('https://www.googletagmanager.com/gtag/js'));
    const configs = scripts.filter(tag => attr(tag, 'id') === 'google-analytics');
    check(loaders.length === 1 && configs.length === 1, `Duplicate or missing Google tag: ${file}`);
    check(attr(loaders[0], 'src') === `https://www.googletagmanager.com/gtag/js?id=${measurementId}` && /\basync(?:=|[ >])/.test(loaders[0]), `Incorrect GA loader: ${file}`);
    check(head.includes(loaders[0]) && head.includes(configs[0]), `GA must be in the static head: ${file}`);
    check(configs[0].includes('window.dataLayer = window.dataLayer || []') && configs[0].includes('function gtag(){dataLayer.push(arguments);}') && configs[0].includes("gtag('js', new Date())") && configs[0].includes(`gtag('config', '${measurementId}')`), `Incomplete GA initialization: ${file}`);
  }
  console.log(`Google tag checks passed: ${measurementId}, one loader and one initialization in the head of all ${exportedHtml.length} HTML pages.`);
}
writeFileSync('seo-report.json',JSON.stringify(results,null,2)+'\n');
console.table(results.map(({canonical,...rest})=>rest));
console.log(`Static SEO checks passed. Indexing ${site.readyForLaunch ? 'enabled' : 'disabled for preparation'}.`);
