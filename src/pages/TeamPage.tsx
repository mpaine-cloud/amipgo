import { motion } from "motion/react";
import { Linkedin, Rocket, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

export default function TeamPage() {
  const team = [
    {
      name: "María Asunción Ilabaca Parga",
      role: "Directora de Operaciones",
      bio: [
        "Especialista en comunicación estratégica y traducción profesional de alto nivel, enfocada en transformar información compleja en mensajes claros, precisos y persuasivos.",
        <>Fundadora de <a href="https://miptraducciones.cl" target="_blank" rel="noopener noreferrer" className="underline decoration-moss/50 hover:decoration-moss transition-colors">MIP Traducciones</a>, donde lidera proyectos para empresas y organizaciones que necesitan mucho más que una traducción literal: requieren exactitud técnica, coherencia conceptual y una adaptación efectiva a distintos contextos culturales y de negocio.</>,
        "Su experiencia le permite trabajar con contenidos críticos —técnicos, corporativos y académicos— asegurando estándares exigentes de calidad, consistencia terminológica y claridad comunicacional. Este enfoque es especialmente clave en procesos donde cada palabra impacta la evaluación, comprensión o toma de decisiones.",
        "En Amipgo, Asunción potencia cada proyecto desde la comunicación: revisa, estructura y optimiza los contenidos para que no solo cumplan con las bases, sino que destaquen. Su trabajo convierte propuestas técnicas en postulaciones claras, sólidas y competitivas.",
        "Gracias a su aporte, nuestros clientes no solo presentan proyectos correctos, sino propuestas que se entienden, conectan y tienen mayores probabilidades de adjudicación."
      ],
      initials: "MA",
      photoUrl: "/Asuncion_Ilabaca.jpg",
      photoConfig: { objectPosition: "center top", scale: 1.1 }, // Si la imagen se corta a los lados, no uses un scale menor a 1.
      linkedin: "https://www.linkedin.com/in/mar%C3%ADa-asunci%C3%B3n-ilabaca-parga-187515152/", // example format, using general or user provided
    },
    {
      name: "Mijail Painecura",
      role: "Director Comercial",
      bio: [
        "Asesor estratégico de pymes y especialista en formulación de proyectos con financiamiento público, enfocado en convertir ideas en iniciativas viables, financiables y sostenibles.",
        "Cuenta con experiencia directa en el ecosistema público, habiendo trabajado en SERCOTEC, lo que le permite entender en profundidad cómo se evalúan los proyectos y qué realmente marca la diferencia al momento de adjudicar fondos.",
        <>Es cofundador de <a href="https://neucos.cl" target="_blank" rel="noopener noreferrer" className="underline decoration-moss/50 hover:decoration-moss transition-colors">Neucos</a>, donde lidera el desarrollo de soluciones basadas en neurociencia y ciencia del comportamiento aplicadas a negocios, experiencia de usuario y toma de decisiones.</>,
        "Su trabajo combina estrategia, experiencia en terreno y comprensión técnica de los instrumentos públicos, permitiéndole acompañar a empresas no solo en la postulación, sino en todo el proceso de crecimiento: desde la validación de la idea hasta su consolidación.",
        "En Amipgo, Mijail lidera la estructuración estratégica de los proyectos, asegurando que cada postulación tenga coherencia, claridad y un enfoque sólido de negocio. Su objetivo no es solo adjudicar fondos, sino que cada proyecto tenga sentido, proyección y resultados reales.",
        "Gracias a su enfoque, nuestros clientes no solo acceden a financiamiento, sino que construyen bases sólidas para crecer y sostenerse en el tiempo."
      ],
      initials: "MP",
      photoUrl: "/Mijail_Painecura.png",
      photoConfig: { objectPosition: "center top", scale: 1.5 }, // Ajusta la posición (ej: "center top") y el zoom (ej: 1.2 o 1.5)
      linkedin: "https://www.linkedin.com/in/mijail-painecura/", // example format
    }
  ];

  return (
    <div className="bg-charcoal text-white min-h-screen pt-32 flex flex-col">
      <SEO 
        title="Equipo y Experiencia | Amipgo"
        description="Conoce al equipo de Amipgo. Combinamos comunicación estratégica, experiencia pública (SERCOTEC) y neurociencia del comportamiento para estructurar propuestas de financiamiento altamente competitivas."
        url="https://www.amipgo.com/equipo"
        keywords="equipo amipgo, maria asuncion ilabaca, mijail painecura, mip traducciones, neucos, asesores corfo, consultores sercotec"
      />
      <Navbar />

      <main className="flex-grow">
        <section id="equipo" className="py-12 md:py-16 px-6 relative flex justify-center overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-moss/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-clay/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="w-full max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 md:mb-24 flex flex-col items-center text-center"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-px bg-moss" />
                <span className="font-mono text-sm tracking-widest text-moss uppercase">Quiénes Somos</span>
                <div className="w-8 h-px bg-moss" />
              </div>
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
                Equipo & <span className="italic font-serif font-light text-white/80">Experiencia</span>
              </h1>
              <p className="text-xl text-white/70 max-w-2xl text-balance">
                Combinamos comunicación estratégica, experiencia pública y ciencia del comportamiento para llevar tu proyecto al siguiente nivel.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {team.map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-sm relative group hover:border-moss/30 transition-colors flex flex-col h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-moss/0 to-moss/0 group-hover:from-moss/5 group-hover:to-transparent transition-colors duration-500 rounded-3xl pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 border-b border-white/10 pb-8">
                    {/* AVATAR WITH PLACEHOLDER (Rounded) */}
                    <div className="w-24 h-24 shrink-0 bg-moss/20 text-moss rounded-full flex items-center justify-center font-heading font-bold text-3xl border-2 border-moss/30 group-hover:scale-105 transition-transform duration-500 overflow-hidden relative">
                      {member.photoUrl ? (
                        <img 
                          src={member.photoUrl} 
                          alt={member.name} 
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{
                            objectPosition: member.photoConfig?.objectPosition || "center",
                            transform: `scale(${member.photoConfig?.scale || 1})`
                          }}
                        />
                      ) : (
                        member.initials
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-heading mb-2">{member.name}</h3>
                      <div className="flex items-center gap-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-moss/10 rounded-full border border-moss/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-moss" />
                          <p className="font-mono text-xs text-moss tracking-wider uppercase font-semibold">{member.role}</p>
                        </div>
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white/40 hover:text-[#0A66C2] transition-colors p-1"
                          title="Perfil de LinkedIn"
                        >
                          <Linkedin size={20} />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 text-white/70 leading-relaxed text-sm md:text-base flex-grow">
                    {member.bio.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* CTA SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 md:mt-32 max-w-4xl mx-auto bg-gradient-to-br from-moss/20 to-charcoal border border-moss/30 rounded-[2rem] p-8 md:p-12 text-center"
            >
              <div className="w-16 h-16 bg-moss/20 text-moss rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Rocket size={32} />
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                ¿Listo para formular tu proyecto con nosotros?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Agenda un diagnóstico inicial. Evaluaremos la madurez de tu propuesta y trazaremos el camino correcto hacia el éxito de tu postulación.
              </p>
              <button 
                onClick={() => window.open('https://calendar.app.google/s2kynij4CBZiurUbA', '_blank', 'noopener,noreferrer')}
                className="bg-moss text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-moss/90 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 shadow-lg shadow-moss/25"
              >
                Agendar Reunión <ArrowRight size={20} />
              </button>
            </motion.div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
