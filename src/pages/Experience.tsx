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
  const [selectedExperience, setSelectedExperience] = useState(null);

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
                  
                  <Card 
                    className="ml-16 group-hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedExperience(exp)}
                  >
                    <CardContent className="p-8">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start flex-wrap gap-4">
                          <div>
                            <h3 className="text-xl font-medium group-hover:text-gray-600 transition-colors duration-200">
                              {exp.title}
                            </h3>
                            <p className="text-gray-600 font-medium">{exp.organization}</p>
                            <p className="text-sm text-gray-500">{exp.location} • {exp.type}</p>
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

      {/* Experience Modal */}
      <Dialog open={!!selectedExperience} onOpenChange={() => setSelectedExperience(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
          {selectedExperience && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl font-semibold">
                  {selectedExperience.title}
                </DialogTitle>
                <DialogDescription>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img 
                          src={selectedExperience.companyLogo} 
                          alt={selectedExperience.organization}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">
                          {selectedExperience.organization}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{selectedExperience.location}</span>
                          <span>•</span>
                          <span>{selectedExperience.type}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full self-start md:self-center">
                      {selectedExperience.period}
                    </span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-6">
                {/* Featured Image */}
                <div className="aspect-[2/1] rounded-lg overflow-hidden">
                  <img 
                    src={selectedExperience.image} 
                    alt={`${selectedExperience.title} at ${selectedExperience.organization}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {/* Main Content - Left Side */}
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Overview</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedExperience.detailedDescription}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Key Responsibilities</h3>
                      <ul className="space-y-2">
                        {selectedExperience.responsibilities?.map((resp, index) => (
                          <li key={index} className="flex items-start">
                            <div className="mr-3 mt-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                            </div>
                            <p className="text-gray-700">{resp}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Notable Projects</h3>
                      <ul className="space-y-2">
                        {selectedExperience.projects?.map((project, index) => (
                          <li key={index} className="flex items-start">
                            <div className="mr-3 mt-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                            </div>
                            <p className="text-gray-700">{project}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Key Achievements</h3>
                      <ul className="space-y-2">
                        {selectedExperience.achievements?.map((achievement, index) => (
                          <li key={index} className="flex items-start">
                            <div className="mr-3 mt-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                            </div>
                            <p className="text-gray-700">{achievement}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Sidebar - Right Side */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Technical Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedExperience.skills?.technical.map((skill, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Soft Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedExperience.skills?.soft.map((skill, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedExperience.technologies?.map((tech, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
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

export default Experience;