import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  PlusCircle, 
  RefreshCw, 
  Wrench,
  Camera,
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { StreetlightAsset, StreetlightFault, Ward } from '../types';

export const StreetlightPage: React.FC = () => {
  const { user, switchUserByRole } = useAuth();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'ASSETS' | 'FAULTS' | 'REPORT'>('ASSETS');
  const [assets, setAssets] = useState<StreetlightAsset[]>([]);
  const [faults, setFaults] = useState<StreetlightFault[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [reporterName, setReporterName] = useState('Citizen Resident');
  const [reporterContact, setReporterContact] = useState('+91 98450 99881');
  const [faultDescription, setFaultDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [routeResult, setRouteResult] = useState<any>(null);

  useEffect(() => {
    if (!user || user.role !== 'STREETLIGHT_OFFICER') {
      switchUserByRole('STREETLIGHT_OFFICER');
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [aRes, fRes, wRes] = await Promise.all([
        fetch('/api/streetlight/assets'),
        fetch('/api/streetlight/faults'),
        fetch('/api/master/wards')
      ]);

      if (aRes.ok) {
        const assetList: StreetlightAsset[] = await aRes.json();
        setAssets(assetList);
        if (assetList.length > 0) setSelectedAssetId(assetList[0].id);
      }
      if (fRes.ok) setFaults(await fRes.json());
      if (wRes.ok) setWards(await wRes.json());
    } catch (err) {
      console.error('Error fetching streetlight data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReportFault = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !faultDescription.trim()) {
      alert('Please select an asset pole and describe the issue.');
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch('/api/streetlight/faults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_id: selectedAssetId,
          reported_by: reporterName,
          contact_number: reporterContact,
          description: faultDescription,
          photo_url: photoUrl || undefined
        })
      });

      if (res.ok) {
        const result = await res.json();
        setRouteResult(result);
        setFaultDescription('');
        setPhotoUrl('');
        loadData();
      } else {
        alert('Failed to report streetlight fault.');
      }
    } catch (err) {
      console.error('Streetlight fault error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Stats
  const totalAssets = assets.length;
  const workingAssets = assets.filter(a => a.status === 'WORKING').length;
  const faultyAssets = assets.filter(a => a.status === 'FAULTY').length;
  const bbmpAssets = assets.filter(a => a.responsible_authority === 'BBMP').length;
  const bescomAssets = assets.filter(a => a.responsible_authority === 'BESCOM').length;
  const contractorAssets = assets.filter(a => a.responsible_authority === 'CONTRACTOR').length;

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Top Banner */}
      <div className="bg-[#0B2545] text-white py-6 px-4 border-b border-blue-900">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-teal-500 text-slate-950 font-bold px-2 py-0.5 rounded uppercase">
                Joint BBMP-BESCOM Coordination Cell
              </span>
              <span className="text-xs text-slate-300">Public Lighting Infrastructure Division</span>
            </div>
            <h1 className="text-2xl font-black mt-1">
              {language === 'kn' ? "ಬೀದಿದೀಪ ಸಮನ್ವಯ ಮತ್ತು ನಿರ್ವಹಣಾ ಕೋಶ" : "Streetlight Infrastructure & Multi-Agency Coordination"}
            </h1>
            <p className="text-xs text-slate-300">
              Logged in as: <strong className="text-white">{user?.full_name || 'Lakshmi Devi'}</strong> (Streetlight Coordination Officer)
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-blue-900/80 p-1 rounded-lg border border-blue-400/20 text-xs">
            <button
              onClick={() => setActiveTab('ASSETS')}
              className={`px-3 py-1.5 rounded font-semibold transition-all ${
                activeTab === 'ASSETS' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-200 hover:text-white'
              }`}
            >
              Assets Register ({assets.length})
            </button>
            <button
              onClick={() => setActiveTab('FAULTS')}
              className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'FAULTS' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-200 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Faults Queue ({faults.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('REPORT')}
              className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'REPORT' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-200 hover:text-white'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log Pole Fault</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-slate-500 text-[11px] font-semibold block">Total Streetlights</span>
            <span className="text-2xl font-bold text-slate-900">{totalAssets}</span>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-emerald-200 shadow-sm">
            <span className="text-emerald-800 text-[11px] font-semibold block">Active & Working</span>
            <span className="text-2xl font-bold text-emerald-600">{workingAssets}</span>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-rose-200 shadow-sm">
            <span className="text-rose-800 text-[11px] font-semibold block">Faulty / Dark</span>
            <span className="text-2xl font-bold text-rose-600">{faultyAssets}</span>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-teal-200 shadow-sm">
            <span className="text-teal-800 text-[11px] font-semibold block">BBMP Urban Body</span>
            <span className="text-2xl font-bold text-teal-700">{bbmpAssets}</span>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-blue-200 shadow-sm">
            <span className="text-blue-800 text-[11px] font-semibold block">BESCOM Electricity-Side</span>
            <span className="text-2xl font-bold text-blue-700">{bescomAssets}</span>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-purple-200 shadow-sm">
            <span className="text-purple-800 text-[11px] font-semibold block">Contractor Covered</span>
            <span className="text-2xl font-bold text-purple-700">{contractorAssets}</span>
          </div>
        </div>

        {/* Responsibility-Aware Routing Note */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-xs text-blue-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Responsibility-Aware Civic vs Utility Routing:</span>
          </div>
          <p className="text-slate-700">
            Streetlight maintenance is fundamentally multi-agency. Structural defects, lamp burnouts, and timer issues route directly to the <strong>BBMP Lighting Contractor</strong>. Hazardous open junction boxes, sparks, or supply feeder blackouts route to <strong>BESCOM Operations</strong>.
          </p>
        </div>

        {/* ---------------- TAB 1: ASSETS REGISTER ---------------- */}
        {activeTab === 'ASSETS' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Streetlight Pole Inventory & Maintenance Mapping
                </h3>
                <p className="text-xs text-slate-500">
                  Bengaluru Ward-level poles with configured responsible authority
                </p>
              </div>
              <button
                onClick={loadData}
                className="text-xs px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50 font-semibold"
              >
                Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold">Pole Number</th>
                    <th className="p-3 font-semibold">Locality / Ward</th>
                    <th className="p-3 font-semibold">Lamp Type</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold">Responsible Authority</th>
                    <th className="p-3 font-semibold">Assigned Contractor</th>
                    <th className="p-3 font-semibold">Last Inspected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-blue-900">
                        {asset.pole_number}
                      </td>
                      <td className="p-3">
                        <span className="font-medium text-slate-900">{asset.locality}</span>
                        <span className="block text-[11px] text-slate-400">{asset.ward}</span>
                      </td>
                      <td className="p-3 text-slate-700 font-medium">
                        {asset.lamp_type}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${
                          asset.status === 'WORKING' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          asset.status === 'FAULTY' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                          'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${
                          asset.responsible_authority === 'BBMP' ? 'bg-teal-50 text-teal-800 border-teal-200' :
                          asset.responsible_authority === 'BESCOM' ? 'bg-blue-50 text-blue-800 border-blue-200 font-bold' :
                          'bg-purple-50 text-purple-800 border-purple-200'
                        }`}>
                          {asset.responsible_authority}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">
                        {asset.contractor_name || 'In-House Municipal Crew'}
                      </td>
                      <td className="p-3 text-slate-500 text-[11px]">
                        {asset.last_inspected || 'Pending Inspection'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: FAULTS QUEUE & REPEAT FAULTS ---------------- */}
        {activeTab === 'FAULTS' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">
                Active Streetlight Faults & Repeat-Failure Identification
              </h3>
              <p className="text-xs text-slate-500">
                Poles failing 2 or more times are highlighted for infrastructure upgrade.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold">Fault ID</th>
                    <th className="p-3 font-semibold">Pole Number</th>
                    <th className="p-3 font-semibold">Locality</th>
                    <th className="p-3 font-semibold">Description</th>
                    <th className="p-3 font-semibold">Repeat Faults</th>
                    <th className="p-3 font-semibold">Routed Authority</th>
                    <th className="p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {faults.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-blue-900">
                        {f.id}
                      </td>
                      <td className="p-3 font-mono font-semibold text-slate-900">
                        {f.pole_number}
                      </td>
                      <td className="p-3 text-slate-700">
                        {f.locality}
                      </td>
                      <td className="p-3 text-slate-700 max-w-xs truncate" title={f.description}>
                        {f.description}
                      </td>
                      <td className="p-3">
                        {f.repeat_fault_count >= 2 ? (
                          <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded border border-rose-300 text-[11px] flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            <span>Repeat Fault #{f.repeat_fault_count}</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">First occurrence</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {f.responsible_authority}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: REPORT POLE FAULT ---------------- */}
        {activeTab === 'REPORT' && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-[#0B2545] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <span>Report Streetlight Fault</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Responsibility-aware routing engine automatically assigns case to BBMP, Contractor, or BESCOM.
                </p>
              </div>
            </div>

            {routeResult && (
              <div className="m-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <CheckCircle className="w-5 h-5 text-emerald-700" />
                  <span>Streetlight Fault Successfully Routed</span>
                </div>
                <p className="text-slate-700">
                  Fault ID: <strong className="font-mono">{routeResult.fault_id}</strong> on Pole <strong className="font-mono">{routeResult.pole_number}</strong>.
                </p>
                <div className="p-2.5 bg-white rounded border border-emerald-200 font-semibold text-emerald-800 flex justify-between">
                  <span>Target Responsible Authority:</span>
                  <span className="bg-emerald-100 px-2 py-0.5 rounded">{routeResult.routed_authority}</span>
                </div>
                {routeResult.repeat_fault_count > 0 && (
                  <p className="text-amber-800 font-medium">
                    ⚠️ Repeat failure detected on this asset (Prior faults: {routeResult.repeat_fault_count}). Flagged for physical pole replacement.
                  </p>
                )}
              </div>
            )}

            <form onSubmit={handleReportFault} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  1. Select Streetlight Asset Pole *
                </label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded font-medium bg-white"
                  required
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.pole_number} - {a.locality} (Owner: {a.responsible_authority})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Reporter Name *
                  </label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Fault Description *
                </label>
                <textarea
                  rows={3}
                  value={faultDescription}
                  onChange={(e) => setFaultDescription(e.target.value)}
                  placeholder="e.g. Lamp completely burnt out, or open wire sparking at pole base..."
                  className="w-full p-2 border border-slate-300 rounded"
                  required
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#0B2545] hover:bg-[#134074] text-white px-6 py-2.5 rounded font-bold shadow flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? "Routing..." : "Submit & Route to Authority"}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
