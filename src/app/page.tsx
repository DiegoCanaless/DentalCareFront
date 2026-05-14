import { Navbar } from '@/components/ui/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Treatments } from '@/components/sections/Treatments';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { About } from '@/components/sections/About';
import { Footer } from '@/components/sections/Footer';
import { api } from '@/lib/api';

async function getTreatments() {
  try {
    const data = await api.treatments.list();
    return data;
  } catch {
    return [];
  }
}

export default async function Home() {
  const treatments = await getTreatments();

  return (
    <main className="flex-1">
      <Navbar />
      <Hero />
      <Treatments treatments={treatments} />
      <HowItWorks />
      <About />
      <Footer />
    </main>
  );
}
