import React from 'react';
import MarketplaceGrid from '../components/marketplace/MarketplaceGrid';
import '../components/marketplace/marketplace.css';

const MarketplacePage: React.FC = () => {
  return (
    <div style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1>Plugin Ecosystem</h1>
        <p className="text-muted">Discover, install, and manage integration plugins.</p>
      </header>
      <MarketplaceGrid />
    </div>
  );
};

export default MarketplacePage;
