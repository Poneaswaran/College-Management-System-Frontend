import { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import { Upload, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

interface StudentApproval {
  id: number;
  registrationNumber: string;
  studentName: string;
  email: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
}

export default function StudentOnboarding() {
  const [activeTab, setActiveTab] = useState<'pending' | 'upload'>('pending');
  
  // Mock data for pending approvals
  const pendingApprovals: StudentApproval[] = [
    {
      id: 1,
      registrationNumber: 'REG20230001',
      studentName: 'John Doe',
      email: 'john.doe@college.edu',
      status: 'PENDING',
      submittedAt: '2024-03-27T10:30:00Z'
    },
    {
      id: 2,
      registrationNumber: 'REG20230002',
      studentName: 'Jane Smith',
      email: 'jane.smith@college.edu',
      status: 'PENDING',
      submittedAt: '2024-03-27T09:15:00Z'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'REJECTED':
        return <XCircle size={18} className="text-red-500" />;
      case 'PENDING':
      default:
        return <Clock size={18} className="text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <PageLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Student Onboarding
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Manage student onboarding requests, bulk uploads, and approvals
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={18} />
              Pending Approvals
            </div>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Upload size={18} />
              Bulk Upload
            </div>
          </button>
        </div>

        {/* Pending Approvals Tab */}
        {activeTab === 'pending' && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-background-hover)]">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                    Registration #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.length > 0 ? (
                  pendingApprovals.map(approval => (
                    <tr
                      key={approval.id}
                      className="border-b border-[var(--color-border)] hover:bg-[var(--color-background-hover)] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-[var(--color-text-primary)]">
                        {approval.registrationNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text-primary)]">
                        {approval.studentName}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                        {approval.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            approval.status
                          )}`}
                        >
                          {getStatusIcon(approval.status)}
                          {approval.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                        {new Date(approval.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors">
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors">
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-[var(--color-text-secondary)]"
                    >
                      No pending approvals at this time
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Bulk Upload Tab */}
        {activeTab === 'upload' && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
            <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-12 text-center">
              <Upload size={48} className="mx-auto mb-4 text-[var(--color-text-secondary)]" />
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                Upload Student Data
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Drag and drop a CSV or XLSX file, or click to browse
              </p>
              <button className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity">
                Select File
              </button>
              <p className="text-xs text-[var(--color-text-secondary)] mt-4">
                Maximum file size: 10 MB
              </p>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
