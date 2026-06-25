import React from 'react';
import { usePluginStore } from '../../store/usePluginStore';
import type { PluginManifestV2 } from '../../services/PluginRegistry';
import { ShieldCheck, Download, Power, PowerOff, Package, Code } from 'lucide-react';

const PluginCard: React.FC<{ plugin: PluginManifestV2 }> = ({ plugin }) => {
  const { installedPluginIds, enabledPluginIds, installPlugin, togglePluginEnabled, uninstallPlugin } = usePluginStore();

  const isInstalled = installedPluginIds.includes(plugin.id);
  const isEnabled = enabledPluginIds.includes(plugin.id);

  return (
    <div className={`plugin-card glass-card ${isInstalled && !isEnabled ? 'disabled' : ''}`} style={{ borderTopColor: plugin.color, borderTopWidth: '4px' }}>
      <div className="plugin-header">
        <div>
          <h3 className="plugin-name">{plugin.name} {plugin.isVerified && <ShieldCheck size={16} className="text-success" />}</h3>
          <span className="plugin-author">by {plugin.author} • v{plugin.version}</span>
        </div>
        <span className="plugin-category" style={{ backgroundColor: `${plugin.color}20`, color: plugin.color }}>{plugin.category}</span>
      </div>
      
      <p className="plugin-desc">{plugin.description}</p>
      
      <div className="plugin-meta">
        <div className="meta-list">
          <span className="meta-label"><Code size={12}/> Capabilities:</span>
          {plugin.capabilities.slice(0, 2).map(c => <span key={c} className="meta-tag">{c}</span>)}
          {plugin.capabilities.length > 2 && <span className="meta-tag">+{plugin.capabilities.length - 2}</span>}
        </div>
        <div className="meta-list">
          <span className="meta-label"><Package size={12}/> Requires:</span>
          {plugin.credentialRequirements.map(c => <span key={c.provider} className="meta-tag alert">{c.type.toUpperCase()}</span>)}
        </div>
      </div>

      <div className="plugin-actions">
        {!isInstalled ? (
          <button className="btn-primary" onClick={() => installPlugin(plugin.id)}>
            <Download size={16} /> Install Plugin
          </button>
        ) : (
          <>
            <button className={`btn-${isEnabled ? 'warning' : 'success'}`} onClick={() => togglePluginEnabled(plugin.id)}>
              {isEnabled ? <><PowerOff size={16} /> Disable</> : <><Power size={16} /> Enable</>}
            </button>
            <button className="btn-danger outline" onClick={() => uninstallPlugin(plugin.id)}>
              Uninstall
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PluginCard;
