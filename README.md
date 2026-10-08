# Little Loot — Collectible Figures & Blind Boxes

Standalone static website. No build step or backend required.

## GitHub Pages 发布
1. 在 GitHub 建立 public repository，例如 little-loot。
2. 解压 ZIP，将 index.html、styles.css、app.js、assets 文件夹和 .nojekyll 放在 repository 根目录。不要上传 ZIP 本身。
3. 打开 Settings → Pages。
4. Source 选择 Deploy from a branch。
5. Branch 选择 main，文件夹选择 / (root)，点击 Save。
6. 部署完成后，在 Pages 页面打开网站链接。

也可将这些文件放到任何静态网站服务器的公开目录。

## Local preview
Open index.html directly, or run: python -m http.server 8080
Then visit http://localhost:8080

## Editing
- index.html: content and page structure
- styles.css: responsive styling
- app.js: product details, filters and box options
- assets/: original PDF artwork exported as WebP

Footer: Powered by Lucraft Studio.
This is a showcase site. Payments and order processing are not connected.
Product information is a design concept from the supplied PDF. Before selling, confirm product specifications and permissions for the branding and artwork.

Store name: Little Loot. Featured series: AHYEON Moments Collection.

Latest update: expanded product dialog with figure/card gallery, edition details, specifications, box format selector and blind box notes. Card preview shows the whole collection card sheet.
