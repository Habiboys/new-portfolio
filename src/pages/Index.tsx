import { ExperienceCard } from "@/components/ExperienceCard";
import { ContactSilkBackground, SilkStaticBackground } from "@/components/ContactSilkBackground";
import { BlogPreview } from "@/components/BlogPreview";
import { IndexPageSkeleton } from "@/components/IndexPageSkeleton";
import { LazyMount } from "@/components/LazyMount";
import Navbar from "@/components/Navbar";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import LogoLoop from "@/components/LogoLoop";
import { Reveal } from "@/components/Reveal";
import ShapeGrid from "@/components/ShapeGrid";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePortfolioData } from "@/hooks/usePortfolio";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { ProjectItem } from "@/types/portfolio";
import { ArrowRight, ExternalLink, Github, Instagram, Linkedin, Mail } from "lucide-react";
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Carousel = lazy(() => import("@/components/Carousel"));
const Masonry = lazy(() => import("@/components/Masonry"));
const ExperienceStack = lazy(() => import("@/components/ExperienceStack"));
const ScrambledText = lazy(() => import("@/components/ScrambledText"));

function SectionLoader({ className = "h-[480px]" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
    </div>
  );
}

const Index = () => {
  const { data: portfolio, isLoading } = usePortfolioData();

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

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(() =>
    typeof window !== "undefined" ? Math.min(window.innerWidth - 32, 1200) : 500
  );
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReducedMotion = usePrefersReducedMotion();
  // Gallery grid + carousel autoplay only — experience & contact stay animated on mobile
  const useLightMotion = isMobile || prefersReducedMotion;
  const validGalleryItems = galleryItems.filter((item) => item.thumbnail);
  const masonryItems = useMemo(
    () =>
      validGalleryItems.map((item, index) => ({
        id: String(item.id),
        img: item.thumbnail,
        height: 260 + (index % 4) * 48,
        title: item.title,
      })),
    [validGalleryItems]
  );
  const techLogos = useMemo(
    () =>
      techStack.map((tech) => ({
        src: `https://skillicons.dev/icons?i=${tech}&theme=light`,
        alt: tech,
        title: tech,
      })),
    [techStack]
  );

  useEffect(() => {
    const el = carouselContainerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      setCarouselWidth(Math.max(Math.min(w, 1200), 280));
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
    <main className="bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Navbar />

      {isLoading ? (
        <IndexPageSkeleton />
      ) : (
        <>
      {/* ─── HERO ─────────────────────── */}
      <section className="min-h-[90vh] sm:min-h-screen flex items-center justify-center px-4 sm:px-6 pt-28 sm:pt-32 pb-12 sm:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100/50">
          <div className="absolute inset-0 z-[1] pointer-events-auto">
            <ShapeGrid
              speed={0.5}
              squareSize={isMobile ? 32 : 40}
              direction="diagonal"
              borderColor="#e5e7eb"
              hoverFillColor="#222"
              shape="square"
              hoverTrailAmount={5}
              paused={prefersReducedMotion}
            />
          </div>
          <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-transparent via-white/20 to-gray-50/90" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-transparent to-gray-50 pointer-events-none z-[2]" />

        <div className="relative w-full pointer-events-none">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-[2]">
            {/* Left – Photo */}
            <div className="flex justify-center pointer-events-auto animate-hero-in">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] mx-auto">
                <div className="aspect-[3/4] flex items-center justify-center rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                  {personalInfo.photo ? (
                    <img
                      src={personalInfo.photo}
                      alt={personalInfo.name || "Profile photo"}
                      className="max-h-full max-w-full w-auto h-auto object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  ) : null}
                </div>
              </div>
            </div>

            <div className="text-center lg:text-left pointer-events-auto animate-hero-in-delay-1 max-w-xl mx-auto lg:mx-0">
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-light mb-4 sm:mb-6 tracking-tight break-words">
                  {personalInfo.name.split(" ").slice(0, 2).join(" ")}
                  <br />
                  <span className="font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    {personalInfo.name.split(" ").slice(2).join(" ")}
                  </span>
                </h1>
                <p className="text-base sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 font-light">
                  {personalInfo.title}
                </p>
                <p className="text-base sm:text-lg text-gray-500 mb-8 sm:mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {personalInfo.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-hero-in-delay-2">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT ────────────────────── */}
      <Reveal>
        <section id="about" className="py-12 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-gray-50 via-white to-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light mb-12 text-center">
              About Me
            </h2>
            <div className="space-y-8">
              {aboutMe.paragraphs.map((paragraph, index) => (
                <Suspense
                  key={index}
                  fallback={
                    <p className="text-lg text-gray-700 leading-relaxed">{paragraph}</p>
                  }
                >
                  <ScrambledText
                    radius={100}
                    duration={1.2}
                    speed={0.5}
                    scrambleChars=".:"
                  >
                    {paragraph}
                  </ScrambledText>
                </Suspense>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ─── TECH STACK ───────────────── */}
      <Reveal>
        <section id="techstack" className="py-12 md:py-20 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-gray-100/70">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-center">
              Tech Stack
            </h2>
          </div>
          {techLogos.length > 0 && (
            <div className="relative h-28 md:h-32 w-full">
              <LogoLoop
                logos={techLogos}
                speed={80}
                direction="left"
                logoHeight={56}
                gap={48}
                hoverSpeed={20}
                scaleOnHover
                fadeOut
                fadeOutColor="#f3f4f6"
                ariaLabel="Technology stack"
              />
            </div>
          )}
        </section>
      </Reveal>

      {/* ─── EXPERIENCE ───────────────── */}
      <section
        id="experience"
        className="relative overflow-hidden py-10 md:py-14 px-4 sm:px-6 bg-gradient-to-b from-gray-100/70 via-white to-gray-50/80"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 md:mb-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2">Career</p>
              <h2 className="text-3xl md:text-4xl font-light">Recent Experience</h2>
            </div>
            <Link to="/experience">
              <Button variant="outline" className="group self-start sm:self-auto">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </div>

          <LazyMount minHeight={prefersReducedMotion ? 360 : 420}>
            {prefersReducedMotion ? (
              <div className="space-y-5">
                {experiences.map((exp, index) => (
                  <ExperienceCard key={index} exp={exp} index={index} />
                ))}
              </div>
            ) : (
              <Suspense fallback={<SectionLoader className="h-[420px]" />}>
                <ExperienceStack experiences={experiences} />
              </Suspense>
            )}
          </LazyMount>
        </div>
      </section>

      {/* ─── PROJECTS ─────────────────── */}
      <section id="projects" className="py-10 md:py-14 px-4 sm:px-6 bg-gradient-to-b from-gray-50/80 via-gray-50 to-white/90">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 md:mb-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2">Work</p>
              <h2 className="text-3xl md:text-4xl font-light">Recent Projects</h2>
            </div>
            <Link to="/projects">
              <Button variant="outline" className="group self-start sm:self-auto">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </div>
          <div ref={carouselContainerRef} className="w-full overflow-hidden">
            <LazyMount minHeight={480}>
              {projects.length > 0 ? (
                <Suspense fallback={<SectionLoader className="h-[280px] sm:h-[420px]" />}>
                  <Carousel
                    items={projects}
                    baseWidth={carouselWidth}
                    autoplay={!useLightMotion}
                    autoplayDelay={2200}
                    pauseOnHover={true}
                    loop={true}
                    onSelectProject={setSelectedProject}
                  />
                </Suspense>
              ) : (
                <div className="w-full h-[400px] flex items-center justify-center">
                  <p className="text-gray-400">No projects yet</p>
                </div>
              )}
            </LazyMount>
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
        <section id="blog" className="py-12 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-white/90 via-white to-gray-100/60">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-light">Recent Posts</h2>
              <Link to="/blog">
                <Button variant="outline" className="group self-start sm:self-auto">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
            </div>
            <BlogPreview />
          </div>
        </section>
      </Reveal>

      {/* ─── CONTACT ───────────────────── */}
      <Reveal>
        <section id="contact" className="relative overflow-hidden bg-gradient-to-b from-gray-100/60 via-gray-200/40 to-[#7B7481]/30">
          <div className="absolute inset-x-0 top-0 h-20 sm:h-28 bg-gradient-to-b from-gray-100/60 to-transparent pointer-events-none z-[1]" />
          <LazyMount minHeight="24rem" className="w-full min-h-[24rem] md:min-h-[30rem] md:h-[35rem] relative z-0">
            <div className="relative flex min-h-[24rem] md:min-h-0 h-full w-full flex-col items-center justify-center px-4 sm:px-6 md:px-10 py-8 md:py-4">
              {prefersReducedMotion ? (
                <SilkStaticBackground />
              ) : (
                <ContactSilkBackground />
              )}

              <div className="relative z-10 flex w-full flex-col items-center justify-center">
                <h2 className="text-white text-2xl md:text-4xl font-light mb-8 md:mb-12 text-center">
                  {contactInfo.title}
                </h2>
                <p className="text-white/90 text-base md:text-lg mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed text-center">
                  {contactInfo.description}
                </p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="group border-white/30 hover:border-white bg-white/10 hover:bg-white/20 text-white transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
                    onClick={() => window.open(`mailto:${personalInfo.email}`)}
                  >
                    <Mail className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    Email Me
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group border-white/30 hover:border-white bg-white/10 hover:bg-white/20 text-white transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
                    onClick={() => window.open(personalInfo.github, "_blank")}
                  >
                    <Github className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    GitHub
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group border-white/30 hover:border-white bg-white/10 hover:bg-white/20 text-white transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
                    onClick={() => window.open(personalInfo.linkedin, "_blank")}
                  >
                    <Linkedin className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group border-white/30 hover:border-white bg-white/10 hover:bg-white/20 text-white transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
                    onClick={() => window.open(personalInfo.instagram, "_blank")}
                  >
                    <Instagram className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    Instagram
                  </Button>
                </div>
              </div>
            </div>
          </LazyMount>
        </section>
      </Reveal>

      {/* ─── GALLERY ───────────────────── */}
      <Reveal>
        <section id="gallery" className="relative py-12 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-[#7B7481]/15 via-gray-50 to-white">
          <div className="absolute inset-x-0 top-0 h-16 sm:h-24 bg-gradient-to-b from-[#7B7481]/10 to-transparent pointer-events-none" />
          <div className="max-w-6xl mx-auto relative">
            <h2 className="text-3xl md:text-4xl font-light mb-12 text-center">
              Gallery
            </h2>
            <LazyMount minHeight={480} className="w-full relative">
              {useLightMotion || validGalleryItems.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {validGalleryItems.map((item) => (
                    <div
                      key={item.id}
                      className="aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.imageAlt ?? item.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Suspense fallback={<SectionLoader className="min-h-[480px]" />}>
                  <Masonry
                    items={masonryItems}
                    ease="power2.out"
                    duration={0.45}
                    stagger={0.04}
                    animateFrom="center"
                    scaleOnHover
                    hoverScale={0.98}
                    blurToFocus={false}
                  />
                </Suspense>
              )}
            </LazyMount>
          </div>
        </section>
      </Reveal>

      {/* ─── FOOTER ────────────────────── */}
      <footer className="py-6 md:py-8 px-4 md:px-6 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
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
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
        </>
      )}
    </main>
  );
};

export default Index;
