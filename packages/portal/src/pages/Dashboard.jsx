import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function GaugeWidget({ label, value }) {
  const score = value ?? 0;
  
  const data = [
    { name: 'Score', value: score },
    { name: 'Remainder', value: 100 - score }
  ];

  let color = '#B23A34'; // oxide (critical)
  if (score >= 80) color = '#2F7D6E'; // teal (ok)
  else if (score >= 60) color = '#D98E2B'; // amber (warn)

  return (
    <div className="border border-divider bg-surface/50 glass-card p-5 flex flex-col items-center">
      <p className="font-mono text-[11px] uppercase tracking-widest text-text-muted self-start w-full">{label}</p>
      <div className="w-full h-32 mt-4 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell key="cell-0" fill={color} />
              <Cell key="cell-1" fill="rgba(156, 163, 175, 0.2)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <span className="font-display text-4xl font-bold text-text-primary">{value ?? '—'}</span>
        </div>
      </div>
    </div>
  );
}

function Widget({ label, value, status }) {
  const statusClass = {
    ok: 'status-tag--ok',
    warn: 'status-tag--warn',
    critical: 'status-tag--critical',
  }[status];

  return (
    <div className="border border-divider bg-surface/50 glass-card p-5">
      <p className="font-mono text-[11px] uppercase tracking-widest text-text-muted">{label}</p>
      <p className="mt-3 font-display text-3xl font-bold text-text-primary">{value ?? '—'}</p>
      {status && <span className={`status-tag ${statusClass} mt-3`}>{status}</span>}
    </div>
  );
}

function countStatus(count, severity) {
  if (count == null) return null;
  return count === 0 ? 'ok' : severity;
}

function SkeletonWidget() {
  return (
    <div className="border border-divider bg-surface/50 glass-card p-5">
      <div className="h-3 w-32 animate-pulse bg-line" />
      <div className="mt-4 h-8 w-16 animate-pulse bg-line" />
    </div>
  );
}

export default function Dashboard() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['reports', 'compliance-summary'],
    queryFn: () => api.get('/reports/compliance-summary').then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonWidget />
          <SkeletonWidget />
          <SkeletonWidget />
        </div>
      </div>
    );
  }

  if (isError) {
    const status = error?.response?.status;
    const detail =
      error?.response?.data?.error ||
      (status ? `The server responded ${status}.` : 'The server could not be reached.');

    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="border border-oxide/40 bg-oxide/5 p-6 max-w-xl">
          <p className="font-mono text-[11px] uppercase tracking-widest text-oxide">
            Summary unavailable
          </p>
          <p className="mt-2 text-sm text-text-primary/80">{detail}</p>
          {status === 403 && (
            <p className="mt-2 text-sm text-text-muted">
              Your account does not have view access to reports. An administrator can grant it
              under user permissions.
            </p>
          )}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn-primary mt-4"
          >
            {isFetching ? 'Retrying…' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GaugeWidget
          label="Compliance Health Score"
          value={data?.latestScore}
        />
        <Widget
          label="Open Obligations"
          value={data?.openObligations}
          status={countStatus(data?.openObligations, 'warn')}
        />
        <Widget
          label="Overdue Obligations"
          value={data?.overdueObligations}
          status={countStatus(data?.overdueObligations, 'critical')}
        />
      </div>
    </div>
  );
}
