import { Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import PortalLayout from './layouts/PortalLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

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
      </Route>
      <Route path="*" element={<Navigate to="/portal" replace />} />
    </Routes>
  );
}
