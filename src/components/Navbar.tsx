import { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Logo } from "./Logo";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50 || !isHome);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = isHome ? (
    <>
      <a href="#diagnostic-lab" className="hover:opacity-70 transition-opacity whitespace-nowrap" onClick={() => setIsMobileMenuOpen(false)}>Laboratorio</a>
      <a href="#metodologia" className="hover:opacity-70 transition-opacity whitespace-nowrap" onClick={() => setIsMobileMenuOpen(false)}>Metodología</a>
      <a href="#archive" className="hover:opacity-70 transition-opacity whitespace-nowrap" onClick={() => setIsMobileMenuOpen(false)}>Fondos</a>
      <Link to="/equipo" className="hover:opacity-70 transition-opacity whitespace-nowrap" onClick={() => setIsMobileMenuOpen(false)}>Equipo</Link>
      <a href="#pricing" className="hover:opacity-70 transition-opacity whitespace-nowrap" onClick={() => setIsMobileMenuOpen(false)}>Planes</a>
    </>
  ) : (
    <>
      <Link to="/" className="hover:opacity-70 transition-opacity whitespace-nowrap" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
      <Link to="/equipo" className="hover:opacity-70 transition-opacity whitespace-nowrap" onClick={() => setIsMobileMenuOpen(false)}>Equipo</Link>
    </>
  );

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div
        ref={navRef}
        className={cn(
          "flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 rounded-full transition-all duration-500 ease-out lg:gap-6 xl:gap-10",
          isScrolled || isMobileMenuOpen
            ? "bg-white/80 backdrop-blur-md border border-moss/10 text-moss shadow-sm"
            : "bg-transparent text-white"
        )}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            className="lg:hidden p-1.5 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="flex shrink-0 items-center" onClick={() => setIsMobileMenuOpen(false)}>
            <Logo 
              dark={isScrolled || isMobileMenuOpen} 
              className="text-xl sm:text-2xl md:text-3xl" 
            />
          </Link>
        </div>
        
        <div className="hidden lg:flex flex-1 items-center justify-center gap-4 lg:gap-6 xl:gap-8 font-medium text-[13px] xl:text-sm px-4">
          {navLinks}
          <Link to="/workspace" className="hover:opacity-70 transition-opacity text-clay font-semibold whitespace-nowrap">Workspace</Link>
          <Link to="/blog" className="hover:opacity-70 transition-opacity whitespace-nowrap">Blog</Link>
        </div>

        <button 
          onClick={() => window.open('https://calendar.app.google/s2kynij4CBZiurUbA', '_blank', 'noopener,noreferrer')}
          className={cn(
            "shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-transform hover:scale-105 active:scale-95",
            isScrolled || isMobileMenuOpen
              ? "bg-moss text-white" 
              : "bg-white text-moss"
          )}
        >
          <span className="hidden sm:inline">Agendar Diagnóstico</span>
          <span className="sm:hidden">Agendar</span>
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-moss/10 shadow-lg rounded-2xl overflow-hidden flex flex-col pt-2 pb-4 px-6 text-moss font-medium divide-y divide-moss/10"
          >
            <div className="flex flex-col py-4 gap-4">
              {navLinks}
            </div>
            <div className="flex flex-col py-4 gap-4">
              <Link to="/workspace" className="text-clay font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Workspace</Link>
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
