export type Language = 'en' | 'kn';

export interface Translations {
  portalTitle: string;
  portalSubtitle: string;
  home: string;
  about: string;
  consumerServices: string;
  serviceInfo: string;
  contact: string;
  login: string;
  logout: string;
  officerPortal: string;
  registerComplaint: string;
  trackComplaint: string;
  quickTrackTitle: string;
  enterComplaintId: string;
  trackButton: string;
  heroHeading: string;
  heroSubtitle: string;
  govBadge: string;
  demoBadge: string;
  selectRole: string;
  switchRole: string;
  currentRole: string;
  
  // Roles
  roleConsumer: string;
  roleOfficer: string;
  roleFieldEngineer: string;
  roleStreetlight: string;
  roleAdmin: string;
  
  // Statuses
  statusSubmitted: string;
  statusReceived: string;
  statusReviewed: string;
  statusAssigned: string;
  statusWorkInProgress: string;
  statusResolved: string;
  statusVerified: string;

  // Categories
  catPowerOutage: string;
  catLowVoltage: string;
  catMeterIssue: string;
  catInfraFault: string;
  catBillingIssue: string;
  catOtherIssue: string;

  // Priorities
  priorityCritical: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityNormal: string;

  // Common UI
  dashboard: string;
  complaints: string;
  incidents: string;
  workOrders: string;
  streetlights: string;
  analytics: string;
  auditTrail: string;
  notifications: string;
  helplineNotice: string;
  safetyAlert: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    portalTitle: "VIDYUT SPANDAN",
    portalSubtitle: "Power Distribution Service Coordination Portal",
    home: "Home",
    about: "About Portal",
    consumerServices: "Consumer Services",
    serviceInfo: "Service Information",
    contact: "Emergency & Contact",
    login: "Portal Login",
    logout: "Sign Out",
    officerPortal: "Staff / Officer Workspace",
    registerComplaint: "Register Complaint",
    trackComplaint: "Track Complaint",
    quickTrackTitle: "Quick Grievance Tracking",
    enterComplaintId: "Enter Complaint ID (e.g. VS-2026-BLR-0101)",
    trackButton: "Search Status",
    heroHeading: "Connecting Power Services. Improving Every Neighbourhood.",
    heroSubtitle: "A proposed digital coordination platform for electricity complaints, field operations and service accountability.",
    govBadge: "Government of Karnataka Context — BESCOM Operational Framework",
    demoBadge: "DEMONSTRATION PROTOTYPE — FOR PRESIDENCY UNIVERSITY HACKATHON — NOT LIVE BESCOM INFRASTRUCTURE",
    selectRole: "Select Demonstration Role Workspace",
    switchRole: "Quick Role Switcher (Judge Demo)",
    currentRole: "Current Active Role",

    roleConsumer: "Citizen Consumer",
    roleOfficer: "BESCOM Sub-Divisional Officer",
    roleFieldEngineer: "Field Lineman / Technician Crew",
    roleStreetlight: "Streetlight Coordination Officer",
    roleAdmin: "State Operations Administrator",

    statusSubmitted: "Submitted",
    statusReceived: "Received",
    statusReviewed: "Reviewed",
    statusAssigned: "Assigned",
    statusWorkInProgress: "Work in Progress",
    statusResolved: "Resolved",
    statusVerified: "Verified & Closed",

    catPowerOutage: "Power Outage / Supply Disruption",
    catLowVoltage: "Low Voltage / Fluctuation",
    catMeterIssue: "Meter-Related Fault / Sparking",
    catInfraFault: "Electricity Infrastructure Fault (Wire/Pole/Transformer)",
    catBillingIssue: "Billing / Tariff Assessment Issue",
    catOtherIssue: "Other Electricity Service Grievance",

    priorityCritical: "Critical",
    priorityHigh: "High",
    priorityMedium: "Medium",
    priorityNormal: "Normal",

    dashboard: "Operations Dashboard",
    complaints: "Complaints Register",
    incidents: "Incident Intelligence",
    workOrders: "Field Work Orders",
    streetlights: "Streetlight Assets",
    analytics: "Operational Analytics",
    auditTrail: "System Audit Trail",
    notifications: "Official Alerts",
    helplineNotice: "BESCOM Centralized Helpline 1912 (24x7 Emergency Contact)",
    safetyAlert: "Public Safety Warning: Never touch snapped overhead wires or waterlogged transformer enclosures."
  },
  kn: {
    portalTitle: "ವಿದ್ಯುತ್ ಸ್ಪಂದನ",
    portalSubtitle: "ವಿದ್ಯುತ್ ವಿತರಣಾ ಸೇವಾ ಸಮನ್ವಯ ತಂತ್ರಾಂಶ",
    home: "ಮುಖಪುಟ",
    about: "ಪೋರ್ಟಲ್ ಪರಿಚಯ",
    consumerServices: "ಗ್ರಾಹಕ ಸೇವೆಗಳು",
    serviceInfo: "ಸೇವಾ ಮಾಹಿತಿ",
    contact: "ತುರ್ತು ಸಂಪರ್ಕ",
    login: "ಲಾಗಿನ್",
    logout: "ನಿರ್ಗಮಿಸಿ",
    officerPortal: "ಅಧಿಕಾರಿಗಳ ಕಾರ್ಯಸ್ಥಳ",
    registerComplaint: "ದೂರು ದಾಖಲಿಸಿ",
    trackComplaint: "ದೂರು ಪರಿಶೀಲಿಸಿ",
    quickTrackTitle: "ತ್ವರಿತ ದೂರು ಸ್ಥಿತಿ ಪರಿಶೀಲನೆ",
    enterComplaintId: "ದೂರು ಸಂಖ್ಯೆ ನಮೂದಿಸಿ (ಉದಾ: VS-2026-BLR-0101)",
    trackButton: "ಸ್ಥಿತಿ ಹುಡುಕಿ",
    heroHeading: "ವಿದ್ಯುತ್ ಸೇವೆಗಳ ಸಮನ್ವಯ. ಪ್ರತಿಯೊಂದು ಬಡಾವಣೆಯ ಸುಧಾರಣೆ.",
    heroSubtitle: "ವಿದ್ಯುತ್ ದೂರುಗಳು, ಕ್ಷೇತ್ರ ಕಾರ್ಯಾಚರಣೆಗಳು ಮತ್ತು ಸೇವಾ ಹೊಣೆಗಾರಿಕೆಗಾಗಿ ಉದ್ದೇಶಿತ ಡಿಜಿಟಲ್ ಸಮನ್ವಯ ವೇದಿಕೆ.",
    govBadge: "ಕರ್ನಾಟಕ ಸರ್ಕಾರ ಸಂದರ್ಭ — ಬೆಸ್ಕಾಂ ಕಾರ್ಯಾಚರಣಾ ಚೌಕಟ್ಟು",
    demoBadge: "ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಮಾದರಿ — ಪ್ರೆಸಿಡೆನ್ಸಿ ವಿಶ್ವವಿದ್ಯಾಲಯ ಹ್ಯಾಕಥಾನ್ — ನೇರ ಬೆಸ್ಕಾಂ ಜಾಲವಲ್ಲ",
    selectRole: "ಪ್ರಾಯೋಗಿಕ ಖಾತೆಯ ಕಾರ್ಯಸ್ಥಳ ಆಯ್ಕೆಮಾಡಿ",
    switchRole: "ತ್ವರಿತ ಪಾತ್ರ ಬದಲಾವಣೆ (ತೀರ್ಪುಗಾರರ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ)",
    currentRole: "ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ ಪಾತ್ರ",

    roleConsumer: "ನಾಗರಿಕ ಗ್ರಾಹಕ",
    roleOfficer: "ಬೆಸ್ಕಾಂ ಉಪ-ವಿಭಾಗೀಯ ಅಧಿಕಾರಿ",
    roleFieldEngineer: "ಕ್ಷೇತ್ರ ತಾಂತ್ರಿಕ ಸಿಬ್ಬಂದಿ / ಲೈನ್‌ಮನ್",
    roleStreetlight: "ಬೀದಿದೀಪ ಸಮನ್ವಯ ಅಧಿಕಾರಿ",
    roleAdmin: "ರಾಜ್ಯ ಕಾರ್ಯಾಚರಣಾ ಆಡಳಿತಾಧಿಕಾರಿ",

    statusSubmitted: "ಸಲ್ಲಿಸಲಾಗಿದೆ",
    statusReceived: "ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
    statusReviewed: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    statusAssigned: "ನಿಯೋಜಿಸಲಾಗಿದೆ",
    statusWorkInProgress: "ದುರಸ್ತಿ ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    statusResolved: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    statusVerified: "ದೃಢೀಕರಿಸಿ ಮುಕ್ತಾಯಗೊಳಿಸಲಾಗಿದೆ",

    catPowerOutage: "ವಿದ್ಯುತ್ ವ್ಯತ್ಯಯ / ಸರಬರಾಜು ಸ್ಥಗಿತ",
    catLowVoltage: "ಕಡಿಮೆ ವೋಲ್ಟೇಜ್ / ಏರಿಳಿತ",
    catMeterIssue: "ಮೀಟರ್ ಸಂಬಂಧಿತ ದೋಷ",
    catInfraFault: "ವಿದ್ಯುತ್ ಮೂಲಸೌಕರ್ಯ ದೋಷ (ತಂತಿ/ಕಂಬ/ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್)",
    catBillingIssue: "ಬಿಲ್ / ದರ ಲೆಕ್ಕಾಚಾರದ ಸಮಸ್ಯೆ",
    catOtherIssue: "ಇತರ ವಿದ್ಯುತ್ ಸೇವಾ ದೂರು",

    priorityCritical: "ಅತ್ಯಂತ ತುರ್ತು",
    priorityHigh: "ಹೆಚ್ಚಿನ ಆದ್ಯತೆ",
    priorityMedium: "ಮಧ್ಯಮ ಆದ್ಯತೆ",
    priorityNormal: "ಸಾಮಾನ್ಯ",

    dashboard: "ಕಾರ್ಯಾಚರಣಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    complaints: "ದೂರುಗಳ ಪಟ್ಟಿ",
    incidents: "ಘಟನಾ ಗುಪ್ತಚರ ವಿಶ್ಲೇಷಣೆ",
    workOrders: "ಕ್ಷೇತ್ರ ಕಾರ್ಯಾದೇಶಗಳು",
    streetlights: "ಬೀದಿದೀಪ ಆಸ್ತಿಗಳು",
    analytics: "ಕಾರ್ಯಾಚರಣಾ ಅಂಕಿ-ಅಂಶಗಳು",
    auditTrail: "ವ್ಯವಸ್ಥೆಯ ಆಡಿಟ್ ವಿವರ",
    notifications: "ಅಧಿಕೃತ ಸೂಚನೆಗಳು",
    helplineNotice: "ಬೆಸ್ಕಾಂ ಕೇಂದ್ರೀಕೃತ ಸಹಾಯವಾಣಿ 1912 (24x7 ತುರ್ತು ಸೇವೆ)",
    safetyAlert: "ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆ: ತುಂಡಾದ ವಿದ್ಯುತ್ ತಂತಿಗಳನ್ನು ಅಥವಾ ನೀರಿನಲ್ಲಿ ಮುಳುಗಿದ ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್‌ಗಳನ್ನು ಸ್ಪರ್ಶಿಸಬೇಡಿ."
  }
};
