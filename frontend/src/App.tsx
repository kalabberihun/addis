import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Navbar } from './components/Navbar';
import { MusicLibrary } from './pages/MusicLibrary';
import { StatisticsDashboard } from './pages/StatisticsDashboard';
import { SongModal } from './components/SongModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ToastNotification } from './components/ToastNotification';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
`;

const Footer = styled.footer`
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  text-align: center;
  font-size: 0.82rem;
  color: #64748b;

  span {
    color: #a78bfa;
    font-weight: 600;
  }
`;

const App: React.FC = () => {
  return (
    <AppContainer>
      <Navbar />
      <MainContent>
        <Routes>
          <Route path="/" element={<Navigate replace to="/songs" />} />
          <Route path="/songs" element={<MusicLibrary />} />
          <Route path="/statistics" element={<StatisticsDashboard />} />
          <Route path="*" element={<Navigate replace to="/songs" />} />
        </Routes>
      </MainContent>

      {/* Global Dialogs & Notifications */}
      <SongModal />
      <DeleteConfirmModal />
      <ToastNotification />

      <Footer>
        Addis Software Assessment Project &bull; Full Stack MERN with <span>Redux Toolkit & Saga</span>
      </Footer>
    </AppContainer>
  );
};

export default App;
