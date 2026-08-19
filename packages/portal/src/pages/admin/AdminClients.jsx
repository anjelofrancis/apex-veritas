import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiErrorMessage } from '../../api/client';
import { useAuth } from '../../store/auth';
import { canManagePlatform } from '../../lib/roles';
import PageShell from '../../components/PageShell';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

export default function AdminClients() {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  // POST /admin/clients is SUPER_ADMIN-only; consultants get the read-only view.
  const canWrite = canManagePlatform(user);

  const { data: clients, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'clients'],
    queryFn: () => api.get('/admin/clients').then((res) => res.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (newClient) => api.post('/admin/clients', newClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] });
      setModalOpen(false);
    },
  });

  const columns = [
    { key: 'id', label: 'ID', render: (r) => <span className="font-mono text-xs">{r.id.slice(0,8)}</span> },
    { key: 'name', label: 'Company Name' },
    { key: 'jurisdiction', label: 'Jurisdiction' },
    { key: 'industry', label: 'Industry' },
    { key: 'status', label: 'Status', render: (r) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-widest ${r.status === 'ACTIVE' ? 'bg-teal/10 text-teal border border-teal/20' : 'bg-white/5 text-text-secondary border border-white/10'}`}>
        {r.status}
      </span>
    ) },
    { key: 'createdAt', label: 'Created', render: (r) => new Date(r.createdAt).toLocaleDateString() },
  ];

  return (
    <PageShell
      title="Tenants"
      actions={
        canWrite && (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-oxide text-white px-4 py-2 text-sm font-medium hover:bg-oxide/90 transition-colors"
          >
            Add Tenant
          </button>
        )
      }
    >
      <DataTable columns={columns} data={clients} isLoading={isLoading} isError={isError} error={error} />
      
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Tenant">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            createMutation.mutate({
              name: fd.get('name'),
              jurisdiction: fd.get('jurisdiction'),
              industry: fd.get('industry'),
              status: 'ACTIVE',
            });
          }}
        >
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-text-secondary mb-1">Company Name</label>
            <input name="name" required className="w-full bg-background border border-divider rounded px-3 py-2 text-sm text-text-primary focus:border-oxide focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-text-secondary mb-1">Jurisdiction</label>
              <input name="jurisdiction" required className="w-full bg-background border border-divider rounded px-3 py-2 text-sm text-text-primary focus:border-oxide focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-text-secondary mb-1">Industry</label>
              <input name="industry" required className="w-full bg-background border border-divider rounded px-3 py-2 text-sm text-text-primary focus:border-oxide focus:outline-none" />
            </div>
          </div>
          {createMutation.isError && (
            <p className="text-sm text-oxide" role="alert">
              {apiErrorMessage(createMutation.error, 'Could not create the tenant.')}
            </p>
          )}
          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="bg-oxide text-white px-4 py-2 text-sm font-medium hover:bg-oxide/90 disabled:opacity-50">
              {createMutation.isPending ? 'Creating...' : 'Create Tenant'}
            </button>
          </div>
        </form>
      </Modal>
    </PageShell>
  );
}
