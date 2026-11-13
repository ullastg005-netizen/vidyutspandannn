import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  FileText, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Truck,
  Eye,
  Sliders,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { WorkOrder, WorkOrderStatus } from '../types';

export const FieldEngineerPage: React.FC = () => {
  const { user, switchUserByRole } = useAuth();
  const { t, language } = useLanguage();

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  // Form states for progress update
  const [targetStatus, setTargetStatus] = useState<WorkOrderStatus>('ACCEPTED');
  const [updateNotes, setUpdateNotes] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'FIELD_ENGINEER') {
      switchUserByRole('FIELD_ENGINEER');
    }
  }, [user]);

  const loadWorkOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/work-orders');
      if (res.ok) {
        const data = await res.json();
        setWorkOrders(data);
      }
    } catch (err) {
      console.error('Error fetching work orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkOrders();
  }, []);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWO) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/work-orders/${selectedWO.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: targetStatus,
          notes: updateNotes,
          evidence_url: evidenceUrl || undefined,
          updated_by: user?.full_name || 'Manjunath V. (Lead Lineman)'
        })
      });

      if (res.ok) {
        setUpdateModalOpen(false);
        setUpdateNotes('');
        setEvidenceUrl('');
        loadWorkOrders();
      } else {
        alert('Failed to update work order status.');
      }
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    ASSIGNED: 'bg-blue-100 text-blue-800 border-blue-300',
    ACCEPTED: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    REACHED_LOCATION: 'bg-purple-100 text-purple-800 border-purple-300',
    INSPECTED: 'bg-amber-100 text-amber-800 border-amber-300',
    REPAIR_IN_PROGRESS: 'bg-orange-100 text-orange-800 border-orange-300',
    WORK_COMPLETED: 'bg-teal-100 text-teal-800 border-teal-300',
    AWAITING_VERIFICATION: 'bg-teal-100 text-teal-800 border-teal-300',
    VERIFIED_CLOSED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    REJECTED: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Top Banner */}
      <div className="bg-[#0B2545] text-white py-6 px-4 border-b border-blue-900">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded uppercase">
                Field Operations Workspace
              </span>
              <span className="text-xs text-slate-300">BESCOM Rapid Response Crew Alpha (FT-101)</span>
            </div>
            <h1 className="text-2xl font-black mt-1">
              {language === 'kn' ? "ಕ್ಷೇತ್ರ ಲೈನ್‌ಮನ್ / ತಾಂತ್ರಿಕ ಸಿಬ್ಬಂದಿ ಕಾರ್ಯಸ್ಥಳ" : "Field Engineer & Lineman Operations"}
            </h1>
            <p className="text-xs text-slate-300">
              Active Lead: <strong className="text-white">{user?.full_name || 'Manjunath V.'}</strong> (Senior Lineman) | Coverage: <span className="text-amber-300">Jayanagar 4th & 9th Blocks</span>
            </p>
          </div>

          <button
            onClick={loadWorkOrders}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold border border-blue-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Work Orders</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        {/* Workflow Banner Info */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
            <span>
              <strong>Supervisor Verification Rule:</strong> Field crews cannot unilaterally mark a complaint closed. Submitting "Work Completed" with photo evidence advances the work order to the Sub-Divisional Verification Queue.
            </span>
          </div>
        </div>

        {/* Work Order Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workOrders.map((wo) => {
            const isClosed = wo.status === 'VERIFIED_CLOSED';
            const isCompleted = wo.status === 'WORK_COMPLETED';

            return (
              <div
                key={wo.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:border-blue-400 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {wo.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${statusColors[wo.status] || 'bg-slate-100'}`}>
                      {wo.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {wo.category?.replace(/_/g, ' ') || 'Distribution Fault'}
                    </h3>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{wo.locality} ({wo.ward})</span>
                    </p>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 line-clamp-3">
                    {wo.description}
                  </p>

                  {wo.inspection_notes && (
                    <div className="text-[11px] text-slate-600 bg-blue-50/50 p-2 rounded border border-blue-100">
                      <strong>Field Notes:</strong> {wo.inspection_notes}
                    </div>
                  )}

                  {wo.completion_evidence_url && (
                    <div className="text-[11px] text-teal-800 bg-teal-50 p-2 rounded border border-teal-200 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-teal-700 shrink-0" />
                      <span>Photo Evidence Uploaded</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    Crew: {wo.team_name}
                  </span>

                  {!isClosed ? (
                    <button
                      onClick={() => {
                        setSelectedWO(wo);
                        setTargetStatus(
                          wo.status === 'ASSIGNED' ? 'ACCEPTED' :
                          wo.status === 'ACCEPTED' ? 'REACHED_LOCATION' :
                          wo.status === 'REACHED_LOCATION' ? 'INSPECTED' :
                          wo.status === 'INSPECTED' ? 'REPAIR_IN_PROGRESS' :
                          'WORK_COMPLETED'
                        );
                        setUpdateModalOpen(true);
                      }}
                      className="bg-[#0B2545] hover:bg-[#134074] text-white px-3 py-1.5 rounded font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Update Status</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Verified & Closed</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- MODAL: UPDATE WORK ORDER STATUS ---------------- */}
      {updateModalOpen && selectedWO && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-600" />
                <span>Advance Field Work Order Lifecycle</span>
              </h3>
              <button onClick={() => setUpdateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1">
              <p><strong>Work Order:</strong> {selectedWO.id} | Complaint: {selectedWO.complaint_id}</p>
              <p><strong>Location:</strong> {selectedWO.locality} ({selectedWO.ward})</p>
              <p><strong>Current Status:</strong> {selectedWO.status}</p>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Next Lifecycle Stage *
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as WorkOrderStatus)}
                  className="w-full p-2.5 border border-slate-300 rounded font-semibold text-slate-800 bg-white"
                >
                  <option value="ACCEPTED">1. ACCEPTED (Crew acknowledged assignment)</option>
                  <option value="REACHED_LOCATION">2. REACHED LOCATION (Vehicle on site)</option>
                  <option value="INSPECTED">3. INSPECTED (Preliminary physical diagnosis)</option>
                  <option value="REPAIR_IN_PROGRESS">4. REPAIR IN PROGRESS (Cable jointing / fuse replacement)</option>
                  <option value="WORK_COMPLETED">5. WORK COMPLETED (Ready for supervisor verification)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Technical On-Site Notes *
                </label>
                <textarea
                  rows={3}
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="Record multimeter voltage readings, replaced materials, cable joint sleeve specs..."
                  className="w-full p-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              {targetStatus === 'WORK_COMPLETED' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-slate-500" />
                    <span>Upload Repair Completion Evidence (URL / Sample Preset)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={evidenceUrl}
                      onChange={(e) => setEvidenceUrl(e.target.value)}
                      placeholder="Enter photo evidence URL"
                      className="flex-1 p-2 border border-slate-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setEvidenceUrl('https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded border border-slate-300"
                    >
                      Sample Preset
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setUpdateModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#0B2545] hover:bg-[#134074] text-white rounded font-bold shadow flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{actionLoading ? "Submitting..." : "Update Progress"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
