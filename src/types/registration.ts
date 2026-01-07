// Registration and Admin System Types

export interface ServiceTypeConfig {
  id: string;
  key: string;
  label: string;
  enabled: boolean;
}

export type SubmissionStatus = 
  | 'pending_verification'
  | 'payment_verified'
  | 'assigned_support'
  | 'slot_confirmed'
  | 'interview_scheduled'
  | 'completed'
  | 'dropped'
  | 'refund';

export interface CompanyPricing {
  id: string;
  companyName: string;
  prices: Record<string, number>; // key is service type key
  enabled: boolean;
}

export interface TimelineEntry {
  id: string;
  action: string;
  timestamp: string;
  notes?: string;
  performedBy?: string;
}

export interface UserSubmission {
  id: string;
  referenceId: string;
  fullName: string;
  phone: string;
  email: string;
  collegeBatch: string;
  targetCompanyExam: string;
  serviceType: string;
  preferredDate: string;
  paymentScreenshotUrl: string;
  status: SubmissionStatus;
  timeline: TimelineEntry[];
  adminNotes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationFormData {
  fullName: string;
  phone: string;
  email: string;
  collegeBatch: string;
  targetCompanyExam: string;
  serviceType: string;
  preferredDate: string;
}

export interface AdminSettings {
  id: string;
  upiId: string;
  qrCodeUrl: string;
  whatsappNumber: string;
  serviceTypes: ServiceTypeConfig[];
  companies: CompanyPricing[];
  formFields: FormFieldConfig[];
  messageTemplates: MessageTemplate[];
  updatedAt: string;
}

export interface FormFieldConfig {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'date' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[]; // For select type
  enabled: boolean;
  order: number;
}

export interface MessageTemplate {
  id: string;
  name: string;
  template: string;
  triggerStatus?: SubmissionStatus;
}

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  exam_slot: 'Exam Slot',
  interview_support: 'Interview Support',
  full_placement_support: 'Full Placement Support',
  communication_mentorship: 'Communication / Mentorship',
};

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending_verification: 'Pending Verification',
  payment_verified: 'Payment Verified',
  assigned_support: 'Assigned Support',
  slot_confirmed: 'Slot Confirmed',
  interview_scheduled: 'Interview Scheduled',
  completed: 'Completed',
  dropped: 'Dropped',
  refund: 'Refund',
};

export const STATUS_COLORS: Record<SubmissionStatus, string> = {
  pending_verification: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  payment_verified: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  assigned_support: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  slot_confirmed: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  interview_scheduled: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  dropped: 'bg-red-500/20 text-red-400 border-red-500/30',
  refund: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

export const DEFAULT_SERVICE_TYPES: ServiceTypeConfig[] = [
  { id: '1', key: 'exam_slot', label: 'Exam Slot', enabled: true },
  { id: '2', key: 'interview_support', label: 'Interview Support', enabled: true },
  { id: '3', key: 'full_placement_support', label: 'Full Placement Support', enabled: true },
  { id: '4', key: 'communication_mentorship', label: 'Communication / Mentorship', enabled: true },
];

// Legacy - for backward compatibility
export type ServiceType = string;

export const DEFAULT_SERVICE_PRICES: Record<string, number> = {
  exam_slot: 999,
  interview_support: 1999,
  full_placement_support: 4999,
  communication_mentorship: 1499,
};

export const DEFAULT_COMPANIES: CompanyPricing[] = [
  {
    id: '1',
    companyName: 'Accenture',
    prices: { exam_slot: 2000, interview_support: 5000, full_placement_support: 8000, communication_mentorship: 3000 },
    enabled: true,
  },
  {
    id: '2',
    companyName: 'TCS',
    prices: { exam_slot: 1500, interview_support: 4000, full_placement_support: 7000, communication_mentorship: 2500 },
    enabled: true,
  },
  {
    id: '3',
    companyName: 'Infosys',
    prices: { exam_slot: 1800, interview_support: 4500, full_placement_support: 7500, communication_mentorship: 2800 },
    enabled: true,
  },
  {
    id: '4',
    companyName: 'Wipro',
    prices: { exam_slot: 1500, interview_support: 4000, full_placement_support: 6500, communication_mentorship: 2500 },
    enabled: true,
  },
  {
    id: '5',
    companyName: 'Cognizant',
    prices: { exam_slot: 1800, interview_support: 4500, full_placement_support: 7500, communication_mentorship: 2800 },
    enabled: true,
  },
  {
    id: '6',
    companyName: 'Capgemini',
    prices: { exam_slot: 2000, interview_support: 5000, full_placement_support: 8000, communication_mentorship: 3000 },
    enabled: true,
  },
];

export const DEFAULT_FORM_FIELDS: FormFieldConfig[] = [
  { id: '1', name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name', enabled: true, order: 1 },
  { id: '2', name: 'phone', label: 'Phone Number (WhatsApp)', type: 'tel', required: true, placeholder: '+91 XXXXXXXXXX', enabled: true, order: 2 },
  { id: '3', name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com', enabled: true, order: 3 },
  { id: '4', name: 'collegeBatch', label: 'College / Batch', type: 'text', required: true, placeholder: 'e.g., ABC College, 2024 Batch', enabled: true, order: 4 },
  { id: '5', name: 'targetCompanyExam', label: 'Target Company / Exam', type: 'text', required: true, placeholder: 'e.g., Accenture, TCS NQT', enabled: true, order: 5 },
  { id: '6', name: 'serviceType', label: 'Service Type', type: 'select', required: true, options: Object.keys(SERVICE_TYPE_LABELS), enabled: true, order: 6 },
  { id: '7', name: 'preferredDate', label: 'Preferred Exam Date / Timeline', type: 'date', required: true, enabled: true, order: 7 },
];

export const DEFAULT_MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: '1',
    name: 'Payment Verified',
    template: 'Hi {{fullName}}, your payment is verified! ✅\n\nService: {{serviceType}}\nTarget: {{targetCompanyExam}}\nReference ID: {{referenceId}}\n\nOur team will contact you before {{preferredDate}}.',
    triggerStatus: 'payment_verified',
  },
  {
    id: '2',
    name: 'Slot Confirmed',
    template: 'Hi {{fullName}}, your exam slot has been confirmed! 🎯\n\nCompany: {{targetCompanyExam}}\nDate: {{preferredDate}}\nReference ID: {{referenceId}}\n\nAll the best!',
    triggerStatus: 'slot_confirmed',
  },
  {
    id: '3',
    name: 'Support Assigned',
    template: 'Hi {{fullName}}, a support executive has been assigned to you! 👨‍💼\n\nService: {{serviceType}}\nReference ID: {{referenceId}}\n\nThey will reach out to you shortly.',
    triggerStatus: 'assigned_support',
  },
];
