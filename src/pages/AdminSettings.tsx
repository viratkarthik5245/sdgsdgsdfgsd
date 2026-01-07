import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLogin } from '@/components/AdminLogin';
import { 
  FormFieldConfig, 
  ServiceType,
  SERVICE_TYPE_LABELS,
  DEFAULT_FORM_FIELDS,
  DEFAULT_COMPANIES,
  DEFAULT_SERVICE_TYPES,
  CompanyPricing,
  ServiceTypeConfig,
} from '@/types/registration';
import { getAdminSettings, updateAdminSettings, uploadQRCode } from '@/services/registrationService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Settings, Save, Loader2, Plus, Trash2, GripVertical, 
  QrCode, Phone, CreditCard, FileText, Edit2, ArrowLeft, Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminSettingsPage = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Settings state with defaults
  const [upiId, setUpiId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeConfig[]>(DEFAULT_SERVICE_TYPES);
  const [companies, setCompanies] = useState<CompanyPricing[]>(DEFAULT_COMPANIES);
  const [formFields, setFormFields] = useState<FormFieldConfig[]>(DEFAULT_FORM_FIELDS);
  const [editingField, setEditingField] = useState<FormFieldConfig | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyPricing | null>(null);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [editingService, setEditingService] = useState<ServiceTypeConfig | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadSettings();
    }
  }, [isAuthenticated]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getAdminSettings();
      setUpiId(data.upiId || '');
      setQrCodeUrl(data.qrCodeUrl || '');
      setWhatsappNumber(data.whatsappNumber || '');
      setServiceTypes(data.serviceTypes || DEFAULT_SERVICE_TYPES);
      setCompanies(data.companies || DEFAULT_COMPANIES);
      setFormFields(data.formFields || DEFAULT_FORM_FIELDS);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await updateAdminSettings({ 
        upiId, 
        qrCodeUrl, 
        whatsappNumber,
        serviceTypes,
        companies,
        formFields 
      });
      toast({ title: 'Success', description: 'Settings saved successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadQRCode(file);
        setQrCodeUrl(url);
        toast({ title: 'Success', description: 'QR code uploaded' });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to upload QR code', variant: 'destructive' });
      }
    }
  };

  const handleAddField = () => {
    const newField: FormFieldConfig = {
      id: crypto.randomUUID(),
      name: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false,
      placeholder: '',
      enabled: true,
      order: formFields.length + 1,
    };
    setEditingField(newField);
    setIsAddingField(true);
  };

  const handleSaveField = () => {
    if (!editingField) return;
    
    if (isAddingField) {
      setFormFields([...formFields, editingField]);
    } else {
      setFormFields(formFields.map(f => f.id === editingField.id ? editingField : f));
    }
    setEditingField(null);
    setIsAddingField(false);
  };

  const handleDeleteField = (id: string) => {
    setFormFields(formFields.filter(f => f.id !== id));
  };

  const handleToggleField = (id: string) => {
    setFormFields(formFields.map(f => 
      f.id === id ? { ...f, enabled: !f.enabled } : f
    ));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...formFields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newFields.length) return;
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    newFields.forEach((f, i) => f.order = i + 1);
    setFormFields(newFields);
  };

  // Company management
  const handleAddCompany = () => {
    const newCompany: CompanyPricing = {
      id: crypto.randomUUID(),
      companyName: '',
      prices: { exam_slot: 0, interview_support: 0, full_placement_support: 0, communication_mentorship: 0 },
      enabled: true,
    };
    setEditingCompany(newCompany);
    setIsAddingCompany(true);
  };

  const handleSaveCompany = () => {
    if (!editingCompany || !editingCompany.companyName.trim()) {
      toast({ title: 'Error', description: 'Company name is required', variant: 'destructive' });
      return;
    }
    
    if (isAddingCompany) {
      setCompanies([...companies, editingCompany]);
    } else {
      setCompanies(companies.map(c => c.id === editingCompany.id ? editingCompany : c));
    }
    setEditingCompany(null);
    setIsAddingCompany(false);
  };

  const handleDeleteCompany = (id: string) => {
    setCompanies(companies.filter(c => c.id !== id));
  };

  const handleToggleCompany = (id: string) => {
    setCompanies(companies.map(c => 
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ));
  };

  // Service Type management
  const handleAddService = () => {
    const newService: ServiceTypeConfig = {
      id: crypto.randomUUID(),
      key: `service_${Date.now()}`,
      label: '',
      enabled: true,
    };
    setEditingService(newService);
    setIsAddingService(true);
  };

  const handleSaveService = () => {
    if (!editingService || !editingService.label.trim()) {
      toast({ title: 'Error', description: 'Service name is required', variant: 'destructive' });
      return;
    }
    
    // Generate key from label if adding new
    if (isAddingService) {
      editingService.key = editingService.label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    }
    
    if (isAddingService) {
      setServiceTypes([...serviceTypes, editingService]);
      // Add this service to all companies with price 0
      setCompanies(companies.map(c => ({
        ...c,
        prices: { ...c.prices, [editingService.key]: 0 }
      })));
    } else {
      setServiceTypes(serviceTypes.map(s => s.id === editingService.id ? editingService : s));
    }
    setEditingService(null);
    setIsAddingService(false);
  };

  const handleDeleteService = (id: string) => {
    const service = serviceTypes.find(s => s.id === id);
    if (service) {
      setServiceTypes(serviceTypes.filter(s => s.id !== id));
      // Remove from all companies
      setCompanies(companies.map(c => {
        const newPrices = { ...c.prices };
        delete newPrices[service.key];
        return { ...c, prices: newPrices };
      }));
    }
  };

  const handleToggleService = (id: string) => {
    setServiceTypes(serviceTypes.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00d9b8] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 relative overflow-hidden">
      <div className="absolute top-40 right-20 w-96 h-96 bg-[#00d9b8]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/admin/submissions">
              <Button variant="ghost" size="sm" className="text-[#6b7a8f] hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
              <Settings className="w-8 h-8 text-[#00d9b8]" />
              Admin Settings
            </h1>
          </div>
          <Button onClick={handleSaveSettings} disabled={saving} className="bg-[#00d9b8] text-[#0a1628]">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save All
          </Button>
        </div>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="bg-[#0a1628]/50 p-1 flex-wrap">
            <TabsTrigger value="services" className="data-[state=active]:bg-[#00d9b8] data-[state=active]:text-[#0a1628]">
              <FileText className="w-4 h-4 mr-2" /> Services
            </TabsTrigger>
            <TabsTrigger value="companies" className="data-[state=active]:bg-[#00d9b8] data-[state=active]:text-[#0a1628]">
              <Building2 className="w-4 h-4 mr-2" /> Companies
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-[#00d9b8] data-[state=active]:text-[#0a1628]">
              <CreditCard className="w-4 h-4 mr-2" /> Payment
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-[#00d9b8] data-[state=active]:text-[#0a1628]">
              <Phone className="w-4 h-4 mr-2" /> Contact
            </TabsTrigger>
          </TabsList>

          {/* Service Types */}
          <TabsContent value="services">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Service Types</h2>
                <Button onClick={handleAddService} size="sm" className="bg-[#00d9b8] text-[#0a1628]">
                  <Plus className="w-4 h-4 mr-2" /> Add Service
                </Button>
              </div>
              
              <p className="text-[#6b7a8f] text-sm mb-4">
                Add service types like Exam Slot, Interview Support, etc. These will appear in company pricing.
              </p>

              <div className="space-y-2">
                {serviceTypes.map((service) => (
                  <div 
                    key={service.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      service.enabled ? 'bg-[#0a1628]/30 border-[#00d9b8]/20' : 'bg-[#0a1628]/10 border-white/5 opacity-50'
                    }`}
                  >
                    <div>
                      <p className="text-white font-medium">{service.label}</p>
                      <p className="text-[#6b7a8f] text-xs">Key: {service.key}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={service.enabled} 
                        onCheckedChange={() => handleToggleService(service.id)}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setEditingService(service); setIsAddingService(false); }}
                        className="text-[#00d9b8] hover:bg-[#00d9b8]/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Companies & Pricing */}
          <TabsContent value="companies">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Companies & Pricing</h2>
                <Button onClick={handleAddCompany} size="sm" className="bg-[#00d9b8] text-[#0a1628]">
                  <Plus className="w-4 h-4 mr-2" /> Add Company
                </Button>
              </div>
              
              <p className="text-[#6b7a8f] text-sm mb-4">
                Add companies and set prices for each service type.
              </p>

              <div className="space-y-3">
                {companies.map((company) => (
                  <div 
                    key={company.id} 
                    className={`p-4 rounded-lg border ${
                      company.enabled ? 'bg-[#0a1628]/30 border-[#00d9b8]/20' : 'bg-[#0a1628]/10 border-white/5 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-lg">{company.companyName}</h3>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={company.enabled} 
                          onCheckedChange={() => handleToggleCompany(company.id)}
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => { setEditingCompany(company); setIsAddingCompany(false); }}
                          className="text-[#00d9b8] hover:bg-[#00d9b8]/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteCompany(company.id)}
                          className="text-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                      {serviceTypes.filter(s => s.enabled).map((service) => (
                        <div key={service.key} className="bg-[#0a1628]/50 rounded px-3 py-2">
                          <p className="text-[#6b7a8f] text-xs">{service.label}</p>
                          <p className="text-[#00d9b8] font-semibold">₹{company.prices[service.key] || 0}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment">
            <div className="glass-card p-6 rounded-xl space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Payment Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-[#b8c5d6]">UPI ID</Label>
                    <Input 
                      value={upiId} 
                      onChange={(e) => setUpiId(e.target.value)}
                      className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white mt-1" 
                      placeholder="yourname@upi" 
                    />
                  </div>
                  
                  <div>
                    <Label className="text-[#b8c5d6]">QR Code Image</Label>
                    <div className="mt-2">
                      <input type="file" accept="image/*" onChange={handleQRUpload} className="hidden" id="qr-upload" />
                      <label htmlFor="qr-upload" className="block cursor-pointer">
                        <div className="border-2 border-dashed border-[#00d9b8]/30 rounded-xl p-4 hover:border-[#00d9b8]/50 transition-colors">
                          {qrCodeUrl ? (
                            <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto object-contain rounded-lg" />
                          ) : (
                            <div className="text-center py-8">
                              <QrCode className="w-12 h-12 text-[#6b7a8f] mx-auto mb-2" />
                              <p className="text-[#6b7a8f]">Click to upload QR code</p>
                            </div>
                          )}
                        </div>
                      </label>
                      {qrCodeUrl && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setQrCodeUrl('')}
                          className="text-red-400 hover:text-red-300 mt-2"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Remove QR
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a1628]/30 rounded-xl p-4">
                  <p className="text-[#6b7a8f] text-sm">
                    💡 Prices are now set per company in the "Companies" tab. 
                    Each company can have different prices for each service type.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Contact Settings */}
          <TabsContent value="contact">
            <div className="glass-card p-6 rounded-xl space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Contact Settings</h2>
              
              <div className="max-w-md space-y-4">
                <div>
                  <Label className="text-[#b8c5d6]">WhatsApp Number</Label>
                  <Input 
                    value={whatsappNumber} 
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white mt-1" 
                    placeholder="+919876543210" 
                  />
                  <p className="text-[#6b7a8f] text-xs mt-1">Include country code (e.g., +91 for India)</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Form Fields Settings */}
          <TabsContent value="form">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Registration Form Fields</h2>
                <Button onClick={handleAddField} size="sm" className="bg-[#00d9b8] text-[#0a1628]">
                  <Plus className="w-4 h-4 mr-2" /> Add Field
                </Button>
              </div>
              
              <p className="text-[#6b7a8f] text-sm mb-4">
                Manage the fields shown in the registration form. Drag to reorder, toggle to enable/disable.
              </p>

              <div className="space-y-2">
                {formFields.sort((a, b) => a.order - b.order).map((field, index) => (
                  <div 
                    key={field.id} 
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      field.enabled ? 'bg-[#0a1628]/30 border-[#00d9b8]/20' : 'bg-[#0a1628]/10 border-white/5 opacity-50'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => moveField(index, 'up')} 
                        disabled={index === 0}
                        className="text-[#6b7a8f] hover:text-white disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button 
                        onClick={() => moveField(index, 'down')} 
                        disabled={index === formFields.length - 1}
                        className="text-[#6b7a8f] hover:text-white disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-white font-medium">{field.label}</p>
                      <p className="text-[#6b7a8f] text-xs">
                        Type: {field.type} | Name: {field.name} {field.required && '| Required'}
                      </p>
                    </div>

                    <Switch 
                      checked={field.enabled} 
                      onCheckedChange={() => handleToggleField(field.id)}
                    />
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => { setEditingField(field); setIsAddingField(false); }}
                      className="text-[#00d9b8] hover:bg-[#00d9b8]/10"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteField(field.id)}
                      className="text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Field Modal */}
      <Dialog open={!!editingField} onOpenChange={() => { setEditingField(null); setIsAddingField(false); }}>
        <DialogContent className="glass-card border-[#00d9b8]/30">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isAddingField ? 'Add New Field' : 'Edit Field'}
            </DialogTitle>
          </DialogHeader>
          
          {editingField && (
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-[#b8c5d6]">Field Label</Label>
                <Input 
                  value={editingField.label} 
                  onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                  className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white mt-1" 
                />
              </div>
              
              <div>
                <Label className="text-[#b8c5d6]">Field Name (ID)</Label>
                <Input 
                  value={editingField.name} 
                  onChange={(e) => setEditingField({ ...editingField, name: e.target.value.replace(/\s/g, '_').toLowerCase() })}
                  className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white mt-1" 
                />
              </div>
              
              <div>
                <Label className="text-[#b8c5d6]">Field Type</Label>
                <Select 
                  value={editingField.type} 
                  onValueChange={(v) => setEditingField({ ...editingField, type: v as any })}
                >
                  <SelectTrigger className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f1d32] border-[#00d9b8]/20">
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="tel">Phone</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                    <SelectItem value="textarea">Text Area</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-[#b8c5d6]">Placeholder</Label>
                <Input 
                  value={editingField.placeholder || ''} 
                  onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                  className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white mt-1" 
                />
              </div>

              {editingField.type === 'select' && (
                <div>
                  <Label className="text-[#b8c5d6]">Options (comma separated)</Label>
                  <Input 
                    value={editingField.options?.join(', ') || ''} 
                    onChange={(e) => setEditingField({ 
                      ...editingField, 
                      options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white mt-1" 
                    placeholder="Option 1, Option 2, Option 3"
                  />
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Switch 
                  checked={editingField.required} 
                  onCheckedChange={(v) => setEditingField({ ...editingField, required: v })}
                />
                <Label className="text-[#b8c5d6]">Required field</Label>
              </div>
              
              <div className="flex items-center gap-3">
                <Switch 
                  checked={editingField.enabled} 
                  onCheckedChange={(v) => setEditingField({ ...editingField, enabled: v })}
                />
                <Label className="text-[#b8c5d6]">Enabled</Label>
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-6">
            <Button variant="ghost" onClick={() => { setEditingField(null); setIsAddingField(false); }}>
              Cancel
            </Button>
            <Button onClick={handleSaveField} className="bg-[#00d9b8] text-[#0a1628]">
              {isAddingField ? 'Add Field' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Company Modal */}
      <Dialog open={!!editingCompany} onOpenChange={() => { setEditingCompany(null); setIsAddingCompany(false); }}>
        <DialogContent className="glass-card border-[#00d9b8]/30 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isAddingCompany ? 'Add New Company' : 'Edit Company'}
            </DialogTitle>
          </DialogHeader>
          
          {editingCompany && (
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-[#b8c5d6]">Company Name</Label>
                <Input 
                  value={editingCompany.companyName} 
                  onChange={(e) => setEditingCompany({ ...editingCompany, companyName: e.target.value })}
                  className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white mt-1" 
                  placeholder="e.g., Accenture, TCS, Infosys"
                />
              </div>
              
              <div>
                <Label className="text-[#b8c5d6] mb-3 block">Service Prices (₹)</Label>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {serviceTypes.filter(s => s.enabled).map((service) => (
                    <div key={service.key} className="flex items-center gap-3">
                      <span className="text-[#6b7a8f] text-sm flex-1">{service.label}</span>
                      <Input 
                        type="number" 
                        value={editingCompany.prices[service.key] || ''}
                        onChange={(e) => setEditingCompany({ 
                          ...editingCompany, 
                          prices: { ...editingCompany.prices, [service.key]: Number(e.target.value) } 
                        })}
                        className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white w-28" 
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Switch 
                  checked={editingCompany.enabled} 
                  onCheckedChange={(v) => setEditingCompany({ ...editingCompany, enabled: v })}
                />
                <Label className="text-[#b8c5d6]">Enabled (visible to users)</Label>
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-6">
            <Button variant="ghost" onClick={() => { setEditingCompany(null); setIsAddingCompany(false); }}>
              Cancel
            </Button>
            <Button onClick={handleSaveCompany} className="bg-[#00d9b8] text-[#0a1628]">
              {isAddingCompany ? 'Add Company' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Modal */}
      <Dialog open={!!editingService} onOpenChange={() => { setEditingService(null); setIsAddingService(false); }}>
        <DialogContent className="glass-card border-[#00d9b8]/30">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isAddingService ? 'Add New Service' : 'Edit Service'}
            </DialogTitle>
          </DialogHeader>
          
          {editingService && (
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-[#b8c5d6]">Service Name</Label>
                <Input 
                  value={editingService.label} 
                  onChange={(e) => setEditingService({ ...editingService, label: e.target.value })}
                  className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white mt-1" 
                  placeholder="e.g., Exam Slot, Interview Support"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <Switch 
                  checked={editingService.enabled} 
                  onCheckedChange={(v) => setEditingService({ ...editingService, enabled: v })}
                />
                <Label className="text-[#b8c5d6]">Enabled</Label>
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-6">
            <Button variant="ghost" onClick={() => { setEditingService(null); setIsAddingService(false); }}>
              Cancel
            </Button>
            <Button onClick={handleSaveService} className="bg-[#00d9b8] text-[#0a1628]">
              {isAddingService ? 'Add Service' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSettingsPage;
