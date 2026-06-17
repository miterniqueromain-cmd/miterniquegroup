const fs = require("fs");
const path = require("path");

const SITE_URL = "https://www.miterniquegroup.com";
const ROOT_DIR = __dirname;

const excludedFiles = [
  "generate-sitemap.html"
];

function getHtmlFiles(dir) {
  let results = [];

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!file.startsWith(".") && file !== "node_modules") {
        results = results.concat(getHtmlFiles(fullPath));
      }
    } else if (
      file.endsWith(".html") &&
      !excludedFiles.includes(file)
    ) {
      results.push(fullPath);
    }
  }

  return results;
}

const today = new Date().toISOString().split("T")[0];

const htmlFiles = getHtmlFiles(ROOT_DIR);

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

htmlFiles.forEach(file => {
  let relativePath = path.relative(ROOT_DIR, file).replace(/\\/g, "/");

  let url = relativePath === "index.html"
    ? `${SITE_URL}/`
    : `${SITE_URL}/${relativePath}`;

  let priority = relativePath === "index.html" ? "1.0" : "0.8";

  sitemap += `  <url>\n`;
  sitemap += `    <loc>${url}</loc>\n`;
  sitemap += `    <lastmod>${today}</lastmod>\n`;
  sitemap += `    <changefreq>monthly</changefreq>\n`;
  sitemap += `    <priority>${priority}</priority>\n`;
  sitemap += `  </url>\n`;
});

sitemap += `</urlset>\n`;

fs.writeFileSync(path.join(ROOT_DIR, "sitemap.xml"), sitemap, "utf8");

console.log("sitemap.xml généré automatiquement avec succès.");
