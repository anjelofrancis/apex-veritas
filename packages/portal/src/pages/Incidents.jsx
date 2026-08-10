import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import PageShell from '../components/PageShell';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

export default function Incidents() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInc, setSelectedInc] = useState(null);
  
  const { data, isLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => api.get('/incidents').then(r => r.data.data),
  });

  const columns = [
    { 
      key: 'description', 
      label: 'Description',
      render: (r) => <div className="truncate max-w-xs">{r.description}</div>
    },
    { 
      key: 'severity', 
      label: 'Severity',
      render: (r) => {
        const cls = ['MODERATE', 'MAJOR', 'FATALITY'].includes(r.severity) ? 'status-tag--critical' : 'status-tag--warn';
        return <span className={`status-tag ${cls}`}>{r.severity}</span>;
      }
    },
    { key: 'status', label: 'Status' },
    { key: 'location', label: 'Location' },
    { key: 'occurredAt', label: 'Occurred At' }
  ];

  return (
    <PageShell 
      title="Incidents" 
      actions={<button id="add-inc-btn" className="btn-primary" onClick={() => setModalOpen(true)}>Report Incident</button>}
    >
      <DataTable columns={columns} data={data || []} isLoading={isLoading} onRowClick={setSelectedInc} />
      
      <Modal open={!!selectedInc} onClose={() => setSelectedInc(null)} title="Incident Details">
        <div className="flex flex-col gap-4">
          <p><strong>Description:</strong> {selectedInc?.description}</p>
          <p><strong>Investigation:</strong> {selectedInc?.investigation || 'N/A'}</p>
        </div>
      </Modal>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Report Incident">
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1">
            <label htmlFor="inc-desc" className="text-sm font-medium text-text-primary">What happened?</label>
            <textarea name="description" placeholder="Describe the incident in detail..." className="field-input min-h-[120px] resize-none" required id="inc-desc"/>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="inc-sev" className="text-sm font-medium text-text-primary">Severity Level</label>
            <select name="severity" className="field-input h-12" id="inc-sev">
              <option value="NEAR_MISS">Near Miss</option>
              <option value="MINOR">Minor</option>
              <option value="MODERATE">Moderate</option>
              <option value="MAJOR">Major</option>
              <option value="FATALITY">Fatality</option>
            </select>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary py-3 sm:py-2 w-full sm:w-auto" id="inc-cancel">Cancel</button>
            <button type="submit" className="btn-primary py-3 sm:py-2 w-full sm:w-auto text-center justify-center" id="inc-submit">Report Incident</button>
          </div>
        </form>
      </Modal>
    </PageShell>
  );
}
