import React from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuth } from '@/features/auth';

export interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const { user, fullName, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <Header
        userName={fullName || user?.firstName || 'User'}
        userAvatar={user?.avatar}
        onMenuClick={() => setSidebarOpen(true)}
        onLogout={handleLogout}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content - margin matches sidebar width */}
      <main
        className={cn(
          'min-h-[calc(100vh-4rem)]',
          'transition-all duration-300',
          'pb-20 lg:pb-0',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        )}
      >
        <div className="p-4 lg:p-6">
          {children || <Outlet />}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav />
    </div>
  );
};

export default MainLayout;
