import React, { useEffect } from 'react';
import { usePluginStore } from '../../store/usePluginStore';
import { PluginRegistry } from '../../services/PluginRegistry';
import PluginCard from './PluginCard';
import { Search } from 'lucide-react';

const MarketplaceGrid: React.FC = () => {
  const { availablePlugins, setAvailablePlugins } = usePluginStore();

  useEffect(() => {
    PluginRegistry.discoverPlugins().then(setAvailablePlugins);
  }, [setAvailablePlugins]);

  return (
    <div className="marketplace-container">
      <div className="marketplace-header">
        <h2>Plugin Marketplace</h2>
        <div className="search-box">
          <Search size={18} className="text-muted" />
          <input type="text" placeholder="Search plugins by name, capability, or category..." className="form-input" style={{ width: '300px' }} />
        </div>
      </div>
      
      <div className="plugin-grid">
        {availablePlugins.map(plugin => (
          <PluginCard key={plugin.id} plugin={plugin} />
        ))}
      </div>
    </div>
  );
};

export default MarketplaceGrid;
