import Link from "next/link";

export const metadata = {
  title: "About | AI Development Notes",
  description: "Learn more about AI Development Notes and the author behind the insights.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1>About Horse & Panda</h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Welcome to AI Development Notes, your go-to resource for insights, tutorials, 
          and discoveries in the rapidly evolving world of artificial intelligence and development.
        </p>

        <h2>What You&apos;ll Find Here</h2>
        
        <ul>
          <li><strong>Technical Deep-Dives:</strong> In-depth explorations of AI frameworks, tools, and technologies</li>
          <li><strong>Hands-On Tutorials:</strong> Step-by-step guides for building AI applications and solutions</li>
          <li><strong>Best Practices:</strong> Proven strategies for ML engineering, deployment, and production workflows</li>
          <li><strong>Industry Insights:</strong> Analysis of trends, research, and developments in the AI space</li>
          <li><strong>Tool Reviews:</strong> Evaluations of the latest AI development tools and platforms</li>
        </ul>

        <h2>Mission</h2>
        
        <p>
          Our mission is to demystify AI development and make cutting-edge technologies 
          accessible to developers at all levels. Whether you&apos;re just starting your AI journey 
          or you&apos;re a seasoned practitioner, you&apos;ll find valuable content to enhance your skills 
          and understanding.
        </p>

        <h2>Topics We Cover</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div>
            <h3>Machine Learning</h3>
            <ul>
              <li>Neural Networks & Deep Learning</li>
              <li>Natural Language Processing</li>
              <li>Computer Vision</li>
              <li>Reinforcement Learning</li>
            </ul>
          </div>
          
          <div>
            <h3>Development & Engineering</h3>
            <ul>
              <li>MLOps & Model Deployment</li>
              <li>Data Engineering</li>
              <li>AI Application Architecture</li>
              <li>Performance Optimization</li>
            </ul>
          </div>
        </div>

        <h2>Stay Connected</h2>
        
        <p>
          AI is a rapidly moving field, and we&apos;re committed to keeping our content 
          current and relevant. New posts are published regularly, covering the latest 
          developments, tools, and techniques in AI development.
        </p>

        <p>
          Have a topic you&apos;d like us to cover? Found an error in one of our posts? 
          We welcome feedback and suggestions from our community.
        </p>

        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mt-8">
          <h3>Get Started</h3>
          <p className="mb-4">
            Ready to dive in? Check out our latest posts or browse by topic to find 
            content that matches your interests and experience level.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/posts" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Posts
            </Link>
            <Link 
              href="/tags" 
              className="inline-block px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Explore Topics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}