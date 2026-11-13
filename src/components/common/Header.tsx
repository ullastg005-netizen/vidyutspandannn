import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  PhoneCall, 
  Globe, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  LogIn, 
  Menu, 
  X,
  AlertTriangle,
  Building2,
  Wrench,
  Lightbulb,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, switchUserByRole, logout, demoUsers } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [textSizeLarge, setTextSizeLarge] = useState(false);

  const toggleTextSize = () => {
    setTextSizeLarge(!textSizeLarge);
    document.body.style.fontSize = !textSizeLarge ? '17px' : '15px';
  };

  const getDashboardPath = (role?: UserRole) => {
    switch (role) {
      case 'CONSUMER': return '/consumer';
      case 'BESCOM_OFFICER': return '/officer';
      case 'FIELD_ENGINEER': return '/field';
      case 'STREETLIGHT_OFFICER': return '/streetlight';
      case 'ADMINISTRATOR': return '/admin';
      default: return '/login';
    }
  };

  const roleLabels: Record<UserRole, { en: string; kn: string; icon: any }> = {
    CONSUMER: { en: "Consumer", kn: "ಗ್ರಾಹಕ", icon: UserCheck },
    BESCOM_OFFICER: { en: "BESCOM Officer", kn: "ಬೆಸ್ಕಾಂ ಅಧಿಕಾರಿ", icon: Building2 },
    FIELD_ENGINEER: { en: "Field Engineer", kn: "ಲೈನ್‌ಮನ್", icon: Wrench },
    STREETLIGHT_OFFICER: { en: "Streetlight Cell", kn: "ಬೀದಿದೀಪ ಕೋಶ", icon: Lightbulb },
    ADMINISTRATOR: { en: "Admin", kn: "ಆಡಳಿತಾಧಿಕಾರಿ", icon: Settings },
  };

  return (
    <header className="w-full shadow-md z-50 bg-white">
      {/* 1. Official Government Top Strip */}
      <div className="bg-[#0B2545] text-slate-100 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="font-medium tracking-wide flex items-center gap-1.5 text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t.govBadge}
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-200">
              Department of Energy, Government of Karnataka Framework
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="tel:1912" 
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-2 py-0.5 rounded text-[11px] transition-colors"
              title="BESCOM Central 24x7 Helpline"
            >
              <PhoneCall className="w-3 h-3" />
              <span>1912 (24x7)</span>
            </a>

            {/* Accessibility text size toggle */}
            <button 
              onClick={toggleTextSize}
              className="hover:text-amber-300 font-mono text-[11px] px-1 border border-slate-600 rounded"
              title="Toggle font size"
            >
              {textSizeLarge ? 'A-' : 'A+'}
            </button>

            {/* Language switch */}
            <div className="flex items-center border border-slate-600 rounded overflow-hidden">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 font-semibold text-[11px] transition-colors ${
                  language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('kn')}
                className={`px-2 py-0.5 font-semibold text-[11px] transition-colors ${
                  language === 'kn' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Demonstration Prototype Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-1 text-center text-xs text-amber-900 font-medium flex items-center justify-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
        <span>{t.demoBadge}</span>
      </div>

      {/* 3. Judge & Evaluator Demonstration Switcher Bar */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <UserCheck className="w-4 h-4 text-blue-700" />
            <span>{t.switchRole}:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(['CONSUMER', 'BESCOM_OFFICER', 'FIELD_ENGINEER', 'STREETLIGHT_OFFICER', 'ADMINISTRATOR'] as UserRole[]).map((r) => {
              const isActive = user?.role === r;
              const meta = roleLabels[r];
              const Icon = meta.icon;
              return (
                <button
                  key={r}
                  onClick={() => {
                    switchUserByRole(r);
                    navigate(getDashboardPath(r));
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-900 text-white shadow-sm ring-2 ring-blue-500'
                      : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{language === 'kn' ? meta.kn : meta.en}</span>
                </button>
              );
            })}

            {user && (
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-rose-700 hover:bg-rose-50 border border-rose-200 ml-1"
                title="Logout current user"
              >
                <LogOut className="w-3 h-3" />
                <span>{t.logout}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Main Portal Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo & Titles */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#0B2545] to-[#134074] text-white flex items-center justify-center shadow border border-blue-900/40">
            <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-[#0B2545] group-hover:text-blue-800 transition-colors">
                {t.portalTitle}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold border border-blue-200">
                KA-BESCOM
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium line-clamp-1">
              {t.portalSubtitle}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link to="/" className="hover:text-blue-700 transition-colors">
            {t.home}
          </Link>
          <a href="#about-section" className="hover:text-blue-700 transition-colors">
            {t.about}
          </a>
          <a href="#services-section" className="hover:text-blue-700 transition-colors">
            {t.consumerServices}
          </a>
          <a href="#comparison-section" className="hover:text-blue-700 transition-colors">
            {t.serviceInfo}
          </a>
          <a href="#contact-section" className="hover:text-blue-700 transition-colors">
            {t.contact}
          </a>

          {user ? (
            <Link
              to={getDashboardPath(user.role)}
              className="bg-[#0B2545] hover:bg-[#134074] text-white px-3.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>{roleLabels[user.role][language === 'kn' ? 'kn' : 'en']} {t.dashboard}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-[#0B2545] hover:bg-[#134074] text-white px-3.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t.login}</span>
            </Link>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-blue-900 rounded focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-50 border-t border-slate-200 px-4 py-3 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-slate-700 hover:text-blue-700"
          >
            {t.home}
          </Link>
          <a
            href="#about-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-slate-700 hover:text-blue-700"
          >
            {t.about}
          </a>
          <a
            href="#services-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-slate-700 hover:text-blue-700"
          >
            {t.consumerServices}
          </a>
          <a
            href="#comparison-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-slate-700 hover:text-blue-700"
          >
            {t.serviceInfo}
          </a>
          <a
            href="#contact-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-slate-700 hover:text-blue-700"
          >
            {t.contact}
          </a>
          <div className="pt-2 border-t border-slate-200">
            {user ? (
              <Link
                to={getDashboardPath(user.role)}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block bg-blue-900 text-white py-2 rounded text-xs font-semibold"
              >
                {roleLabels[user.role][language === 'kn' ? 'kn' : 'en']} {t.dashboard}
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block bg-blue-900 text-white py-2 rounded text-xs font-semibold"
              >
                {t.login}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
