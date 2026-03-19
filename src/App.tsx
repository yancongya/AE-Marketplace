import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { ExpressionsTab, ScriptsTab, PresetsTab, ExtensionsTab } from '@/components/CategoryTab';
import { StagingPanel } from '@/components/StagingPanel';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { Toaster } from '@/components/ui/sonner';
import { Home } from '@/pages/Home';
import { Callback } from '@/pages/Callback';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const pageVariants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  enter: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -10 }
};

const pageTransition = {
  type: 'tween' as const,
  ease: [0.4, 0, 0.2, 1] as const,
  duration: 0.4
};

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
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
    <AdminProvider>
      <I18nProvider>
        <ThemeProvider isDark={isDark} toggleTheme={toggleTheme}>
          <div className="min-h-screen bg-grid">
            <Navbar />
            <main className="relative">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={
                    <PageWrapper>
                      <Home />
                    </PageWrapper>
                  } />
                  <Route path="/expressions" element={
                    <PageWrapper>
                      <ExpressionsTab />
                    </PageWrapper>
                  } />
                  <Route path="/expressions/:slug" element={
                    <PageWrapper>
                      <ExpressionsTab />
                    </PageWrapper>
                  } />
                  <Route path="/scripts" element={
                    <PageWrapper>
                      <ScriptsTab />
                    </PageWrapper>
                  } />
                  <Route path="/scripts/:slug" element={
                    <PageWrapper>
                      <ScriptsTab />
                    </PageWrapper>
                  } />
                  <Route path="/presets" element={
                    <PageWrapper>
                      <PresetsTab />
                    </PageWrapper>
                  } />
                  <Route path="/presets/:slug" element={
                    <PageWrapper>
                      <PresetsTab />
                    </PageWrapper>
                  } />
                  <Route path="/extensions" element={
                    <PageWrapper>
                      <ExtensionsTab />
                    </PageWrapper>
                  } />
                  <Route path="/extensions/:slug" element={
                    <PageWrapper>
                      <ExtensionsTab />
                    </PageWrapper>
                  } />
                  <Route path="/callback" element={<Callback />} />
                </Routes>
              </AnimatePresence>
            </main>
            <Toaster />
            <StagingPanel />
          </div>
        </ThemeProvider>
      </I18nProvider>
    </AdminProvider>
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
