import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Wrench, 
  CheckCircle, 
  XCircle, 
  ShieldAlert, 
  ShieldCheck, 
  Eye, 
  RefreshCw,
  Send,
  SlidersHorizontal,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Complaint, 
  IncidentGroup, 
  SuggestedIncident, 
  FieldTeam, 
  Ward, 
  PriorityLevel 
} from '../types';

export const OfficerPage: React.FC = () => {
  const { user, switchUserByRole } = useAuth();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'MANAGEMENT' | 'INCIDENT_INTEL' | 'AUDIT_LOGS'>('MANAGEMENT');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [fieldTeams, setFieldTeams] = useState<FieldTeam[]>([]);
  const [incidentGroups, setIncidentGroups] = useState<IncidentGroup[]>([]);
  const [suggestedIncidents, setSuggestedIncidents] = useState<SuggestedIncident[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [wardFilter, setWardFilter] = useState('ALL');

  // Modals
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);

  // Modal actions state
  const [assignTeamId, setAssignTeamId] = useState('');
  const [assignInstructions, setAssignInstructions] = useState('Immediate field restoration requested.');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('HIGH');
  const [overrideReason, setOverrideReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Incident cluster confirm state
  const [confirmModalData, setConfirmModalData] = useState<SuggestedIncident | null>(null);
  const [confirmReason, setConfirmReason] = useState('Transformer breaker tripping confirmed by physical feeder relay telemetry.');

  // Auto-switch to officer role if needed
  useEffect(() => {
    if (!user || user.role !== 'BESCOM_OFFICER') {
      switchUserByRole('BESCOM_OFFICER');
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, ftRes, igRes, suggRes, wRes, audRes] = await Promise.all([
        fetch('/api/complaints'),
        fetch('/api/master/field-teams'),
        fetch('/api/incidents'),
        fetch('/api/incidents/suggested'),
        fetch('/api/master/wards'),
        fetch('/api/admin/audit-logs?limit=40')
      ]);

      if (cRes.ok) setComplaints(await cRes.json());
      if (ftRes.ok) {
        const teams: FieldTeam[] = await ftRes.json();
        setFieldTeams(teams);
        if (teams.length > 0) setAssignTeamId(teams[0].id);
      }
      if (igRes.ok) setIncidentGroups(await igRes.json());
      if (suggRes.ok) setSuggestedIncidents(await suggRes.json());
      if (wRes.ok) setWards(await wRes.json());
      if (audRes.ok) setAuditLogs(await audRes.json());
    } catch (err) {
      console.error('Error fetching officer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (searchFilter && !c.id.toLowerCase().includes(searchFilter.toLowerCase()) && !c.description.toLowerCase().includes(searchFilter.toLowerCase()) && !c.locality.toLowerCase().includes(searchFilter.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;
    if (wardFilter !== 'ALL' && c.ward !== wardFilter) return false;
    return true;
  });

  // Calculate high-level stats
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => ['SUBMITTED', 'RECEIVED', 'REVIEWED', 'ASSIGNED', 'WORK_IN_PROGRESS'].includes(c.status)).length;
  const criticalCount = complaints.filter(c => c.priority === 'CRITICAL' && c.status !== 'VERIFIED').length;
  const awaitingVerificationCount = complaints.filter(c => c.status === 'RESOLVED').length;
  const resolvedCount = complaints.filter(c => ['RESOLVED', 'VERIFIED'].includes(c.status)).length;

  // Handle Team Assignment
  const handleAssignTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !assignTeamId) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/complaints/${selectedComplaint.id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: assignTeamId,
          officer_id: user?.id || 'USR_OFFICER_01',
          officer_name: user?.full_name || 'K. Ramesh, AEE',
          instructions: assignInstructions
        })
      });

      if (res.ok) {
        setAssignModalOpen(false);
        loadData();
      } else {
        alert('Failed to assign team.');
      }
    } catch (err) {
      console.error('Assign error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Priority Override
  const handleOverridePriority = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !overrideReason.trim()) {
      alert('Please state a reason for manual priority override.');
      return;
    }
    setActionLoading(true);

    try {
      const res = await fetch(`/api/complaints/${selectedComplaint.id}/priority`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priority: newPriority,
          override_reason: overrideReason,
          officer_id: user?.id || 'USR_OFFICER_01',
          officer_name: user?.full_name || 'K. Ramesh, AEE'
        })
      });

      if (res.ok) {
        setOverrideModalOpen(false);
        setOverrideReason('');
        loadData();
      } else {
        alert('Failed to update priority.');
      }
    } catch (err) {
      console.error('Override error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm Incident Cluster
  const handleConfirmIncident = async () => {
    if (!confirmModalData) return;
    setActionLoading(true);

    try {
      const res = await fetch('/api/incidents/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suggested_id: confirmModalData.suggested_id,
          title: confirmModalData.title,
          locality: confirmModalData.locality,
          ward: confirmModalData.ward,
          category: confirmModalData.category,
          complaint_ids: confirmModalData.complaint_ids,
          officer_id: user?.id || 'USR_OFFICER_01',
          officer_name: user?.full_name || 'K. Ramesh, AEE',
          reason: confirmReason
        })
      });

      if (res.ok) {
        setConfirmModalData(null);
        loadData();
      } else {
        alert('Failed to confirm incident cluster.');
      }
    } catch (err) {
      console.error('Cluster confirm error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const priorityBadgeColors: Record<string, string> = {
    CRITICAL: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
    HIGH: 'bg-orange-100 text-orange-800 border-orange-300 font-semibold',
    MEDIUM: 'bg-amber-100 text-amber-800 border-amber-300',
    NORMAL: 'bg-slate-100 text-slate-700 border-slate-300',
  };

  const statusBadgeColors: Record<string, string> = {
    SUBMITTED: 'bg-blue-100 text-blue-800 border-blue-300',
    RECEIVED: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    REVIEWED: 'bg-purple-100 text-purple-800 border-purple-300',
    ASSIGNED: 'bg-amber-100 text-amber-800 border-amber-300',
    WORK_IN_PROGRESS: 'bg-orange-100 text-orange-800 border-orange-300',
    RESOLVED: 'bg-teal-100 text-teal-800 border-teal-300',
    VERIFIED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Top Banner */}
      <div className="bg-[#0B2545] text-white py-6 px-4 border-b border-blue-900">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-600 text-white font-bold px-2 py-0.5 rounded uppercase">
                Sub-Division Operations
              </span>
              <span className="text-xs text-slate-300">Jayanagar & Bengaluru South Distribution Zones</span>
            </div>
            <h1 className="text-2xl font-black mt-1">
              {language === 'kn' ? "ಬೆಸ್ಕಾಂ ಕಾರ್ಯಾಚರಣಾ ಅಧಿಕಾರಿ ಕಾರ್ಯಸ್ಥಳ" : "BESCOM Sub-Divisional Officer Workspace"}
            </h1>
            <p className="text-xs text-slate-300">
              Logged in as: <strong className="text-white">{user?.full_name || 'K. Ramesh, AEE'}</strong> (Assistant Executive Engineer - O&M)
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-blue-900/80 p-1 rounded-lg border border-blue-400/20 text-xs">
            <button
              onClick={() => setActiveTab('MANAGEMENT')}
              className={`px-3 py-1.5 rounded font-semibold transition-all ${
                activeTab === 'MANAGEMENT' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-200 hover:text-white'
              }`}
            >
              Complaints Queue ({complaints.length})
            </button>
            <button
              onClick={() => setActiveTab('INCIDENT_INTEL')}
              className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'INCIDENT_INTEL' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-200 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Incident Intelligence ({suggestedIncidents.length + incidentGroups.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('AUDIT_LOGS')}
              className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'AUDIT_LOGS' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-200 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Audit Trail</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-slate-500 text-[11px] font-semibold block">Total Complaints</span>
            <span className="text-2xl font-bold text-slate-900">{totalCount}</span>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-amber-200 shadow-sm">
            <span className="text-amber-800 text-[11px] font-semibold block">Active / Pending</span>
            <span className="text-2xl font-bold text-amber-600">{pendingCount}</span>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-rose-200 shadow-sm">
            <span className="text-rose-800 text-[11px] font-semibold block flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>Critical Urgency</span>
            </span>
            <span className="text-2xl font-bold text-rose-600">{criticalCount}</span>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-purple-200 shadow-sm">
            <span className="text-purple-800 text-[11px] font-semibold block">Suggested Clusters</span>
            <span className="text-2xl font-bold text-purple-700">{suggestedIncidents.length}</span>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-teal-200 shadow-sm">
            <span className="text-teal-800 text-[11px] font-semibold block">Awaiting Verification</span>
            <span className="text-2xl font-bold text-teal-700">{awaitingVerificationCount}</span>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-emerald-200 shadow-sm">
            <span className="text-emerald-800 text-[11px] font-semibold block">Restored Cases</span>
            <span className="text-2xl font-bold text-emerald-700">{resolvedCount}</span>
          </div>
        </div>

        {/* ---------------- TAB 1: COMPLAINT MANAGEMENT ---------------- */}
        {activeTab === 'MANAGEMENT' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Filter and Search Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {/* Search */}
                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search by ID, locality, description..."
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-1.5 border border-slate-300 rounded bg-white font-medium"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="RECEIVED">RECEIVED</option>
                  <option value="REVIEWED">REVIEWED</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="WORK_IN_PROGRESS">WORK IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="VERIFIED">VERIFIED</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="p-1.5 border border-slate-300 rounded bg-white font-medium"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="NORMAL">NORMAL</option>
                </select>

                {/* Ward Filter */}
                <select
                  value={wardFilter}
                  onChange={(e) => setWardFilter(e.target.value)}
                  className="p-1.5 border border-slate-300 rounded bg-white font-medium"
                >
                  <option value="ALL">All Wards</option>
                  {wards.map((w) => (
                    <option key={w.id} value={w.id}>
                      Ward {w.ward_number}: {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={loadData}
                className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded font-semibold text-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold">Complaint ID</th>
                    <th className="p-3 font-semibold">Category</th>
                    <th className="p-3 font-semibold">Locality / Ward</th>
                    <th className="p-3 font-semibold">Calculated Priority</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold">Assigned Team</th>
                    <th className="p-3 font-semibold">Cluster</th>
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-slate-400">
                        No complaints matching the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-blue-900">
                          {c.id}
                        </td>
                        <td className="p-3 font-medium">
                          {c.category.replace(/_/g, ' ')}
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-900">{c.locality}</span>
                          <span className="block text-[11px] text-slate-400">{c.ward}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded border text-[11px] ${priorityBadgeColors[c.priority]}`}>
                              {c.priority}
                            </span>
                            {c.is_priority_overridden ? (
                              <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-1 border border-purple-200 rounded" title="Human Officer Override Recorded">
                                OVERRIDDEN
                              </span>
                            ) : null}
                          </div>
                          {c.priority_reason && (
                            <span className="block text-[10px] text-slate-500 max-w-xs truncate" title={c.priority_reason}>
                              {c.priority_reason}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${statusBadgeColors[c.status] || 'bg-slate-100'}`}>
                            {c.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-3">
                          {c.assigned_team_id ? (
                            <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {fieldTeams.find(t => t.id === c.assigned_team_id)?.team_name || c.assigned_team_id}
                            </span>
                          ) : (
                            <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {c.incident_group_id ? (
                            <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                              {c.incident_group_id}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Individual</span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          {/* Assign Team Button */}
                          <button
                            onClick={() => {
                              setSelectedComplaint(c);
                              setAssignModalOpen(true);
                            }}
                            className="bg-blue-900 hover:bg-blue-800 text-white px-2 py-1 rounded text-[11px] font-semibold"
                            title="Dispatch / Reassign Crew"
                          >
                            Assign Crew
                          </button>

                          {/* Override Priority Button */}
                          <button
                            onClick={() => {
                              setSelectedComplaint(c);
                              setNewPriority(c.priority);
                              setOverrideModalOpen(true);
                            }}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-2 py-1 rounded text-[11px] font-semibold"
                            title="Human Priority Override"
                          >
                            Set Priority
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: NEIGHBOURHOOD INCIDENT INTELLIGENCE ---------------- */}
        {activeTab === 'INCIDENT_INTEL' && (
          <div className="space-y-6">
            {/* Banner explaining innovation */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-xl shadow-md border border-blue-700">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                    <Users className="w-4 h-4" />
                    <span>Key Platform Differentiator: Spatio-Temporal Grouping</span>
                  </div>
                  <h3 className="text-lg font-bold">
                    Neighbourhood-Level Incident Intelligence Engine
                  </h3>
                  <p className="text-xs text-slate-200 max-w-3xl leading-relaxed">
                    Rather than dispatching redundant crews to 10 isolated calls, Vidyut Spandan clusters complaints across localities and wards.
                    <strong> Non-autonomous:</strong> All cluster suggestions strictly require human officer confirmation before merging.
                  </p>
                </div>
                <span className="bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1 rounded shrink-0">
                  Active Analysis
                </span>
              </div>
            </div>

            {/* Suggested Clusters Requiring Review */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>POSSIBLE RELATED INCIDENTS — STAFF REVIEW REQUIRED ({suggestedIncidents.length})</span>
                  </h3>
                  <p className="text-xs text-amber-800">
                    Algorithmic correlation identified multiple independent reports in the same neighbourhood feeder zone.
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {suggestedIncidents.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs">
                    No active unconfirmed incident clusters detected right now.
                  </div>
                ) : (
                  suggestedIncidents.map((sugg, idx) => (
                    <div key={idx} className="border-2 border-amber-300 rounded-lg p-4 bg-amber-50/40 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-sm text-slate-900">
                            {sugg.title}
                          </span>
                          <p className="text-xs text-slate-600">
                            {sugg.locality} ({sugg.ward}) | Category: <strong>{sugg.category}</strong>
                          </p>
                        </div>
                        <span className="bg-rose-100 text-rose-800 font-bold text-xs px-2.5 py-1 rounded border border-rose-300">
                          {sugg.report_count} Correlated Consumer Reports
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded border border-slate-200 text-xs text-slate-700">
                        <span className="font-semibold block text-slate-900 mb-1">Algorithmic Correlation Evidence:</span>
                        <p>{sugg.suggested_reason}</p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span>Associated Complaint IDs:</span>
                        <div className="flex flex-wrap gap-1">
                          {sugg.complaint_ids.map(cid => (
                            <span key={cid} className="font-mono bg-blue-100 text-blue-900 font-bold px-1.5 py-0.5 rounded text-[11px]">
                              {cid}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-amber-200 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setConfirmModalData(sugg);
                          }}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded flex items-center gap-1.5 shadow"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm Incident & Group Complaints</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Confirmed Incident Groups */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm">
                  Active Confirmed Neighbourhood Incident Groups ({incidentGroups.length})
                </h3>
              </div>

              <div className="p-6 space-y-3">
                {incidentGroups.map((grp) => (
                  <div key={grp.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                          {grp.id}
                        </span>
                        <strong className="text-slate-900 text-sm">{grp.title}</strong>
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          CONFIRMED
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">
                        Locality: {grp.locality} ({grp.ward}) | Linked: <strong>{grp.report_count} complaints</strong>
                      </p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Officer Confirmation: {grp.suggested_reason} (by {grp.confirmed_by} at {grp.confirmed_at})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 block">Coordinated Crew:</span>
                      <strong className="text-blue-900 font-semibold">FT_JYN_ALPHA (Lead: Manjunath V.)</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: AUDIT TRAIL ---------------- */}
        {activeTab === 'AUDIT_LOGS' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Immutable Sub-Divisional Operations Audit Log
                </h3>
                <p className="text-xs text-slate-500">
                  Every dispatch, priority override, and incident confirmation recorded with timestamp.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold">Timestamp</th>
                    <th className="p-3 font-semibold">Action</th>
                    <th className="p-3 font-semibold">Entity Type / ID</th>
                    <th className="p-3 font-semibold">Officer / Actor</th>
                    <th className="p-3 font-semibold">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-[11px] text-slate-500">
                        {log.timestamp}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-800">
                        {log.entity_type}: {log.entity_id}
                      </td>
                      <td className="p-3 font-medium">
                        {log.performed_by_name} ({log.role})
                      </td>
                      <td className="p-3 text-slate-600">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- MODAL 1: ASSIGN FIELD CREW ---------------- */}
      {assignModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-700" />
                <span>Dispatch Field Technical Crew</span>
              </h3>
              <button onClick={() => setAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Complaint ID:</span>
                <strong className="font-mono text-blue-900">{selectedComplaint.id}</strong>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <strong>{selectedComplaint.category}</strong>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span>{selectedComplaint.locality} ({selectedComplaint.ward})</span>
              </div>
            </div>

            <form onSubmit={handleAssignTeam} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select Field Crew *
                </label>
                <select
                  value={assignTeamId}
                  onChange={(e) => setAssignTeamId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded font-medium text-slate-800 bg-white"
                  required
                >
                  {fieldTeams.map((ft) => (
                    <option key={ft.id} value={ft.id}>
                      {ft.team_name} (Lead: {ft.lead_name}) - Status: {ft.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Work Order Instructions / Dispatch Notes
                </label>
                <textarea
                  rows={3}
                  value={assignInstructions}
                  onChange={(e) => setAssignInstructions(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
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
                  <span>{actionLoading ? "Dispatching..." : "Issue Work Order & Dispatch"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: HUMAN PRIORITY OVERRIDE ---------------- */}
      {overrideModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-purple-700" />
                <span>Explainable Priority Override (Human Officer)</span>
              </h3>
              <button onClick={() => setOverrideModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1">
              <p><strong>System Recommended:</strong> {selectedComplaint.priority}</p>
              <p className="text-slate-600"><strong>System Reason:</strong> {selectedComplaint.priority_reason}</p>
            </div>

            <form onSubmit={handleOverridePriority} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Adjust Priority Classification *
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                  className="w-full p-2.5 border border-slate-300 rounded font-bold text-slate-800 bg-white"
                >
                  <option value="CRITICAL">CRITICAL (Direct life/safety hazard)</option>
                  <option value="HIGH">HIGH (Essential facility / high-density outage)</option>
                  <option value="MEDIUM">MEDIUM (Localized feeder trip / equipment fluctuation)</option>
                  <option value="NORMAL">NORMAL (Standard service inquiry)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mandatory Officer Override Justification *
                </label>
                <textarea
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="State technical or operational reason for overriding rules engine recommendation..."
                  className="w-full p-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  This override will be permanently written to the State Audit Ledger with your credentials.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setOverrideModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded font-bold shadow flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{actionLoading ? "Saving..." : "Confirm Override & Log Audit"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 3: CONFIRM INCIDENT CLUSTER ---------------- */}
      {confirmModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border-2 border-amber-500">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Confirm Neighbourhood Incident Cluster</span>
              </h3>
              <button onClick={() => setConfirmModalData(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              You are officially validating that <strong>{confirmModalData.report_count} consumer complaints</strong> in <strong>{confirmModalData.locality}</strong> stem from a common distribution failure.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Officer Confirmation Justification *
                </label>
                <textarea
                  rows={3}
                  value={confirmReason}
                  onChange={(e) => setConfirmReason(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setConfirmModalData(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmIncident}
                  disabled={actionLoading}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold shadow flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{actionLoading ? "Processing..." : "Confirm & Link Complaints"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
