import React from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';

export interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  // Mock user data - will be replaced with actual auth data
  const user = {
    name: 'Admin User',
    avatar: null,
  };

  const handleLogout = () => {
    // Will be implemented with auth store
    console.log('Logout clicked');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <Header
        userName={user.name}
        userAvatar={user.avatar || undefined}
        onMenuClick={() => setSidebarOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 min-h-[calc(100vh-4rem)]',
            'transition-all duration-300',
            'pb-20 lg:pb-0', // Bottom padding for mobile nav
            sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          )}
        >
          <div className="p-4 lg:p-6">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav />
    </div>
  );
};

export default MainLayout;
