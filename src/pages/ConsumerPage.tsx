import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Camera, 
  FileText, 
  RefreshCw,
  Bell,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  User,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Complaint, ComplaintCategory, Locality, Ward, Notification } from '../types';

export const ConsumerPage: React.FC = () => {
  const { user, switchUserByRole } = useAuth();
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<'MY_COMPLAINTS' | 'REGISTER' | 'TRACK'>('MY_COMPLAINTS');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successModalData, setSuccessModalData] = useState<any>(null);

  // Form State
  const [category, setCategory] = useState<ComplaintCategory>('POWER_OUTAGE');
  const [selectedWard, setSelectedWard] = useState('WARD_153');
  const [selectedLocality, setSelectedLocality] = useState('Jayanagar 4th T Block');
  const [landmark, setLandmark] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Tracking State
  const [trackIdInput, setTrackIdInput] = useState(searchParams.get('track') || '');
  const [trackedComplaint, setTrackedComplaint] = useState<any>(null);
  const [trackError, setTrackError] = useState('');

  // Auto-switch to consumer demo if no user or another role is active and user wants consumer
  useEffect(() => {
    if (!user || user.role !== 'CONSUMER') {
      switchUserByRole('CONSUMER');
    }
  }, [user]);

  // Load complaints and master data
  const loadData = async () => {
    setLoading(true);
    try {
      const [compRes, wardRes, locRes, notifRes] = await Promise.all([
        fetch('/api/complaints'),
        fetch('/api/master/wards'),
        fetch('/api/master/localities'),
        fetch('/api/notifications?role=CONSUMER')
      ]);

      if (compRes.ok) {
        const allComps: Complaint[] = await compRes.json();
        // Filter by consumer or show sample cases
        setComplaints(allComps);
      }
      if (wardRes.ok) setWards(await wardRes.json());
      if (locRes.ok) setLocalities(await locRes.json());
      if (notifRes.ok) setNotifications(await notifRes.json());
    } catch (err) {
      console.error('Error fetching consumer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle URL query track parameter
  useEffect(() => {
    const trackParam = searchParams.get('track');
    if (trackParam) {
      setActiveTab('TRACK');
      setTrackIdInput(trackParam);
      handleTrackQuery(trackParam);
    }
  }, [searchParams]);

  const handleTrackQuery = async (id: string) => {
    if (!id.trim()) return;
    setTrackError('');
    setTrackedComplaint(null);
    try {
      const res = await fetch(`/api/complaints/${id.trim().toUpperCase()}`);
      if (res.ok) {
        const data = await res.json();
        setTrackedComplaint(data);
      } else {
        setTrackError('Complaint ID not found in database. Please verify the ID number.');
      }
    } catch (err) {
      setTrackError('Failed to fetch complaint tracking details.');
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoordinates({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
          });
        },
        () => {
          // Fallback to sample coordinates in Jayanagar
          setGpsCoordinates({ lat: 12.9250, lng: 77.5938 });
        }
      );
    } else {
      setGpsCoordinates({ lat: 12.9250, lng: 77.5938 });
    }
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !landmark.trim()) {
      alert('Please fill in both landmark and complaint description.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        consumer_id: user?.id || 'USR_CONSUMER_01',
        consumer_name: user?.full_name || 'Rajesh Kumar',
        consumer_phone: user?.phone || '+91 98450 12345',
        category,
        locality: selectedLocality,
        ward: selectedWard,
        landmark,
        description,
        photo_url: photoUrl || undefined,
        lat: gpsCoordinates?.lat,
        lng: gpsCoordinates?.lng,
      };

      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        setSuccessModalData(result);
        // Reset form
        setDescription('');
        setLandmark('');
        setPhotoUrl('');
        setGpsCoordinates(null);
        loadData();
      } else {
        alert('Failed to register complaint. Please try again.');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Server error while registering complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions: { key: ComplaintCategory; labelEn: string; labelKn: string }[] = [
    { key: 'POWER_OUTAGE', labelEn: 'Power Outage / Supply Interruption', labelKn: 'ವಿದ್ಯುತ್ ವ್ಯತ್ಯಯ / ಸರಬರಾಜು ಸ್ಥಗಿತ' },
    { key: 'LOW_VOLTAGE', labelEn: 'Low Voltage / Fluctuations', labelKn: 'ಕಡಿಮೆ ವೋಲ್ಟೇಜ್ / ಏರಿಳಿತ' },
    { key: 'METER_RELATED_ISSUE', labelEn: 'Meter-Related Issue / Sparking', labelKn: 'ಮೀಟರ್ ಸಂಬಂಧಿತ ದೋಷ' },
    { key: 'ELECTRICITY_INFRASTRUCTURE_FAULT', labelEn: 'Electricity Infrastructure Fault (Wire/Pole/Transformer)', labelKn: 'ವಿದ್ಯುತ್ ಮೂಲಸೌಕರ್ಯ ದೋಷ' },
    { key: 'BILLING_RELATED_ISSUE', labelEn: 'Billing / Tariff Assessment Issue', labelKn: 'ಬಿಲ್ / ದರ ಲೆಕ್ಕಾಚಾರದ ಸಮಸ್ಯೆ' },
    { key: 'OTHER_SERVICE_ISSUE', labelEn: 'Other Electricity Service Issue', labelKn: 'ಇತರ ವಿದ್ಯುತ್ ಸೇವಾ ದೂರು' },
  ];

  const statusBadgeColors: Record<string, string> = {
    SUBMITTED: 'bg-blue-100 text-blue-800 border-blue-300',
    RECEIVED: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    REVIEWED: 'bg-purple-100 text-purple-800 border-purple-300',
    ASSIGNED: 'bg-amber-100 text-amber-800 border-amber-300',
    WORK_IN_PROGRESS: 'bg-orange-100 text-orange-800 border-orange-300',
    RESOLVED: 'bg-teal-100 text-teal-800 border-teal-300',
    VERIFIED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  };

  const priorityBadgeColors: Record<string, string> = {
    CRITICAL: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
    HIGH: 'bg-orange-100 text-orange-800 border-orange-300 font-semibold',
    MEDIUM: 'bg-amber-100 text-amber-800 border-amber-300',
    NORMAL: 'bg-slate-100 text-slate-700 border-slate-300',
  };

  const workflowStages = [
    'SUBMITTED',
    'RECEIVED',
    'REVIEWED',
    'ASSIGNED',
    'WORK_IN_PROGRESS',
    'RESOLVED',
    'VERIFIED'
  ];

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Top Banner */}
      <div className="bg-[#0B2545] text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded uppercase">
                Citizen Portal
              </span>
              <span className="text-xs text-slate-300">BESCOM Sub-Division Coordination</span>
            </div>
            <h1 className="text-2xl font-black mt-1">
              {language === 'kn' ? "ಗ್ರಾಹಕ ಸೇವಾ ಪೋರ್ಟಲ್" : "Electricity Consumer Service Workspace"}
            </h1>
            <p className="text-xs text-slate-300">
              Logged in as: <strong className="text-white">{user?.full_name || 'Rajesh Kumar'}</strong> | Consumer No: <span className="font-mono text-amber-300">RR-BLR-88421</span>
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-blue-900/80 p-1 rounded-lg border border-blue-400/20 text-xs">
            <button
              onClick={() => setActiveTab('MY_COMPLAINTS')}
              className={`px-3 py-1.5 rounded font-semibold transition-all ${
                activeTab === 'MY_COMPLAINTS' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-200 hover:text-white'
              }`}
            >
              My Complaints ({complaints.length})
            </button>
            <button
              onClick={() => setActiveTab('REGISTER')}
              className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'REGISTER' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-200 hover:text-white'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.registerComplaint}</span>
            </button>
            <button
              onClick={() => setActiveTab('TRACK')}
              className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'TRACK' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-200 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t.trackComplaint}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        {/* Success Modal after Submission */}
        {successModalData && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scaleIn border-2 border-emerald-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Grievance Registered Successfully
                  </h3>
                  <p className="text-xs text-slate-500">
                    Saved in Persistent Database & Assigned Unique Token
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Complaint Reference ID:</span>
                  <strong className="font-mono text-sm text-blue-900 font-bold bg-blue-100 px-2 py-0.5 rounded">
                    {successModalData.complaint_id}
                  </strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Calculated Priority:</span>
                  <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${priorityBadgeColors[successModalData.priority]}`}>
                    {successModalData.priority}
                  </span>
                </div>

                <div className="pt-2">
                  <span className="font-semibold text-slate-700 block mb-1">
                    Explainable Engine Assessment Factors:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                    {successModalData.priority_reasons?.map((r: string, idx: number) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    const id = successModalData.complaint_id;
                    setSuccessModalData(null);
                    setActiveTab('TRACK');
                    setTrackIdInput(id);
                    handleTrackQuery(id);
                  }}
                  className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
                >
                  Track Live Timeline Now
                </button>
                <button
                  onClick={() => setSuccessModalData(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold px-4 py-2 rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 1: MY COMPLAINTS ---------------- */}
        {activeTab === 'MY_COMPLAINTS' && (
          <div className="space-y-6">
            {/* Notifications Ribbon */}
            {notifications.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 font-bold text-xs text-blue-900 mb-2">
                  <Bell className="w-4 h-4 text-blue-700" />
                  <span>Recent Automated Service Notifications</span>
                </div>
                <div className="space-y-1.5">
                  {notifications.slice(0, 2).map((n) => (
                    <div key={n.id} className="text-xs text-slate-700 flex items-start gap-2 bg-white p-2 rounded border border-blue-100">
                      <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong>{n.title}:</strong> {n.message}
                        <span className="block text-[10px] text-slate-400">{n.created_at}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complaint List Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-slate-50">
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">
                    Grievance History & Status Register
                  </h2>
                  <p className="text-xs text-slate-500">
                    Complaints registered across Bengaluru Sub-Divisions
                  </p>
                </div>
                <button
                  onClick={loadData}
                  className="text-xs text-slate-600 hover:text-blue-900 flex items-center gap-1 border border-slate-300 bg-white px-2.5 py-1 rounded"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-3 font-semibold">Complaint ID</th>
                      <th className="p-3 font-semibold">Category</th>
                      <th className="p-3 font-semibold">Locality / Ward</th>
                      <th className="p-3 font-semibold">Landmark</th>
                      <th className="p-3 font-semibold">Priority</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold">Date Logged</th>
                      <th className="p-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {complaints.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-6 text-center text-slate-400">
                          No complaints found. Click "Register Complaint" to log an issue.
                        </td>
                      </tr>
                    ) : (
                      complaints.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-blue-900">
                            {c.id}
                          </td>
                          <td className="p-3 font-medium">
                            {c.category.replace(/_/g, ' ')}
                          </td>
                          <td className="p-3">
                            <span className="font-medium text-slate-900">{c.locality}</span>
                            <span className="block text-[11px] text-slate-400">{c.ward}</span>
                          </td>
                          <td className="p-3 text-slate-600 max-w-xs truncate" title={c.landmark}>
                            {c.landmark}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded border text-[11px] ${priorityBadgeColors[c.priority]}`}>
                              {c.priority}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${statusBadgeColors[c.status] || 'bg-slate-100'}`}>
                              {c.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500 text-[11px]">
                            {c.created_at}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setActiveTab('TRACK');
                                setTrackIdInput(c.id);
                                handleTrackQuery(c.id);
                              }}
                              className="text-blue-700 hover:text-blue-900 font-bold hover:underline"
                            >
                              Track →
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: REGISTER COMPLAINT ---------------- */}
        {activeTab === 'REGISTER' && (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-[#0B2545] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-400" />
                  <span>{t.registerComplaint}</span>
                </h2>
                <p className="text-xs text-slate-300">
                  Fill in electrical service grievance details for immediate sub-divisional routing.
                </p>
              </div>
              <span className="bg-amber-400 text-slate-950 font-bold text-xs px-2.5 py-1 rounded">
                Official Form
              </span>
            </div>

            <form onSubmit={handleSubmitComplaint} className="p-6 space-y-5">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Complaint Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium text-slate-800"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {language === 'kn' ? opt.labelKn : opt.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ward & Locality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    2. Distribution Ward *
                  </label>
                  <select
                    value={selectedWard}
                    onChange={(e) => {
                      setSelectedWard(e.target.value);
                      const matchingLoc = localities.find(l => l.ward_id === e.target.value);
                      if (matchingLoc) setSelectedLocality(matchingLoc.name);
                    }}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    {wards.map((w) => (
                      <option key={w.id} value={w.id}>
                        Ward {w.ward_number}: {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    3. Locality / Neighbourhood *
                  </label>
                  <select
                    value={selectedLocality}
                    onChange={(e) => setSelectedLocality(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    {localities
                      .filter(l => l.ward_id === selectedWard)
                      .map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name} ({loc.pincode})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Landmark & GPS */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    4. Landmark / Address Line *
                  </label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-700" />
                    <span>{gpsCoordinates ? `Lat: ${gpsCoordinates.lat}, Lng: ${gpsCoordinates.lng}` : "Use Location Permission (GPS)"}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Sagar Hospital Gate 2, Opposite Bus Stop"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  5. Detailed Description of the Electrical Fault *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe whether loose wire is sparking, transformer made loud sound, or power is cut across multiple homes..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Mention if sparking, live wire snapped, or hospital/clinic is nearby. The Explainable Priority Engine will factor this into dispatch ranking.
                </p>
              </div>

              {/* Photo Evidence URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-slate-500" />
                  <span>6. Photograph Evidence (Optional URL / Preset)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Enter image URL or select preset below"
                    className="flex-1 text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800&auto=format&fit=crop&q=60')}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded border border-slate-300"
                  >
                    Sample Wire Photo
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Your grievance is legally logged and timestamped under Karnataka Citizen Charter.
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#0B2545] hover:bg-[#134074] text-white px-6 py-2.5 rounded text-xs font-bold shadow flex items-center gap-2 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? "Submitting..." : "Submit Grievance"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ---------------- TAB 3: TRACK COMPLAINT ---------------- */}
        {activeTab === 'TRACK' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Search Box */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Enter Complaint Tracking Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={trackIdInput}
                  onChange={(e) => setTrackIdInput(e.target.value)}
                  placeholder="e.g. VS-2026-BLR-0101"
                  className="flex-1 text-sm p-2.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 uppercase font-mono"
                />
                <button
                  onClick={() => handleTrackQuery(trackIdInput)}
                  className="bg-[#0B2545] hover:bg-[#134074] text-white px-5 py-2.5 rounded text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Track Status</span>
                </button>
              </div>

              {trackError && (
                <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded">
                  {trackError}
                </div>
              )}
            </div>

            {/* Tracking Result View */}
            {trackedComplaint && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden space-y-6 p-6">
                {/* Header summary */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <span className="font-mono text-base font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                      {trackedComplaint.complaint.id}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-2">
                      {trackedComplaint.complaint.category.replace(/_/g, ' ')}
                    </h2>
                    <p className="text-xs text-slate-600">
                      {trackedComplaint.complaint.locality} ({trackedComplaint.complaint.ward}) | Landmark: {trackedComplaint.complaint.landmark}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`px-3 py-1 rounded border text-xs font-bold inline-block ${statusBadgeColors[trackedComplaint.complaint.status]}`}>
                      Current Status: {trackedComplaint.complaint.status.replace(/_/g, ' ')}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Logged: {trackedComplaint.complaint.created_at}
                    </p>
                  </div>
                </div>

                {/* Priority & Explainability Card */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Assigned Urgency Priority:</span>
                    <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${priorityBadgeColors[trackedComplaint.complaint.priority]}`}>
                      {trackedComplaint.complaint.priority}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    <strong>Reasoning:</strong> {trackedComplaint.complaint.priority_reason || 'Standard ticket assessment.'}
                  </p>
                  {trackedComplaint.assigned_team && (
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-700">
                      <span>Assigned Field Crew:</span>
                      <strong>{trackedComplaint.assigned_team.team_name} (Lead: {trackedComplaint.assigned_team.lead_name})</strong>
                    </div>
                  )}
                </div>

                {/* 7-Stage Visual Timeline */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
                    7-Stage Restoration Governance Lifecycle
                  </h3>

                  <div className="relative border-l-2 border-blue-800 ml-4 pl-6 space-y-6">
                    {trackedComplaint.timeline?.map((item: any, idx: number) => (
                      <div key={idx} className="relative group">
                        {/* Dot indicator */}
                        <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-900 border-2 border-white ring-2 ring-blue-500" />
                        
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-blue-900">
                              {item.status.replace(/_/g, ' ')}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {item.timestamp}
                            </span>
                          </div>
                          <p className="text-slate-700">{item.notes}</p>
                          <div className="text-[10px] text-slate-500 italic">
                            Updated by: {item.updated_by_name} ({item.updated_by_role})
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supervisor Verification Record if closed */}
                {trackedComplaint.verification && (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Official Sub-Divisional Verification Certificate</span>
                    </div>
                    <p className="text-emerald-800">
                      Restoration inspected and approved by <strong>{trackedComplaint.verification.supervisor_name}</strong> on {trackedComplaint.verification.verified_at}.
                    </p>
                    <p className="text-emerald-700 italic">
                      Remarks: "{trackedComplaint.verification.remarks}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
