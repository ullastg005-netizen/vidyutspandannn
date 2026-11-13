import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Search, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Users, 
  Activity, 
  Wrench, 
  Building2, 
  Flame, 
  Lightbulb, 
  TrendingUp, 
  FileText,
  MapPin,
  CheckCircle,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchId, setSearchId] = useState('');
  const [quickTrackResult, setQuickTrackResult] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  const handleQuickTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setTrackingLoading(true);
    setTrackingError('');
    setQuickTrackResult(null);

    try {
      const res = await fetch(`/api/complaints/${searchId.trim().toUpperCase()}`);
      if (res.ok) {
        const data = await res.json();
        setQuickTrackResult(data);
      } else {
        setTrackingError(
          language === 'kn' 
            ? "ದೂರು ಐಡಿ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಮಾನ್ಯ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (ಉದಾ: VS-2026-BLR-0101)."
            : "Complaint ID not found. Please try a sample ID like VS-2026-BLR-0101 or VS-2026-BLR-0106."
        );
      }
    } catch (err) {
      setTrackingError("Unable to connect to server. Please check connection.");
    } finally {
      setTrackingLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    SUBMITTED: 'bg-blue-100 text-blue-800 border-blue-300',
    RECEIVED: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    REVIEWED: 'bg-purple-100 text-purple-800 border-purple-300',
    ASSIGNED: 'bg-amber-100 text-amber-800 border-amber-300',
    WORK_IN_PROGRESS: 'bg-orange-100 text-orange-800 border-orange-300',
    RESOLVED: 'bg-teal-100 text-teal-800 border-teal-300',
    VERIFIED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#0B2545] via-[#103058] to-[#134074] text-white py-16 px-4 border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-900/80 border border-blue-400/30 px-3 py-1 rounded-full text-xs text-amber-300 font-semibold shadow-inner">
              <Zap className="w-4 h-4 fill-amber-300" />
              <span>{language === 'kn' ? "ಕರ್ನಾಟಕ ವಿದ್ಯುತ್ ಸೇವಾ ಸಮನ್ವಯ ಪೋರ್ಟಲ್" : "Karnataka Electricity Coordination Portal"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {t.heroHeading}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl">
              {t.heroSubtitle}
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/consumer"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-lg text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                <span>{t.registerComplaint}</span>
              </Link>

              <Link
                to="/login"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg text-sm border border-white/20 backdrop-blur-sm flex items-center gap-2 transition-all"
              >
                <Building2 className="w-5 h-5 text-amber-300" />
                <span>{t.officerPortal}</span>
              </Link>
            </div>

            {/* Quick Stats Badges */}
            <div className="pt-4 grid grid-cols-3 gap-3 max-w-lg border-t border-blue-800/60 text-xs">
              <div>
                <span className="block text-xl font-bold text-amber-400">20+</span>
                <span className="text-slate-300">Monitored Feeders</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-amber-400">&lt; 2 Hrs</span>
                <span className="text-slate-300">Avg Response Time</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-amber-400">100%</span>
                <span className="text-slate-300">Supervisor Verified</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Live Grievance Quick Tracker Card */}
          <div className="lg:col-span-5">
            <div className="bg-white text-slate-900 rounded-xl shadow-2xl p-6 border-2 border-amber-500/80">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center">
                    <Search className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B2545]">
                      {t.quickTrackTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Live status across Bengaluru sub-divisions
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                  Live DB
                </span>
              </div>

              <form onSubmit={handleQuickTrack} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.enterComplaintId}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      placeholder="e.g. VS-2026-BLR-0101"
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 focus:outline-none uppercase"
                    />
                    <button
                      type="submit"
                      disabled={trackingLoading}
                      className="bg-[#0B2545] hover:bg-[#134074] text-white px-4 py-2 rounded text-xs font-bold transition-colors"
                    >
                      {trackingLoading ? "..." : t.trackButton}
                    </button>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span>Try sample:</span>
                    <button
                      type="button"
                      onClick={() => setSearchId('VS-2026-BLR-0101')}
                      className="text-blue-700 hover:underline font-mono"
                    >
                      VS-2026-BLR-0101
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={() => setSearchId('VS-2026-BLR-0106')}
                      className="text-blue-700 hover:underline font-mono"
                    >
                      VS-2026-BLR-0106
                    </button>
                  </div>
                </div>
              </form>

              {trackingError && (
                <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{trackingError}</span>
                </div>
              )}

              {quickTrackResult && (
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-900">
                        {quickTrackResult.complaint.id}
                      </span>
                      <p className="text-xs text-slate-600">
                        {quickTrackResult.complaint.locality} ({quickTrackResult.complaint.ward})
                      </p>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${statusColors[quickTrackResult.complaint.status] || 'bg-slate-100'}`}>
                      {quickTrackResult.complaint.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 line-clamp-2">
                    {quickTrackResult.complaint.description}
                  </p>

                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Priority:</span>
                      <strong className={quickTrackResult.complaint.priority === 'CRITICAL' ? 'text-rose-700' : 'text-slate-800'}>
                        {quickTrackResult.complaint.priority}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Assigned Team:</span>
                      <strong className="text-slate-800">
                        {quickTrackResult.assigned_team?.team_name || 'Assigned to Sub-Division Pool'}
                      </strong>
                    </div>
                  </div>

                  <Link
                    to={`/consumer?track=${quickTrackResult.complaint.id}`}
                    className="block text-center text-xs font-bold text-blue-700 hover:text-blue-900 pt-1"
                  >
                    View Complete 7-Stage Timeline →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 7-STAGE COMPLAINT WORKFLOW LIFECYCLE */}
      <section id="services-section" className="py-12 px-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              End-to-End Governance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545]">
              {language === 'kn' ? "ದೂರು ಪರಿಹಾರ ಮತ್ತು ಕ್ಷೇತ್ರ ಕಾರ್ಯಾಚರಣೆಗಳ ಹಂತಗಳು" : "Complaint-to-Verification Operational Timeline"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
              Every power outage and electrical hazard moves through a mandatory transparent chain with full timestamping and audit logging.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
            {[
              { step: "1", title: t.statusSubmitted, desc: "Citizen lodges grievance with locality & photo", color: "border-blue-500" },
              { step: "2", title: t.statusReceived, desc: "Auto-ingestion & priority rules evaluation", color: "border-indigo-500" },
              { step: "3", title: t.statusReviewed, desc: "Officer reviews & correlates cluster incidents", color: "border-purple-500" },
              { step: "4", title: t.statusAssigned, desc: "Work order created & field crew dispatched", color: "border-amber-500" },
              { step: "5", title: t.statusWorkInProgress, desc: "On-site cable/transformer repair ongoing", color: "border-orange-500" },
              { step: "6", title: t.statusResolved, desc: "Field crew uploads completion evidence", color: "border-teal-500" },
              { step: "7", title: t.statusVerified, desc: "Supervisor physically verifies before closure", color: "border-emerald-500" },
            ].map((s, idx) => (
              <div key={idx} className={`bg-slate-50 p-4 rounded-lg border-t-4 ${s.color} shadow-sm space-y-2 flex flex-col justify-between`}>
                <div>
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold inline-flex items-center justify-center mb-1">
                    {s.step}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">{s.title}</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE INNOVATION HIGHLIGHTS (THE 7 PROPOSED DIFFERENTIATORS) */}
      <section id="about-section" className="py-14 px-4 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
              Presidency University Hackathon Innovation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545]">
              Vidyut Spandan Proposed Architectural Differentiators
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mx-auto">
              Addressing operational blind spots in civic-utility coordination through neighbourhood-level intelligence and explainable decision support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Incident Intelligence */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                1. Neighbourhood Incident Intelligence
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatically identifies correlated complaints in the same locality, ward, or feeder zone within short time windows, suggesting potential transformer trips for human officer confirmation.
              </p>
            </div>

            {/* 2. Explainable Priority Engine */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-900 flex items-center justify-center">
                <Flame className="w-5 h-5 text-rose-700" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                2. Explainable Priority Engine
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rules-based Python engine scoring safety hazards (loose wire/sparks), hospital impact, affected consumer density, and outage duration with human-readable reasoning and auditable officer override.
              </p>
            </div>

            {/* 3. Responsibility-Aware Routing */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-900 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-teal-700" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                3. Responsibility-Aware Routing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Distinct routing between Urban Local Bodies (BBMP streetlight contractors) and BESCOM electricity-side supply, eliminating cross-agency jurisdictional delays.
              </p>
            </div>

            {/* 4. Connected Work-Order Workflow */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                4. Connected Work-Order-to-Verification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete field lifecycle: Assigned → Accepted → Reached Location → Inspected → Repair in Progress → Work Completed. Field engineers cannot unilaterally self-approve final ticket closure.
              </p>
            </div>

            {/* 5. Supervisor Verification Gate */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                5. Mandatory Supervisor Verification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Restoration evidence (insulation tests, photo proof) must be reviewed by the Sub-Divisional AEE before marked VERIFIED, ensuring true on-ground quality.
              </p>
            </div>

            {/* 6. Repeat-Fault Tracking & Audit Trail */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-700" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                6. Repeat-Fault & Complete Audit Trail
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatically flags repeat equipment burnout (poles/transformers failing 2+ times) and maintains an immutable timestamped log of every dispatch and priority override.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXISTING UTILITY COMPARATIVE ANALYSIS (HONEST DIFFERENTIATION) */}
      <section id="comparison-section" className="py-14 px-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
              Academic Comparative Analysis
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545]">
              Existing Systems vs Vidyut Spandan Innovation
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mx-auto">
              We do not claim Vidyut Spandan invented baseline grievance logging or meter reading. This matrix highlights our specific proposed inter-agency coordination advancements.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#0B2545] text-white">
                <tr>
                  <th className="p-3 font-semibold">Capability / Workflow Dimension</th>
                  <th className="p-3 font-semibold">BESCOM Mithra App</th>
                  <th className="p-3 font-semibold">Sahaaya 2.0 (BBMP)</th>
                  <th className="p-3 font-semibold text-amber-300">Vidyut Spandan (Proposed)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold">Consumer Complaint Logging</td>
                  <td className="p-3 text-emerald-700 font-medium">✓ Fully Supported</td>
                  <td className="p-3 text-emerald-700 font-medium">✓ Fully Supported</td>
                  <td className="p-3 text-emerald-700 font-semibold bg-blue-50/50">✓ Supported with Geo & Locality metadata</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold">Neighbourhood Cluster Suggestion</td>
                  <td className="p-3 text-slate-500">Manual feeder reports</td>
                  <td className="p-3 text-slate-500">Uncorrelated civic tickets</td>
                  <td className="p-3 text-blue-900 font-bold bg-blue-50/50">★ Spatio-temporal cluster engine for officer review</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold">Explainable Priority Scoring</td>
                  <td className="p-3 text-slate-500">First-come or manual SLA</td>
                  <td className="p-3 text-slate-500">Departmental SLA timer</td>
                  <td className="p-3 text-blue-900 font-bold bg-blue-50/50">★ Multi-factor rules engine (Hazard, Essential, Scale)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold">Streetlight Civic vs Utility Routing</td>
                  <td className="p-3 text-slate-500">Refers citizens to BBMP</td>
                  <td className="p-3 text-slate-500">Routes to BBMP Ward Eng</td>
                  <td className="p-3 text-blue-900 font-bold bg-blue-50/50">★ Responsibility-aware (Pole asset owner vs power feed)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold">Restoration Quality Verification</td>
                  <td className="p-3 text-slate-500">Consumer SMS OTP confirmation</td>
                  <td className="p-3 text-slate-500">Citizen rating or auto-close</td>
                  <td className="p-3 text-blue-900 font-bold bg-blue-50/50">★ Dual gate: Field crew evidence + Supervisor sign-off</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold">Repeat-Fault Intelligence</td>
                  <td className="p-3 text-slate-500">Sub-station logs only</td>
                  <td className="p-3 text-slate-500">Not tracked at asset level</td>
                  <td className="p-3 text-blue-900 font-bold bg-blue-50/50">★ Persistent failure count per transformer & pole</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. EMERGENCY CONTACT & SAFETY SECTION */}
      <section id="contact-section" className="py-10 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <PhoneCall className="w-5 h-5" />
              <span>Official BESCOM Emergency Contact Numbers</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              Electrocution Risk or Sparking Live Wires?
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              In case of live wire snap, transformer fire, or immediate life danger, call BESCOM 24x7 control room immediately. Keep a minimum safe perimeter of 10 metres.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="tel:1912"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded text-sm flex items-center gap-2"
              >
                <span>Call 1912 (Toll Free)</span>
              </a>
              <span className="text-slate-400 text-xs self-center">
                SMS Outage: Format <code>KAVITARA &lt;Consumer-ID&gt;</code> to 9224228700
              </span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700 text-xs space-y-3">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Citizen Electrical Safety Guidelines</span>
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              <li>• Never approach or drive over snapped cables submerged in rain puddles.</li>
              <li>• Do not tie cattle or display banners on electricity poles and feeder boxes.</li>
              <li>• Turn off the main distribution MCB switch before evacuating flood-affected premises.</li>
              <li>• Report open pillar box doors immediately through Vidyut Spandan.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
