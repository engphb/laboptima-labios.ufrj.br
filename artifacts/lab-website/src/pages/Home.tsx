import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Research } from "@/components/sections/Research";
import { Publications } from "@/components/sections/Publications";
import { Services } from "@/components/sections/Services";
import { News } from "@/components/sections/News";
import { About } from "@/components/sections/About";
import { Infrastructure } from "@/components/sections/Infrastructure";
import { Team } from "@/components/sections/Team";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Research />
        <Publications />
        <Services />
        <News />
        <About />
        <Infrastructure />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
