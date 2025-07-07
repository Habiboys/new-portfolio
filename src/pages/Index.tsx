                                                                                                                           import { ArrowRight, Mail, Github, Linkedin, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import habibiePhoto from "../assets/images/habibie.png";
import { personalInfo, aboutMe, techStack, experiences, projects, contactInfo } from "@/data/portfolioData";
import { Boxes } from "@/components/ui/background-boxes";
import { Gallery } from "@/components/Gallery";
import { Blog } from "@/components/Blog";
import { BlogPreview } from "@/components/BlogPreview";
import { Vortex } from "@/components/ui/vortex";
import Navbar from "@/components/Navbar";

const Index = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-slide images in modal
  useEffect(() => {
    if (selectedProject && selectedProject.images) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          (prev + 1) % selectedProject.images.length
        );
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [selectedProject]);

  // Reset image index when modal opens
  useEffect(() => {
    if (selectedProject) {
      setCurrentImageIndex(0);
    }
  }, [selectedProject]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Data now imported from portfolioData.ts

  return (
    <main className="bg-white">
      <Navbar />

      {/* Add margin-top to hero section to account for fixed navbar */}
      <div className="h-16"></div>

      {/* Modern Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background dengan boxes */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100/50">
          <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(transparent,white)]" />
          <div className="absolute inset-0 z-[1]">
            <Boxes />
          </div>
        </div>

        {/* Content wrapper dengan pointer-events-none */}
        <div className="relative w-full pointer-events-none">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-[2]">
            {/* Left Side - Photo dengan pointer-events-auto */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end pointer-events-auto"
            >
              <div className="relative max-w-[580px] w-full">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="aspect-[4/5] rounded-lg overflow-hidden"
                >
                  <img 
                    src={habibiePhoto}
                    alt="Muhammad Nouval Habibie"
                    className="w-full h-full object-contain scale-110"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Content dengan pointer-events-auto */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center lg:text-left pointer-events-auto"
            >
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-5xl md:text-6xl font-light mb-6 tracking-tight"
                >
                  {personalInfo.name.split(' ').slice(0, 2).join(' ')}
                  <br />
                  <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
                  >
                    {personalInfo.name.split(' ').slice(2).join(' ')}
                  </motion.span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="text-xl md:text-2xl text-gray-600 mb-8 font-light"
                >
                  {personalInfo.title}
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="text-lg text-gray-500 mb-12 max-w-xl leading-relaxed"
                >
                  {personalInfo.description}
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Button 
                    onClick={() => scrollToSection('about')}
                    variant="default"
                    className="group bg-gray-900 hover:bg-gray-800 transition-all duration-300"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                  <Button
                    onClick={() => scrollToSection('projects')}
                    variant="outline"
                    className="group border-gray-300 hover:border-gray-900 transition-all duration-300"
                  >
                    View Projects
                    <ExternalLink className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light mb-12 text-center">About Me</h2>
          <div className="animate-slide-up">
            {aboutMe.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-lg text-gray-700 leading-relaxed mb-8">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section with Marquee */}
      <section id="techstack" className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-light mb-12 text-center">Tech Stack</h2>
          <div className="relative">
            <div className="flex animate-marquee gap-12 w-max">
              {/* Create multiple copies for seamless loop */}
              {Array.from({ length: 4 }).map((_, setIndex) => (
                <div key={`set-${setIndex}`} className="flex gap-12">
                  {techStack.map((tech, index) => (
                    <div key={`${setIndex}-${index}`} className="flex-shrink-0">
                      <img 
                        src={`https://skillicons.dev/icons?i=${tech}&theme=light`}
                        alt={tech}
                        className="w-20 h-20 hover:scale-110 transition-transform duration-200 opacity-90 hover:opacity-100"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light">Recent Experience</h2>
            <Link to="/experience">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200"></div>
            
            <div className="space-y-12">
              {experiences.slice(0, 3).map((exp, index) => (
                <div key={index} className="relative group">
                  <div className="absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-gray-300 group-hover:border-gray-600 group-hover:scale-125 transition-all duration-300"></div>
                  
                  <Card className="ml-16 group-hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      
      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light">Recent Projects</h2>
            <Link to="/projects">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project, index) => (
              <Card 
                key={index} 
                className="group border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col"
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

      {/* Blog Section */}
      <section id="blog" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light">Recent Posts</h2>
            <Link to="/blog">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </div>
          <BlogPreview />
        </div>
      </section>

      {/* Contact Section - Let's Connect */}
      <section id="contact" className="relative overflow-hidden">
        <div className="w-full h-[30rem] md:h-[35rem]">
          <Vortex
            backgroundColor="black"
            className="flex items-center flex-col justify-center px-4 md:px-10 py-4 w-full h-full"
          >
            <h2 className="text-white text-2xl md:text-4xl font-light mb-8 md:mb-12 text-center">
              {contactInfo.title}
            </h2>
            <p className="text-white/90 text-base md:text-lg mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed text-center">
              {contactInfo.description}
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:space-x-6">
              <Button 
                variant="outline" 
                size="lg"
                className="group border-white/30 hover:border-white bg-white/10 hover:bg-white/20 text-white transition-all duration-300 w-full md:w-auto backdrop-blur-sm"
                onClick={() => window.open(`mailto:${personalInfo.email}`)}
              >
                <Mail className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                Email Me
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="group border-white/30 hover:border-white bg-white/10 hover:bg-white/20 text-white transition-all duration-300 w-full md:w-auto backdrop-blur-sm"
                onClick={() => window.open(personalInfo.github, '_blank')}
              >
                <Github className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                GitHub
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="group border-white/30 hover:border-white bg-white/10 hover:bg-white/20 text-white transition-all duration-300 w-full md:w-auto backdrop-blur-sm"
                onClick={() => window.open(personalInfo.linkedin, '_blank')}
              >
                <Linkedin className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                LinkedIn
              </Button>
            </div>
          </Vortex>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light mb-12 text-center">Gallery</h2>
          <Gallery />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 md:py-8 px-4 md:px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2024 {personalInfo.name}. Built with React and Tailwind CSS.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
        
        .animate-marquee {
          animation: marquee 24s linear infinite;
        }
      `}</style>
    </main>
  );
};

export default Index;
