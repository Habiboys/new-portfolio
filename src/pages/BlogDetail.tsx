import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/portfolioData";
import Navbar from "@/components/Navbar";

const BlogDetail = () => {
  const { id } = useParams();
  const blogPost = blogPosts.find(post => post.id === parseInt(id || '0'));

  if (!blogPost) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <div className="h-16"></div>
      
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                <Tag className="mr-1 h-3 w-3" />
                {blogPost.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
              {blogPost.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span className="text-sm">
                  {new Date(blogPost.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span className="text-sm">{blogPost.readTime}</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-video rounded-xl overflow-hidden mb-12">
              <img 
                src={blogPost.image} 
                alt={blogPost.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            {/* Excerpt */}
            <div className="text-xl text-gray-600 leading-relaxed mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-gray-300">
              {blogPost.excerpt}
            </div>

            {/* Main Content */}
            <div className="text-gray-700 leading-relaxed space-y-6">
              {/* Since we don't have full content, we'll create some sample content based on the category */}
              {blogPost.category === "Web Development" && (
                <>
                  <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Introduction</h2>
                  <p>
                    Modern web development has evolved significantly over the past few years. With the rise of frameworks like React and robust backend solutions like Node.js, developers now have powerful tools at their disposal to create scalable, maintainable applications.
                  </p>
                  
                  <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Key Concepts</h2>
                  <p>
                    When building scalable web applications, there are several key concepts that every developer should understand:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Component-based architecture</li>
                    <li>State management patterns</li>
                    <li>API design and integration</li>
                    <li>Performance optimization</li>
                    <li>Security best practices</li>
                  </ul>

                  <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Best Practices</h2>
                  <p>
                    Following established best practices is crucial for maintaining code quality and ensuring long-term project success. This includes proper code organization, testing strategies, and deployment procedures.
                  </p>
                </>
              )}

              {blogPost.category === "Cloud Computing" && (
                <>
                  <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">The Cloud Revolution</h2>
                  <p>
                    Cloud computing has fundamentally changed how we approach software development and deployment. The ability to scale resources on-demand and leverage managed services has opened up new possibilities for developers and organizations.
                  </p>
                  
                  <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Key Benefits</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Scalability and flexibility</li>
                    <li>Cost optimization</li>
                    <li>Global reach and availability</li>
                    <li>Managed services and automation</li>
                    <li>Enhanced security and compliance</li>
                  </ul>

                  <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Future Trends</h2>
                  <p>
                    As cloud technology continues to evolve, we're seeing exciting developments in areas like serverless computing, edge computing, and AI/ML services that are making it easier than ever to build intelligent applications.
                  </p>
                </>
              )}

              {blogPost.category === "Database" && (
                <>
                  <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Database Design Fundamentals</h2>
                  <p>
                    Effective database design is the foundation of any successful application. Poor database design can lead to performance issues, data inconsistencies, and maintenance nightmares down the road.
                  </p>
                  
                  <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Optimization Strategies</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Proper indexing strategies</li>
                    <li>Query optimization techniques</li>
                    <li>Normalization vs. denormalization</li>
                    <li>Caching mechanisms</li>
                    <li>Connection pooling</li>
                  </ul>

                  <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Performance Monitoring</h2>
                  <p>
                    Regular monitoring and analysis of database performance is essential for maintaining optimal application performance and user experience.
                  </p>
                </>
              )}

              {(blogPost.category === "Machine Learning" || blogPost.category === "Frontend") && (
                <>
                  <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Getting Started</h2>
                  <p>
                    {blogPost.category === "Machine Learning" 
                      ? "Machine learning is becoming increasingly accessible to web developers, with powerful libraries and APIs making it easier to integrate intelligent features into web applications."
                      : "Modern CSS has evolved to include powerful features that make creating beautiful, responsive interfaces easier than ever before."
                    }
                  </p>
                  
                  <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Key Technologies</h2>
                  <p>
                    {blogPost.category === "Machine Learning"
                      ? "From TensorFlow.js to cloud-based ML APIs, there are numerous tools available for integrating machine learning capabilities into your web applications."
                      : "CSS Grid, Flexbox, custom properties, and modern layout techniques provide developers with unprecedented control over design and user experience."
                    }
                  </p>

                  <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Practical Applications</h2>
                  <p>
                    {blogPost.category === "Machine Learning"
                      ? "Real-world applications include recommendation systems, image recognition, natural language processing, and predictive analytics."
                      : "These techniques can be applied to create responsive layouts, smooth animations, and engaging user interfaces that work across all devices."
                    }
                  </p>
                </>
              )}
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blogPost.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Posts Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-light mb-12 text-center">Related Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts
              .filter(post => post.id !== blogPost.id && (
                post.category === blogPost.category || 
                post.tags.some(tag => blogPost.tags.includes(tag))
              ))
              .slice(0, 3)
              .map((post) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.id}`}
                  className="group block"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium mb-3 group-hover:text-gray-600 transition-colors duration-200 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogDetail;