import { useState } from 'react';
import { AppProvider, useApp } from '@/lib/store';
import { Layout, type PageId } from '@/components/Layout';
import { ToastContainer } from '@/components/Toast';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ReportIncidentPage } from '@/pages/ReportIncidentPage';
import { AIAnalysisPage } from '@/pages/AIAnalysisPage';
import { IncidentManagementPage } from '@/pages/IncidentManagementPage';
import { RiskPredictionPage } from '@/pages/RiskPredictionPage';
import { RootCauseAnalysisPage } from '@/pages/RootCauseAnalysisPage';
import { CAPAPage } from '@/pages/CAPAPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { AlertsPage } from '@/pages/AlertsPage';

function AppContent() {
  const { role } = useApp();
  const [page, setPage] = useState<PageId>('dashboard');

  if (!role) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage onNavigate={setPage} />;
      case 'report':
        return <ReportIncidentPage />;
      case 'analysis':
        return <AIAnalysisPage />;
      case 'incidents':
        return <IncidentManagementPage />;
      case 'risk':
        return <RiskPredictionPage />;
      case 'rootcause':
        return <RootCauseAnalysisPage />;
      case 'capa':
        return <CAPAPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'alerts':
        return <AlertsPage />;
      default:
        return <DashboardPage onNavigate={setPage} />;
    }
  };

  return (
    <>
      <Layout currentPage={page} onNavigate={setPage}>
        {renderPage()}
      </Layout>
      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
