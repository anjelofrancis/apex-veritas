import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import PageShell from '../components/PageShell';
import DataTable from '../components/DataTable';

export default function Training() {
  const [tab, setTab] = useState('courses');
  
  const { data: courses, isLoading: isCoursesLoading } = useQuery({
    queryKey: ['training-courses'],
    queryFn: () => api.get('/training/courses').then(r => r.data.data),
    enabled: tab === 'courses'
  });

  const { data: records, isLoading: isRecordsLoading } = useQuery({
    queryKey: ['training-records'],
    queryFn: () => api.get('/training/records').then(r => r.data.data),
    enabled: tab === 'records'
  });

  const courseCols = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'validityMonths', label: 'Validity (Months)' }
  ];

  const recordCols = [
    { key: 'course', label: 'Course' },
    { key: 'user', label: 'User' },
    { 
      key: 'status', 
      label: 'Status',
      render: (r) => {
        const cls = r.status === 'COMPLETED' ? 'status-tag--ok' : r.status === 'EXPIRED' ? 'status-tag--critical' : 'status-tag--warn';
        return <span className={`status-tag ${cls}`}>{r.status}</span>;
      }
    },
    { key: 'completedAt', label: 'Completed At' },
    { key: 'expiry', label: 'Expiry' }
  ];

  return (
    <PageShell 
      title="Training" 
      actions={
        tab === 'courses' 
          ? <button id="add-course-btn" className="btn-primary">Add Course</button>
          : <button id="add-record-btn" className="btn-primary">Add Record</button>
      }
    >
      <div className="flex gap-4 mb-4 border-b border-divider pb-2">
        <button id="tab-courses" className={`font-bold ${tab === 'courses' ? 'text-text-primary' : 'text-text-muted'}`} onClick={() => setTab('courses')}>Courses</button>
        <button id="tab-records" className={`font-bold ${tab === 'records' ? 'text-text-primary' : 'text-text-muted'}`} onClick={() => setTab('records')}>Training Records</button>
      </div>

      {tab === 'courses' ? (
        <DataTable columns={courseCols} data={courses || []} isLoading={isCoursesLoading} />
      ) : (
        <DataTable columns={recordCols} data={records || []} isLoading={isRecordsLoading} />
      )}
    </PageShell>
  );
}
