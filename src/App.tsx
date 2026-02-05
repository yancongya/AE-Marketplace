import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Navbar } from '@/components/Navbar';
import { ExpressionsTab, ScriptsTab } from '@/components/ExpressionsTab';
import { PresetsTab } from '@/components/PresetsTab';
import { ExtensionsTab } from '@/components/ExtensionsTab';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/sonner';
import { Home } from '@/pages/Home';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <ThemeProvider isDark={isDark} toggleTheme={toggleTheme}>
      <div className="min-h-screen bg-grid">
        <Navbar />
        <main className="relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/expressions" element={
            <>
              <ExpressionsTab />
            </>
          } />
          <Route path="/expressions/:slug" element={
            <>
              <ExpressionsTab />
            </>
          } />
          <Route path="/scripts" element={
            <>
              <ScriptsTab />
            </>
          } />
          <Route path="/scripts/:slug" element={
            <>
              <ScriptsTab />
            </>
          } />
          <Route path="/presets" element={
            <>
              <PresetsTab />
            </>
          } />
          <Route path="/presets/:slug" element={
            <>
              <PresetsTab />
            </>
          } />
          <Route path="/extensions" element={
            <>
              <ExtensionsTab />
            </>
          } />
          <Route path="/extensions/:slug" element={
            <>
              <ExtensionsTab />
            </>
          } />
        </Routes>
      </main>
      <Toaster />
    </div>
    </ThemeProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Tooltip.Provider>
        <ScrollToTop />
        <AppContent />
      </Tooltip.Provider>
    </BrowserRouter>
  );
}

export default App;
