import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { id: "about", label: "About", type: "section" as const },
  { id: "experience", label: "Experience", type: "route" as const, path: "/experience" },
  { id: "projects", label: "Projects", type: "route" as const, path: "/projects" },
  { id: "blog", label: "Blog", type: "route" as const, path: "/blog" },
  { id: "gallery", label: "Gallery", type: "section" as const },
  { id: "contact", label: "Contact", type: "section" as const },
];

const mobileLinkClass =
  "flex w-full items-center px-4 py-3.5 text-[15px] font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100";

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const linkClass = (active: boolean) =>
    cn(
      "transition-colors duration-200 whitespace-nowrap",
      scrolled ? "text-sm" : "text-[15px]",
      active ? "text-gray-900 font-medium" : "text-gray-600 hover:text-gray-900"
    );

  const renderDesktopNavItem = (item: (typeof navLinks)[number]) => {
    const isActive =
      item.type === "route" ? location.pathname === item.path : false;

    if (item.type === "section") {
      if (isHomePage) {
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToSection(item.id)}
            className={linkClass(false)}
          >
            {item.label}
          </button>
        );
      }

      return (
        <Link key={item.id} to={`/#${item.id}`} className={linkClass(false)}>
          {item.label}
        </Link>
      );
    }

    return (
      <Link key={item.id} to={item.path!} className={linkClass(isActive)}>
        {item.label}
      </Link>
    );
  };

  const renderMobileNavItem = (item: (typeof navLinks)[number]) => {
    const isActive =
      item.type === "route" ? location.pathname === item.path : false;

    const className = cn(
      mobileLinkClass,
      isActive && "text-gray-900 bg-gray-50"
    );

    const close = () => setMobileOpen(false);

    if (item.type === "section") {
      if (isHomePage) {
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              scrollToSection(item.id);
              close();
            }}
            className={className}
          >
            {item.label}
          </button>
        );
      }

      return (
        <Link key={item.id} to={`/#${item.id}`} onClick={close} className={className}>
          {item.label}
        </Link>
      );
    }

    return (
      <Link key={item.id} to={item.path!} onClick={close} className={className}>
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed inset-x-0 top-0 z-50 pointer-events-none px-3 sm:px-4">
        <motion.div
          initial={false}
          animate={{ y: scrolled ? 4 : 12 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="mx-auto w-full max-w-lg md:max-w-none"
        >
          <nav
            className={cn(
              "pointer-events-auto mx-auto border backdrop-blur-xl transition-all duration-300 ease-out",
              "rounded-2xl md:rounded-2xl",
              scrolled
                ? "md:max-w-3xl md:rounded-full border-gray-200/70 bg-white/92 shadow-[0_8px_32px_rgba(15,23,42,0.10)]"
                : "md:max-w-5xl border-white/60 bg-white/78 shadow-[0_10px_40px_rgba(15,23,42,0.08)]"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-between transition-all duration-300 ease-out",
                scrolled ? "h-12 px-3 sm:px-5" : "h-[4.25rem] px-4 sm:px-6"
              )}
            >
              <div className="flex-shrink-0 min-w-0">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "font-medium bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate block transition-all duration-300",
                    scrolled ? "text-base" : "text-lg sm:text-xl"
                  )}
                >
                  My Portfolio
                </Link>
              </div>

              <div
                className={cn(
                  "hidden md:flex items-center transition-all duration-300",
                  scrolled ? "gap-5" : "gap-8"
                )}
              >
                {navLinks.map((item) => renderDesktopNavItem(item))}
              </div>

              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                className={cn(
                  "md:hidden rounded-full hover:bg-gray-100/80 transition-colors duration-200",
                  scrolled ? "p-1.5" : "p-2"
                )}
                onClick={() => setMobileOpen((open) => !open)}
              >
                {mobileOpen ? (
                  <X className={cn("text-gray-800", scrolled ? "h-5 w-5" : "h-6 w-6")} />
                ) : (
                  <Menu className={cn("text-gray-800", scrolled ? "h-5 w-5" : "h-6 w-6")} />
                )}
              </button>
            </div>
          </nav>

          <AnimatePresence initial={false}>
            {mobileOpen && (
              <motion.div
                key="mobile-menu"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="pointer-events-auto md:hidden mt-2 overflow-hidden rounded-2xl border border-gray-200/80 bg-white/96 shadow-[0_16px_48px_rgba(15,23,42,0.14)] backdrop-blur-xl"
              >
                <ul className="divide-y divide-gray-100">
                  {navLinks.map((item) => (
                    <li key={item.id}>{renderMobileNavItem(item)}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

export default Navbar;
