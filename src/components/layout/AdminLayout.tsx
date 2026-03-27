import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/auth.store';
import { ADMIN_SIDEBAR_CONFIG } from '../../features/admin/config';
import { useAuth } from '../../features/auth/hooks';
import type { AdminSidebarSection, AdminSidebarMenuItem } from '../../features/admin/config';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface ExpandedState {
  [key: string]: boolean;
}

/**
 * AdminLayout Component
 * Provides the main layout structure for admin pages with sidebar navigation
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const { logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<ExpandedState>({
    onboarding: true
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const isActive = (path: string | undefined): boolean => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const renderMenuItem = (item: AdminSidebarMenuItem) => {
    const itemPath = item.path;
    const isItemActive = isActive(itemPath);

    return (
      <Link
        key={item.key}
        to={itemPath || '#'}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
          isItemActive
            ? 'bg-[var(--color-primary)] text-white'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-background-hover)]'
        }`}
        onClick={(e) => {
          if (!itemPath) {
            e.preventDefault();
          }
        }}
      >
        <span className="text-sm font-medium">{item.label}</span>
        {isItemActive && (
          <div className="ml-auto w-1 h-5 bg-white rounded-full" />
        )}
      </Link>
    );
  };

  const renderSection = (section: AdminSidebarSection) => {
    const isExpanded = expandedSections[section.key];
    const Icon = section.icon;

    return (
      <div key={section.key} className="mb-2">
        <button
          onClick={() => toggleSection(section.key)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[var(--color-text-primary)] hover:bg-[var(--color-background-hover)] transition-all duration-200"
        >
          <Icon size={18} />
          <span className="font-medium flex-1 text-left">{section.label}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isExpanded && (
          <div className="mt-1 ml-4 space-y-1 border-l-2 border-[var(--color-border)] pl-2">
            {section.children.map(item => renderMenuItem(item))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-all duration-300 z-40 ${
          isSidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-[var(--color-border)]">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              Admin Panel
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              {user?.email}
            </p>
          </div>

          {/* Sidebar Content */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {ADMIN_SIDEBAR_CONFIG.map(section => renderSection(section))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[var(--color-border)]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-background-hover)] hover:text-[var(--color-text-primary)] transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-[var(--color-background-hover)] transition-colors"
            >
              {isSidebarOpen ? (
                <X size={20} className="text-[var(--color-text-primary)]" />
              ) : (
                <Menu size={20} className="text-[var(--color-text-primary)]" />
              )}
            </button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--color-text-secondary)]">
                {user?.email}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
