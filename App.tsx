
import React, { Suspense, lazy, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nProvider } from './contexts/I18nContext';
import { ModernBottomNav } from './components/Layout/BottomNav';
import { AnimatedSplash } from './components/AnimatedSplash';
import { OrthodoxLifeLogo } from './components/OrthodoxLifeLogo';

// Lazy Load Pages for Performance
const Onboarding = lazy(() => import('./pages/Onboarding').then(module => ({ default: module.Onboarding })));
const Today = lazy(() => import('./pages/Today').then(module => ({ default: module.Today })));
const CalendarPage = lazy(() => import('./pages/CalendarPage').then(module => ({ default: module.CalendarPage })));
const Prayers = lazy(() => import('./pages/Prayers').then(module => ({ default: module.Prayers })));
const AIHelper = lazy(() => import('./pages/AIHelper').then(module => ({ default: module.AIHelper })));
const Menu = lazy(() => import('./pages/Menu').then(module => ({ default: module.Menu })));

const LoadingScreen = () => (
  <div className="min-h-screen bg-bg flex items-center justify-center">
    <OrthodoxLifeLogo size={48} className="animate-pulse text-primary" />
  </div>
);

const AppContent: React.FC = () => {
  const { user } = useUser();
  const [splashFinished, setSplashFinished] = useState(false);

  if (!splashFinished) {
    return <AnimatedSplash onFinish={() => setSplashFinished(true)} />;
  }

  if (!user || !user.hasOnboarded) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Onboarding />
      </Suspense>
    );
  }

  return (
    <Router>
      <div className="min-h-screen font-sans text-text bg-bg transition-colors duration-300">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/calendar/*" element={<CalendarPage />} />
            <Route path="/prayers/*" element={<Prayers />} />
            <Route path="/ai" element={<AIHelper />} />
            <Route path="/menu/*" element={<Menu />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <ModernBottomNav />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <I18nProvider>
          <AppContent />
        </I18nProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
