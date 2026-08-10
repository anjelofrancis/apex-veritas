import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import PageShell from '../components/PageShell';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const { data: compSummary } = useQuery({ queryKey: ['rep-comp'], queryFn: () => api.get('/reports/compliance-summary').then(r => r.data.data) });
  const { data: safetyKpi } = useQuery({ queryKey: ['rep-safe'], queryFn: () => api.get('/reports/safety-kpi').then(r => r.data.data) });
  const { data: auditSum } = useQuery({ queryKey: ['rep-audit'], queryFn: () => api.get('/reports/audit-summary').then(r => r.data.data) });

  const incData = safetyKpi?.incidentSeverities ? Object.entries(safetyKpi.incidentSeverities).map(([k,v]) => ({ name: k, value: v })) : [];
  const auditData = auditSum?.statuses ? Object.entries(auditSum.statuses).map(([k,v]) => ({ name: k, value: v })) : [];
  
  const COLORS = ['#2F7D6E', '#D98E2B', '#B23A34', '#1B3A56'];

  return (
    <PageShell title="Reports">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-divider bg-surface/50 glass-card p-5 h-64">
          <h3 className="font-bold mb-4">Incident Severity Breakdown</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incData}>
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="value" fill="#F9FAFB" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-divider bg-surface/50 glass-card p-5 h-64">
          <h3 className="font-bold mb-4">Audit Status Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={auditData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                {auditData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PageShell>
  );
}
