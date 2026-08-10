import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import PageShell from '../components/PageShell';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

export default function Compliance() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  
  const { data, isLoading } = useQuery({
    queryKey: ['compliance'],
    queryFn: () => api.get('/compliance').then(r => r.data.data),
  });

  const mutation = useMutation({
    mutationFn: (payload) => {
      if (editingRow) return api.put(`/compliance/${editingRow.id}`, payload);
      return api.post('/compliance', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['compliance']);
      setModalOpen(false);
      setEditingRow(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/compliance/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['compliance'])
  });

  const columns = [
    { key: 'regulationRef', label: 'Regulation Ref' },
    { key: 'title', label: 'Title' },
    { key: 'jurisdiction', label: 'Jurisdiction' },
    { 
      key: 'status', 
      label: 'Status',
      render: (r) => {
        const cls = r.status === 'met' ? 'status-tag--ok' : r.status === 'overdue' ? 'status-tag--critical' : 'status-tag--warn';
        return <span className={`status-tag ${cls}`}>{r.status}</span>;
      }
    },
    { key: 'dueDate', label: 'Due Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <button id={`edit-comp-${r.id}`} className="text-text-primary text-xs underline" onClick={() => { setEditingRow(r); setModalOpen(true); }}>Edit</button>
          <button id={`del-comp-${r.id}`} className="text-oxide text-xs underline" onClick={() => deleteMutation.mutate(r.id)}>Delete</button>
        </div>
      )
    }
  ];

  return (
    <PageShell 
      title="Compliance" 
      actions={<button id="add-comp-btn" className="btn-primary" onClick={() => { setEditingRow(null); setModalOpen(true); }}>Add Obligation</button>}
    >
      <DataTable columns={columns} data={data || []} isLoading={isLoading} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingRow ? "Edit Obligation" : "Add Obligation"}>
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          mutation.mutate(Object.fromEntries(fd));
        }} className="flex flex-col gap-4">
          <input name="jurisdiction" placeholder="Jurisdiction" defaultValue={editingRow?.jurisdiction} className="field-input" required id="comp-jur"/>
          <input name="regulationRef" placeholder="Regulation Ref" defaultValue={editingRow?.regulationRef} className="field-input" required id="comp-reg"/>
          <input name="title" placeholder="Title" defaultValue={editingRow?.title} className="field-input" required id="comp-title"/>
          <textarea name="obligation" placeholder="Obligation Details" defaultValue={editingRow?.obligation} className="field-input" required id="comp-ob"/>
          <input name="dueDate" type="date" defaultValue={editingRow?.dueDate} className="field-input" required id="comp-due"/>
          <select name="status" defaultValue={editingRow?.status || 'open'} className="field-input" id="comp-status">
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="met">Met</option>
            <option value="overdue">Overdue</option>
          </select>
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary" id="comp-cancel">Cancel</button>
            <button type="submit" className="btn-primary" disabled={mutation.isLoading} id="comp-submit">Save</button>
          </div>
        </form>
      </Modal>
    </PageShell>
  );
}
