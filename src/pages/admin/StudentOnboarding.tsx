import { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import { Upload, Users, CheckCircle, XCircle } from 'lucide-react';
import OnboardingService, { OnboardingApproval } from '../../services/onboarding.service';
import OnboardingApprovalTable from '../../components/admin/OnboardingApprovalTable';
import { useToast } from '../../components/ui/Toast';

export default function StudentOnboarding() {
  const [activeTab, setActiveTab] = useState<'pending' | 'upload'>('pending');
  const [approvals, setApprovals] = useState<OnboardingApproval[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { addToast } = useToast();

  const fetchPending = async () => {
    setIsLoading(true);
    try {
      const data = await OnboardingService.getPendingStudents();
      setApprovals(data);
    } catch (error) {
      addToast({ type: 'error', title: 'Fetch Error', message: 'Failed to fetch pending student onboarding requests' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPending();
    }
  }, [activeTab]);

  const handleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === approvals.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(approvals.map(a => a.id));
    }
  };

  const handleApprove = async (id: number) => {
    const student = approvals.find(a => a.id === id);
    if (!student?.student_id) return;
    
    setIsActionLoading(true);
    try {
      await OnboardingService.approveStudent(student.student_id);
      addToast({ type: 'success', title: 'Approved', message: 'Student onboarding approved' });
      fetchPending();
      setSelectedIds(prev => prev.filter(i => i !== id));
    } catch (error) {
      addToast({ type: 'error', title: 'Approval Failed', message: 'Failed to approve student' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    const student = approvals.find(a => a.id === id);
    if (!student?.student_id) return;

    setIsActionLoading(true);
    try {
      await OnboardingService.rejectStudent(student.student_id);
      addToast({ type: 'success', title: 'Rejected', message: 'Student onboarding rejected' });
      fetchPending();
      setSelectedIds(prev => prev.filter(i => i !== id));
    } catch (error) {
      addToast({ type: 'error', title: 'Rejection Failed', message: 'Failed to reject student' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    
    // We need student_ids for the bulk action service actually
    // But our service takes 'ids' which currently map to StudentOnboardingApproval.id in backend?
    // Wait, check service.
    // backend BulkApproveStudentOnboardingView expects serializer.validated_data["ids"]
    // which are passed to StudentApprovalService.bulk_approve(student_ids, ...)
    // So selectedIds should be STUDENT_IDs (profile ids).
    
    const profileIds = approvals
      .filter(a => selectedIds.includes(a.id))
      .map(a => a.student_id)
      .filter((id): id is number => !!id);

    setIsActionLoading(true);
    try {
      await OnboardingService.bulkApproveStudents(profileIds);
      addToast({ type: 'success', title: 'Bulk Approved', message: `${profileIds.length} students approved` });
      fetchPending();
      setSelectedIds([]);
    } catch (error) {
      addToast({ type: 'error', title: 'Bulk Action Failed', message: 'Bulk approval failed' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    
    const profileIds = approvals
      .filter(a => selectedIds.includes(a.id))
      .map(a => a.student_id)
      .filter((id): id is number => !!id);

    setIsActionLoading(true);
    try {
      await OnboardingService.bulkRejectStudents(profileIds);
      addToast({ type: 'success', title: 'Bulk Rejected', message: `${profileIds.length} students rejected` });
      fetchPending();
      setSelectedIds([]);
    } catch (error) {
      addToast({ type: 'error', title: 'Bulk Action Failed', message: 'Bulk rejection failed' });
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
              Student Onboarding
            </h1>
            <p className="mt-2 text-lg text-[var(--color-text-secondary)]">
              Manage student registrations and verify documents for approval.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'pending'
                  ? 'bg-[var(--color-primary)] text-white shadow-lg'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-background-hover)]'
              }`}
              data-testid="tab-pending"
            >
              <Users size={18} />
              Pending
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-[var(--color-primary)] text-white shadow-lg'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-background-hover)]'
              }`}
              data-testid="tab-upload"
            >
              <Upload size={18} />
              Bulk Upload
            </button>
          </div>
        </div>

        {activeTab === 'pending' && (
          <div className="space-y-4">
            {selectedIds.length > 0 && (
              <div className="flex items-center justify-between bg-[var(--color-primary-faint)] p-4 rounded-lg border border-[var(--color-primary)] animate-in fade-in slide-in-from-top-2">
                <span className="text-[var(--color-primary)] font-semibold">
                  {selectedIds.length} students selected
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={handleBulkApprove}
                    disabled={isActionLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md disabled:opacity-50"
                    data-testid="bulk-approve-btn"
                  >
                    <CheckCircle size={18} />
                    Approve All
                  </button>
                  <button
                    onClick={handleBulkReject}
                    disabled={isActionLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md disabled:opacity-50"
                    data-testid="bulk-reject-btn"
                  >
                    <XCircle size={18} />
                    Reject All
                  </button>
                </div>
              </div>
            )}

            <OnboardingApprovalTable
              approvals={approvals}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              onApprove={handleApprove}
              onReject={handleReject}
              type="student"
              isLoading={isLoading}
            />
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-12 shadow-xl">
             <div className="flex flex-col items-center justify-center border-4 border-dashed border-[var(--color-border)] rounded-2xl p-12 hover:border-[var(--color-primary)] transition-colors group cursor-pointer">
              <div className="p-6 bg-[var(--color-background-hover)] rounded-full mb-6 group-hover:bg-[var(--color-primary-faint)] transition-colors">
                <Upload size={64} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                Bulk Onboard Students
              </h3>
              <p className="text-[var(--color-text-secondary)] text-center max-w-md mb-8">
                Upload a CSV or Excel file containing student details to onboard multiple students at once.
              </p>
              <button 
                className="px-8 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95"
                data-testid="select-file-btn"
              >
                Choose File
              </button>
              <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
                Supported formats: .csv, .xlsx (Max 10MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
