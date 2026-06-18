import { ArrowRight, Mail, Github, Linkedin, ExternalLink, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePortfolioData } from "@/hooks/usePortfolio";
import { Boxes } from "@/components/ui/background-boxes";
import DomeGallery from "@/components/DomeGallery";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { BlogPreview } from "@/components/BlogPreview";
import { Vortex } from "@/components/ui/vortex";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import ProjectDetailModal from "@/components/ProjectDetailModal";

// Reusable scroll-reveal wrapper
function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}) {
  const dirMap = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...dirMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function staggerContainer(delayChildren = 0.1) {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: delayChildren, delayChildren: 0 },
    },
  };
}

function staggerItem(delay = 0) {
  return {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };
}

const Index = () => {
  const { data: portfolio } = usePortfolioData();

  const personalInfo = portfolio?.personalInfo ?? {
    name: "",
    title: "",
    description: "",
    photo: "",
    email: "",
    linkedin: "",
    github: "",
    instagram: "",
  };
  const aboutMe = portfolio?.aboutMe ?? { paragraphs: [] };
  const techStack = portfolio?.techStack ?? [];
  const experiences = portfolio?.experiences ?? [];
  const projects = portfolio?.projects ?? [];
  const contactInfo = portfolio?.contactInfo ?? {
    title: "",
    description: "",
    socialLinks: [],
  };
  const galleryItems = portfolio?.galleryItems ?? [];

  const [selectedProject, setSelectedProject] = useState(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(500);

  useEffect(() => {
    const el = carouselContainerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      setCarouselWidth(Math.min(w, 1200));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="bg-white">
      <Navbar />

      {/* Add margin-top to hero section to account for fixed navbar */}
      <div className="h-16"></div>

      {/* ─── HERO ─────────────────────── */}
      <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100/50">
          <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(transparent,white)]" />
          <div className="absolute inset-0 z-[1]">
            <Boxes />
          </div>
        </div>

        <div className="relative w-full pointer-events-none">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-[2]">
            {/* Left – Photo */}
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
                    src={personalInfo.photo}
                    alt="Muhammad Nouval Habibie"
                    className="w-full h-full object-contain scale-110"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Right – Text */}
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
                  {personalInfo.name.split(" ").slice(0, 2).join(" ")}
                  <br />
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
                  >
                    {personalInfo.name.split(" ").slice(2).join(" ")}
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
                    onClick={() => scrollToSection("about")}
                    variant="default"
                    className="group bg-gray-900 hover:bg-gray-800 transition-all duration-300"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                  <Button
                    onClick={() => scrollToSection("projects")}
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

      {/* ─── ABOUT ────────────────────── */}
      <Reveal>
        <section id="about" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-light mb-12 text-center"
            >
              About Me
            </motion.h2>
            <motion.div
              variants={staggerContainer(0.15)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {aboutMe.paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  variants={staggerItem(index * 0.1)}
                  className="text-lg text-gray-700 leading-relaxed mb-8"
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* ─── TECH STACK ───────────────── */}
      <Reveal>
        <section id="techstack" className="py-20 bg-gray-50 overflow-hidden">
          <div className="max-w-4xl mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-light mb-12 text-center"
            >
              Tech Stack
            </motion.h2>
            <div className="relative">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex animate-marquee gap-12 w-max"
              >
                {Array.from({ length: 4 }).map((_, setIndex) => (
                  <div key={`set-${setIndex}`} className="flex gap-12">
                    {techStack.map((tech, index) => (
                      <motion.div
                        key={`${setIndex}-${index}`}
                        whileHover={{
                          scale: 1.15,
                          rotate: 5,
                          transition: { duration: 0.2 },
                        }}
                        className="flex-shrink-0"
                      >
                        <img
                          src={`https://skillicons.dev/icons?i=${tech}&theme=light`}
                          alt={tech}
                          className="w-20 h-20 opacity-90 hover:opacity-100"
                        />
                      </motion.div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ─── EXPERIENCE ───────────────── */}
      <section id="experience" className="relative overflow-hidden bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light">Recent Experience</h2>
            <Link to="/experience">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </motion.div>
        </div>
        <ScrollStack
          useWindowScroll={true}
          itemDistance={80}
          itemScale={0.05}
          itemStackDistance={40}
          stackPosition="30%"
          scaleEndPosition="15%"
          baseScale={0.8}
          rotationAmount={0}
          blurAmount={0}
        >
          {experiences.slice(0, 3).map((exp, index) => (
            <ScrollStackItem key={index}>
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">
                      {exp.title}
                    </h3>
                    <p className="text-gray-600 font-medium">
                      {exp.organization}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full">
                    {exp.period}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {exp.description}
                </p>
                <div className="h-0.5 w-full bg-gradient-to-r from-gray-100 to-gray-200" />
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </section>

      {/* ─── PROJECTS ─────────────────── */}
      <section id="projects" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light">Recent Projects</h2>
            <Link to="/projects">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </motion.div>
          <div ref={carouselContainerRef}>
            {projects.length > 0 ? (
              <Carousel
                items={projects}
                baseWidth={carouselWidth}
                autoplay={true}
                autoplayDelay={2500}
                pauseOnHover={true}
                loop={true}
                onSelectProject={setSelectedProject}
              />
            ) : (
              <div className="w-full h-[400px] flex items-center justify-center">
                <p className="text-gray-400">No projects yet</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* ─── BLOG ──────────────────────── */}
      <Reveal>
        <section id="blog" className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex justify-between items-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-light">Recent Posts</h2>
              <Link to="/blog">
                <Button variant="outline" className="group">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
            </motion.div>
            <BlogPreview />
          </div>
        </section>
      </Reveal>

      {/* ─── CONTACT ───────────────────── */}
      <Reveal>
        <section id="contact" className="relative overflow-hidden">
          <div className="w-full h-[30rem] md:h-[35rem]">
            <Vortex
              backgroundColor="black"
              className="flex items-center flex-col justify-center px-4 md:px-10 py-4 w-full h-full"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-white text-2xl md:text-4xl font-light mb-8 md:mb-12 text-center"
              >
                {contactInfo.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-white/90 text-base md:text-lg mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed text-center"
              >
                {contactInfo.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col md:flex-row justify-center gap-4 md:space-x-6"
              >
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
                  onClick={() => window.open(personalInfo.github, "_blank")}
                >
                  <Github className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-white/30 hover:border-white bg-white/10 hover:bg-white/20 text-white transition-all duration-300 w-full md:w-auto backdrop-blur-sm"
                  onClick={() => window.open(personalInfo.linkedin, "_blank")}
                >
                  <Linkedin className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-white/30 hover:border-white bg-white/10 hover:bg-white/20 text-white transition-all duration-300 w-full md:w-auto backdrop-blur-sm"
                  onClick={() => window.open(personalInfo.instagram, "_blank")}
                >
                  <Instagram className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  Instagram
                </Button>
              </motion.div>
            </Vortex>
          </div>
        </section>
      </Reveal>

      {/* ─── GALLERY ───────────────────── */}
      <Reveal>
        <section id="gallery" className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-light mb-12 text-center"
            >
              Gallery
            </motion.h2>
            <div className="w-full h-[600px] md:h-[700px] relative">
              <DomeGallery
                images={galleryItems.map((item) => ({
                  src: item.thumbnail,
                  alt: item.title,
                }))}
                grayscale={false}
                imageBorderRadius="16px"
                openedImageBorderRadius="16px"
                overlayBlurColor="#ffffff"
                minRadius={500}
                fit={0.45}
                padFactor={0.15}
              />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ─── FOOTER ────────────────────── */}
      <footer className="py-6 md:py-8 px-4 md:px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {personalInfo.name}.
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
