import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = () => {
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': 'Anushi Kothari - Professional Event Host & Anchor',
    'alternateName': 'Anchor Anushi Kothari',
    'description': 'Premium, luxury, and high-energy event hosting for corporate summits, awards, product launches, and destination weddings by celebrity anchor Anushi Kothari.',
    'url': 'https://anushikothari.com',
    'telephone': '+919876543210',
    'priceRange': '$$$$',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Mumbai',
      'addressRegion': 'Maharashtra',
      'addressCountry': 'IN'
    },
    'sameAs': [
      'https://instagram.com/anushi_kothari',
      'https://linkedin.com/in/anushikothari',
      'https://youtube.com/@anushikothari',
      'https://facebook.com/anushikothari'
    ]
  };

  return (
    <Helmet>
      {/* Canonical Link */}
      <link rel="canonical" href="https://anushikothari.com" />

      {/* Title */}
      <title>Anchor Anushi Kothari | Premium Event Host & MC</title>
      <meta name="description" content="Premium, luxury, and high-energy event hosting for corporate summits, awards, product launches, and destination weddings by celebrity anchor Anushi Kothari." />
      <meta name="keywords" content="Anushi Kothari, Event Host, Anchor, Master of Ceremonies, MC, Corporate Event Host, Sangeet Anchor, Wedding Host, Celebrity Presenter, Mumbai Anchor" />
      <meta name="author" content="Anushi Kothari" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://anushikothari.com" />
      <meta property="og:title" content="Anchor Anushi Kothari | Premium Event Host & MC" />
      <meta property="og:description" content="Elevating global events with charismatic stage presence. Corporate shows, award nights, celebrity panels, and destination weddings." />
      <meta property="og:image" content="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://anushikothari.com" />
      <meta name="twitter:title" content="Anchor Anushi Kothari | Premium Event Host & MC" />
      <meta name="twitter:description" content="Elevating global events with charismatic stage presence. Corporate shows, award nights, celebrity panels, and destination weddings." />
      <meta name="twitter:image" content="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80" />

      {/* JSON-LD Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>
    </Helmet>
  );
};

export default SEO;
