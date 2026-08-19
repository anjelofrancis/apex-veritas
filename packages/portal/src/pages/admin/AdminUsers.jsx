import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import PageShell from '../../components/PageShell';
import DataTable from '../../components/DataTable';

export default function AdminUsers() {
  const { data: team, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'team'],
    queryFn: () => api.get('/admin/team').then((res) => res.data.data),
  });

  const columns = [
    { key: 'firstName', label: 'Name', render: (r) => `${r.firstName} ${r.lastName}` },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (r) => (
      <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">{r.role.replace(/_/g, ' ')}</span>
    ) },
    { key: 'isActive', label: 'Status', render: (r) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-widest ${r.isActive ? 'bg-teal/10 text-teal border border-teal/20' : 'bg-white/5 text-text-secondary border border-white/10'}`}>
        {r.isActive ? 'ACTIVE' : 'INACTIVE'}
      </span>
    ) },
  ];

  return (
    <PageShell title="Platform Team">
      <DataTable columns={columns} data={team} isLoading={isLoading} isError={isError} error={error} />
    </PageShell>
  );
}
