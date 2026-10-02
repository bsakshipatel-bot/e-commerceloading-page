import { Icons } from '@/components/icons';

export type PageKey = 'dashboard' | 'plants' | 'analytics' | 'irrigation' | 'alerts' | 'settings';

interface SidebarProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems: Array<{ key: PageKey; label: string; icon: keyof typeof Icons }> = [
  { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { key: 'plants', label: 'Plants', icon: 'Sprout' },
  { key: 'analytics', label: 'Analytics', icon: 'BarChart3' },
  { key: 'irrigation', label: 'Irrigation', icon: 'Waves' },
  { key: 'alerts', label: 'Alerts', icon: 'Bell' },
  { key: 'settings', label: 'Settings', icon: 'Settings' },
];

export function Sidebar({ currentPage, onNavigate, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-secondary-900/30 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-secondary-200/60 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-secondary-200/60 shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-500 text-white">
            <Icons.Leaf className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-secondary-900 leading-tight">Smart Garden</h1>
            <p className="text-xs text-secondary-500">IoT Monitoring</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="px-3 mb-2 text-xs font-semibold text-secondary-400 uppercase tracking-wider">Menu</p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = Icons[item.icon];
              const isActive = currentPage === item.key;
              return (
                <li key={item.key}>
                  <button
                    onClick={() => {
                      onNavigate(item.key);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-secondary-400'}`} />
                    {item.label}
                    {item.key === 'alerts' && (
                      <span className="ml-auto bg-danger-100 text-danger-600 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                        3
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-secondary-200/60 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700">
              <Icons.Sprout className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-700 truncate">ESP32 Connected</p>
              <p className="text-xs text-secondary-400">Demo Mode · No hardware</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-success-500" />
          </div>
        </div>
      </aside>
    </>
  );
}
