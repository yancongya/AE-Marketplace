import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ExpressionsTab, ScriptsTab } from '@/components/ExpressionsTab';
import { PresetsTab } from '@/components/PresetsTab';
import { AboutSection } from '@/components/AboutSection';
import { FAQSection } from '@/components/FAQSection';
import { Footer } from '@/components/Footer';
import { ExtensionsTab } from '@/components/ExtensionsTab';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && ['expressions', 'scripts', 'presets', 'extensions'].includes(hash)) {
        setCurrentView(hash);
      } else {
        setCurrentView('home');
      }
    };

    const hash = window.location.hash.slice(1);
    if (hash && ['expressions', 'scripts', 'presets', 'extensions'].includes(hash)) {
      setCurrentView(hash);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'expressions':
        return (
          <>
            <ExpressionsTab />
            <Footer onViewChange={handleViewChange} />
          </>
        );
      
      case 'scripts':
        return (
          <>
            <ScriptsTab />
            <Footer onViewChange={handleViewChange} />
          </>
        );
      
      case 'presets':
        return (
          <>
            <PresetsTab />
            <Footer onViewChange={handleViewChange} />
          </>
        );
      
      case 'extensions':
        return (
          <>
            <ExtensionsTab />
            <Footer onViewChange={handleViewChange} />
          </>
        );
      
      case 'faq':
        return (
          <>
            <FAQSection onViewChange={handleViewChange} />
            <Footer onViewChange={handleViewChange} />
          </>
        );
      
      case 'home':
      default:
        return (
          <>
            <HeroSection />
            <PresetsTab />
            <AboutSection />
            <Footer onViewChange={handleViewChange} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-grid">
      <Navbar 
        currentView={currentView} 
        onViewChange={handleViewChange}
        isDark={isDark}
        onThemeChange={setIsDark}
      />
      
      <main className="relative">
        {renderContent()}
      </main>
      
    </div>
  );
}

export default App;
