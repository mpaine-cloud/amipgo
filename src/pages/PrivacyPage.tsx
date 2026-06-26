import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen text-charcoal font-sans selection:bg-moss selection:text-white flex flex-col">
      <SEO 
        title="Política de Privacidad | Amipgo"
        description="Consulta nuestra política de privacidad sobre el tratamiento confidencial y resguardo de datos en el Workspace Estratégico."
        url="https://www.amipgo.com/privacidad"
        keywords="politica de privacidad, amipgo, proteccion de datos, privacidad"
      />
      <header className="bg-white border-b border-black/5 py-6 px-6 md:px-12 sticky top-0 z-50 flex items-center">
        <Link to="/" className="inline-flex items-center gap-2 text-charcoal/70 hover:text-moss font-medium transition-colors">
          <ArrowLeft size={18} /> Volver al Inicio
        </Link>
      </header>
      
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-20 md:py-24">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4 text-charcoal leading-tight">Política de Privacidad</h1>
          <p className="text-lg text-black/60">Última actualización: Diciembre 2024</p>
        </div>
        
        <div className="space-y-12">
          <section className="bg-cream/50 p-8 rounded-3xl border border-black/5">
            <h2 className="text-2xl font-heading font-bold text-moss mb-4">1. Identidad del Responsable</h2>
            <p className="text-black/80 leading-relaxed text-lg">
              El responsable del tratamiento de los datos personales es amipGO. Puede contactarnos para cualquier consulta relacionada con la privacidad a la dirección de correo electrónico: <a href="mailto:contacto@amipgo.com" className="font-semibold text-moss hover:underline">contacto@amipgo.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-4">2. Finalidad del Tratamiento</h2>
            <p className="text-black/80 leading-relaxed text-lg mb-4">
              Recopilamos y tratamos sus datos personales con los siguientes fines:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-moss mt-2.5 flex-shrink-0"></span>
                <span className="text-black/80 text-lg leading-relaxed">Para entregar el informe diagnóstico (PDF) generado por nuestra herramienta "Workspace".</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-moss mt-2.5 flex-shrink-0"></span>
                <span className="text-black/80 text-lg leading-relaxed">Para mejorar nuestros servicios y la experiencia de usuario.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-moss mt-2.5 flex-shrink-0"></span>
                <span className="text-black/80 text-lg leading-relaxed"><strong>(Opcional)</strong> Si usted nos entrega su consentimiento explícito, para enviarle correos electrónicos y mensajes con información comercial, promociones y novedades sobre nuestros servicios.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-4">3. Minimización de Datos</h2>
            <p className="text-black/80 leading-relaxed text-lg">
              Solo solicitamos la información estrictamente necesaria. El número de WhatsApp es completamente opcional y solo se utilizará si usted nos brinda su consentimiento expreso para fines comerciales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-4">4. Destinatarios de los Datos</h2>
            <p className="text-black/80 leading-relaxed text-lg">
              No vendemos ni compartimos sus datos personales con terceros para sus propios fines de marketing. 
              <strong> Además, no compartiremos sus datos con proveedores de servicios externos.</strong> Toda la información recopilada es de uso exclusivo y confidencial por parte de amipGO, asegurando el resguardo absoluto de sus datos personales bajo nuestro control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-4">5. Derechos del Titular (Derechos ARCOP)</h2>
            <p className="text-black/80 leading-relaxed text-lg">
              Usted tiene derecho a conocer, actualizar, rectificar o eliminar su información personal. Para ejercer estos derechos, puede enviarnos un correo, indicando su solicitud a: <strong>contacto@amipgo.com</strong>. Nuestro equipo atenderá su petición dentro de los plazos que estipula la ley.
            </p>
          </section>
        </div>
      </main>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
}
