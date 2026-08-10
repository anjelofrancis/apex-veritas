import { useAuth } from '../store/auth';
import PageShell from '../components/PageShell';

export default function Settings() {
  const { user } = useAuth();
  
  return (
    <PageShell title="Settings">
      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="border border-divider bg-surface/50 glass-card p-6">
          <h2 className="text-lg font-bold mb-4">Profile Information</h2>
          <div className="flex flex-col gap-2 text-sm">
            <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>
        </div>

        {user?.role === 'CLIENT_ADMIN' && (
          <div className="border border-divider bg-surface/50 glass-card p-6">
            <h2 className="text-lg font-bold mb-4">Team Members</h2>
            <p className="text-sm text-text-secondary">Team management coming soon.</p>
          </div>
        )}

        <div className="border border-divider bg-surface/50 glass-card p-6">
          <h2 className="text-lg font-bold mb-4">Two-Factor Authentication</h2>
          {!user?.mfaEnabled ? (
            <button id="enable-mfa" className="btn-primary">Enable MFA</button>
          ) : (
            <span className="status-tag status-tag--ok">MFA Enabled</span>
          )}
        </div>
      </div>
    </PageShell>
  );
}
