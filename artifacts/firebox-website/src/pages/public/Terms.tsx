import React from 'react';

export default function Terms() {
  return (
    <div className="w-full px-4 py-24 max-w-4xl prose prose-invert prose-lg prose-headings:font-display">
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2>Agreement to Terms</h2>
      <p>By viewing or using this website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the website.</p>
      
      <h2>Intellectual Property</h2>
      <p>The Site and its original content, features, and functionality are owned by FireboxTechStudios and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
      
      <h2>Client Projects & Deliverables</h2>
      <p>Any software, designs, or systems built for clients are subject to individual Master Service Agreements (MSAs) or Statements of Work (SOWs). These Terms of Service apply only to the general use of this public website.</p>
      
      <h2>Disclaimer</h2>
      <p>Your use of the Site is at your sole risk. The Site is provided on an "AS IS" and "AS AVAILABLE" basis. The Site is provided without warranties of any kind, whether express or implied.</p>
    </div>
  );
}
