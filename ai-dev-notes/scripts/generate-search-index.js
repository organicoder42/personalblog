const fs = require('fs');
const path = require('path');

async function generateSearchIndex() {
  try {
    // Try to import the contentlayer data, fallback to empty array if not available
    let allPosts = [];
    try {
      const contentlayerModule = await import('../.contentlayer/generated/index.mjs');
      allPosts = contentlayerModule.allPosts || [];
    } catch (importError) {
      console.log('⚠️  No contentlayer data found, generating empty search index');
      allPosts = [];
    }
    
    const searchIndex = allPosts
      .filter(post => !post.draft)
      .map(post => ({
        title: post.title,
        summary: post.summary,
        tags: post.tags || [],
        slug: post.slug,
        url: post.url,
        publishedAt: post.publishedAt,
      }));

    const outputPath = path.join(process.cwd(), 'public', 'search-index.json');
    
    // Ensure the public directory exists
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2));
    console.log(`✅ Generated search index with ${searchIndex.length} posts`);
  } catch (error) {
    console.error('Error generating search index:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateSearchIndex();
}

module.exports = generateSearchIndex;