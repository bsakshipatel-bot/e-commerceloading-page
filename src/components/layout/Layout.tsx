import { useState, type ReactNode } from 'react';
import { Sidebar, type PageKey } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

interface LayoutProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
  pageTitle: string;
  children: ReactNode;
}

export function Layout({ currentPage, onNavigate, pageTitle, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8faf9]">
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} pageTitle={pageTitle} />
        <main className="flex-1 p-4 lg:p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
