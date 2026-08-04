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
        <div className="text-white/60">Loading...</div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10 text-sm text-white/60">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Email</th>
                <th className="p-4">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(subscribers as any[]).map((sub: any, index: number) => (
                <tr key={sub.id} className="hover:bg-white/5">
                  <td className="p-4 text-white/40">{index + 1}</td>
                  <td className="p-4 font-medium">{sub.email}</td>
                  <td className="p-4 text-white/60 text-sm">{sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(subscribers as any[]).length === 0 && (
            <div className="p-8 text-center text-white/40">No subscribers yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
