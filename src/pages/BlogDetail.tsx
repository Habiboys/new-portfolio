import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlogPosts } from "@/hooks/usePortfolio";
import Navbar from "@/components/Navbar";

const BlogDetail = () => {
  const { slug } = useParams();
  const { data: blogPosts } = useBlogPosts();
  const posts = blogPosts ?? [];
  const blogPost = posts.find((post) => post.slug === slug);

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
              {blogPost.content && blogPost.content !== "Full blog content here..." ? (
                <div dangerouslySetInnerHTML={{ __html: blogPost.content.replace(/\n/g, "<br/>") }} />
              ) : (
                <p className="text-gray-500 italic">
                  Konten artikel belum tersedia. Silakan edit melalui admin panel.
                </p>
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
            {posts
              .filter(post => post.id !== blogPost.id && (
                post.category === blogPost.category || 
                post.tags.some(tag => blogPost.tags.includes(tag))
              ))
              .slice(0, 3)
              .map((post) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.slug}`}
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