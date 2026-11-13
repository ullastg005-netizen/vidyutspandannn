export type UserRole = 
  | 'CONSUMER'
  | 'BESCOM_OFFICER'
  | 'FIELD_ENGINEER'
  | 'STREETLIGHT_OFFICER'
  | 'ADMINISTRATOR';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone: string;
  ward?: string;
  locality?: string;
  designation?: string;
  department?: string;
  created_at: string;
}

export type ComplaintCategory = 
  | 'POWER_OUTAGE'
  | 'LOW_VOLTAGE'
  | 'METER_RELATED_ISSUE'
  | 'ELECTRICITY_INFRASTRUCTURE_FAULT'
  | 'BILLING_RELATED_ISSUE'
  | 'OTHER_SERVICE_ISSUE';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'NORMAL';

export type ComplaintStatus = 
  | 'SUBMITTED'
  | 'RECEIVED'
  | 'REVIEWED'
  | 'ASSIGNED'
  | 'WORK_IN_PROGRESS'
  | 'RESOLVED'
  | 'VERIFIED';

export interface Complaint {
  id: string;
  consumer_id: string;
  consumer_name: string;
  consumer_phone: string;
  category: ComplaintCategory;
  locality: string;
  ward: string;
  landmark: string;
  description: string;
  photo_url?: string;
  lat: number;
  lng: number;
  priority: PriorityLevel;
  priority_reason?: string;
  is_priority_overridden?: number;
  status: ComplaintStatus;
  assigned_team_id?: string;
  incident_group_id?: string;
  department_id: string;
  created_at: string;
  updated_at: string;
}

export interface StatusHistoryItem {
  id: number;
  complaint_id: string;
  status: ComplaintStatus;
  notes: string;
  updated_by_role: string;
  updated_by_name: string;
  timestamp: string;
}

export interface IncidentGroup {
  id: string;
  title: string;
  locality: string;
  ward: string;
  category: string;
  report_count: number;
  status: 'SUGGESTED' | 'CONFIRMED' | 'REJECTED';
  suggested_reason: string;
  lat?: number;
  lng?: number;
  confirmed_by?: string;
  confirmed_at?: string;
  created_at: string;
  complaint_ids?: string[];
}

export interface SuggestedIncident {
  suggested_id: string;
  title: string;
  locality: string;
  ward: string;
  category: string;
  report_count: number;
  complaint_ids: string[];
  lat: number;
  lng: number;
  status: 'SUGGESTED';
  suggested_reason: string;
  requires_human_approval: boolean;
}

export interface FieldTeam {
  id: string;
  team_name: string;
  lead_name: string;
  contact_number: string;
  ward_coverage: string;
  status: 'AVAILABLE' | 'DISPATCHED' | 'OFF_DUTY';
  active_work_order_id?: string;
}

export type WorkOrderStatus = 
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'REACHED_LOCATION'
  | 'INSPECTED'
  | 'REPAIR_IN_PROGRESS'
  | 'WORK_COMPLETED'
  | 'AWAITING_VERIFICATION'
  | 'VERIFIED_CLOSED'
  | 'REJECTED';

export interface WorkOrder {
  id: string;
  complaint_id: string;
  team_id: string;
  status: WorkOrderStatus;
  inspection_notes?: string;
  completion_notes?: string;
  completion_evidence_url?: string;
  estimated_restoration_time?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  category?: string;
  locality?: string;
  ward?: string;
  landmark?: string;
  description?: string;
  priority?: PriorityLevel;
  team_name?: string;
  consumer_name?: string;
}

export interface VerificationRecord {
  id: string;
  work_order_id: string;
  complaint_id: string;
  supervisor_id: string;
  supervisor_name: string;
  status: 'APPROVED' | 'REJECTED';
  remarks: string;
  verified_at: string;
}

export interface StreetlightAsset {
  id: string;
  pole_number: string;
  locality: string;
  ward: string;
  lat: number;
  lng: number;
  lamp_type: string;
  status: 'WORKING' | 'FAULTY' | 'MAINTENANCE';
  responsible_authority: 'BBMP' | 'BESCOM' | 'CONTRACTOR';
  contractor_name?: string;
  last_inspected?: string;
}

export interface StreetlightFault {
  id: string;
  asset_id: string;
  reported_by: string;
  contact_number: string;
  description: string;
  status: string;
  repeat_fault_count: number;
  responsible_authority: string;
  contractor_name?: string;
  pole_number?: string;
  locality?: string;
  ward?: string;
  created_at: string;
  resolved_at?: string;
}

export interface Ward {
  id: string;
  ward_number: number;
  name: string;
  name_kn: string;
  sub_division: string;
  division: string;
  zone: string;
}

export interface Locality {
  id: string;
  name: string;
  name_kn: string;
  ward_id: string;
  pincode: string;
  lat: number;
  lng: number;
}

export interface AuditLog {
  id: number;
  action: string;
  entity_type: string;
  entity_id: string;
  performed_by_id: string;
  performed_by_name: string;
  role: string;
  details: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  user_id?: string;
  role: string;
  title: string;
  message: string;
  complaint_id?: string;
  is_read: number;
  created_at: string;
}
