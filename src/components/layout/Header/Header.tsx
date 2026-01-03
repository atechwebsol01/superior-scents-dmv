import React from 'react';
import { Menu, Bell, Search, User, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Avatar } from '@/components/common/Avatar';

export interface HeaderProps {
  title?: string;
  userName?: string;
  userAvatar?: string;
  onMenuClick?: () => void;
  onLogout?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Superior Scents DMV',
  userName = 'User',
  userAvatar,
  onMenuClick,
  onLogout,
  className,
}) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header
      className={cn(
        'h-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white flex items-center justify-between px-4 lg:px-6 shadow-lg shadow-primary-500/20',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 hover:bg-primary-600 rounded-lg transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="p-2 hover:bg-primary-600 rounded-lg transition-colors hidden sm:block"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="p-2 hover:bg-primary-600 rounded-lg transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full" />
        </button>

        <div className="relative ml-2">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 hover:bg-primary-600 rounded-lg transition-colors"
          >
            <Avatar src={userAvatar} name={userName} size="sm" />
            <span className="hidden sm:block text-sm font-medium">{userName}</span>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50">
                <button
                  type="button"
                  className="w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <hr className="my-1 border-neutral-200" />
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
