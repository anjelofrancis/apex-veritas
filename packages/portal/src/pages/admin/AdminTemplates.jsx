import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiErrorMessage } from '../../api/client';
import { useAuth } from '../../store/auth';
import { canManagePlatform } from '../../lib/roles';
import PageShell from '../../components/PageShell';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

export default function AdminTemplates() {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  // POST /admin/templates is SUPER_ADMIN-only; consultants browse the catalogue.
  const canWrite = canManagePlatform(user);

  const { data: templates, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'templates'],
    queryFn: () => api.get('/admin/templates').then((res) => res.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (newTemplate) => api.post('/admin/templates', newTemplate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] });
      setModalOpen(false);
    },
  });

  const columns = [
    { key: 'name', label: 'Template Name' },
    { key: 'category', label: 'Category' },
    { key: 'priceCents', label: 'Price', render: (r) => (
      <span className="font-mono text-sm">${(r.priceCents / 100).toFixed(2)}</span>
    ) },
    { key: 'isSubscription', label: 'Type', render: (r) => (
      <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">{r.isSubscription ? 'Subscription' : 'One-time'}</span>
    ) },
    { key: 'createdAt', label: 'Added', render: (r) => new Date(r.createdAt).toLocaleDateString() },
  ];

  return (
    <PageShell
      title="Template Store"
      actions={
        canWrite && (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-oxide text-white px-4 py-2 text-sm font-medium hover:bg-oxide/90 transition-colors"
          >
            Add Template
          </button>
        )
      }
    >
      <DataTable columns={columns} data={templates} isLoading={isLoading} isError={isError} error={error} />
      
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Template Product">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            createMutation.mutate({
              name: fd.get('name'),
              category: fd.get('category'),
              priceCents: parseInt(fd.get('price'), 10) * 100,
              isSubscription: fd.get('isSubscription') === 'on',
              storageKey: fd.get('storageKey') || 'templates/placeholder.zip',
            });
          }}
        >
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-text-secondary mb-1">Product Name</label>
            <input name="name" required className="w-full bg-background border border-divider rounded px-3 py-2 text-sm text-text-primary focus:border-oxide focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-text-secondary mb-1">Category</label>
              <input name="category" required className="w-full bg-background border border-divider rounded px-3 py-2 text-sm text-text-primary focus:border-oxide focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-text-secondary mb-1">Price (USD)</label>
              <input name="price" type="number" min="0" step="1" required className="w-full bg-background border border-divider rounded px-3 py-2 text-sm text-text-primary focus:border-oxide focus:outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isSubscription" id="isSubscription" className="accent-oxide" />
            <label htmlFor="isSubscription" className="text-sm text-text-primary">Recurring Subscription</label>
          </div>
          {createMutation.isError && (
            <p className="text-sm text-oxide" role="alert">
              {apiErrorMessage(createMutation.error, 'Could not add the template.')}
            </p>
          )}
          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="bg-oxide text-white px-4 py-2 text-sm font-medium hover:bg-oxide/90 disabled:opacity-50">
              {createMutation.isPending ? 'Saving...' : 'Add Product'}
            </button>
          </div>
        </form>
      </Modal>
    </PageShell>
  );
}
