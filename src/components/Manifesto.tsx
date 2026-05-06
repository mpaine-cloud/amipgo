import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, Calculator, PenTool, Presentation } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Search,
    title: "Diagnóstico de Brechas",
    description: "Evaluamos el TRL, validamos el mercado y definimos la estrategia competitiva inicial."
  },
  {
    icon: Calculator,
    title: "Estructuración del Presupuesto",
    description: "Armamos el equipo clave y proyectamos el uso de fondos con precisión técnica y financiera."
  },
  {
    icon: PenTool,
    title: "Redacción Estratégica",
    description: "Formulamos el documento técnico con lenguaje enfocado en impacto, innovación y mercado."
  },
  {
    icon: Presentation,
    title: "Preparación Demo Day",
    description: "Entrenamos tu pitch y preparamos material de defensa para el comité de evaluación."
  }
];

export default function Methodology() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".methodology-step",
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          }
        }
      );
      
      gsap.fromTo(
        ".manifesto-text",
        { opacity: 0, scale: 0.95 },
        { 
          opacity: 1, 
          scale: 1,
          duration: 1.2,
          delay: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="metodologia"
      ref={containerRef}
      className="relative w-full py-24 md:py-32 px-6 md:px-16 bg-charcoal text-white flex items-center justify-center overflow-hidden"
    >
      {/* Background with parallax effect */}
      <div 
        className="absolute inset-0 w-full h-full opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1773020504166-abb1c6681f4f?q=80&w=1917&auto=format&fit=crop')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-clay mb-4">Nuestra Metodología</h2>
          <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed">
            Una ruta de trabajo diseñada para maximizar tus posibilidades de adjudicación técnica y minimizar tu incertidumbre.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="methodology-step relative bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl hover:bg-white/15 transition-all duration-300 flex flex-col gap-4">
              <div className="absolute -top-5 -left-5 w-12 h-12 bg-clay text-white rounded-xl shadow-lg flex items-center justify-center font-heading font-bold text-xl rotate-[-6deg]">
                {idx + 1}
              </div>
              <div className="w-14 h-14 bg-white/10 text-clay rounded-2xl flex items-center justify-center mb-2">
                <step.icon size={28} />
              </div>
              <h3 className="font-heading font-bold text-xl leading-tight text-white">
                {step.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
