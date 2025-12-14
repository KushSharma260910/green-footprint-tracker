import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Leaf, LayoutDashboard, User, Plus, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/add-activity', label: 'Log Activity', icon: Plus },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="eco-gradient rounded-lg p-2">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold eco-gradient-text">CarbonTrack</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}>
                <Button
                  variant="ghost"
                  className={cn(
                    'gap-2',
                    isActive && 'bg-secondary text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex items-center justify-around border-t border-border/40 py-2 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'flex-col gap-1 h-auto py-2',
                  isActive && 'text-primary'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
