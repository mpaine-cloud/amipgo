import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";

export default function BlogCTA() {
  return (
    <section className="py-24 px-6 md:px-16 bg-charcoal text-white relative overflow-hidden border-t border-white/5">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-moss blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-clay blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left backdrop-blur-sm">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-mono uppercase tracking-widest mb-6">
              <BookOpen size={14} />
              Centro de Recursos Estratégicos
            </div>
            <h2 className="font-heading font-bold text-4xl md:text-6xl mb-6 tracking-tight text-balance">
              Tu manual de ejecución para <span className="text-moss">levantar capital</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed text-balance">
              No es solo información, es material de alto valor. Accede a las guías definitivas y pautas paso a paso para estructurar proyectos ganadores y asegurar el financiamiento que tu innovación merece.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <Link 
              to="/blog" 
              className="group inline-flex items-center gap-3 bg-white text-charcoal px-8 py-5 rounded-full font-sans font-semibold text-lg hover:bg-white/90 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:scale-105"
            >
              Ingresar al Blog
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
