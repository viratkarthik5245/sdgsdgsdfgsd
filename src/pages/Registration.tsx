import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  RegistrationFormData, 
  AdminSettings, 
  SERVICE_TYPE_LABELS,
  ServiceType,
  CompanyPricing,
  ServiceTypeConfig,
} from '@/types/registration';
import { getAdminSettings, createSubmission, uploadPaymentScreenshot } from '@/services/registrationService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { 
  User, Phone, Mail, GraduationCap, Building2, Calendar,
  ChevronRight, ChevronLeft, Check, Upload, Copy, MessageCircle,
  Loader2, FileCheck, AlertCircle
} from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email'),
  collegeBatch: z.string().min(2, 'Enter your college/batch'),
  targetCompanyExam: z.string().min(1, 'Select a company'),
  serviceType: z.string().min(1, 'Select a service'),
  preferredDate: z.string().min(1, 'Select preferred date'),
});

type FormData = z.infer<typeof formSchema>;

type Step = 'form' | 'review' | 'payment' | 'confirmation';

export const Registration = () => {
  const [step, setStep] = useState<Step>('form');
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [referenceId, setReferenceId] = useState<string>('');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyPricing | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      collegeBatch: '',
      targetCompanyExam: '',
      serviceType: 'exam_slot',
      preferredDate: '',
    },
  });

  // Watch for company and service changes to update price
  const watchCompany = form.watch('targetCompanyExam');
  const watchService = form.watch('serviceType');

  useEffect(() => {
    if (settings && watchCompany) {
      const company = settings.companies?.find(c => c.companyName === watchCompany && c.enabled);
      setSelectedCompany(company || null);
    }
  }, [watchCompany, settings]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getAdminSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load form settings. Please refresh.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setStep('review');
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!screenshot || !formData) {
      toast({
        title: 'Screenshot Required',
        description: 'Please upload your payment screenshot.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      // Upload screenshot and create submission
      const screenshotUrl = await uploadPaymentScreenshot(screenshot, `temp-${Date.now()}`);
      const submission = await createSubmission(formData as RegistrationFormData, screenshotUrl);
      setReferenceId(submission.referenceId);
      setStep('confirmation');
    } catch (error) {
      console.error('Submission failed:', error);
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Text copied to clipboard.',
    });
  };

  const getWhatsAppMessage = () => {
    if (!formData || !settings) return '';
    return `Hi, I have completed my payment for PrimoBoost services.

Reference ID: ${referenceId}
Name: ${formData.fullName}
Service: ${SERVICE_TYPE_LABELS[formData.serviceType]}
Target: ${formData.targetCompanyExam}

Please verify my payment.`;
  };

  const openWhatsApp = () => {
    if (!settings) return;
    const message = encodeURIComponent(getWhatsAppMessage());
    const phone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const getPrice = () => {
    if (!selectedCompany || !formData) return 0;
    return selectedCompany.prices[formData.serviceType] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00d9b8] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-40 left-20 w-96 h-96 bg-[#00d9b8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 right-20 w-96 h-96 bg-[#1affce]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['form', 'review', 'payment', 'confirmation'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step === s 
                  ? 'bg-[#00d9b8] text-[#0a1628]' 
                  : (['form', 'review', 'payment', 'confirmation'].indexOf(step) > i)
                    ? 'bg-[#00d9b8]/30 text-[#00d9b8]'
                    : 'bg-white/10 text-[#6b7a8f]'
              }`}>
                {(['form', 'review', 'payment', 'confirmation'].indexOf(step) > i) ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < 3 && <div className={`w-8 sm:w-12 h-0.5 ${
                (['form', 'review', 'payment', 'confirmation'].indexOf(step) > i) ? 'bg-[#00d9b8]/50' : 'bg-white/10'
              }`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Registration Form */}
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-6 sm:p-8 rounded-2xl"
            >
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                Register for Services
              </h1>
              <p className="text-[#b8c5d6] mb-6">Fill in your details to get started</p>

              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
                <div>
                  <Label className="text-[#b8c5d6] flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" /> Full Name
                  </Label>
                  <Input
                    {...form.register('fullName')}
                    placeholder="Enter your full name"
                    className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white"
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-[#b8c5d6] flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4" /> Phone Number (WhatsApp)
                  </Label>
                  <Input
                    {...form.register('phone')}
                    placeholder="+91 XXXXXXXXXX"
                    className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-[#b8c5d6] flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" /> Email
                  </Label>
                  <Input
                    {...form.register('email')}
                    type="email"
                    placeholder="your@email.com"
                    className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-[#b8c5d6] flex items-center gap-2 mb-2">
                    <GraduationCap className="w-4 h-4" /> College / Batch
                  </Label>
                  <Input
                    {...form.register('collegeBatch')}
                    placeholder="e.g., ABC College, 2024 Batch"
                    className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white"
                  />
                  {form.formState.errors.collegeBatch && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.collegeBatch.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-[#b8c5d6] flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4" /> Target Company
                  </Label>
                  <Select
                    value={form.watch('targetCompanyExam')}
                    onValueChange={(value) => form.setValue('targetCompanyExam', value)}
                  >
                    <SelectTrigger className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f1d32] border-[#00d9b8]/20">
                      {settings?.companies?.filter(c => c.enabled).map((company) => (
                        <SelectItem key={company.id} value={company.companyName} className="text-white hover:bg-[#00d9b8]/20">
                          {company.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.targetCompanyExam && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.targetCompanyExam.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-[#b8c5d6] mb-2 block">Service Type</Label>
                  <Select
                    value={form.watch('serviceType')}
                    onValueChange={(value) => form.setValue('serviceType', value)}
                  >
                    <SelectTrigger className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f1d32] border-[#00d9b8]/20">
                      {settings?.serviceTypes?.filter(s => s.enabled).map((service) => (
                        <SelectItem key={service.key} value={service.key} className="text-white hover:bg-[#00d9b8]/20">
                          {service.label}
                          {selectedCompany && ` - ₹${selectedCompany.prices[service.key] || 0}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCompany && form.watch('serviceType') && (
                    <p className="text-[#00d9b8] text-sm mt-2">
                      Price: ₹{selectedCompany.prices[form.watch('serviceType')] || 0}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-[#b8c5d6] flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" /> Preferred Exam Date / Timeline
                  </Label>
                  <Input
                    {...form.register('preferredDate')}
                    type="date"
                    className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white"
                  />
                  {form.formState.errors.preferredDate && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.preferredDate.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] font-semibold h-12"
                >
                  Continue to Review <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </motion.div>
          )}

          {/* Step 2: Review */}
          {step === 'review' && formData && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-6 sm:p-8 rounded-2xl"
            >
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                Review Your Details
              </h1>
              <p className="text-[#b8c5d6] mb-6">Please confirm your information</p>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-[#6b7a8f]">Name</span>
                  <span className="text-white">{formData.fullName}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-[#6b7a8f]">Phone</span>
                  <span className="text-white">{formData.phone}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-[#6b7a8f]">Email</span>
                  <span className="text-white">{formData.email}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-[#6b7a8f]">College/Batch</span>
                  <span className="text-white">{formData.collegeBatch}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-[#6b7a8f]">Target</span>
                  <span className="text-white">{formData.targetCompanyExam}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-[#6b7a8f]">Service</span>
                  <span className="text-white">{settings?.serviceTypes?.find(s => s.key === formData.serviceType)?.label || formData.serviceType}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-[#6b7a8f]">Preferred Date</span>
                  <span className="text-white">{formData.preferredDate}</span>
                </div>
                <div className="flex justify-between py-3 bg-[#00d9b8]/10 rounded-lg px-4">
                  <span className="text-[#00d9b8] font-semibold">Amount to Pay</span>
                  <span className="text-[#00d9b8] font-bold text-xl">₹{selectedCompany?.prices[formData.serviceType] || 0}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('form')}
                  className="flex-1 border-[#00d9b8]/30 text-[#00d9b8] hover:bg-[#00d9b8]/10"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button
                  onClick={() => setStep('payment')}
                  className="flex-1 bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] font-semibold"
                >
                  Proceed to Pay <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {step === 'payment' && formData && settings && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-6 sm:p-8 rounded-2xl"
            >
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                Complete Payment
              </h1>
              <p className="text-[#b8c5d6] mb-6">Pay ₹{selectedCompany?.prices[formData.serviceType] || 0} via UPI</p>

              <div className="text-center mb-6">
                {settings.qrCodeUrl ? (
                  <img 
                    src={settings.qrCodeUrl} 
                    alt="Payment QR Code" 
                    className="w-48 h-48 mx-auto rounded-lg border border-white/10"
                  />
                ) : (
                  <div className="w-48 h-48 mx-auto rounded-lg border border-white/10 flex items-center justify-center bg-white/5">
                    <AlertCircle className="w-8 h-8 text-[#6b7a8f]" />
                  </div>
                )}
              </div>

              <div className="bg-[#0a1628]/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6b7a8f] text-sm">UPI ID</p>
                    <p className="text-white font-mono">{settings.upiId}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(settings.upiId)}
                    className="text-[#00d9b8] hover:bg-[#00d9b8]/10"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <Label className="text-[#b8c5d6] flex items-center gap-2 mb-2">
                  <Upload className="w-4 h-4" /> Upload Payment Screenshot
                </Label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label
                    htmlFor="screenshot-upload"
                    className="flex items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-[#00d9b8]/30 rounded-lg cursor-pointer hover:border-[#00d9b8]/50 transition-colors"
                  >
                    {screenshotPreview ? (
                      <img src={screenshotPreview} alt="Screenshot" className="h-full object-contain rounded" />
                    ) : (
                      <div className="text-center">
                        <FileCheck className="w-8 h-8 text-[#6b7a8f] mx-auto mb-2" />
                        <p className="text-[#6b7a8f] text-sm">Click to upload screenshot</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('review')}
                  className="flex-1 border-[#00d9b8]/30 text-[#00d9b8] hover:bg-[#00d9b8]/10"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button
                  onClick={handlePaymentSubmit}
                  disabled={submitting || !screenshot}
                  className="flex-1 bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] font-semibold disabled:opacity-50"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                  ) : (
                    <>Submit <Check className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {step === 'confirmation' && formData && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6 sm:p-8 rounded-2xl text-center"
            >
              <div className="w-16 h-16 bg-[#00d9b8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-[#00d9b8]" />
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                Submission Successful!
              </h1>
              <p className="text-[#b8c5d6] mb-6">Your registration has been received</p>

              <div className="bg-[#0a1628]/50 rounded-lg p-4 mb-6">
                <p className="text-[#6b7a8f] text-sm mb-1">Your Reference ID</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-[#00d9b8] font-mono text-xl font-bold">{referenceId}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(referenceId)}
                    className="text-[#00d9b8] hover:bg-[#00d9b8]/10"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-[#b8c5d6] text-sm mb-6">
                Please save this reference ID. Our team will verify your payment and contact you within 24 hours.
              </p>

              <Button
                onClick={openWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-12"
              >
                <MessageCircle className="w-4 h-4 mr-2" /> Contact on WhatsApp
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
