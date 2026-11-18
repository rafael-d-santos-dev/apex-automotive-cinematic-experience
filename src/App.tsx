import { TopBar } from './components/TopBar';
import { CinematicHero } from './components/CinematicHero';
import { DesignSection } from './components/DesignSection';
import { EngineeringSection } from './components/EngineeringSection';
import { PerformanceSection } from './components/PerformanceSection';
import { FinalRevealSection } from './components/FinalRevealSection';
import { CinematicFooter } from './components/CinematicFooter';

export default function App() {
  return (
    <>
      <TopBar />
      <CinematicHero />
      <DesignSection />
      <EngineeringSection />
      <PerformanceSection />
      <FinalRevealSection />
      <CinematicFooter />
    </>
  );
}
