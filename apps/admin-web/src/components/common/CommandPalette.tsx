import React, { useState, useEffect, useRef } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { Terminal, Search, Play, Plus, RefreshCw, Eye, ShieldAlert, Cpu } from 'lucide-react';

interface CommandItem {
  id: string;
  name: string;
  shortcut?: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, toggleCommandPalette, setActiveModule, toggleTheme, addNotification } = useUIStore();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'create_worker',
      name: 'Create New Windows Worker Node',
      shortcut: '⌥W',
      category: 'Infrastructure',
      icon: <Plus size={16} />,
      action: () => {
        setActiveModule('provisioning');
        addNotification('Dynamic Provisioning engine opened.', 'info');
      }
    },
    {
      id: 'scale_k8s',
      name: 'Scale Kubernetes Worker Cluster',
      shortcut: '⌥K',
      category: 'Cloud',
      icon: <Cpu size={16} />,
      action: () => {
        setActiveModule('cloud');
        addNotification('Navigated to Kubernetes Pool Scaling.', 'info');
      }
    },
    {
      id: 'deploy_plugin',
      name: 'Deploy Verified Marketplace Plugin',
      shortcut: '⌥P',
      category: 'Plugins',
      icon: <Play size={16} />,
      action: () => {
        setActiveModule('marketplace');
      }
    },
    {
      id: 'run_backup',
      name: 'Run Disaster Recovery Backup Snapshot',
      shortcut: '⌥B',
      category: 'Maintenance',
      icon: <RefreshCw size={16} />,
      action: () => {
        setActiveModule('backup');
        addNotification('System backup snapshot initiated.', 'success');
      }
    },
    {
      id: 'toggle_dark_light',
      name: 'Switch Interface Visual Theme (Light/Dark)',
      shortcut: '⇧T',
      category: 'Interface',
      icon: <Eye size={16} />,
      action: () => {
        toggleTheme();
      }
    },
    {
      id: 'audit_security',
      name: 'Inspect Live Security Zero-Trust Audit Logs',
      shortcut: '⇧S',
      category: 'Security',
      icon: <ShieldAlert size={16} />,
      action: () => {
        setActiveModule('security');
      }
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        toggleCommandPalette();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      toggleCommandPalette();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '100px',
      }}
      onClick={toggleCommandPalette}
    >
      <div
        ref={containerRef}
        className="glass-panel"
        style={{
          width: '600px',
          maxHeight: '400px',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Search size={18} style={{ color: 'var(--color-text-muted)', marginRight: '12px' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or module name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--color-text)',
              fontFamily: 'inherit',
              fontSize: '16px',
            }}
          />
          <Terminal size={14} style={{ color: 'var(--color-text-muted)' }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No commands matching search.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    toggleCommandPalette();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    border: isSelected ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '12px', color: isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                      {cmd.icon}
                    </span>
                    <div>
                      <div style={{ color: 'var(--color-text)', fontWeight: 500 }}>{cmd.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{cmd.category}</div>
                    </div>
                  </div>
                  {cmd.shortcut && (
                    <span
                      style={{
                        fontSize: '11px',
                        background: 'rgba(255,255,255,0.08)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {cmd.shortcut}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
