import React from 'react';
import { useGetSiteSettings } from '@workspace/api-client-react';
import { Heart, Smartphone, CreditCard } from 'lucide-react';

export default function Support() {
  const { data: settings } = useGetSiteSettings();

  return (
    <div className="container mx-auto px-4 md:px-6 py-24 pb-32">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className="w-20 h-20 mx-auto rounded-full bg-destructive/20 text-destructive flex items-center justify-center mb-6">
          <Heart size={40} />
        </div>
        <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Support <span className="text-destructive">Firebox</span></h1>
        <p className="text-xl text-white/70">
          {settings?.donationMessage || "If you love our free tutorials, open-source projects, and community work, consider buying us a coffee. Your support keeps the servers running and the caffeine flowing."}
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {settings?.mpesaNumber && (
          <div className="glass-panel-glow p-10 rounded-3xl text-center border-t-[4px] border-t-[#4CAF50]">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#4CAF50]/20 text-[#4CAF50] flex items-center justify-center mb-6">
              <Smartphone size={32} />
            </div>
            <h3 className="text-2xl font-bold font-display mb-2">M-Pesa</h3>
            <p className="text-white/60 mb-8">Send support directly via Safaricom M-Pesa (Kenya).</p>
            <div className="bg-black/30 py-4 px-6 rounded-xl border border-white/10 font-mono text-2xl tracking-wider text-[#4CAF50] font-bold">
              {settings.mpesaNumber}
            </div>
          </div>
        )}

        {settings?.paypalEmail && (
          <div className="glass-panel-glow p-10 rounded-3xl text-center border-t-[4px] border-t-[#003087]">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#003087]/20 text-[#0079C1] flex items-center justify-center mb-6">
              <CreditCard size={32} />
            </div>
            <h3 className="text-2xl font-bold font-display mb-2">PayPal</h3>
            <p className="text-white/60 mb-8">Support us globally securely through PayPal.</p>
            <a 
              href={`https://paypal.me/${settings.paypalEmail}`} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex w-full h-14 items-center justify-center rounded-xl bg-[#0079C1] text-white font-bold hover:bg-[#003087] transition-colors"
            >
              Donate via PayPal
            </a>
          </div>
        )}
        
        {!settings?.mpesaNumber && !settings?.paypalEmail && (
          <div className="col-span-1 md:col-span-2 text-center text-white/50 py-12">
            Donation options are currently being updated. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
}
