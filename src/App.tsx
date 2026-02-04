import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ExpressionsTab, ScriptsTab } from '@/components/ExpressionsTab';
import { PresetsTab } from '@/components/PresetsTab';
import { AboutSection } from '@/components/AboutSection';
import { FAQSection } from '@/components/FAQSection';
import { Footer } from '@/components/Footer';
import { ExtensionsTab } from '@/components/ExtensionsTab';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-grid">
      <Navbar
        isDark={isDark}
        onThemeChange={setIsDark}
      />
      <main className="relative">
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <PresetsTab />
              <AboutSection />
              <Footer />
            </>
          } />
          <Route path="/expressions" element={
            <>
              <ExpressionsTab />
              <Footer />
            </>
          } />
          <Route path="/expressions/:slug" element={
            <>
              <ExpressionsTab />
              <Footer />
            </>
          } />
          <Route path="/scripts" element={
            <>
              <ScriptsTab />
              <Footer />
            </>
          } />
          <Route path="/scripts/:slug" element={
            <>
              <ScriptsTab />
              <Footer />
            </>
          } />
          <Route path="/presets" element={
            <>
              <PresetsTab />
              <Footer />
            </>
          } />
          <Route path="/presets/:slug" element={
            <>
              <PresetsTab />
              <Footer />
            </>
          } />
          <Route path="/extensions" element={
            <>
              <ExtensionsTab />
              <Footer />
            </>
          } />
          <Route path="/extensions/:slug" element={
            <>
              <ExtensionsTab />
              <Footer />
            </>
          } />
          <Route path="/faq" element={
            <>
              <FAQSection />
              <Footer />
            </>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
