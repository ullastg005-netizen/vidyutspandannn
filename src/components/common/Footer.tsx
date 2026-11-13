import React from 'react';
import { ShieldAlert, Zap, Phone, Mail, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-[#07172B] text-slate-300 text-xs border-t-4 border-amber-500">
      {/* Upper Footer: Academic & Hackathon Attribution */}
      <div className="bg-[#0B2545] border-b border-slate-700/60 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              Presidency University Hackathon
            </span>
            <span className="font-semibold text-slate-200">
              Team: <span className="text-amber-300">TECH WARRIORS</span>
            </span>
          </div>

          <div className="text-slate-300 text-[11px]">
            Theme: <strong className="text-white">Digital Transformation of Power Distribution Operations</strong> (Karnataka Context)
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Identity & Mission */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-700 flex items-center justify-center text-white">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <span className="text-base font-bold text-white tracking-wide">
              {t.portalTitle}
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[12px]">
            {language === 'kn' 
              ? "ವಿದ್ಯುತ್ ದೂರುಗಳು, ಕ್ಷೇತ್ರ ಕಾರ್ಯಾಚರಣೆಗಳು ಮತ್ತು ಸೇವಾ ಹೊಣೆಗಾರಿಕೆಗಾಗಿ ಉದ್ದೇಶಿತ ಡಿಜಿಟಲ್ ಸಮನ್ವಯ ವೇದಿಕೆ."
              : "A proposed digital coordination platform bridging electricity consumers, BESCOM sub-divisional officers, field lineworkers, and urban local body lighting units."
            }
          </p>
          <div className="pt-2 text-slate-400 text-[11px] space-y-1">
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Bengaluru Urban & Rural Distribution Zones, Karnataka</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>BESCOM Emergency 24x7 Helpline: 1912</span>
            </p>
          </div>
        </div>

        {/* Col 2: Proposed Differentiators */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3 border-l-2 border-amber-400 pl-2">
            Key Innovations
          </h4>
          <ul className="space-y-2 text-[12px] text-slate-300">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Neighbourhood Incident Intelligence</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Explainable Rule-Based Priority Engine</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Responsibility-Aware Civic Work Routing</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Supervisor Verified Restoration Flow</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Repeat-Fault Tracking & Auditing</span>
            </li>
          </ul>
        </div>

        {/* Col 3: Existing Service Attribution */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3 border-l-2 border-amber-400 pl-2">
            Existing Utilities Context
          </h4>
          <p className="text-slate-400 text-[11px] leading-relaxed mb-2">
            Vidyut Spandan acknowledges established civic & utility software:
          </p>
          <ul className="space-y-1.5 text-[11px] text-slate-300">
            <li><strong>BESCOM Mithra:</strong> Citizen outage registration & GPS team tracking.</li>
            <li><strong>Smart Meter-BESCOM:</strong> Consumption analytics & AMR complaints.</li>
            <li><strong>Sahaaya 2.0:</strong> Multi-agency civic grievance escalation.</li>
          </ul>
          <p className="mt-2 text-slate-400 text-[10px] italic">
            Vidyut Spandan demonstrates proposed workflow optimizations for inter-agency coordination.
          </p>
        </div>

        {/* Col 4: Important Prototype Disclaimer */}
        <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-700/80">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Prototype Disclaimer</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            This web application is an academic hackathon prototype for Presidency University. It is <strong>NOT an official BESCOM or Government of Karnataka portal</strong> and does not perform live SCADA grid switching or access actual consumer billing data.
          </p>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 text-center text-[11px] text-slate-500">
        <p>© 2026 Vidyut Spandan | Developed by Team TECH WARRIORS | Presidency University Hackathon</p>
      </div>
    </footer>
  );
};
