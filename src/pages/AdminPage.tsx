import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  BarChart3, 
  MapPin, 
  Users, 
  Download, 
  RefreshCw, 
  Building2, 
  ShieldCheck, 
  FileText, 
  Clock, 
  TrendingUp,
  Layers,
  Wrench,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { InteractiveMap } from '../components/common/InteractiveMap';
import { Complaint, StreetlightAsset, IncidentGroup } from '../types';

export const AdminPage: React.FC = () => {
  const { user, switchUserByRole, demoUsers } = useAuth();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'MAP' | 'USERS' | 'AUDIT'>('ANALYTICS');
  const [analytics, setAnalytics] = useState<any>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [streetlights, setStreetlights] = useState<StreetlightAsset[]>([]);
  const [incidentGroups, setIncidentGroups] = useState<IncidentGroup[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'ADMINISTRATOR') {
      switchUserByRole('ADMINISTRATOR');
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [anRes, cRes, slRes, igRes, audRes] = await Promise.all([
        fetch('/api/analytics/summary'),
        fetch('/api/complaints'),
        fetch('/api/streetlight/assets'),
        fetch('/api/incidents'),
        fetch('/api/admin/audit-logs?limit=50')
      ]);

      if (anRes.ok) setAnalytics(await anRes.json());
      if (cRes.ok) setComplaints(await cRes.json());
      if (slRes.ok) setStreetlights(await slRes.json());
      if (igRes.ok) setIncidentGroups(await igRes.json());
      if (audRes.ok) setAuditLogs(await audRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportCSV = () => {
    window.location.href = '/api/analytics/export-csv';
  };

  const PIE_COLORS = ['#0B2545', '#134074', '#0077b6', '#0096c7', '#e11d48', '#ea580c'];

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Top Banner */}
      <div className="bg-[#0B2545] text-white py-6 px-4 border-b border-blue-900">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-700 text-white font-bold px-2 py-0.5 rounded uppercase">
                State Distribution Administrator
              </span>
              <span className="text-xs text-slate-300">Karnataka Power Transmission & Distribution Systems Cell</span>
            </div>
            <h1 className="text-2xl font-black mt-1">
              {language === 'kn' ? "ರಾಜ್ಯ ಆಡಳಿತ ಮತ್ತು ವಿಶ್ಲೇಷಣಾ ನಿಯಂತ್ರಣ ಕೊಠಡಿ" : "State Operations Administration & Analytics Command"}
            </h1>
            <p className="text-xs text-slate-300">
              Logged in as: <strong className="text-white">{user?.full_name || 'State Admin Controller'}</strong> (Chief Information Systems Officer)
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-blue-900/80 p-1 rounded-lg border border-blue-400/20 text-xs">
              <button
                onClick={() => setActiveTab('ANALYTICS')}
                className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'ANALYTICS' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-200 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Analytics & Charts</span>
              </button>
              <button
                onClick={() => setActiveTab('MAP')}
                className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'MAP' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-200 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Interactive Grid Map</span>
              </button>
              <button
                onClick={() => setActiveTab('USERS')}
                className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'USERS' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-200 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>User Roles</span>
              </button>
              <button
                onClick={() => setActiveTab('AUDIT')}
                className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'AUDIT' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-200 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>System Audit Logs</span>
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded flex items-center gap-1.5 shadow transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        {/* KPI Top Cards */}
        {analytics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-slate-500 text-[11px] font-semibold block">Total Complaints</span>
              <span className="text-2xl font-bold text-slate-900">{analytics.total_complaints}</span>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-amber-200 shadow-sm">
              <span className="text-amber-800 text-[11px] font-semibold block">Active / Pending</span>
              <span className="text-2xl font-bold text-amber-600">{analytics.pending_complaints}</span>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-rose-200 shadow-sm">
              <span className="text-rose-800 text-[11px] font-semibold block">Critical Urgent</span>
              <span className="text-2xl font-bold text-rose-600">{analytics.critical_complaints}</span>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-teal-200 shadow-sm">
              <span className="text-teal-800 text-[11px] font-semibold block">Avg Assign SLA</span>
              <span className="text-2xl font-bold text-teal-700">{analytics.avg_assignment_time_hrs}h</span>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-blue-200 shadow-sm">
              <span className="text-blue-800 text-[11px] font-semibold block">Avg Verified Closure</span>
              <span className="text-2xl font-bold text-blue-700">{analytics.avg_verified_closure_hrs}h</span>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-emerald-200 shadow-sm">
              <span className="text-emerald-800 text-[11px] font-semibold block">Verified Closed</span>
              <span className="text-2xl font-bold text-emerald-700">{analytics.verified_complaints}</span>
            </div>
          </div>
        )}

        {/* ---------------- TAB 1: ANALYTICS & CHARTS (RECHARTS) ---------------- */}
        {activeTab === 'ANALYTICS' && analytics && (
          <div className="space-y-6">
            {/* Chart Row 1: Complaints by Category & Ward Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown Bar Chart */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                  <span>Complaints by Category</span>
                  <span className="text-xs font-normal text-slate-500">Service Category Distribution</span>
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.category_breakdown}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="category" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0B2545" radius={[4, 4, 0, 0]} name="Complaints Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Ward Breakdown Bar Chart */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                  <span>Complaints by Ward</span>
                  <span className="text-xs font-normal text-slate-500">Distribution Density</span>
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.ward_breakdown}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="ward_name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#134074" radius={[4, 4, 0, 0]} name="Grievances Logged" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart Row 2: Locality Density & Field Team Workload */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Locality Distribution */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  Complaints by Neighbourhood Locality
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.locality_breakdown}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="locality" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0077b6" radius={[4, 4, 0, 0]} name="Locality Total" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Field Team Workload */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  Active Field Crew Work Order Load
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.team_workload}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="team_name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="active_work_orders" fill="#e11d48" radius={[4, 4, 0, 0]} name="Active Work Orders" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: INTERACTIVE GRID MAP ---------------- */}
        {activeTab === 'MAP' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Live Interactive Electrical Grid & Incident Map (Leaflet + OpenStreetMap)
                </h3>
                <p className="text-xs text-slate-500">
                  Visualizing Bengaluru Sub-Division complaints, feeder outage clusters, and streetlight assets.
                </p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded border border-emerald-300">
                OpenStreetMap Vector Tiles
              </span>
            </div>

            <InteractiveMap
              complaints={complaints}
              streetlights={streetlights}
              incidentGroups={incidentGroups}
              height="550px"
            />
          </div>
        )}

        {/* ---------------- TAB 3: USER ROLES MANAGEMENT ---------------- */}
        {activeTab === 'USERS' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">
                Configured Demonstration User Profiles & Permissions
              </h3>
              <p className="text-xs text-slate-500">
                Authorized roles spanning Consumers, Utility Officers, Linemen, and Lighting Officers
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold">User ID</th>
                    <th className="p-3 font-semibold">Full Name / Kannada</th>
                    <th className="p-3 font-semibold">Email</th>
                    <th className="p-3 font-semibold">Role</th>
                    <th className="p-3 font-semibold">Phone</th>
                    <th className="p-3 font-semibold">Ward / Locality</th>
                    <th className="p-3 font-semibold">Designation & Department</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {demoUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-[11px] font-bold text-blue-900">
                        {u.id}
                      </td>
                      <td className="p-3 font-semibold text-slate-900">
                        {u.full_name}
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        {u.email}
                      </td>
                      <td className="p-3">
                        <span className="bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded text-[11px]">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">
                        {u.phone}
                      </td>
                      <td className="p-3 text-slate-600">
                        {u.locality || u.ward || 'State HQ'}
                      </td>
                      <td className="p-3 text-slate-500">
                        {u.designation} ({u.department})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- TAB 4: AUDIT LOGS ---------------- */}
        {activeTab === 'AUDIT' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">
                State Power Distribution Operational Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                Timestamped records of every dispatch, priority override, cluster confirmation, and supervisor verification.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold">Timestamp</th>
                    <th className="p-3 font-semibold">Action</th>
                    <th className="p-3 font-semibold">Target Entity</th>
                    <th className="p-3 font-semibold">Responsible Actor</th>
                    <th className="p-3 font-semibold">Operational Audit Detail</th>
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
    </div>
  );
};
