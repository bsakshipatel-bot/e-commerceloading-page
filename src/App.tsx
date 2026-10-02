import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import type { PageKey } from '@/components/layout/Sidebar';
import { DashboardPage } from '@/pages/DashboardPage';
import { PlantsPage } from '@/pages/PlantsPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { IrrigationPage } from '@/pages/IrrigationPage';
import { AlertsPage } from '@/pages/AlertsPage';
import { SettingsPage } from '@/pages/SettingsPage';

const pageTitles: Record<PageKey, string> = {
  dashboard: 'Dashboard',
  plants: 'Plants',
  analytics: 'Analytics',
  irrigation: 'Irrigation',
  alerts: 'Alerts',
  settings: 'Settings',
};

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'plants':
        return <PlantsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'irrigation':
        return <IrrigationPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'settings':
        return <SettingsPage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage} pageTitle={pageTitles[currentPage]}>
      {renderPage()}
    </Layout>
  );
}

export default App;
