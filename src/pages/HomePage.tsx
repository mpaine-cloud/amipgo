import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import DiagnosticLab from "../components/DiagnosticLab";
import BlogCTA from "../components/BlogCTA";
import Manifesto from "../components/Manifesto";
import Archive from "../components/Archive";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
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
