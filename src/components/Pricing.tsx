import { Check } from "lucide-react";
import { cn } from "../utils/cn";

const plans = [
  {
    name: "Diagnóstico",
    price: "Gratis",
    description: "Evaluación inicial de madurez tecnológica y encaje con fondos.",
    features: [
      "Mapeo de TRL actual",
      "Identificación de brechas",
      "Recomendación de instrumento",
      "Reunión de 45 minutos"
    ],
    highlighted: false,
    cta: "Agendar Sesión"
  },
  {
    name: "Formulación",
    price: "A medida",
    description: "Desarrollo completo de la postulación con metodología probada.",
    features: [
      "Diseño de proyecto I+D",
      "Estructuración de presupuesto",
      "Redacción técnica y comercial",
      "Revisión de admisibilidad",
      "Acompañamiento hasta envío"
    ],
    highlighted: true,
    cta: "Cotizar Proyecto"
  },
  {
    name: "Revisión",
    price: "Evaluación",
    description: "Servicio de revisión y feedback para mejorar tu postulación lista.",
    features: [
      "Auditoría de admisibilidad",
      "Evaluación de coherencia",
      "Identificación de brechas",
      "Feedback técnico y financiero",
      "Sugerencias de mejora"
    ],
    highlighted: false,
    cta: "Solicitar Revisión"
  },
  {
    name: "Ejecución",
    price: "Retainer",
    description: "Acompañamiento técnico y financiero post-adjudicación.",
    features: [
      "Gestión de hitos técnicos",
      "Rendición financiera",
      "Preparación de informes",
      "Estrategia de escalamiento"
    ],
    highlighted: false,
    cta: "Hablar con un experto"
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative z-20 py-32 px-6 md:px-16 bg-cream text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6">
            Inversión en <span className="font-serif italic text-clay">Certeza</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Estructuramos tu proyecto para maximizar la probabilidad de adjudicación, minimizando el riesgo y el tiempo invertido.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 max-w-[90rem] mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={cn(
                "rounded-[2.5rem] p-6 sm:p-8 lg:p-6 xl:p-8 transition-transform hover:-translate-y-2 duration-300 flex flex-col",
                plan.highlighted
                  ? "bg-moss text-white shadow-xl md:scale-105 z-10 border-none relative"
                  : "bg-white text-charcoal border border-charcoal/10 shadow-sm"
              )}
            >
              <h3 className="font-mono text-sm tracking-widest uppercase mb-4 opacity-80">
                {plan.name}
              </h3>
              <div className="font-heading font-bold text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-6 tracking-tight text-left w-full" style={{ wordBreak: 'keep-all', overflowWrap: 'normal' }}>
                {plan.price}
              </div>
              <p className={cn("text-sm mb-8 leading-relaxed", plan.highlighted ? "text-white/80" : "text-charcoal/70")}>
                {plan.description}
              </p>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className={cn("shrink-0 mt-0.5", plan.highlighted ? "text-white" : "text-moss")} size={18} />
                    <span className={plan.highlighted ? "text-white/90" : "text-charcoal/80"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  if (plan.cta === "Agendar Sesión") {
                    window.open('https://calendar.app.google/s2kynij4CBZiurUbA', '_blank', 'noopener,noreferrer');
                  } else {
                    let message = "";
                    if (plan.cta === "Cotizar Proyecto") {
                      message = "Hola AMIPGO, quiero información sobre la formulación a medida para postular a un fondo concursable.";
                    } else if (plan.cta === "Solicitar Revisión") {
                      message = "Hola AMIPGO, tengo la formulación de un proyecto en estado avanzado y me gustaría obtener detalles sobre el servicio de revisión y feedback.";
                    } else if (plan.cta === "Hablar con un experto") {
                      message = "Hola AMIPGO, nos adjudicamos un fondo y quiero información sobre el servicio de acompañamiento técnico y financiero.";
                    }
                    if (message) {
                      window.open(`https://wa.me/56968455958?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
                    }
                  }
                }}
                className={cn(
                  "w-full py-4 rounded-full font-semibold text-sm transition-transform hover:scale-105 active:scale-95 mt-auto",
                  plan.highlighted
                    ? "bg-clay text-white"
                    : "bg-charcoal text-white"
                )}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
