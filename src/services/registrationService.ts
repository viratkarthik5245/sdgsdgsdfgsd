import { supabase } from '@/lib/supabase';
import {
  UserSubmission,
  AdminSettings,
  RegistrationFormData,
  SubmissionStatus,
  TimelineEntry,
  DEFAULT_SERVICE_PRICES,
  DEFAULT_FORM_FIELDS,
  DEFAULT_MESSAGE_TEMPLATES,
  DEFAULT_COMPANIES,
  DEFAULT_SERVICE_TYPES,
  STATUS_LABELS,
  CompanyPricing,
  ServiceType,
  ServiceTypeConfig,
} from '@/types/registration';

// Generate unique reference ID: PJ-YYYY-XXXXX
export const generateReferenceId = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `PJ-${year}-${random}`;
};

// Upload payment screenshot to Supabase Storage
export const uploadPaymentScreenshot = async (file: File, referenceId: string): Promise<string> => {
  // Try Supabase storage first
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${referenceId}-${Date.now()}.${fileExt}`;
    const filePath = `payment-screenshots/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('submissions')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from('submissions').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    // Fallback: Convert to base64 data URL for demo/offline mode
    console.warn('Storage unavailable, using local data URL');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};

// Create new submission
export const createSubmission = async (
  formData: RegistrationFormData,
  screenshotUrl: string
): Promise<UserSubmission> => {
  const referenceId = generateReferenceId();
  const now = new Date().toISOString();

  const initialTimeline: TimelineEntry[] = [
    {
      id: crypto.randomUUID(),
      action: 'Form Submitted',
      timestamp: now,
    },
    {
      id: crypto.randomUUID(),
      action: 'Payment Screenshot Uploaded',
      timestamp: now,
    },
  ];

  const submission: UserSubmission = {
    id: crypto.randomUUID(),
    referenceId,
    fullName: formData.fullName,
    phone: formData.phone,
    email: formData.email,
    collegeBatch: formData.collegeBatch,
    targetCompanyExam: formData.targetCompanyExam,
    serviceType: formData.serviceType,
    preferredDate: formData.preferredDate,
    paymentScreenshotUrl: screenshotUrl,
    status: 'pending_verification',
    timeline: initialTimeline,
    createdAt: now,
    updatedAt: now,
  };

  // Try database first
  try {
    const { data, error } = await supabase
      .from('user_submissions')
      .insert([{
        reference_id: submission.referenceId,
        full_name: submission.fullName,
        phone: submission.phone,
        email: submission.email,
        college_batch: submission.collegeBatch,
        target_company_exam: submission.targetCompanyExam,
        service_type: submission.serviceType,
        preferred_date: submission.preferredDate,
        payment_screenshot_url: submission.paymentScreenshotUrl,
        status: submission.status,
        timeline: submission.timeline,
        created_at: submission.createdAt,
        updated_at: submission.updatedAt,
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapDbToSubmission(data);
  } catch (error) {
    // Fallback: Save to localStorage
    console.warn('Database unavailable, saving to localStorage');
    const localSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    localSubmissions.unshift(submission);
    localStorage.setItem('submissions', JSON.stringify(localSubmissions));
    return submission;
  }
};

// Get all submissions with optional filters
export const getSubmissions = async (filters?: {
  status?: SubmissionStatus;
  serviceType?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<UserSubmission[]> => {
  // Get local submissions first
  const localSubmissions: UserSubmission[] = JSON.parse(localStorage.getItem('submissions') || '[]');
  
  let allSubmissions: UserSubmission[] = [...localSubmissions];

  // Try to get from database
  try {
    let query = supabase
      .from('user_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.serviceType) {
      query = query.eq('service_type', filters.serviceType);
    }
    if (filters?.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,reference_id.ilike.%${filters.search}%,target_company_exam.ilike.%${filters.search}%`);
    }
    if (filters?.dateFrom) {
      query = query.gte('preferred_date', filters.dateFrom);
    }
    if (filters?.dateTo) {
      query = query.lte('preferred_date', filters.dateTo);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      const dbSubmissions = data.map(mapDbToSubmission);
      // Merge: local submissions + db submissions (avoid duplicates by referenceId)
      const dbIds = new Set(dbSubmissions.map(s => s.referenceId));
      const uniqueLocal = localSubmissions.filter(s => !dbIds.has(s.referenceId));
      allSubmissions = [...uniqueLocal, ...dbSubmissions];
    }
  } catch (error) {
    console.warn('Database error, using local data:', error);
  }

  // If no submissions at all, return demo data
  if (allSubmissions.length === 0) {
    return DEMO_SUBMISSIONS;
  }

  // Apply filters to local submissions
  return allSubmissions.filter(sub => {
    if (filters?.status && sub.status !== filters.status) return false;
    if (filters?.serviceType && sub.serviceType !== filters.serviceType) return false;
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      if (!sub.fullName.toLowerCase().includes(q) && 
          !sub.referenceId.toLowerCase().includes(q) &&
          !sub.targetCompanyExam.toLowerCase().includes(q)) return false;
    }
    if (filters?.dateFrom && sub.preferredDate < filters.dateFrom) return false;
    if (filters?.dateTo && sub.preferredDate > filters.dateTo) return false;
    return true;
  });
};

// Get single submission by ID
export const getSubmissionById = async (id: string): Promise<UserSubmission | null> => {
  const { data, error } = await supabase
    .from('user_submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch submission: ${error.message}`);
  }

  return mapDbToSubmission(data);
};

// Update submission status
export const updateSubmissionStatus = async (
  id: string,
  status: SubmissionStatus,
  notes?: string,
  performedBy?: string
): Promise<UserSubmission> => {
  const newTimelineEntry: TimelineEntry = {
    id: crypto.randomUUID(),
    action: `Status changed to ${STATUS_LABELS[status]}`,
    timestamp: new Date().toISOString(),
    notes,
    performedBy,
  };

  // Try localStorage first - check by both id and referenceId
  const localSubmissions: UserSubmission[] = JSON.parse(localStorage.getItem('submissions') || '[]');
  const localIndex = localSubmissions.findIndex(s => s.id === id || s.referenceId === id);
  
  if (localIndex !== -1) {
    // Update in localStorage
    const submission = localSubmissions[localIndex];
    submission.status = status;
    submission.timeline = [...submission.timeline, newTimelineEntry];
    submission.adminNotes = notes || submission.adminNotes;
    submission.updatedAt = new Date().toISOString();
    localSubmissions[localIndex] = submission;
    localStorage.setItem('submissions', JSON.stringify(localSubmissions));
    return submission;
  }

  // Check if it's a demo submission
  const demoIndex = DEMO_SUBMISSIONS.findIndex(s => s.id === id || s.referenceId === id);
  if (demoIndex !== -1) {
    // For demo submissions, save the updated version to localStorage
    const demoSubmission = { ...DEMO_SUBMISSIONS[demoIndex] };
    demoSubmission.status = status;
    demoSubmission.timeline = [...demoSubmission.timeline, newTimelineEntry];
    demoSubmission.adminNotes = notes || demoSubmission.adminNotes;
    demoSubmission.updatedAt = new Date().toISOString();
    
    // Save to localStorage so changes persist
    const updatedLocal = [...localSubmissions, demoSubmission];
    localStorage.setItem('submissions', JSON.stringify(updatedLocal));
    
    // Also update the demo array in memory
    DEMO_SUBMISSIONS[demoIndex] = demoSubmission;
    return demoSubmission;
  }

  // Try database
  try {
    const current = await getSubmissionById(id);
    if (!current) {
      throw new Error('Submission not found');
    }

    const updatedTimeline = [...current.timeline, newTimelineEntry];

    const { data, error } = await supabase
      .from('user_submissions')
      .update({
        status,
        timeline: updatedTimeline,
        admin_notes: notes || current.adminNotes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapDbToSubmission(data);
  } catch (error) {
    throw new Error('Failed to update submission');
  }
};

// Add timeline entry
export const addTimelineEntry = async (
  id: string,
  action: string,
  notes?: string,
  performedBy?: string
): Promise<UserSubmission> => {
  const current = await getSubmissionById(id);
  if (!current) {
    throw new Error('Submission not found');
  }

  const newEntry: TimelineEntry = {
    id: crypto.randomUUID(),
    action,
    timestamp: new Date().toISOString(),
    notes,
    performedBy,
  };

  const updatedTimeline = [...current.timeline, newEntry];

  const { data, error } = await supabase
    .from('user_submissions')
    .update({
      timeline: updatedTimeline,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add timeline entry: ${error.message}`);
  }

  return mapDbToSubmission(data);
};

// Admin Settings
export const getAdminSettings = async (): Promise<AdminSettings> => {
  // Try to get from localStorage first (for demo/offline mode)
  const localSettings = localStorage.getItem('adminSettings');
  if (localSettings) {
    try {
      return JSON.parse(localSettings);
    } catch (e) {
      // Invalid JSON, continue to database
    }
  }

  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .single();

    if (error) {
      // Return defaults if no settings exist or table doesn't exist
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return getDefaultSettings();
      }
      console.warn('Database error, using defaults:', error.message);
      return getDefaultSettings();
    }

    return mapDbToSettings(data);
  } catch (error) {
    console.warn('Failed to fetch from database, using defaults');
    return getDefaultSettings();
  }
};

export const updateAdminSettings = async (settings: Partial<AdminSettings>): Promise<AdminSettings> => {
  const current = await getAdminSettings();
  
  const updatedSettings: AdminSettings = {
    id: current.id || '1',
    upiId: settings.upiId ?? current.upiId,
    qrCodeUrl: settings.qrCodeUrl ?? current.qrCodeUrl,
    whatsappNumber: settings.whatsappNumber ?? current.whatsappNumber,
    serviceTypes: settings.serviceTypes ?? current.serviceTypes,
    companies: settings.companies ?? current.companies,
    formFields: settings.formFields ?? current.formFields,
    messageTemplates: settings.messageTemplates ?? current.messageTemplates,
    updatedAt: new Date().toISOString(),
  };

  // Always save to localStorage as backup
  localStorage.setItem('adminSettings', JSON.stringify(updatedSettings));

  // Try to save to database
  try {
    const updateData = {
      upi_id: updatedSettings.upiId,
      qr_code_url: updatedSettings.qrCodeUrl,
      whatsapp_number: updatedSettings.whatsappNumber,
      service_types: updatedSettings.serviceTypes,
      companies: updatedSettings.companies,
      form_fields: updatedSettings.formFields,
      message_templates: updatedSettings.messageTemplates,
      updated_at: updatedSettings.updatedAt,
    };

    const { data, error } = await supabase
      .from('admin_settings')
      .upsert([{ id: updatedSettings.id, ...updateData }])
      .select()
      .single();

    if (error) {
      console.warn('Database save failed, saved to localStorage:', error.message);
      // Return the locally saved settings
      return updatedSettings;
    }

    return mapDbToSettings(data);
  } catch (error) {
    console.warn('Database unavailable, saved to localStorage');
    return updatedSettings;
  }
};

// Upload QR code image
export const uploadQRCode = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `qr-code-${Date.now()}.${fileExt}`;
  const filePath = `settings/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('submissions')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw new Error(`Failed to upload QR code: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from('submissions').getPublicUrl(filePath);
  return data.publicUrl;
};

// Helper functions
const mapDbToSubmission = (data: any): UserSubmission => ({
  id: data.id,
  referenceId: data.reference_id,
  fullName: data.full_name,
  phone: data.phone,
  email: data.email,
  collegeBatch: data.college_batch,
  targetCompanyExam: data.target_company_exam,
  serviceType: data.service_type,
  preferredDate: data.preferred_date,
  paymentScreenshotUrl: data.payment_screenshot_url,
  status: data.status,
  timeline: data.timeline || [],
  adminNotes: data.admin_notes,
  assignedTo: data.assigned_to,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

const mapDbToSettings = (data: any): AdminSettings => ({
  id: data.id,
  upiId: data.upi_id,
  qrCodeUrl: data.qr_code_url,
  whatsappNumber: data.whatsapp_number,
  serviceTypes: data.service_types || DEFAULT_SERVICE_TYPES,
  companies: data.companies || DEFAULT_COMPANIES,
  formFields: data.form_fields,
  messageTemplates: data.message_templates,
  updatedAt: data.updated_at,
});

const getDefaultSettings = (): AdminSettings => ({
  id: '1',
  upiId: 'primojobs@upi',
  qrCodeUrl: 'https://img.sanishtech.com/u/6629801cde5d6b03f4704e221bd65bbc.jpg',
  whatsappNumber: '+919876543210',
  serviceTypes: DEFAULT_SERVICE_TYPES,
  companies: DEFAULT_COMPANIES,
  formFields: DEFAULT_FORM_FIELDS,
  messageTemplates: DEFAULT_MESSAGE_TEMPLATES,
  updatedAt: new Date().toISOString(),
});

// Demo/Sample submissions for testing (mutable for status updates)
export let DEMO_SUBMISSIONS: UserSubmission[] = [
  {
    id: 'demo-1',
    referenceId: 'PJ-2026-00001',
    fullName: 'Rahul Sharma',
    phone: '+919876543210',
    email: 'rahul.sharma@email.com',
    collegeBatch: 'VIT Vellore, 2025 Batch',
    targetCompanyExam: 'Accenture',
    serviceType: 'exam_slot',
    preferredDate: '2026-01-15',
    paymentScreenshotUrl: 'https://placehold.co/400x600/0a1628/00d9b8?text=Payment+Screenshot',
    status: 'pending_verification',
    timeline: [
      { id: '1', action: 'Form Submitted', timestamp: '2026-01-07T10:30:00Z' },
      { id: '2', action: 'Payment Screenshot Uploaded', timestamp: '2026-01-07T10:32:00Z' },
    ],
    createdAt: '2026-01-07T10:30:00Z',
    updatedAt: '2026-01-07T10:32:00Z',
  },
  {
    id: 'demo-2',
    referenceId: 'PJ-2026-00002',
    fullName: 'Priya Patel',
    phone: '+919988776655',
    email: 'priya.patel@email.com',
    collegeBatch: 'SRM Chennai, 2025 Batch',
    targetCompanyExam: 'TCS NQT',
    serviceType: 'full_placement_support',
    preferredDate: '2026-01-20',
    paymentScreenshotUrl: 'https://placehold.co/400x600/0a1628/00d9b8?text=Payment+Screenshot',
    status: 'payment_verified',
    timeline: [
      { id: '1', action: 'Form Submitted', timestamp: '2026-01-05T14:00:00Z' },
      { id: '2', action: 'Payment Screenshot Uploaded', timestamp: '2026-01-05T14:05:00Z' },
      { id: '3', action: 'Status changed to payment_verified', timestamp: '2026-01-05T16:00:00Z', performedBy: 'Admin' },
    ],
    createdAt: '2026-01-05T14:00:00Z',
    updatedAt: '2026-01-05T16:00:00Z',
  },
  {
    id: 'demo-3',
    referenceId: 'PJ-2026-00003',
    fullName: 'Amit Kumar',
    phone: '+919123456789',
    email: 'amit.kumar@email.com',
    collegeBatch: 'BITS Pilani, 2024 Batch',
    targetCompanyExam: 'Infosys',
    serviceType: 'interview_support',
    preferredDate: '2026-01-12',
    paymentScreenshotUrl: 'https://placehold.co/400x600/0a1628/00d9b8?text=Payment+Screenshot',
    status: 'assigned_support',
    timeline: [
      { id: '1', action: 'Form Submitted', timestamp: '2026-01-03T09:00:00Z' },
      { id: '2', action: 'Payment Screenshot Uploaded', timestamp: '2026-01-03T09:10:00Z' },
      { id: '3', action: 'Status changed to payment_verified', timestamp: '2026-01-03T11:00:00Z', performedBy: 'Admin' },
      { id: '4', action: 'Status changed to assigned_support', timestamp: '2026-01-04T10:00:00Z', performedBy: 'Admin', notes: 'Assigned to Mentor Ravi' },
    ],
    createdAt: '2026-01-03T09:00:00Z',
    updatedAt: '2026-01-04T10:00:00Z',
  },
  {
    id: 'demo-4',
    referenceId: 'PJ-2026-00004',
    fullName: 'Sneha Reddy',
    phone: '+918877665544',
    email: 'sneha.reddy@email.com',
    collegeBatch: 'JNTU Hyderabad, 2025 Batch',
    targetCompanyExam: 'Wipro',
    serviceType: 'communication_mentorship',
    preferredDate: '2026-01-25',
    paymentScreenshotUrl: 'https://placehold.co/400x600/0a1628/00d9b8?text=Payment+Screenshot',
    status: 'slot_confirmed',
    timeline: [
      { id: '1', action: 'Form Submitted', timestamp: '2026-01-02T11:00:00Z' },
      { id: '2', action: 'Payment Screenshot Uploaded', timestamp: '2026-01-02T11:15:00Z' },
      { id: '3', action: 'Status changed to payment_verified', timestamp: '2026-01-02T14:00:00Z', performedBy: 'Admin' },
      { id: '4', action: 'Status changed to slot_confirmed', timestamp: '2026-01-03T09:00:00Z', performedBy: 'Admin', notes: 'Slot confirmed for Jan 25' },
    ],
    createdAt: '2026-01-02T11:00:00Z',
    updatedAt: '2026-01-03T09:00:00Z',
  },
  {
    id: 'demo-5',
    referenceId: 'PJ-2026-00005',
    fullName: 'Vikram Singh',
    phone: '+917766554433',
    email: 'vikram.singh@email.com',
    collegeBatch: 'NIT Trichy, 2024 Batch',
    targetCompanyExam: 'Cognizant',
    serviceType: 'exam_slot',
    preferredDate: '2026-01-10',
    paymentScreenshotUrl: 'https://placehold.co/400x600/0a1628/00d9b8?text=Payment+Screenshot',
    status: 'completed',
    timeline: [
      { id: '1', action: 'Form Submitted', timestamp: '2025-12-28T10:00:00Z' },
      { id: '2', action: 'Payment Screenshot Uploaded', timestamp: '2025-12-28T10:10:00Z' },
      { id: '3', action: 'Status changed to payment_verified', timestamp: '2025-12-28T12:00:00Z', performedBy: 'Admin' },
      { id: '4', action: 'Status changed to slot_confirmed', timestamp: '2025-12-29T09:00:00Z', performedBy: 'Admin' },
      { id: '5', action: 'Status changed to completed', timestamp: '2026-01-06T18:00:00Z', performedBy: 'Admin', notes: 'Exam completed successfully' },
    ],
    createdAt: '2025-12-28T10:00:00Z',
    updatedAt: '2026-01-06T18:00:00Z',
  },
];
