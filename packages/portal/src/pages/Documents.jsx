import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import PageShell from '../components/PageShell';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

export default function Documents() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  
  const { data, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => api.get('/documents').then(r => r.data.data),
  });

  const mutation = useMutation({
    mutationFn: (payload) => api.post('/documents', payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['documents']);
      setModalOpen(false);
    }
  });

  const columns = [
    { key: 'title', label: 'Title' },
    { 
      key: 'approvalStatus', 
      label: 'Approval Status',
      render: (r) => {
        const cls = r.approvalStatus === 'APPROVED' ? 'status-tag--ok' : r.approvalStatus === 'REJECTED' ? 'status-tag--critical' : 'status-tag--warn';
        return <span className={`status-tag ${cls}`}>{r.approvalStatus}</span>;
      }
    },
    { key: 'currentVersion', label: 'Current Version' },
    { key: 'expiryDate', label: 'Expiry Date' },
    { key: 'updatedAt', label: 'Updated At' },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <button id={`edit-doc-${r.id}`} className="text-text-primary text-xs underline">Edit</button>
          <button id={`del-doc-${r.id}`} className="text-oxide text-xs underline">Delete</button>
        </div>
      )
    }
  ];

  return (
    <PageShell 
      title="Documents" 
      actions={<button id="upload-doc-btn" className="btn-primary" onClick={() => setModalOpen(true)}>Upload Document</button>}
    >
      <DataTable columns={columns} data={data || []} isLoading={isLoading} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Upload Document">
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          mutation.mutate(Object.fromEntries(fd));
        }} className="flex flex-col gap-4">
          <input name="title" placeholder="Document Title" className="field-input" required id="doc-title"/>
          <input name="file" type="file" className="field-input" required id="doc-file"/>
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary" id="doc-cancel">Cancel</button>
            <button type="submit" className="btn-primary" disabled={mutation.isLoading} id="doc-submit">Upload</button>
          </div>
        </form>
      </Modal>
    </PageShell>
  );
}
