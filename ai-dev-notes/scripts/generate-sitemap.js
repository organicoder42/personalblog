const fs = require('fs');
const path = require('path');

async function generateSitemap() {
  try {
    // Try to import the contentlayer data, fallback to empty array if not available
    let allPosts = [];
    try {
      const contentlayerModule = await import('../.contentlayer/generated/index.mjs');
      allPosts = contentlayerModule.allPosts || [];
    } catch (importError) {
      console.log('⚠️  No contentlayer data found, generating basic sitemap');
      allPosts = [];
    }
    
    const siteUrl = 'https://ai-dev-notes.vercel.app';
    const currentDate = new Date().toISOString().split('T')[0];

    // Static pages
    const staticPages = [
      { url: '', changefreq: 'weekly', priority: '1.0' },
      { url: '/posts', changefreq: 'weekly', priority: '0.8' },
      { url: '/tags', changefreq: 'monthly', priority: '0.6' },
      { url: '/about', changefreq: 'monthly', priority: '0.5' },
    ];

    // Post pages
    const postPages = allPosts
      .filter(post => !post.draft)
      .map(post => ({
        url: post.url,
        changefreq: 'monthly',
        priority: '0.7',
        lastmod: post.publishedAt,
      }));

    // Tag pages
    const tags = [...new Set(allPosts.flatMap(post => post.tags || []))];
    const tagPages = tags.map(tag => ({
      url: `/tags/${encodeURIComponent(tag)}`,
      changefreq: 'monthly',
      priority: '0.5',
    }));

    // Combine all pages
    const allPages = [...staticPages, ...postPages, ...tagPages];

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Ensure public directory exists
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write sitemap
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);

    // Generate robots.txt
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`;

    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);

    console.log(`✅ Generated sitemap with ${allPages.length} URLs`);
    console.log('✅ Generated robots.txt');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateSitemap();
}

module.exports = generateSitemap;