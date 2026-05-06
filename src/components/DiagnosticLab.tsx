import { useState } from "react";
import { ClipboardCheck, Target, Map, ArrowRight, CheckCircle2, ChevronRight, FileText, Settings, Rocket } from "lucide-react";
import { cn } from "../utils/cn";
import { Logo } from "./Logo";

type Step = "trl" | "alignment" | "protocol";

type TrlLevel = "1-3" | "4-5" | "6-7" | "8-9";
type ProjectGoal = "validate" | "sales" | "scale" | "science";

import { Link } from "react-router-dom";

export default function DiagnosticLab() {
  const [currentStep, setCurrentStep] = useState<Step>("trl");
  const [trl, setTrl] = useState<TrlLevel | null>(null);
  const [goal, setGoal] = useState<ProjectGoal | null>(null);

  const handleNext = () => {
    if (currentStep === "trl") setCurrentStep("alignment");
    else if (currentStep === "alignment") setCurrentStep("protocol");
  };

  const getFundRecommendation = () => {
    if (goal === "sales" && trl === "6-7") return { name: "Semilla Inicia / Semilla Expande", match: "Alto" };
    if (goal === "validate" && (trl === "4-5" || trl === "6-7")) return { name: "Crea y Valida", match: "Alto" };
    if (goal === "scale" && trl === "8-9") return { name: "Consolida y Expande", match: "Alto" };
    if (goal === "science" && (trl === "1-3" || trl === "4-5")) return { name: "Innova Región / Alta Tecnología", match: "Medio" };
    
    // Fallbacks
    if (trl === "1-3") return { name: "Súmate a Innovar / Semilla Inicia (con mayor desarrollo)", match: "Bajo (Requiere avanzar prototipo)" };
    if (trl === "8-9") return { name: "Consolidación o Escalamiento", match: "Alto" };
    return { name: "Crea y Valida", match: "Medio" };
  };

  return (
    <section id="diagnostic-lab" className="py-32 px-6 md:px-16 bg-charcoal text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-moss blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-clay blur-[100px] rounded-full" />
      </div>

      <div className="max-w-[90rem] mx-auto relative z-10">
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-moss/20 border border-moss/30 text-moss text-xs font-mono uppercase tracking-widest mb-6">
            <Settings size={14} />
            Herramienta Determinística
          </div>
          <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">
            Laboratorio <span className="font-serif italic text-clay">Estratégico</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
            Evalúa el nivel de madurez de tu proyecto, encuentra el fondo CORFO con mejor encaje, y genera un protocolo de postulación estructurado.
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md flex flex-col min-h-[600px]">
          {/* Header */}
          <div className="bg-black/60 px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Logo className="text-xl" />
              <span className="font-mono text-xs uppercase tracking-widest text-white/50 ml-2 border-l border-white/10 pl-4 py-1">
                Workspace
              </span>
            </div>
            
            {/* Stepper */}
            <div className="flex items-center gap-2 text-sm font-sans">
              <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors", currentStep === "trl" ? "bg-white/10 text-white" : "text-white/40")}>
                <ClipboardCheck size={16} />
                <span className="hidden sm:inline">1. TRL</span>
              </div>
              <ChevronRight size={14} className="text-white/20" />
              <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors", currentStep === "alignment" ? "bg-white/10 text-white" : "text-white/40")}>
                <Target size={16} />
                <span className="hidden sm:inline">2. Alineación</span>
              </div>
              <ChevronRight size={14} className="text-white/20" />
              <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors", currentStep === "protocol" ? "bg-white/10 text-white" : "text-white/40")}>
                <Map size={16} />
                <span className="hidden sm:inline">3. Protocolo</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 md:p-10">
            {currentStep === "trl" && (
              <div className="max-w-[80rem] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-heading font-semibold mb-2">Evaluador de Madurez (TRL)</h3>
                <p className="text-white/60 font-sans mb-8">¿En qué etapa de desarrollo técnico se encuentra tu solución actualmente?</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { 
                      id: "1-3", 
                      title: "TRL 1-3 : Idea o Concepto", 
                      features: [
                        "Identificación de principios básicos observados.",
                        "Formulación teórica del concepto tecnológico.",
                        "Investigación y pruebas analíticas iniciales.",
                        "Sin prototipo físico o funcional desarrollado."
                      ]
                    },
                    { 
                      id: "4-5", 
                      title: "TRL 4-5 : Prototipo Temprano", 
                      features: [
                        "Validación de componentes en laboratorio.",
                        "Pruebas de concepto en entorno simulado.",
                        "Integración preliminar de partes críticas del sistema.",
                        "Desarrollo de un prototipo de baja resolución."
                      ]
                    },
                    { 
                      id: "6-7", 
                      title: "TRL 6-7 : Prototipo Funcional", 
                      features: [
                        "Validación del sistema en entorno real u operacional.",
                        "Pilotos técnicos con usuarios o primeros adoptantes.",
                        "Iteraciones en diseño basadas en pruebas y feedback.",
                        "Prototipo de alta fidelidad cercano a la versión final."
                      ]
                    },
                    { 
                      id: "8-9", 
                      title: "TRL 8-9 : Comercial / Escalable", 
                      features: [
                        "Sistema final completo, probado en red y operando.",
                        "Certificaciones técnicas, industriales y operativas cumplidas.",
                        "Modelo de negocio validado e incrementos en ventas tempranas.",
                        "Tecnología probada y madura lista para escalamiento comercial."
                      ]
                    }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setTrl(option.id as TrlLevel)}
                      className={cn(
                        "text-left p-6 rounded-2xl border transition-all duration-300",
                        trl === option.id 
                          ? "bg-moss/10 border-moss text-white" 
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-heading font-semibold text-lg">{option.title}</h4>
                        {trl === option.id && <CheckCircle2 size={20} className="text-moss" />}
                      </div>
                      <ul className="space-y-2">
                        {option.features.map((feature, idx) => (
                          <li key={idx} className="text-sm font-sans opacity-80 leading-relaxed flex items-start gap-2">
                            <span className="text-white/30 font-bold mt-0.5">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>

                <div className="mt-10 flex justify-end">
                  <button 
                    onClick={handleNext}
                    disabled={!trl}
                    className="flex items-center gap-2 bg-white text-charcoal px-6 py-3 rounded-full font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Siguiente Fase <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === "alignment" && (
              <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-heading font-semibold mb-2">Alineación Estratégica</h3>
                <p className="text-white/60 font-sans mb-8">¿Cuál es el objetivo principal que buscas financiar con este proyecto?</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: "validate", title: "Desarrollar y Validar", desc: "Necesito iterar y validar mi solución técnica y comercialmente con usuarios reales." },
                    { id: "sales", title: "Iniciar Ventas", desc: "Tengo un producto funcional y necesito presupuesto para marketing, inicio de operaciones y primeras ventas." },
                    { id: "scale", title: "Escalar e Internacionalizar", desc: "Ya tengo ventas consistentes y busco expandirme a nuevos mercados o regiones." },
                    { id: "science", title: "I+D Compleja", desc: "Desarrollo tecnológico científico profundo que requiere alta experimentación y tiempo." }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setGoal(option.id as ProjectGoal)}
                      className={cn(
                        "text-left p-6 rounded-2xl border transition-all duration-300 flex items-start gap-4",
                        goal === option.id 
                          ? "bg-clay/10 border-clay text-white" 
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      )}
                    >
                      <div className={cn("mt-1", goal === option.id ? "text-clay" : "text-white/40")}>
                        {goal === option.id ? <CheckCircle2 size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-current" />}
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-lg mb-1">{option.title}</h4>
                        <p className="text-sm font-sans opacity-80 leading-relaxed">{option.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-10 flex justify-between">
                  <button 
                    onClick={() => setCurrentStep("trl")}
                    className="text-white/50 hover:text-white font-sans text-sm transition-colors"
                  >
                    Volver
                  </button>
                  <button 
                    onClick={handleNext}
                    disabled={!goal}
                    className="flex items-center gap-2 bg-white text-charcoal px-6 py-3 rounded-full font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Generar Protocolo <Rocket size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === "protocol" && (
              <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                  {/* Left Column - Recommendation */}
                  <div className="md:w-1/3">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl h-full flex flex-col">
                      <div className="w-12 h-12 bg-moss/20 text-moss rounded-full flex items-center justify-center mb-6">
                        <Target size={24} />
                      </div>
                      <h4 className="text-sm font-mono text-white/50 uppercase tracking-widest mb-2">Fondo Recomendado</h4>
                      <div className="text-2xl font-heading font-bold text-white mb-6">
                        {getFundRecommendation().name}
                      </div>
                      
                      <div className="space-y-4 font-sans text-sm border-t border-white/10 pt-6 mt-auto">
                        <div className="flex justify-between items-center">
                          <span className="text-white/50">Madurez (TRL) actual:</span>
                          <span className="font-mono bg-white/10 px-2 py-1 rounded text-white">{trl}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/50">Cálculo de Encaje:</span>
                          <span className={cn(
                            "font-medium",
                            getFundRecommendation().match === "Alto" ? "text-moss" : "text-clay"
                          )}>
                            {getFundRecommendation().match}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Checklist */}
                  <div className="md:w-2/3">
                    <h3 className="text-2xl font-heading font-semibold mb-6 flex items-center gap-3">
                      <FileText className="text-clay" /> Protocolo de Postulación
                    </h3>
                    
                    <div className="space-y-4 font-sans">
                      {[
                        { title: "Comprobación de Admisibilidad", desc: "Asegúrate de que tus ventas, tamaño de empresa y figura legal cumplen estrictamente con las bases." },
                        { title: "Elaboración de Brecha de Mercado", desc: "Identifica el problema crítico que el mercado actual o las soluciones existentes no pueden resolver." },
                        { title: "Justificación de Innovación", desc: "Crea una tabla comparativa clara entre tu solución y los 3 principales competidores." },
                        { title: "Plan de Trabajo y Presupuesto", desc: "Divide las actividades en meses y justifica el uso de los fondos orientado a reducir el riesgo técnico." },
                        { title: "Evidencias de Avance (TRL)", desc: "Reúne informes de laboratorio, pantallazos, o cartas de interés que acrediten tu nivel de madurez reportado." }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-sm font-mono text-white/50 shrink-0">
                            {i + 1}
                          </div>
                          <div>
                            <h5 className="font-semibold text-white/90 mb-1">{item.title}</h5>
                            <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                      <button 
                        onClick={() => {
                          setCurrentStep("trl");
                          setTrl(null);
                          setGoal(null);
                        }}
                        className="text-white/50 hover:text-white font-sans text-sm transition-colors px-4 py-2"
                      >
                        Reiniciar Evaluación
                      </button>
                      
                      <Link 
                        to="/workspace"
                        className="flex items-center gap-2 bg-clay text-white px-6 py-3 rounded-full font-semibold hover:bg-clay/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(217,70,37,0.3)]"
                      >
                        Ir al Workspace Completo <Rocket size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

