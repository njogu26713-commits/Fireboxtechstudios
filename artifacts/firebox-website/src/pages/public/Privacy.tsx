import React from 'react';

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl prose prose-invert prose-lg prose-headings:font-display">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <p>At FireboxTechStudios, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
      
      <h2>Information We Collect</h2>
      <p>We may collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the site, or otherwise when you contact us.</p>
      
      <h2>How We Use Your Information</h2>
      <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
      <ul>
        <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
        <li>Email you regarding your account or order.</li>
        <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
      </ul>
      
      <h2>Contact Us</h2>
      <p>If you have questions or comments about this Privacy Policy, please contact us via our Contact page.</p>
    </div>
  );
}
