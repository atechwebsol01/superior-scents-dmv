import React from 'react';
import { Menu, Bell, Search, User, LogOut, Settings, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Avatar } from '@/components/common/Avatar';
import { useThemeStore } from '@/store/themeStore';

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
  const { resolvedTheme, toggleTheme } = useThemeStore();

  return (
    <header
      className={cn(
        'h-16 gradient-animated text-white flex items-center justify-between px-4 lg:px-6 shadow-lg',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          type="button"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden sm:block"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-secondary-400 rounded-full" />
        </button>

        {/* User Menu */}
        <div className="relative ml-2">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Avatar src={userAvatar} name={userName} size="sm" />
            <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">{userName}</span>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-50">
                <button
                  type="button"
                  className="w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <hr className="my-1 border-neutral-200 dark:border-neutral-700" />
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 flex items-center gap-2"
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
