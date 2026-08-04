import React, { useState } from 'react';
import { useGetSiteSettings, useUpdateSiteSettings } from '@workspace/api-client-react';

// Fields accepted by the PATCH /settings endpoint (matches UpdateSiteSettingsBody schema)
const SETTINGS_FIELDS = [
  'siteName','tagline','email','phone','whatsapp','whatsappChannelUrl',
  'whatsappGroupUrl','address','googleMapsUrl','logoUrl','faviconUrl',
  'tiktokUrl','facebookUrl','instagramUrl','linkedinUrl','githubUrl',
  'youtubeUrl','twitterUrl','mpesaNumber','paypalEmail','donationMessage',
  'metaDescription','metaKeywords',
] as const;

type SettingsFields = typeof SETTINGS_FIELDS[number];

export default function SettingsManage() {
  const { data: settings, isLoading } = useGetSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const [formData, setFormData] = useState<Partial<Record<SettingsFields, string>>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Init form from server data — only known fields
  React.useEffect(() => {
    if (settings && Object.keys(formData).length === 0) {
      const clean: Partial<Record<SettingsFields, string>> = {};
      for (const key of SETTINGS_FIELDS) {
        const val = (settings as Record<string, unknown>)[key];
        if (typeof val === 'string') clean[key] = val;
      }
      setFormData(clean);
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    updateSettings.mutate({ data: formData }, {
      onSuccess: () => setSaveSuccess(true),
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Failed to save settings.';
        setSaveError(msg);
      },
    });
  };

  const handleChange = (key: SettingsFields, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-3xl font-display font-bold">Site Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="glass-panel p-6 rounded-md space-y-4">
          <h2 className="text-xl font-bold border-b border-border pb-2">General</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-muted-foreground">Site Name</label>
              <input value={formData.siteName || ''} onChange={e=>handleChange('siteName', e.target.value)} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-muted-foreground">Tagline</label>
              <input value={formData.tagline || ''} onChange={e=>handleChange('tagline', e.target.value)} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-muted-foreground">Logo URL</label>
              <input value={formData.logoUrl || ''} onChange={e=>handleChange('logoUrl', e.target.value)} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-muted-foreground">Favicon URL</label>
              <input value={formData.faviconUrl || ''} onChange={e=>handleChange('faviconUrl', e.target.value)} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground" />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-md space-y-4">
          <h2 className="text-xl font-bold border-b border-border pb-2">Contact & Social</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-muted-foreground">Email</label>
              <input value={formData.email || ''} onChange={e=>handleChange('email', e.target.value)} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-muted-foreground">Phone</label>
              <input value={formData.phone || ''} onChange={e=>handleChange('phone', e.target.value)} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-muted-foreground">WhatsApp</label>
              <input value={formData.whatsapp || ''} onChange={e=>handleChange('whatsapp', e.target.value)} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-muted-foreground">Address</label>
              <input value={formData.address || ''} onChange={e=>handleChange('address', e.target.value)} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground" />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-md space-y-4">
          <h2 className="text-xl font-bold border-b border-border pb-2">Payments & Donations</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-muted-foreground">M-Pesa Number</label>
              <input value={formData.mpesaNumber || ''} onChange={e=>handleChange('mpesaNumber', e.target.value)} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-muted-foreground">PayPal Email</label>
              <input value={formData.paypalEmail || ''} onChange={e=>handleChange('paypalEmail', e.target.value)} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 text-muted-foreground">Donation Message</label>
            <textarea rows={3} value={formData.donationMessage || ''} onChange={e=>handleChange('donationMessage', e.target.value)} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground resize-none"></textarea>
          </div>
        </div>

        {saveError && (
          <div className="px-4 py-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            <strong>Error:</strong> {saveError}
          </div>
        )}

        {saveSuccess && (
          <div className="px-4 py-3 rounded-md bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            Settings saved successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={updateSettings.isPending}
          className="px-8 py-3 bg-primary text-background font-bold rounded-md hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
