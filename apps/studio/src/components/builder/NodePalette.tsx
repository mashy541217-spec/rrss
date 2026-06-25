import React, { useEffect, useState } from 'react';
import { PluginRegistry } from '../../services/PluginRegistry';
import type { PluginManifestV2 } from '../../services/PluginRegistry';

const NodePalette: React.FC = () => {
  const [plugins, setPlugins] = useState<PluginManifestV2[]>([]);

  useEffect(() => {
    PluginRegistry.discoverPlugins().then(setPlugins);
  }, []);

  const onDragStart = (event: React.DragEvent, nodeType: string, data: any) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/data', JSON.stringify({
      type: data.type,
      label: data.name,
      color: data.color,
      inputs: data.inputs,
      outputs: data.outputs
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const grouped = plugins.reduce((acc, plugin) => {
    if (!acc[plugin.category]) acc[plugin.category] = [];
    acc[plugin.category].push(plugin);
    return acc;
  }, {} as Record<string, PluginManifestV2[]>);

  return (
    <aside className="node-palette glass-panel">
      <div className="palette-header">
        <h3>Node Library</h3>
      </div>
      <div className="palette-content">
        {Object.entries(grouped).map(([family, items]) => (
          <div key={family} className="palette-group">
            <h4 className="group-title">{family}</h4>
            {items.map((item) => (
              <div 
                key={item.type}
                className="palette-item"
                draggable
                onDragStart={(e) => onDragStart(e, 'customAction', item)}
                style={{ borderLeftColor: item.color }}
              >
                {item.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default NodePalette;
