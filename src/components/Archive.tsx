import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { cn } from "../utils/cn";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const cards = [
  {
    id: "semilla-inicia",
    title: "Semilla Inicia",
    subtitle: "Validación Inicial",
    description: "Para emprendimientos innovadores en etapa de idea o prototipo. Cofinanciamos actividades de validación técnica y comercial inicial.",
    trl: "TRL 1–3",
    funding: "Hasta $15MM",
    theme: "bg-moss text-white",
    requirements: ["Innovación clara en etapa temprana", "Validación mínima creíble (entrevistas, PoC)", "Mercado atractivo y escalable", "Equipo de trabajo complementario"]
  },
  {
    id: "semilla-expande",
    title: "Semilla Expande",
    subtitle: "Crecimiento Comercial",
    description: "Para emprendimientos que buscan realizar sus primeras ventas o expandir mercados. Apoyamos el despegue comercial de tu innovación.",
    trl: "TRL 4–6",
    funding: "Hasta $45MM",
    theme: "bg-clay text-white",
    requirements: ["Producto ya lanzado con primeras ventas", "Modelo de negocio probado a pequeña escala", "Estrategia clara de escalamiento", "Crecimiento proyectado demostrable"]
  },
  {
    id: "innova",
    title: "Innova Región",
    subtitle: "Impacto Local",
    description: "Desarrollo de nuevos o mejorados productos y procesos, desde prototipos hasta validación técnica a escala productiva, con foco en el impacto económico regional.",
    trl: "TRL 4–6",
    funding: "Hasta $60MM",
    theme: "bg-cream text-white",
    requirements: ["Empresa con iniciación de actividades", "Prototipo de baja resolución validable", "Validación a escala productiva", "Impacto económico cuantificable regional"]
  },
  {
    id: "crea",
    title: "Crea y Valida",
    subtitle: "I+D Aplicada",
    description: "Avanza desde prototipos iniciales hasta validación técnica a escala productiva.",
    trl: "TRL 3–6",
    funding: "Hasta $220MM",
    theme: "bg-charcoal text-white",
    requirements: ["Innovación tecnológica sustantiva", "TRL inicial con evidencia de laboratorio", "Plan orientado a reducir brechas", "Ventas previas en la empresa"]
  },
  {
    id: "sumate",
    title: "Súmate a Innovar",
    subtitle: "Adopción Tecnológica",
    description: "Fomentamos la adopción de innovación para resolver desafíos de productividad.",
    trl: "TRL 2–3",
    funding: "Hasta $10MM",
    theme: "bg-white/10 text-white backdrop-blur-md",
    requirements: ["Al menos 24 meses de antigüedad", "Problema empresarial bien definido", "Apoyo de entidad colaboradora", "Compromiso explícito de la empresa"]
  },
  {
    id: "semilla-abeja",
    title: "Capital Semilla / Abeja",
    subtitle: "Formalización (SERCOTEC)",
    description: "Apoya la puesta en marcha de nuevos negocios, cofinanciando un plan de trabajo que incluye acciones de gestión empresarial e inversiones.",
    funding: "Hasta $3.5MM",
    theme: "bg-clay text-white",
    requirements: ["Mayores de 18 años", "Sin inicio de actividades en primera categoría", "Idea de negocio clara", "Cofinanciamiento requerido"]
  },
  {
    id: "crece",
    title: "Fondo Crece",
    subtitle: "Crecimiento (SERCOTEC)",
    description: "Fondo para empresas establecidas que buscan crecer mediante inversión en capital de trabajo y gestión comercial.",
    funding: "Hasta $5MM",
    theme: "bg-moss text-white",
    requirements: ["Empresas con inicio de actividades", "Ventas anuales demostrables", "Plan de crecimiento", "Cofinanciamiento requerido"]
  }
];

export default function Archive() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = cards.length - 1;
      if (nextIndex >= cards.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const activeCard = cards[currentIndex];

  return (
    <section id="archive" className="relative py-24 bg-charcoal overflow-hidden flex flex-col justify-center min-h-[600px]">
      <div className="max-w-6xl w-full mx-auto px-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between z-20 gap-4">
        <div>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white">Fondos de Financiamiento</h2>
          <p className="text-white/60 font-sans mt-2">Explora las opciones de capital disponibles para tu proyecto.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => paginate(-1)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => paginate(1)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto h-[600px] sm:h-[500px] md:h-[400px] px-6 z-10 flex">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className={cn(
              "absolute left-6 right-6 md:left-6 md:right-6 lg:left-6 lg:right-6 bottom-0 top-0 rounded-[2rem] p-6 md:p-12 border border-white/10 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch md:items-center",
              activeCard.theme
            )}
          >
            <div className="flex-1 flex flex-col gap-3 md:gap-4 justify-center md:justify-start">
              <div className="font-mono text-xs md:text-sm tracking-widest uppercase opacity-70">
                {activeCard.subtitle}
              </div>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
                {activeCard.title}
              </h3>
              <p className="font-sans text-sm md:text-lg opacity-80 leading-snug md:leading-relaxed max-w-xl">
                {activeCard.description}
              </p>
              
              <div className="flex items-center gap-4 md:gap-6 mt-2 md:mt-4 font-mono text-xs md:text-sm">
                {activeCard.trl && (
                  <>
                    <div className="flex flex-col gap-1">
                      <span className="opacity-50 uppercase text-[10px] md:text-xs">Madurez</span>
                      <span className="font-semibold text-sm md:text-lg">{activeCard.trl}</span>
                    </div>
                    <div className="w-px h-6 md:h-8 bg-current opacity-20" />
                  </>
                )}
                <div className="flex flex-col gap-1">
                  <span className="opacity-50 uppercase text-[10px] md:text-xs">Subsidio</span>
                  <span className="font-semibold text-sm md:text-lg">{activeCard.funding}</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-[300px] lg:w-[400px] rounded-xl md:rounded-2xl overflow-hidden bg-black/10 border border-current/10 shrink-0 p-5 md:p-6 flex flex-col justify-center">
              <h4 className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-60 mb-3 md:mb-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-current" /> Perfil Requerido
              </h4>
              <ul className="space-y-2 md:space-y-3 font-sans text-xs md:text-sm opacity-90">
                {activeCard.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={14} className="mt-0.5 md:mt-1 shrink-0 opacity-70" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
