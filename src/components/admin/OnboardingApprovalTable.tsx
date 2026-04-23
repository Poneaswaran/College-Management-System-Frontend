import React from 'react';
import { CheckCircle, XCircle, Clock, Trash2, CheckSquare, Square } from 'lucide-react';
import { OnboardingApproval } from '../../services/onboarding.service';

interface OnboardingApprovalTableProps {
  approvals: OnboardingApproval[];
  selectedIds: number[];
  onSelect: (id: number) => void;
  onSelectAll: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  type: 'student' | 'faculty';
  isLoading?: boolean;
}

const OnboardingApprovalTable: React.FC<OnboardingApprovalTableProps> = ({
  approvals,
  selectedIds,
  onSelect,
  onSelectAll,
  onApprove,
  onReject,
  type,
  isLoading
}) => {
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

  const allSelected = approvals.length > 0 && selectedIds.length === approvals.length;

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-background-hover)]">
              <th className="px-6 py-3 text-left w-10">
                <button 
                  onClick={onSelectAll}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                  data-testid="select-all-checkbox"
                >
                  {allSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                {type === 'student' ? 'Registration #' : 'Employee ID'}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                Submitted
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-[var(--color-text-primary)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-4 h-16 bg-gray-50/50"></td>
                </tr>
              ))
            ) : approvals.length > 0 ? (
              approvals.map(approval => (
                <tr
                  key={approval.id}
                  className={`hover:bg-[var(--color-background-hover)] transition-colors ${
                    selectedIds.includes(approval.id) ? 'bg-[var(--color-primary-faint)]' : ''
                  }`}
                  data-testid={`approval-row-${approval.id}`}
                >
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => onSelect(approval.id)}
                      className={`transition-colors ${
                        selectedIds.includes(approval.id) ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'
                      }`}
                      data-testid={`select-checkbox-${approval.id}`}
                    >
                      {selectedIds.includes(approval.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--color-text-primary)]">
                    {type === 'student' ? approval.registration_number : approval.employee_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-primary)]">
                    {type === 'student' ? approval.student_name : approval.faculty_name}
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
                    {new Date(approval.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => onApprove(approval.id)}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-all shadow-sm hover:shadow-md active:scale-95"
                        data-testid={`approve-btn-${approval.id}`}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => onReject(approval.id)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-all shadow-sm hover:shadow-md active:scale-95"
                        data-testid={`reject-btn-${approval.id}`}
                      >
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
                  No pending onboarding requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OnboardingApprovalTable;
