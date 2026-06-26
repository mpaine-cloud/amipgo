import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import DiagnosticLab from "../components/DiagnosticLab";
import BlogCTA from "../components/BlogCTA";
import Manifesto from "../components/Manifesto";
import Archive from "../components/Archive";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

export default function HomePage() {
  return (
    <>
      <SEO 
        title="Amipgo | Laboratorio Digital para Levantar Capital"
        description="Tu hoja de ruta para levantar capital y crecer. Encuentra las pautas, estrategias y el conocimiento necesario para adjudicarte fondos públicos (CORFO, SERCOTEC) con éxito."
        url="https://www.amipgo.com"
        keywords="amipgo, laboratorio digital, levantar capital, fondos publicos, corfo, sercotec, startups chile, postulacion de proyectos, asesorias de negocios"
      />
      <Navbar />
      <main>
        <Hero />
        <DiagnosticLab />
        <BlogCTA />
        <Archive />
        <Manifesto />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
