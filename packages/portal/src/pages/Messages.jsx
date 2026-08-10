import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import PageShell from '../components/PageShell';

export default function Messages() {
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications').then(r => r.data.data),
  });

  const markRead = useMutation({
    mutationFn: (id) => api.put(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries(['notifications'])
  });

  if (isLoading) return <PageShell title="Messages"><div>Loading...</div></PageShell>;

  return (
    <PageShell title="Messages">
      <div className="flex flex-col gap-3">
        {!data || data.length === 0 ? (
          <div className="border border-divider bg-surface/50 glass-card p-8 text-center text-text-muted">No notifications yet</div>
        ) : (
          data.map(n => (
            <div 
              key={n.id} 
              id={`msg-${n.id}`}
              className={`border border-divider bg-surface p-4 cursor-pointer hover:bg-surface/80 transition-colors ${!n.read ? 'border-l-4 border-l-amber' : ''}`}
              onClick={() => !n.read && markRead.mutate(n.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{n.title}</h3>
                <span className="text-xs text-text-muted font-mono">{new Date(n.timestamp || n.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm text-text-primary/80">{n.body || n.message}</p>
            </div>
          ))
        )}
      </div>
    </PageShell>
  );
}
