// ── Auth ─────────────────────────────────────────────────────────────────────
export type UserRole = "Admin" | "Team Leader" | "Tele Agent" | "Accounts Manager";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "Active" | "Inactive";
  designation?: string;
  phone?: string;
  joinedDate?: string;
  avatar: string;
  avatarBg: string;
  modules: Record<string, boolean>;
  features: Record<string, boolean>;
}

// ── Lead ─────────────────────────────────────────────────────────────────────
export type LeadStatus = "Hot" | "Warm" | "Cool";
export type LeadStage =
  | "Create Lead"
  | "Pending Documents"
  | "Document Verification"
  | "Lender Selection"
  | "Approved"
  | "Reject";

export interface Lead {
  id: string;
  caseId: string;
  fullName: string;
  title?: string;
  dob?: string;
  companyName?: string;
  companyHouseNumber?: string;
  businessAnnualTurnover?: string;
  jobTitle?: string;
  industry?: string;
  emailAddress?: string;
  phoneNumber?: string;
  preferredContact?: string;
  homeOwner?: string;
  timeAtCurrentAddress?: string;
  residentialAddress?: string;
  previousAddress?: string;
  loanAmount?: string;
  loanPurpose?: string;
  existingLoan?: string;
  overdraftFacility?: string;
  companyBank?: string;
  leadSource?: string;
  fundingTimeline?: string;
  creditConsent?: string;
  previousAlphaFundingLoan?: string;
  stage: LeadStage;
  status: LeadStatus;
  agent?: string;
  lender?: string;
  payoutStatus?: boolean;
  additionalComments?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Task ─────────────────────────────────────────────────────────────────────
export type TaskStatus = "To Do" | "In Progress" | "Complete" | "Overdue";
export type TaskType =
  | "Call"
  | "Meeting"
  | "Follow-up"
  | "Email"
  | "Document"
  | "Research"
  | "Outbound";

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  taskStatus: TaskStatus;
  leadStatus: LeadStatus;
  assignee: string;
  client?: string;
  phone?: string;
  email?: string;
  date: string;
  time?: string;
  notes?: string;
  leadId?: string;
  createdAt: string;
}

// ── Lender ───────────────────────────────────────────────────────────────────
export interface Lender {
  id: string;
  name: string;
  tradingName?: string;
  type: "Bank" | "Non-Bank" | "Credit Union";
  status: "Active" | "Inactive";
  tradingYears?: number;
  email?: string;
  accountManager?: string;
  managerEmail?: string;
  tradingAddress?: string;
  registeredAddress?: string;
  categories: string[];
  notes?: string;
  promotions: Promotion[];
  createdAt: string;
}

export interface Promotion {
  id: string;
  name: string;
  offer: string;
  expiryDate?: string;
  document?: string;
  lenderId: string;
}

// ── Document ─────────────────────────────────────────────────────────────────
export type DocCategory =
  | "Knowledge Base"
  | "Guides"
  | "FAQs"
  | "Products"
  | "Policies"
  | "Scripts";

export interface Document {
  id: string;
  title: string;
  category: DocCategory | string;
  status: "New" | "Updated" | "Archived";
  version: string;
  filename: string;
  fileType: string;
  fileSize?: string;
  description?: string;
  uploadedAt: string;
  uploadedBy?: string;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coolLeads: number;
  totalTasks: number;
  overdueTasks: number;
  activeLenders: number;
  pendingPayouts: number;
  conversionRate: number;
}

// ── Pagination ────────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
