import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

const EXPANDED_W = 220;
const COLLAPSED_W = 64;

function LayoutInner() {
  const { collapsed } = useSidebar();
  const sidebarW = collapsed ? COLLAPSED_W : EXPANDED_W;

  return (
    <div style={{ minHeight: '100vh', background: '#FCFCFA' }}>
      <Sidebar />

      {/* Main — shifts right on desktop, full width on mobile */}
      <div
        className="layout-main"
        style={{
          marginLeft: `${sidebarW}px`,
          transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
        }}
      >
        <DashboardHeader />
        <main style={{ flex: 1, padding: '2rem 2.5rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }} className="layout-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .layout-main { margin-left: 0 !important; }
          .layout-content { padding: 1rem !important; }
        }
      `}</style>
    </div>
  );
}

export default function Layout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      <LayoutInner />
    </SidebarProvider>
  );
}
