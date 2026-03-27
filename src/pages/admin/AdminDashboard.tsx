import React from 'react';
import PageLayout from '../../components/layout/PageLayout';
import { BarChart3, Users, GraduationCap } from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export default function AdminDashboard() {
  const stats: StatCard[] = [
    {
      title: 'Pending Student Approvals',
      value: '12',
      icon: <GraduationCap size={24} />,
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Faculty Approvals',
      value: '5',
      icon: <Users size={24} />,
      color: 'bg-green-500'
    },
    {
      title: 'Total Onboarded',
      value: '156',
      icon: <BarChart3 size={24} />,
      color: 'bg-purple-500'
    }
  ];

  return (
    <PageLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Admin Dashboard
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Welcome to the admin panel. Manage onboarding and system settings.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
                  {stat.title}
                </h3>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-[var(--color-text-primary)]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex flex-col items-start p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-background-hover)] transition-colors text-left">
              <span className="font-medium text-[var(--color-text-primary)]">
                Student Onboarding
              </span>
              <span className="text-sm text-[var(--color-text-secondary)] mt-1">
                Manage student onboarding requests and approvals
              </span>
            </button>
            <button className="flex flex-col items-start p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-background-hover)] transition-colors text-left">
              <span className="font-medium text-[var(--color-text-primary)]">
                Faculty Onboarding
              </span>
              <span className="text-sm text-[var(--color-text-secondary)] mt-1">
                Manage faculty onboarding requests and approvals
              </span>
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
