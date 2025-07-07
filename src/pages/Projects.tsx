import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { ArrowLeft, ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "@/data/portfolioData";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-slide images in modal
  useEffect(() => {
    if (selectedProject && selectedProject.images) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          (prev + 1) % selectedProject.images.length
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [selectedProject]);

  // Reset image index when modal opens
  useEffect(() => {
    if (selectedProject) {
      setCurrentImageIndex(0);
    }
  }, [selectedProject]);

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
            <h1 className="text-4xl md:text-5xl font-light mb-6">Projects</h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              A collection of my work showcasing various technologies and solutions I've built.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Projects Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className="group border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col h-full"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={project.previewImage} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <h3 className="text-xl font-medium mb-3 group-hover:text-gray-600 transition-colors duration-200">
                        {project.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                        {project.description}
                      </p>
                    </div>
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" className="group-hover:bg-gray-100 transition-colors duration-200 w-full">
                        View Details
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl font-semibold mb-4">
                  {selectedProject.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Auto-sliding Image Display */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <motion.img 
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src={selectedProject.images[currentImageIndex]} 
                    alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation arrows */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(prev => 
                        prev === 0 ? selectedProject.images.length - 1 : prev - 1
                      );
                    }}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 md:w-10 h-8 md:h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-4 md:w-6 h-4 md:h-6 text-gray-700" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(prev => 
                        (prev + 1) % selectedProject.images.length
                      );
                    }}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 md:w-10 h-8 md:h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                  >
                    <ChevronRight className="w-4 md:w-6 h-4 md:h-6 text-gray-700" />
                  </button>

                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {selectedProject.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full transition-all duration-200 ${
                          index === currentImageIndex 
                            ? 'bg-white w-4 md:w-6' 
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {/* Left Column - Description */}
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Overview</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedProject.detailedDescription}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                      <ul className="space-y-2">
                        {selectedProject.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <div className="mr-3 mt-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                            </div>
                            <p className="text-gray-700">{feature}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column - Tech Stack & Links */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tech.map((tech, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3">
                      {selectedProject.liveDemo && (
                        <Button 
                          variant="default" 
                          className="w-full bg-gray-900 hover:bg-gray-800 transition-all duration-300"
                          onClick={() => window.open(selectedProject.liveDemo, '_blank')}
                        >
                          View Live Demo
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                      {selectedProject.sourceCode && (
                        <Button 
                          variant="outline" 
                          className="w-full border-gray-300 hover:border-gray-900 transition-all duration-300"
                          onClick={() => window.open(selectedProject.sourceCode, '_blank')}
                        >
                          View Source Code
                          <Github className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Projects;