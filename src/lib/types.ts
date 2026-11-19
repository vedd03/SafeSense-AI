export type Role = 'employee' | 'safety_officer' | 'manager';

export type HazardCategory =
  | 'Slip/Fall'
  | 'Electrical'
  | 'Fire'
  | 'Chemical'
  | 'Mechanical'
  | 'PPE'
  | 'Ergonomic'
  | 'Other';

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ReportStatus = 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved' | 'Closed';

export interface Incident {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  hazardType: HazardCategory;
  severity: Severity;
  dateTime: string;
  anonymous: boolean;
  reporterName?: string;
  hasImage: boolean;
  hasVoice: boolean;
  status: ReportStatus;
  aiAnalysis?: AIAnalysis;
  createdAt: string;
}

export interface RootCause {
  cause: string;
  confidence: number;
}

export interface AIAnalysis {
  detectedHazard: string;
  hazardCategory: HazardCategory;
  severity: Severity;
  probability: number;
  riskScore: number;
  riskLevel: RiskLevel;
  priority: Priority;
  rootCauses: RootCause[];
  correctiveAction: string;
  preventiveAction: string;
}

export type CAPAStatus = 'Open' | 'In Progress' | 'Pending Review' | 'Completed' | 'Overdue';

export interface CAPA {
  id: string;
  incidentId: string;
  incidentTitle: string;
  type: 'Corrective' | 'Preventive';
  description: string;
  assignedTo: string;
  dueDate: string;
  status: CAPAStatus;
  createdAt: string;
  completedAt?: string;
}

export type AlertType = 'critical' | 'warning' | 'info' | 'maintenance';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  department: string;
  dateTime: string;
  acknowledged: boolean;
}
