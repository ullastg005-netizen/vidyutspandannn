import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  Wrench, 
  Lightbulb, 
  Settings, 
  ArrowRight, 
  AlertCircle,
  Lock,
  Mail,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { demoUsers, switchUserByRole, loginByEmail } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const getDashboardPath = (role: UserRole) => {
    switch (role) {
      case 'CONSUMER': return '/consumer';
      case 'BESCOM_OFFICER': return '/officer';
      case 'FIELD_ENGINEER': return '/field';
      case 'STREETLIGHT_OFFICER': return '/streetlight';
      case 'ADMINISTRATOR': return '/admin';
      default: return '/';
    }
  };

  const roleCardMeta: Record<UserRole, {
    title: string;
    titleKn: string;
    badge: string;
    description: string;
    icon: any;
    color: string;
    sampleName: string;
  }> = {
    CONSUMER: {
      title: "Citizen Consumer",
      titleKn: "ನಾಗರಿಕ ಗ್ರಾಹಕ",
      badge: "Citizen Portal",
      description: "Lodge power outage, low voltage, or meter complaints and track restoration timeline in real time.",
      icon: UserCheck,
      color: "from-blue-600 to-indigo-700",
      sampleName: "Rajesh Kumar (Jayanagar 4th Block)"
    },
    BESCOM_OFFICER: {
      title: "BESCOM Sub-Divisional Officer",
      titleKn: "ಬೆಸ್ಕಾಂ ಉಪ-ವಿಭಾಗೀಯ ಅಧಿಕಾರಿ",
      badge: "AEE / Operations",
      description: "Review incidents, assess explainable priority recommendations, confirm neighbourhood clusters, and dispatch crews.",
      icon: Building2,
      color: "from-[#0B2545] to-[#134074]",
      sampleName: "K. Ramesh, AEE (Jayanagar Sub-Division)"
    },
    FIELD_ENGINEER: {
      title: "Field Lineman / Crew Lead",
      titleKn: "ಕ್ಷೇತ್ರ ತಾಂತ್ರಿಕ ಸಿಬ್ಬಂದಿ / ಲೈನ್‌ಮನ್",
      badge: "Rapid Response Unit",
      description: "Accept work orders, navigate to transformer/feeder location, log repair progress, and upload completion evidence.",
      icon: Wrench,
      color: "from-amber-600 to-amber-700",
      sampleName: "Manjunath V. (Field Crew Alpha)"
    },
    STREETLIGHT_OFFICER: {
      title: "Streetlight Coordination Officer",
      titleKn: "ಬೀದಿದೀಪ ಸಮನ್ವಯ ಅಧಿಕಾರಿ",
      badge: "Joint BBMP-BESCOM Cell",
      description: "Manage street lighting infrastructure, execute responsibility-aware routing between BBMP, contractors, and BESCOM.",
      icon: Lightbulb,
      color: "from-teal-700 to-emerald-800",
      sampleName: "Lakshmi Devi (Public Lighting Cell)"
    },
    ADMINISTRATOR: {
      title: "State Operations Administrator",
      titleKn: "ರಾಜ್ಯ ಕಾರ್ಯಾಚರಣಾ ಆಡಳಿತಾಧಿಕಾರಿ",
      badge: "System Controller",
      description: "Maintain master ward boundaries, manage user credentials, configure department SLAs, and review complete audit logs.",
      icon: Settings,
      color: "from-slate-700 to-slate-900",
      sampleName: "State Admin Controller (KPTCL / BESCOM HQ)"
    }
  };

  const handleSelectRole = (role: UserRole) => {
    switchUserByRole(role);
    navigate(getDashboardPath(role));
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      setErrorMsg('Please enter an authorized email address.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const success = await loginByEmail(emailInput);
    setLoading(false);
    if (success) {
      const loggedUser = demoUsers.find(u => u.email.toLowerCase() === emailInput.toLowerCase());
      if (loggedUser) {
        navigate(getDashboardPath(loggedUser.role));
      } else {
        navigate('/');
      }
    } else {
      setErrorMsg('Account not found. Please click one of the pre-configured demonstration accounts below.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Karnataka Power Coordination Framework</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B2545] tracking-tight">
            {language === 'kn' ? "ವಿದ್ಯುತ್ ಸ್ಪಂದನ — ಸುರಕ್ಷಿತ ಪಾತ್ರ-ಆಧಾರಿತ ಪ್ರವೇಶ" : "Vidyut Spandan — Secure Role-Based Access"}
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            {language === 'kn'
              ? "ಹ್ಯಾಕಥಾನ್ ಮೌಲ್ಯಮಾಪನಕ್ಕಾಗಿ ಕೆಳಗಿನ ಯಾವುದೇ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಖಾತೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ನೇರವಾಗಿ ಸಂಬಂಧಿತ ಕಾರ್ಯಸ್ಥಳಕ್ಕೆ ಪ್ರವೇಶಿಸಿ."
              : "For Hackathon evaluation, click any demonstration role card below to instantly access that dedicated operational workspace."}
          </p>
        </div>

        {/* 1. Quick Evaluator Demonstration Profiles (Main Choice) */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-[#0B2545] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>{language === 'kn' ? "ತೀರ್ಪುಗಾರರ 1-ಕ್ಲಿಕ್ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಖಾತೆಗಳು" : "Judges / Evaluators 1-Click Demonstration Accounts"}</span>
              </h2>
              <p className="text-xs text-slate-300">
                Instantly switches permissions and launches the respective workflow dashboard.
              </p>
            </div>
            <span className="bg-amber-400 text-slate-950 font-bold text-xs px-2.5 py-1 rounded">
              Ready to Test
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(['CONSUMER', 'BESCOM_OFFICER', 'FIELD_ENGINEER', 'STREETLIGHT_OFFICER', 'ADMINISTRATOR'] as UserRole[]).map((r) => {
              const meta = roleCardMeta[r];
              const Icon = meta.icon;
              return (
                <div
                  key={r}
                  onClick={() => handleSelectRole(r)}
                  className="group relative border border-slate-200 rounded-lg p-5 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer bg-slate-50 hover:bg-white flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${meta.color} text-white flex items-center justify-center shadow`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                        {meta.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-800 transition-colors text-base">
                        {language === 'kn' ? meta.titleKn : meta.title}
                      </h3>
                      <p className="text-xs text-blue-700 font-medium">
                        {meta.sampleName}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {meta.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-blue-700 group-hover:text-blue-900">
                    <span>{language === 'kn' ? "ಪ್ರವೇಶಿಸಿ" : "Launch Workspace"}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Manual Login Form (Standard Government portal layout) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-xl mx-auto">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-slate-600" />
            <span>Direct Email Authentication</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Or test manual login using any registered demonstration email (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded">officer@demo.vidyutspandan.gov.in</code>).
          </p>

          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Authorized Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. consumer@demo.vidyutspandan.gov.in"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B2545] hover:bg-[#134074] text-white py-2 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? "Authenticating..." : "Sign In to Workspace"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
