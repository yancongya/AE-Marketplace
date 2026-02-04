import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ExpressionsTab } from '@/components/ExpressionsTab';
import { PresetsTab } from '@/components/PresetsTab';
import { AboutSection } from '@/components/AboutSection';
import { FAQSection } from '@/components/FAQSection';
import { Footer } from '@/components/Footer';
import { ScriptDetail } from '@/components/ScriptDetail';
import { ExtensionsTab } from '@/components/ExtensionsTab';
import type { AEScript } from '@/types';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedScript, setSelectedScript] = useState<AEScript | null>(null);
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
        setSelectedScript(null);
      } else {
        setCurrentView('home');
        setSelectedScript(null);
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

  const handleScriptClick = (script: AEScript) => {
    setSelectedScript(script);
    setCurrentView('detail');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedScript(null);
    const hash = window.location.hash.slice(1);
    setCurrentView(hash || 'home');
    window.scrollTo(0, 0);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    setSelectedScript(null);
    window.location.hash = view;
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'detail':
        return selectedScript ? (
          <ScriptDetail 
            script={selectedScript} 
            onBack={handleBack}
          />
        ) : null;
      
      case 'expressions':
        return (
          <>
            <ExpressionsTab onScriptClick={handleScriptClick} category="expressions" title="表达式" />
            <Footer onViewChange={handleViewChange} />
          </>
        );
      
      case 'scripts':
        return (
          <>
            <ExpressionsTab onScriptClick={handleScriptClick} category="scripts" title="脚本" />
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
            <ExtensionsTab onViewChange={handleViewChange} />
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
