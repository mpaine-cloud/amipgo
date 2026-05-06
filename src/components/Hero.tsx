import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Logo } from "./Logo";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-text",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power3.out", delay: 0.2 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-[100dvh] bg-charcoal flex flex-col justify-center pt-32 pb-24 md:pb-32 px-6 md:px-16 overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1773020504166-abb1c6681f4f?q=80&w=1917&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-moss via-moss/50 to-transparent mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl w-full mx-auto">
        <div className="max-w-full xl:max-w-6xl">
          <div className="hero-text flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
            <span className="text-white/80 font-mono text-xs sm:text-sm uppercase tracking-widest">Laboratorio Digital de</span>
            <Logo className="text-xl sm:text-2xl" />
          </div>
          <h1 className="hero-text text-white flex flex-col leading-[1.1] tracking-tight gap-2 sm:gap-0">
            <span className="font-heading font-bold text-[2rem] leading-tight sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl">
              Tu hoja de ruta para
            </span>
            <span className="font-heading font-bold italic text-[1.75rem] leading-tight sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl text-white bg-clay px-4 sm:px-6 md:px-8 py-2 md:py-4 rounded-[1.25rem] md:rounded-[2.5rem] sm:mt-2 md:mt-4 w-fit md:whitespace-nowrap">
              levantar capital y crecer
            </span>
          </h1>
          <p className="hero-text text-white/90 font-sans text-lg md:text-xl md:text-2xl mt-8 max-w-3xl leading-relaxed">
            Encuentra las pautas, estrategias y el conocimiento necesario para estructurar tus proyectos y adjudicarte fondos con éxito.
          </p>
        </div>
      </div>
    </section>
  );
}
