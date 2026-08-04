import { useListNewsletterSubscriptions } from '@workspace/api-client-react';
import { Mail } from 'lucide-react';

export default function NewsletterManage() {
  const { data: subscribers = [], isLoading } = useListNewsletterSubscriptions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300">
          <Mail size={16} />
          <span className="font-bold">{(subscribers as any[]).length} subscribers</span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : (
        <div className="bg-muted/40 border border-border rounded-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted/40 border-b border-border text-sm text-muted-foreground">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Email</th>
                <th className="p-4">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(subscribers as any[]).map((sub: any, index: number) => (
                <tr key={sub.id} className="hover:bg-muted/40">
                  <td className="p-4 text-muted-foreground/70">{index + 1}</td>
                  <td className="p-4 font-medium">{sub.email}</td>
                  <td className="p-4 text-muted-foreground text-sm">{sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(subscribers as any[]).length === 0 && (
            <div className="p-8 text-center text-muted-foreground/70">No subscribers yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
