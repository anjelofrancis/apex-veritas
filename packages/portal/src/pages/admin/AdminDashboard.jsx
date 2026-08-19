import { useQuery } from '@tanstack/react-query';
import { api, apiErrorMessage } from '../../api/client';
import PageShell from '../../components/PageShell';

export default function AdminDashboard() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => api.get('/admin/analytics/usage').then((res) => res.data.data),
  });

  return (
    <PageShell title="Platform Analytics">
      {isLoading ? (
        <p className="text-sm text-text-secondary font-mono animate-pulse">Fetching telemetry...</p>
      ) : isError ? (
        // Never fall through to the stat grid on failure: `value ?? 0` would
        // render a confident "0 Clients / 0 Subscriptions" board that reads as
        // real data rather than as a request that never returned.
        <div
          className="title-block bg-surface border border-oxide/30 p-6 flex flex-col gap-2"
          role="alert"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-oxide">
            Telemetry unavailable
          </p>
          <p className="text-sm text-text-secondary">{apiErrorMessage(error)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Clients" value={data?.clientCount} />
          <StatCard label="Active Subscriptions" value={data?.activeSubscriptions} />
          <StatCard label="Total Incidents" value={data?.incidentCount} />
          <StatCard label="Total Audits" value={data?.auditCount} />
        </div>
      )}
    </PageShell>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="title-block bg-surface p-4 border border-oxide/30 flex flex-col gap-2 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
        <svg className="w-8 h-8 text-oxide" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"/>
        </svg>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary z-10 relative">{label}</p>
      <p className="font-display text-4xl font-bold text-oxide z-10 relative">{value ?? 0}</p>
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-oxide group-hover:w-full transition-all duration-500"></div>
    </div>
  );
}
