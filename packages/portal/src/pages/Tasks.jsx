import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import PageShell from '../components/PageShell';
import DataTable from '../components/DataTable';

export default function Tasks() {
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.get('/tasks').then(r => r.data.data),
  });

  const columns = [
    { key: 'title', label: 'Title' },
    { 
      key: 'status', 
      label: 'Status',
      render: (r) => {
        const cls = r.status === 'DONE' || r.status === 'IN_PROGRESS' ? 'status-tag--ok' : r.status === 'BLOCKED' ? 'status-tag--critical' : 'status-tag--warn';
        return <span className={`status-tag ${cls}`}>{r.status}</span>;
      }
    },
    { key: 'assignee', label: 'Assignee' },
    { key: 'dueDate', label: 'Due Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <button id={`edit-task-${r.id}`} className="text-text-primary text-xs underline">Edit</button>
          <button id={`del-task-${r.id}`} className="text-oxide text-xs underline">Delete</button>
        </div>
      )
    }
  ];

  return (
    <PageShell 
      title="Tasks" 
      actions={<button id="add-task-btn" className="btn-primary">Add Task</button>}
    >
      <DataTable columns={columns} data={data || []} isLoading={isLoading} />
    </PageShell>
  );
}
