import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { BlogList } from "@/components/BlogList";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const BlogPage = () => {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <div className="h-16"></div>
      
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100/50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-light mb-6">Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Thoughts, insights, and experiences from my journey in technology and software development.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Blog Content */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <BlogList />
        </div>
      </section>
    </main>
  );
};

export default BlogPage;