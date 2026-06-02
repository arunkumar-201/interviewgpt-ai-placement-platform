import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  Code2,
  FileText,
  Github,
  Home,
  LayoutDashboard,
  MessageSquare,
  Target,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUiStore } from '@/stores/ui.store';

const NAV_ITEMS: {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  disabled?: boolean;
}[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'DSA Arena', href: '/dashboard#dsa', icon: Code2, disabled: true },
  { label: 'Mock Interview', href: '/dashboard#interview', icon: MessageSquare, disabled: true },
  { label: 'Resume', href: '/dashboard#resume', icon: FileText, disabled: true },
  { label: 'GitHub', href: '/dashboard#github', icon: Github, disabled: true },
  { label: 'LeetCode', href: '/dashboard#leetcode', icon: BarChart3, disabled: true },
  { label: 'Company Bank', href: '/dashboard#companies', icon: BookOpen, disabled: true },
  { label: 'Readiness', href: '/dashboard#readiness', icon: Target, disabled: true },
];

interface DashboardSidebarProps {
  mobile?: boolean;
}

export function DashboardSidebar({ mobile }: DashboardSidebarProps) {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar, setMobileSidebarOpen } = useUiStore();
  const collapsed = !mobile && sidebarCollapsed;

  const content = (
    <>
      <div className={cn('flex h-16 items-center border-b border-border/50 px-4', collapsed && 'justify-center px-2')}>
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2" onClick={() => mobile && setMobileSidebarOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600 text-xs font-bold text-white">
              IG
            </div>
            <span className="font-semibold">InterviewGPT</span>
          </Link>
        )}
        {mobile ? (
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setMobileSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className={cn(collapsed ? '' : 'ml-auto')}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.href && !item.href.includes('#');
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.disabled ? '/dashboard' : item.href}
              onClick={() => mobile && setMobileSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                item.disabled && 'opacity-60',
                collapsed && 'justify-center px-2',
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.disabled && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">Soon</span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <Separator className="mb-3" />
        <Link
          to="/"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground',
            collapsed && 'justify-center px-2',
          )}
          onClick={() => mobile && setMobileSidebarOpen(false)}
        >
          <Home className="h-4 w-4" />
          {!collapsed && <span>Back to Home</span>}
        </Link>
      </div>
    </>
  );

  if (mobile) {
    return <div className="flex h-full flex-col bg-card">{content}</div>;
  }

  return (
    <aside
      className={cn(
        'hidden h-screen flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl transition-all duration-300 md:flex',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      {content}
    </aside>
  );
}
