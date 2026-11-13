import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ConsumerPage } from './pages/ConsumerPage';
import { OfficerPage } from './pages/OfficerPage';
import { FieldEngineerPage } from './pages/FieldEngineerPage';
import { StreetlightPage } from './pages/StreetlightPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/consumer" element={<ConsumerPage />} />
                <Route path="/officer" element={<OfficerPage />} />
                <Route path="/field" element={<FieldEngineerPage />} />
                <Route path="/streetlight" element={<StreetlightPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
