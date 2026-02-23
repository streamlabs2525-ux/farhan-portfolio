import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PortfolioSection from "@/components/PortfolioSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
