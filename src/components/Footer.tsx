import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white rounded-t-[3rem] md:rounded-t-[5rem] px-6 md:px-16 pt-24 pb-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16 md:gap-8 border-b border-white/10 pb-16">
        <div className="flex flex-col gap-8 max-w-sm">
          <div className="mb-2">
            <Logo className="text-4xl" />
          </div>
          <p className="font-sans text-sm opacity-60 leading-relaxed">
            Instrumento digital para el desarrollo y financiamiento de proyectos de innovación. Acelerando el TRL de tu negocio.
          </p>
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest opacity-80 mt-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Sistema operativo / Activo
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 md:gap-24">
          <div className="flex flex-col gap-6">
            <h4 className="font-mono text-xs uppercase tracking-widest opacity-50">Navegación</h4>
            <a href="/#diagnostic-lab" className="text-sm hover:text-clay transition-colors flex items-center gap-1 group">
              Laboratorio <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="/#metodologia" className="text-sm hover:text-clay transition-colors flex items-center gap-1 group">
              Metodología <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="/#archive" className="text-sm hover:text-clay transition-colors flex items-center gap-1 group">
              Fondos <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <Link to="/equipo" className="text-sm hover:text-clay transition-colors flex items-center gap-1 group">
              Equipo <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <a href="/#pricing" className="text-sm hover:text-clay transition-colors flex items-center gap-1 group">
              Planes <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
          
          <div className="flex flex-col gap-6">
            <h4 className="font-mono text-xs uppercase tracking-widest opacity-50">Contacto</h4>
            <a href="mailto:contacto@amipgo.com" className="text-sm hover:text-clay transition-colors flex items-center gap-1 group">
              contacto@amipgo.com <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="https://www.instagram.com/amip.go" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-clay transition-colors flex items-center gap-1 group">
              Instagram <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="https://calendar.app.google/s2kynij4CBZiurUbA" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-clay transition-colors flex items-center gap-1 group">
              Agendar Reunión <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-40 font-mono">
        <p>© {new Date().getFullYear()} amipGO. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:opacity-100 transition-opacity">Privacidad</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Términos</a>
        </div>
      </div>
    </footer>
  );
}
