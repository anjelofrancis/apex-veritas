import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import PageShell from '../components/PageShell';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

export default function Audits() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  
  const { data, isLoading } = useQuery({
    queryKey: ['audits'],
    queryFn: () => api.get('/audits').then(r => r.data.data),
  });

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'type', label: 'Type' },
    { 
      key: 'status', 
      label: 'Status',
      render: (r) => {
        const cls = r.status === 'COMPLETED' ? 'status-tag--ok' : r.status === 'FAILED' ? 'status-tag--critical' : 'status-tag--warn';
        return <span className={`status-tag ${cls}`}>{r.status}</span>;
      }
    },
    { key: 'scheduledDate', label: 'Scheduled Date' }
  ];

  return (
    <PageShell 
      title="Audits" 
      actions={<button id="add-audit-btn" className="btn-primary" onClick={() => setModalOpen(true)}>Schedule Audit</button>}
    >
      <DataTable columns={columns} data={data || []} isLoading={isLoading} onRowClick={setSelectedAudit} />
      
      <Modal open={!!selectedAudit} onClose={() => setSelectedAudit(null)} title={selectedAudit?.title || "Audit Details"}>
        <div className="flex flex-col gap-6 w-full">
          <div className="bg-surface/50 border border-divider rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1"><strong>Type:</strong> {selectedAudit?.type}</p>
            <p className="text-sm text-text-secondary mb-1"><strong>Status:</strong> <span className="text-amber-DEFAULT font-medium">{selectedAudit?.status}</span></p>
            <p className="text-sm text-text-secondary"><strong>Date:</strong> {new Date(selectedAudit?.scheduledDate).toLocaleDateString()}</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <h3 className="font-display font-bold text-lg text-text-primary">Digital Checklist</h3>
            <p className="text-xs text-text-muted">Complete the following items in the field:</p>
            
            <div className="flex flex-col gap-4 mt-2">
              {[
                { id: 1, text: "Verify all fire extinguishers are accessible and unblocked." },
                { id: 2, text: "Check emergency exit signs are illuminated." },
                { id: 3, text: "Inspect first aid kits for expired items." }
              ].map((item, i) => (
                <div key={item.id} className="border border-divider rounded-lg p-4 bg-surface/30">
                  <p className="text-sm font-medium text-text-primary mb-4">{i + 1}. {item.text}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" className="py-3 border border-divider rounded bg-surface/50 text-text-primary text-sm font-medium hover:bg-teal-DEFAULT/20 hover:border-teal-DEFAULT hover:text-teal-DEFAULT transition-colors">PASS</button>
                    <button type="button" className="py-3 border border-divider rounded bg-surface/50 text-text-primary text-sm font-medium hover:bg-oxide/20 hover:border-oxide hover:text-oxide transition-colors">FAIL</button>
                  </div>
                  <button type="button" className="mt-3 w-full py-2 text-xs text-text-muted hover:text-text-primary text-center">
                    + Add Photo Evidence
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4 pt-4 border-t border-divider">
            <button type="button" onClick={() => setSelectedAudit(null)} className="btn-secondary py-3 sm:py-2 w-full sm:w-auto">Save Draft</button>
            <button type="button" onClick={() => setSelectedAudit(null)} className="btn-primary py-3 sm:py-2 w-full sm:w-auto text-center justify-center">Complete Audit</button>
          </div>
        </div>
      </Modal>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Schedule Audit">
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1">
            <label htmlFor="audit-title" className="text-sm font-medium text-text-primary">Audit Title</label>
            <input name="title" placeholder="e.g. Monthly Fire Safety Check" className="field-input h-12" required id="audit-title"/>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="audit-date" className="text-sm font-medium text-text-primary">Scheduled Date</label>
            <input name="scheduledDate" type="date" className="field-input h-12" required id="audit-date"/>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary py-3 sm:py-2 w-full sm:w-auto" id="audit-cancel">Cancel</button>
            <button type="submit" className="btn-primary py-3 sm:py-2 w-full sm:w-auto text-center justify-center" id="audit-submit">Schedule</button>
          </div>
        </form>
      </Modal>
    </PageShell>
  );
}
