import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import { BottomNav } from './components/Layout/BottomNav';
import { Onboarding } from './pages/Onboarding';
import { Today } from './pages/Today';
import { CalendarPage } from './pages/CalendarPage';
import { Prayers } from './pages/Prayers';
import { AIHelper } from './pages/AIHelper';
import { Menu } from './pages/Menu';

const AppContent: React.FC = () => {
  const { user } = useUser();

  if (!user || !user.hasOnboarded) {
    return <Onboarding />;
  }

  return (
    <Router>
      <div className="min-h-screen font-sans text-[#2E2A27] bg-[#FAF5F0]">
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/calendar/*" element={<CalendarPage />} />
          <Route path="/prayers/*" element={<Prayers />} />
          <Route path="/ai" element={<AIHelper />} />
          <Route path="/menu/*" element={<Menu />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;