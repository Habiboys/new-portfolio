import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import type { ProjectItem } from "@/types/portfolio";

type Props = {
  project: ProjectItem | null;
  onClose: () => void;
};

export default function ProjectDetailModal({ project, onClose }: Props) {
  const [imgIndex, setImgIndex] = useState(0);

  if (!project) return null;

  const images = project.images?.length > 0 ? project.images : [project.previewImage];
  const totalImages = images.length;

  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const panel = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 28, stiffness: 260 },
    },
    exit: { opacity: 0, y: 30, scale: 0.97, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="modal-backdrop"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-8"
          onClick={onClose}
        >
          <motion.div
            key="modal-panel"
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md flex items-center justify-center transition-all hover:scale-105"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            {/* Hero image gallery */}
            <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgIndex}
                  src={images[imgIndex]}
                  alt={project.title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Gradient at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/80 to-transparent" />

              {/* Image nav */}
              {totalImages > 1 && (
                <>
                  <button
                    onClick={() =>
                      setImgIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1))
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() =>
                      setImgIndex((prev) => (prev + 1) % totalImages)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === imgIndex ? "bg-gray-900 w-5" : "bg-gray-400/60 hover:bg-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content */}
            <div className="p-6 md:p-10 space-y-8">
              {/* Title & meta */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {project.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Overview
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {project.detailedDescription}
                </p>
              </div>

              {/* Features */}
              {project.features?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {project.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extra images grid */}
              {project.images?.length > 1 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Screenshots
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {project.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:opacity-90 ${
                          i === imgIndex ? "border-gray-900" : "border-transparent"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${project.title} screenshot ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
                {project.sourceCode && (
                  <a
                    href={project.sourceCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:border-gray-900 hover:text-gray-900 transition-all hover:scale-105 active:scale-95"
                  >
                    <Github className="w-4 h-4" />
                    Source Code
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
