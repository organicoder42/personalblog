const fs = require('fs');
const path = require('path');
const { Feed } = require('feed');

async function generateRSSFeed() {
  try {
    // Try to import the contentlayer data, fallback to empty array if not available
    let allPosts = [];
    try {
      const contentlayerModule = await import('../.contentlayer/generated/index.mjs');
      allPosts = contentlayerModule.allPosts || [];
    } catch (importError) {
      console.log('⚠️  No contentlayer data found, generating empty RSS feed');
      allPosts = [];
    }
    
    const siteUrl = 'https://ai-dev-notes.vercel.app';
    const author = {
      name: 'AI Dev Notes',
      email: 'hello@ai-dev-notes.com',
      link: siteUrl,
    };

    const feed = new Feed({
      title: 'AI Development Notes',
      description: 'Insights, tutorials, and discoveries in AI development',
      id: siteUrl,
      link: siteUrl,
      language: 'en',
      image: `${siteUrl}/images/logo.png`,
      favicon: `${siteUrl}/favicon.ico`,
      copyright: `© 2025 AI Development Notes`,
      author,
      feedLinks: {
        rss2: `${siteUrl}/rss.xml`,
        json: `${siteUrl}/feed.json`,
        atom: `${siteUrl}/atom.xml`,
      },
    });

    // Add posts to feed
    allPosts
      .filter(post => !post.draft)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .forEach((post) => {
        const postUrl = `${siteUrl}${post.url}`;
        
        feed.addItem({
          title: post.title,
          id: postUrl,
          link: postUrl,
          description: post.summary,
          content: post.summary,
          author: [author],
          date: new Date(post.publishedAt),
          category: post.tags?.map(tag => ({ name: tag })) || [],
        });
      });

    // Ensure public directory exists
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write feed files
    fs.writeFileSync(path.join(publicDir, 'rss.xml'), feed.rss2());
    fs.writeFileSync(path.join(publicDir, 'atom.xml'), feed.atom1());
    fs.writeFileSync(path.join(publicDir, 'feed.json'), feed.json1());

    console.log('✅ Generated RSS feeds (RSS, Atom, JSON)');
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateRSSFeed();
}

module.exports = generateRSSFeed;