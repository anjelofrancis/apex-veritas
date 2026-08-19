import { Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import RequireRole from './components/RequireRole';
import { INTERNAL_ROLES, ROLES } from './lib/roles';
import PortalLayout from './layouts/PortalLayout';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminClients from './pages/admin/AdminClients';
import AdminTemplates from './pages/admin/AdminTemplates';
import AdminUsers from './pages/admin/AdminUsers';

import Compliance from './pages/Compliance';
import Documents from './pages/Documents';
import Audits from './pages/Audits';
import Incidents from './pages/Incidents';
import Training from './pages/Training';
import Tasks from './pages/Tasks';
import Reports from './pages/Reports';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import MfaVerify from './pages/MfaVerify';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/mfa-verify" element={<MfaVerify />} />
      <Route element={<RequireAuth />}>
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="documents" element={<Documents />} />
          <Route path="audits" element={<Audits />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="training" element={<Training />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="reports" element={<Reports />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route element={<RequireRole allowedRoles={INTERNAL_ROLES} />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* Platform analytics is SUPER_ADMIN-only on the API, so sending a
                consultant to it as their landing page would 403. They start at
                Tenants instead — the first admin screen they can read. */}
            <Route
              element={
                <RequireRole allowedRoles={[ROLES.SUPER_ADMIN]} redirectTo="/admin/clients" />
              }
            >
              <Route index element={<AdminDashboard />} />
            </Route>
            <Route path="clients" element={<AdminClients />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="templates" element={<AdminTemplates />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/portal" replace />} />
    </Routes>
  );
}
