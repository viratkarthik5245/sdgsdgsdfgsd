import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLogin } from '@/components/AdminLogin';
import { 
  UserSubmission, 
  SubmissionStatus, 
  ServiceType,
  SERVICE_TYPE_LABELS, 
  STATUS_LABELS, 
  STATUS_COLORS 
} from '@/types/registration';
import { getSubmissions, updateSubmissionStatus } from '@/services/registrationService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Search, Users, Eye, MessageCircle, 
  Settings, Loader2, RefreshCw
} from 'lucide-react';

const AdminSubmissions = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<UserSubmission | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions();
    }
  }, [isAuthenticated]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getSubmissions();
      setSubmissions(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load submissions', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: SubmissionStatus, notes?: string) => {
    try {
      await updateSubmissionStatus(id, status, notes, 'Admin');
      toast({ title: 'Success', description: 'Status updated successfully' });
      loadSubmissions();
      setSelectedSubmission(null);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const openWhatsApp = (submission: UserSubmission, template: string) => {
    const phone = submission.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(template)}`, '_blank');
  };

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
      if (serviceFilter !== 'all' && sub.serviceType !== serviceFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!sub.fullName.toLowerCase().includes(q) && 
            !sub.referenceId.toLowerCase().includes(q) &&
            !sub.targetCompanyExam.toLowerCase().includes(q)) return false;
      }
      if (dateFrom && sub.preferredDate < dateFrom) return false;
      if (dateTo && sub.preferredDate > dateTo) return false;
      return true;
    });
  }, [submissions, statusFilter, serviceFilter, searchQuery, dateFrom, dateTo]);

  // Stats
  const stats = useMemo(() => ({
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending_verification').length,
    verified: submissions.filter(s => s.status === 'payment_verified').length,
    completed: submissions.filter(s => s.status === 'completed').length,
  }), [submissions]);

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 relative overflow-hidden">
      <div className="absolute top-40 right-20 w-96 h-96 bg-[#00d9b8]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-[#00d9b8]" />
              Submissions Dashboard
            </h1>
            <p className="text-[#6b7a8f] mt-1">Manage user registrations and payments</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadSubmissions} className="border-[#00d9b8]/30 text-[#00d9b8]">
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
            <Link to="/admin/settings">
              <Button className="bg-[#00d9b8] text-[#0a1628]">
                <Settings className="w-4 h-4 mr-2" /> Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'bg-blue-500/20 text-blue-400' },
            { label: 'Pending', value: stats.pending, color: 'bg-yellow-500/20 text-yellow-400' },
            { label: 'Verified', value: stats.verified, color: 'bg-green-500/20 text-green-400' },
            { label: 'Completed', value: stats.completed, color: 'bg-purple-500/20 text-purple-400' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.color} rounded-xl p-4 border border-white/10`}>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass-card p-4 rounded-xl mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7a8f]" />
              <Input
                placeholder="Search name, ID, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#0a1628]/50 border-[#00d9b8]/20 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1d32] border-[#00d9b8]/20">
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1d32] border-[#00d9b8]/20">
                <SelectItem value="all">All Services</SelectItem>
                {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} 
              className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white" placeholder="From" />
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white" placeholder="To" />
          </div>
        </div>

        {/* Submissions Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#00d9b8] animate-spin" />
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 text-[#6b7a8f]">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No submissions found</p>
          </div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a1628]/50 border-b border-white/10">
                  <tr>
                    <th className="text-left p-4 text-[#6b7a8f] font-medium">Reference</th>
                    <th className="text-left p-4 text-[#6b7a8f] font-medium">Name</th>
                    <th className="text-left p-4 text-[#6b7a8f] font-medium hidden sm:table-cell">Service</th>
                    <th className="text-left p-4 text-[#6b7a8f] font-medium hidden md:table-cell">Target</th>
                    <th className="text-left p-4 text-[#6b7a8f] font-medium">Status</th>
                    <th className="text-left p-4 text-[#6b7a8f] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 text-[#00d9b8] font-mono text-sm">{sub.referenceId}</td>
                      <td className="p-4 text-white">{sub.fullName}</td>
                      <td className="p-4 text-[#b8c5d6] hidden sm:table-cell">{SERVICE_TYPE_LABELS[sub.serviceType]}</td>
                      <td className="p-4 text-[#b8c5d6] hidden md:table-cell">{sub.targetCompanyExam}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs border ${STATUS_COLORS[sub.status]}`}>
                          {STATUS_LABELS[sub.status]}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button size="sm" variant="ghost" onClick={() => setSelectedSubmission(sub)}
                          className="text-[#00d9b8] hover:bg-[#00d9b8]/10">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="glass-card border-[#00d9b8]/30 max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <span className="text-[#00d9b8] font-mono">{selectedSubmission.referenceId}</span>
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="bg-[#0a1628]/50">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label className="text-[#6b7a8f]">Name</Label><p className="text-white">{selectedSubmission.fullName}</p></div>
                    <div><Label className="text-[#6b7a8f]">Phone</Label><p className="text-white">{selectedSubmission.phone}</p></div>
                    <div><Label className="text-[#6b7a8f]">Email</Label><p className="text-white">{selectedSubmission.email}</p></div>
                    <div><Label className="text-[#6b7a8f]">College/Batch</Label><p className="text-white">{selectedSubmission.collegeBatch}</p></div>
                    <div><Label className="text-[#6b7a8f]">Service</Label><p className="text-white">{SERVICE_TYPE_LABELS[selectedSubmission.serviceType]}</p></div>
                    <div><Label className="text-[#6b7a8f]">Target</Label><p className="text-white">{selectedSubmission.targetCompanyExam}</p></div>
                    <div><Label className="text-[#6b7a8f]">Preferred Date</Label><p className="text-white">{selectedSubmission.preferredDate}</p></div>
                    <div><Label className="text-[#6b7a8f]">Status</Label>
                      <span className={`px-2 py-1 rounded-full text-xs border ${STATUS_COLORS[selectedSubmission.status]}`}>
                        {STATUS_LABELS[selectedSubmission.status]}
                      </span>
                    </div>
                  </div>
                  {selectedSubmission.paymentScreenshotUrl && (
                    <div>
                      <Label className="text-[#6b7a8f]">Payment Screenshot</Label>
                      <img src={selectedSubmission.paymentScreenshotUrl} alt="Payment" className="mt-2 max-w-full h-48 object-contain rounded-lg border border-white/10" />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="timeline" className="mt-4">
                  <div className="space-y-3">
                    {selectedSubmission.timeline.map((entry, i) => (
                      <div key={entry.id} className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#00d9b8] mt-2" />
                        <div>
                          <p className="text-white">{entry.action}</p>
                          <p className="text-[#6b7a8f] text-sm">{new Date(entry.timestamp).toLocaleString()}</p>
                          {entry.notes && <p className="text-[#b8c5d6] text-sm">{entry.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="mt-4 space-y-4">
                  <div>
                    <Label className="text-[#6b7a8f] mb-2 block">Update Status</Label>
                    <div className="flex flex-wrap gap-2">
                      {(['payment_verified', 'assigned_support', 'slot_confirmed', 'interview_scheduled', 'completed', 'dropped', 'refund'] as SubmissionStatus[]).map(status => (
                        <Button key={status} size="sm" variant="outline"
                          onClick={() => handleStatusUpdate(selectedSubmission.id, status)}
                          className={`border-[#00d9b8]/30 ${selectedSubmission.status === status ? 'bg-[#00d9b8]/20' : ''}`}>
                          {STATUS_LABELS[status]}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-[#6b7a8f] mb-2 block">Send WhatsApp</Label>
                    <Button onClick={() => openWhatsApp(selectedSubmission, 
                      `Hi ${selectedSubmission.fullName}, your payment for ${SERVICE_TYPE_LABELS[selectedSubmission.serviceType]} has been verified! ✅\n\nReference: ${selectedSubmission.referenceId}\nTarget: ${selectedSubmission.targetCompanyExam}\n\nOur team will contact you soon.`
                    )} className="bg-green-600 hover:bg-green-700">
                      <MessageCircle className="w-4 h-4 mr-2" /> Send Verification Message
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubmissions;
