import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import OverviewSection from '../components/OverviewSection';
import RoomsPreviewSection from '../components/RoomsPreviewSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <OverviewSection />
      <RoomsPreviewSection />
      <Footer />
    </>
  );
}
