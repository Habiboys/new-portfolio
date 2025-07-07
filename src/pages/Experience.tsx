import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import { experiences } from "@/data/portfolioData";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Experience = () => {
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
            <h1 className="text-4xl md:text-5xl font-light mb-6">Experience</h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              My professional journey and work experience in software development and technology.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Experience Timeline */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200"></div>
            
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <motion.div 
                  key={index} 
                  className="relative group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-gray-300 group-hover:border-gray-600 group-hover:scale-125 transition-all duration-300"></div>
                  
                  <Card className="ml-16 group-hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={exp.image} 
                        alt={exp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-8">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start flex-wrap gap-4">
                          <div>
                            <h3 className="text-xl font-medium group-hover:text-gray-600 transition-colors duration-200">
                              {exp.title}
                            </h3>
                            <p className="text-gray-600 font-medium">{exp.organization}</p>
                          </div>
                          <span className="text-sm text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full group-hover:bg-gray-200 transition-colors duration-200">
                            {exp.period}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                        
                        <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-gray-200 to-gray-300 transition-all duration-700"></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      </main>
  );
};

export default Experience;