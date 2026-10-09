# Little Loot — AHYEON + aespa

Static website. No installation or build step required.

## GitHub Pages
Upload index.html, styles.css, app.js, catalog.json, .nojekyll and the assets folder into the repository root. Settings → Pages → Deploy from a branch → main → / (root) → Save.
Replace the existing files and upload all new assets. Commit changes, wait for the Pages deployment to finish, then hard refresh the site.

## Categories
All collections (11), AHYEON Moments (7), aespa WHIPLASH (4).
Category selection updates the product grid, edition counts, collection imagery, packaging, cards and specifications. Product details always use that product's own collection rules.
In All collections, the lower collection sections are labeled AHYEON; choose aespa to switch them.
The aespa sealed whole set contains 4 boxes, one of each character, with no repeats. No secret editions are listed in its source PDF.

## Editing
index.html: structure; styles.css: appearance; app.js: collection and product data plus interactions. catalog.json is a readable copy of product data for reference; update app.js to change displayed products.

Local preview: python -m http.server 8080

Powered by Lucraft Studio.
Showcase concept; no payment or order service is connected.
