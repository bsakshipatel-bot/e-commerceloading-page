import { Icons } from '@/components/icons';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getGreeting, getCurrentDateTime } from '@/lib/utils';

interface HeaderProps {
  onMenuClick: () => void;
  pageTitle: string;
}

export function Header({ onMenuClick, pageTitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-secondary-200/60">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-secondary-600 hover:bg-secondary-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h2 className="text-lg font-bold text-secondary-900">{pageTitle}</h2>
            <p className="hidden sm:block text-xs text-secondary-500">{getCurrentDateTime()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-secondary-600">{getGreeting()}, Gardener</span>
          </div>
          <StatusBadge status="online" size="sm" />
          <button className="relative flex items-center justify-center w-9 h-9 rounded-lg text-secondary-600 hover:bg-secondary-100">
            <Icons.Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-500" />
          </button>
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-100 text-primary-700">
            <Icons.Sprout className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
