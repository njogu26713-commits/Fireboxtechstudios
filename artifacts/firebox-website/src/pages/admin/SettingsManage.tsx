import React, { useState } from 'react';
import { useListSettings, useUpdateSettings, useGetSiteSettings, useUpdateSiteSettings } from '@workspace/api-client-react';

export default function SettingsManage() {
  const { data: settings, isLoading } = useGetSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const [formData, setFormData] = useState<any>({});

  // Init form
  React.useEffect(() => {
    if (settings && Object.keys(formData).length === 0) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({ data: formData }, {
      onSuccess: () => alert('Settings saved successfully!')
    });
  };

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-3xl font-display font-bold">Site Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold border-b border-white/10 pb-2">General</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-white/60">Site Name</label>
              <input value={formData.siteName || ''} onChange={e=>handleChange('siteName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-white/60">Tagline</label>
              <input value={formData.tagline || ''} onChange={e=>handleChange('tagline', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-white/60">Logo URL</label>
              <input value={formData.logoUrl || ''} onChange={e=>handleChange('logoUrl', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-white/60">Favicon URL</label>
              <input value={formData.faviconUrl || ''} onChange={e=>handleChange('faviconUrl', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold border-b border-white/10 pb-2">Contact & Social</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-white/60">Email</label>
              <input value={formData.email || ''} onChange={e=>handleChange('email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-white/60">Phone</label>
              <input value={formData.phone || ''} onChange={e=>handleChange('phone', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-white/60">WhatsApp</label>
              <input value={formData.whatsapp || ''} onChange={e=>handleChange('whatsapp', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-white/60">Address</label>
              <input value={formData.address || ''} onChange={e=>handleChange('address', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold border-b border-white/10 pb-2">Payments & Donations</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-white/60">M-Pesa Number</label>
              <input value={formData.mpesaNumber || ''} onChange={e=>handleChange('mpesaNumber', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-white/60">PayPal Email</label>
              <input value={formData.paypalEmail || ''} onChange={e=>handleChange('paypalEmail', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/60">Donation Message</label>
            <textarea rows={3} value={formData.donationMessage || ''} onChange={e=>handleChange('donationMessage', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white resize-none"></textarea>
          </div>
        </div>

        <button type="submit" disabled={updateSettings.isPending} className="px-8 py-3 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-all">
          {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
