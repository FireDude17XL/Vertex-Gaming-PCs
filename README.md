# Vertex Gaming

Open `index.html` / `vertex-gaming.html`, or preview with:

```sh
python3 -m http.server 8080
```

Visit http://localhost:8080. The generated site needs no build step, packages, account, or external 3D service. The 3D bundle is local and also works from `file://` in supported browsers. Google Fonts falls back to system fonts offline.

## Included

- Twelve pages plus the original entry point: home, systems, four product pages, configurator, services, about, support, warranty, and catalog sources.
- Core, Pro, Ultra, and **MAX** presets. MAX starts at **$4,000**; the MAX expanded preset is **$7,965**, based on the included estimates.
- **16 CPUs, 18 graphics cards, 10 DDR5 kits**: AMD/Intel processors; NVIDIA/AMD/Intel graphics from multiple board brands; Corsair, G.Skill, Kingston, Crucial, TEAMGROUP, and Patriot memory.
- Processor-dependent motherboard platform; preliminary PSU, cooler, GPU clearance, radiator, and memory-capacity checks. Exact retail board/BIOS/QVL/connectors/fit still require final verification.
- Interactive schematic **Three.js** preview: drag/touch orbit, scroll/pinch zoom, right-drag/two-finger pan, front/inside/rear/top views, keyboard orbit/zoom, reset, exploded view, and glass toggle.
- Model responds to case size/color, GPU length/fan count, CPU brand, RAM stick count/style, cooler type, NVMe count, PSU wattage, and lighting. OS has no physical visual effect. Models are original procedural geometry, not exact manufacturer CAD.
- Modest **one-year limited parts and labor warranty**, with coverage, exclusions, claim process, shipping responsibilities, and preserved statutory rights. See `warranty.html`.
- Button hover/press animations with reduced-motion support.
- Local review/confirmation and downloadable build/support summaries. No payments, orders, or messages are transmitted; selections reset on reload.

## Catalog provenance

CPU/GPU/RAM entries are imported from [Doc Oliver’s PC Part Dataset](https://github.com/docyx/pc-part-dataset), MIT licensed, using revision `c52a04ca9465c83997ed335f7767b09a2005dd26`. Upstream's snapshot date is **July 23, 2025**. Original selected rows and source prices are retained in `assets/catalog/parts.json`; the browser uses the equivalent `parts.js`. Prices are rounded historical USD values, **not live prices or inventory**. Other categories use illustrative planning allowances. FPS scores are locally authored estimates, not source-dataset benchmarks.

`python3 scripts/sync_catalog.py` downloads the pinned source and rebuilds the curated import. To adopt a newer snapshot, review the upstream revision, date, selectors, and compatibility metadata in that script, then update the visible date in the page template. Import fails on missing records rather than silently changing the selected model. No automatic scraping or runtime retailer requests are performed. A live stock feed would require a chosen supplier/API and typically server-side credentials; no such service is represented as connected.

## Editing and rebuilding

- `scripts/build.py`: single source for page content and shared navigation/footer.
- `site.js`: filters, builder, estimates, validation, review, downloads.
- `data.js`: catalog extensions, presets, platform logic, performance assumptions, compatibility rules.
- `viewer.js`: original schematic geometry and camera controls.
- `styles.css`: original brand styles plus responsive extensions.
- `assets/vendor/viewer.bundle.js`: checked-in, self-contained 3D runtime.
- `reference-original.html`: preserved supplied HTML; original logo remains unchanged.

For development:

```sh
npm ci
npm run build
npm test
```

The build regenerates HTML and bundles Three.js. The browser test starts its own server on port 8099. It uses installed macOS Chrome by default; set `CHROME_PATH`, or install Playwright Chromium with `npx playwright install chromium` on other platforms. Test screenshots go into ignored `test-results/`.

## Sources and licenses

- Dataset attribution and MIT license: `assets/catalog/LICENSE.txt`.
- Three.js MIT license: `assets/vendor/THREE-LICENSE.txt`; bundled from pinned npm dependencies in `package-lock.json`.
- [Three.js OrbitControls documentation](https://threejs.org/docs/pages/OrbitControls.html).
- CPU platform references: [Intel Core Ultra 9 285K](https://www.intel.com/content/www/us/en/products/sku/241060/intel-core-ultra-9-processor-285k-36m-cache-up-to-5-70-ghz/specifications.html), [AMD Ryzen 9 9950X3D](https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9950x3d.html).
- Warranty drafting reference: [FTC Businessperson’s Guide to Federal Warranty Law](https://www.ftc.gov/business-guidance/resources/businesspersons-guide-federal-warranty-law). Before taking paid orders, have the final warranty reviewed for the business's sales jurisdictions and add actual business/contact details to the quote/invoice and site.

## GitHub Pages

The generated static files can be served from the `main` branch, repository root. `.nojekyll` disables Jekyll processing. All site asset and page links are relative, so repository-path hosting works. Rebuild and commit generated HTML and `assets/vendor/viewer.bundle.js` when their sources change.
